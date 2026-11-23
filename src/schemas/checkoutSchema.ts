import { z } from "zod";
import { detectCardBrand, stripDigits } from "../data/checkoutConfig";
import type { CustomerFormData, PaymentFormData } from "../types/cart";

export type CustomerFormErrors = Partial<Record<keyof CustomerFormData, string>>;
export type PaymentFormErrors = Partial<Record<keyof PaymentFormData, string>>;

export const customerFormSchema = z
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
      .refine((value) => value.includes("@"), "El correo debe incluir un @.")
      .pipe(z.email("Ingresá un correo electrónico válido.")),
    phone: z
      .string()
      .trim()
      .refine(
        (value) => /^\d+$/.test(value),
        "Ingresá solo números sin espacios ni guiones.",
      )
      .refine(
        (value) => value.length >= 8,
        "El teléfono debe tener al menos 8 dígitos.",
      )
      .refine(
        (value) => value.length <= 13,
        "El teléfono no puede superar los 13 dígitos.",
      ),
    address: z
      .string()
      .trim()
      .min(3, "Ingresá tu dirección (calle y número).")
      .max(100, "La dirección no puede superar los 100 caracteres."),
    locality: z
      .string()
      .trim()
      .min(2, "Ingresá tu localidad o partido.")
      .max(80, "La localidad no puede superar los 80 caracteres."),
    province: z.string().trim().min(1, "Seleccioná una provincia."),
    postalCode: z
      .string()
      .trim()
      .min(4, "Ingresá un código postal válido (ej: 4000 o C1043).")
      .max(8, "El código postal no puede superar los 8 caracteres.")
      .regex(/^[A-Za-z0-9]+$/, "Solo letras y números sin espacios."),
    fiscalCondition: z.enum([
      "consumidor_final",
      "monotributista",
      "responsable_inscripto",
      "exento",
    ]),
    dni: z.string().trim(),
    cuit: z.string().trim(),
    businessName: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    // Validación de DNI (sin puntos, hasta 8 números)
    if (!data.dni) {
      ctx.addIssue({
        code: "custom",
        path: ["dni"],
        message: "Ingresá tu número de DNI sin puntos.",
      });
    } else if (data.dni.includes(".")) {
      ctx.addIssue({
        code: "custom",
        path: ["dni"],
        message: "Escribilo sin puntos (ej: 44555666).",
      });
    } else if (!/^\d+$/.test(data.dni)) {
      ctx.addIssue({
        code: "custom",
        path: ["dni"],
        message: "El DNI solo puede contener números.",
      });
    } else if (data.dni.length < 7 || data.dni.length > 8) {
      ctx.addIssue({
        code: "custom",
        path: ["dni"],
        message: "El DNI debe tener entre 7 y 8 números sin puntos.",
      });
    }

    // Monotributista, Responsable Inscripto y Exento requieren CUIT
    if (
      data.fiscalCondition === "monotributista" ||
      data.fiscalCondition === "responsable_inscripto" ||
      data.fiscalCondition === "exento"
    ) {
      const cuitDigits = stripDigits(data.cuit);
      if (!cuitDigits) {
        ctx.addIssue({
          code: "custom",
          path: ["cuit"],
          message: "Ingresá tu CUIT.",
        });
      } else if (cuitDigits.length !== 11) {
        ctx.addIssue({
          code: "custom",
          path: ["cuit"],
          message: "El CUIT debe tener 11 dígitos (ej: 20-44555666-7).",
        });
      }
    }

    // Responsable Inscripto y Exento requieren Razón Social
    if (
      data.fiscalCondition === "responsable_inscripto" ||
      data.fiscalCondition === "exento"
    ) {
      if (data.businessName.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["businessName"],
          message: "Ingresá la razón social (mínimo 2 caracteres).",
        });
      } else if (data.businessName.length > 100) {
        ctx.addIssue({
          code: "custom",
          path: ["businessName"],
          message: "La razón social no puede superar los 100 caracteres.",
        });
      }
    }
  });

export function validateCustomerForm(
  data: CustomerFormData,
): CustomerFormErrors {
  const result = customerFormSchema.safeParse(data);
  if (result.success) return {};

  const errors: CustomerFormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof CustomerFormData | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

export const paymentFormSchema = z
  .object({
    number: z.string().trim(),
    name: z
      .string()
      .trim()
      .min(3, "Ingresá el nombre tal como figura en la tarjeta.")
      .max(50, "El nombre no puede superar los 50 caracteres.")
      .regex(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'.-]+$/,
        "El nombre del titular solo puede contener letras.",
      ),
    expiry: z.string().trim(),
    cvc: z.string().trim(),
    installments: z.number().int().min(1),
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
        message:
          "Aceptamos únicamente tarjetas Visa (4...), Mastercard (51-55 / 2...) o American Express (34 / 37).",
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

    // Validación de vencimiento MM/AA
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
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        ctx.addIssue({
          code: "custom",
          path: ["expiry"],
          message: "El mes debe estar entre 01 y 12.",
        });
      } else if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["expiry"],
          message: "La tarjeta está vencida.",
        });
      }
    }

    // Validación de CVC/CVV/CID
    const cvcDigits = stripDigits(data.cvc);
    const expectedCvc = brand === "amex" ? 4 : 3;
    if (!cvcDigits) {
      ctx.addIssue({
        code: "custom",
        path: ["cvc"],
        message: "Ingresá el código de seguridad.",
      });
    } else if (cvcDigits.length !== expectedCvc) {
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

export function validatePaymentForm(data: PaymentFormData): PaymentFormErrors {
  const result = paymentFormSchema.safeParse(data);
  if (result.success) return {};

  const errors: PaymentFormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof PaymentFormData | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}
