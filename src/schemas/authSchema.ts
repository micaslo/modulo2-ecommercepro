import { z } from "zod";
import { detectCardBrand, stripDigits } from "../data/checkoutConfig";

export const registerSchema = z
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
    email: z
      .string()
      .trim()
      .min(1, "Ingresá tu correo electrónico.")
      .pipe(z.email("Ingresá un correo electrónico válido.")),
    phone: z
      .string()
      .trim()
      .max(25, "El teléfono no puede superar los 25 caracteres."),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .regex(/[A-Za-z]/, "La contraseña debe incluir al menos una letra.")
      .regex(/\d/, "La contraseña debe incluir al menos un número."),
    passwordConfirmation: z
      .string()
      .min(1, "Confirmá tu contraseña."),
    terms: z.boolean().refine((accepted) => accepted, {
      message: "Tenés que aceptar los términos y condiciones.",
    }),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Las contraseñas no coinciden.",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Ingresá tu correo electrónico.")
    .pipe(z.email("Ingresá un correo electrónico válido.")),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
  notARobot: z.boolean().refine((checked) => checked, {
    message: "Confirmá que no sos un robot.",
  }),
});

export const profileUpdateSchema = z
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
    email: z
      .string()
      .trim()
      .min(1, "Ingresá tu correo electrónico.")
      .pipe(z.email("Ingresá un correo electrónico válido.")),
    phone: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || (/^\d+$/.test(value) && value.length >= 8 && value.length <= 13),
        "Ingresá entre 8 y 13 números sin espacios ni guiones.",
      ),
    address: z
      .string()
      .trim()
      .max(100, "La dirección no puede superar los 100 caracteres."),
    locality: z
      .string()
      .trim()
      .max(80, "La localidad no puede superar los 80 caracteres."),
    province: z.string().trim(),
    postalCode: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || (/^[A-Za-z0-9]{4,8}$/.test(value)),
        "Ingresá entre 4 y 8 caracteres alfanuméricos (ej: 4000).",
      ),
    fiscalCondition: z.enum([
      "consumidor_final",
      "monotributista",
      "responsable_inscripto",
      "exento",
    ]),
    dni: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || (/^\d{7,8}$/.test(value)),
        "El DNI debe tener entre 7 y 8 números sin puntos.",
      ),
    cuit: z.string().trim(),
    businessName: z
      .string()
      .trim()
      .max(100, "La razón social no puede superar los 100 caracteres."),
  })
  .superRefine((data, ctx) => {
    if (data.cuit) {
      const digits = stripDigits(data.cuit);
      if (digits.length !== 11) {
        ctx.addIssue({
          code: "custom",
          path: ["cuit"],
          message: "El CUIT debe tener 11 dígitos (ej: 20-44555666-7).",
        });
      }
    }
  });

export const savedCardSchema = z
  .object({
    number: z.string().trim(),
    name: z
      .string()
      .trim()
      .min(3, "Ingresá el nombre del titular.")
      .max(50, "El nombre no puede superar los 50 caracteres.")
      .regex(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'.-]+$/,
        "El nombre del titular solo puede contener letras.",
      ),
    expiry: z.string().trim(),
    cvc: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    const digits = stripDigits(data.number);
    const brand = detectCardBrand(digits);

    if (!digits) {
      ctx.addIssue({
        code: "custom",
        path: ["number"],
        message: "Ingresá el número de tarjeta.",
      });
    } else if (brand === "unknown") {
      ctx.addIssue({
        code: "custom",
        path: ["number"],
        message: "Solo se admiten tarjetas Visa (4...), Mastercard (51-55 / 2...) o Amex (34/37).",
      });
    } else {
      const expectedLength = brand === "amex" ? 15 : 16;
      if (digits.length !== expectedLength) {
        ctx.addIssue({
          code: "custom",
          path: ["number"],
          message: `La tarjeta debe tener ${expectedLength} dígitos.`,
        });
      }
    }

    const expiryMatch = data.expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!expiryMatch) {
      ctx.addIssue({
        code: "custom",
        path: ["expiry"],
        message: "Ingresá un vencimiento válido (MM/AA).",
      });
    } else {
      const month = Number(expiryMatch[1]);
      const year = 2000 + Number(expiryMatch[2]);
      const now = new Date();
      if (month < 1 || month > 12) {
        ctx.addIssue({
          code: "custom",
          path: ["expiry"],
          message: "El mes debe estar entre 01 y 12.",
        });
      } else if (
        year < now.getFullYear() ||
        (year === now.getFullYear() && month < now.getMonth() + 1)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["expiry"],
          message: "La tarjeta está vencida.",
        });
      }
    }

    const cvcDigits = stripDigits(data.cvc);
    const expectedCvc = brand === "amex" ? 4 : 3;
    if (cvcDigits.length !== expectedCvc) {
      ctx.addIssue({
        code: "custom",
        path: ["cvc"],
        message:
          brand === "amex"
            ? "American Express requiere 4 dígitos."
            : "El código de seguridad debe tener 3 dígitos.",
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;
export type SavedCardValues = z.infer<typeof savedCardSchema>;
