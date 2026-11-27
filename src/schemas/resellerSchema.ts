import { z } from "zod";
import { stripDigits } from "../data/checkoutConfig";

function isValidCuil(cuil: string): boolean {
  if (!/^\d{11}$/.test(cuil)) return false;

  const allowedPrefixes = new Set(["20", "23", "24", "27", "30", "33", "34"]);
  if (!allowedPrefixes.has(cuil.slice(0, 2))) return false;

  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce(
    (total, weight, index) => total + Number(cuil[index]) * weight,
    0,
  );
  let checkDigit = 11 - (sum % 11);

  if (checkDigit === 11) checkDigit = 0;
  if (checkDigit === 10) checkDigit = 9;

  return checkDigit === Number(cuil[10]);
}

export const resellerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(50, "El nombre no puede superar los 50 caracteres."),
    lastName: z
      .string()
      .trim()
      .min(2, "El apellido debe tener al menos 2 caracteres.")
      .max(50, "El apellido no puede superar los 50 caracteres."),
    idNumber: z
      .string()
      .trim()
      .regex(/^\d{8}$/, "Ingresá exactamente 8 números, sin puntos ni espacios."),
    cuil: z
      .string()
      .trim()
      .regex(/^\d{11}$/, "Ingresá los 11 números del CUIL, sin guiones ni espacios."),
    email: z
      .string()
      .trim()
      .min(1, "Ingresá tu correo electrónico.")
      .pipe(z.email("Ingresá un correo electrónico válido.")),
    phone: z
      .string()
      .trim()
      .min(1, "Ingresá tu teléfono.")
      .refine((value) => {
        const digits = stripDigits(value);
        return digits.length >= 8 && digits.length <= 15;
      }, "Ingresá un teléfono válido (entre 8 y 15 dígitos)."),
  })
  .superRefine((data, ctx) => {
    if (/^\d{11}$/.test(data.cuil)) {
      if (!isValidCuil(data.cuil)) {
        ctx.addIssue({
          code: "custom",
          path: ["cuil"],
          message: "Ingresá un CUIL válido de 11 dígitos.",
        });
      } else if (
        /^\d{8}$/.test(data.idNumber) &&
        data.cuil.slice(2, 10) !== data.idNumber
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["cuil"],
          message:
            "El DNI incluido en el CUIL debe coincidir con el DNI ingresado.",
        });
      }
    }
  });

export type ResellerFormValues = z.infer<typeof resellerSchema>;
