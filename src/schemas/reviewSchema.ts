import { z } from "zod";

export const reviewSchema = z.object({
  author: z
    .string()
    .trim()
    .max(40, "El nombre no puede superar los 40 caracteres."),
  rating: z
    .number()
    .int()
    .min(1, "Elegí una calificación entre 1 y 5.")
    .max(5, "Elegí una calificación entre 1 y 5."),
  comment: z
    .string()
    .trim()
    .min(5, "Escribí al menos 5 caracteres sobre tu experiencia.")
    .max(500, "El comentario no puede superar los 500 caracteres."),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
