import { z } from "zod";

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
      .max(25, "El teléfono no puede superar los 25 caracteres.")
      .optional()
      .default(""),
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
    .min(1, "Ingresá tu contraseña."),
});

export const profileUpdateSchema = z.object({
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
  phone: z
    .string()
    .trim()
    .max(25, "El teléfono no puede superar los 25 caracteres.")
    .optional()
    .default(""),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;

export function extractZodFieldErrors<T extends Record<string, unknown>>(
  error: z.ZodError<T>,
): Partial<Record<keyof T, string>> {
  const fieldErrors: Partial<Record<keyof T, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof T | undefined;
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
