import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres.')
      .max(50, 'El nombre no puede superar los 50 caracteres.'),
    lastName: z
      .string()
      .trim()
      .min(2, 'El apellido debe tener al menos 2 caracteres.')
      .max(50, 'El apellido no puede superar los 50 caracteres.'),
    email: z
      .string()
      .trim()
      .pipe(z.email('Ingresá un correo electrónico válido.')),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .regex(/[A-Za-z]/, 'La contraseña debe incluir al menos una letra.')
      .regex(/\d/, 'La contraseña debe incluir al menos un número.'),
    passwordConfirmation: z.string(),
    terms: z.boolean().refine((accepted) => accepted, {
      message: 'Tenés que aceptar los términos y condiciones.',
    }),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Las contraseñas no coinciden.',
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
