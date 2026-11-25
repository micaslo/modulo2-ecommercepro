import { z } from "zod";
import type { Product } from "../types/productMedia";

export const PRODUCT_CATEGORIES = [
  "Tecnología",
  "Vehículos",
  "Cámaras y Accesorios",
  "Gaming",
  "Electrodomésticos",
  "Hogar",
  "Deportes",
  "Ropa",
  "Accesorios",
  "Belleza",
  "Mascotas",
  "Otros",
] as const;

export interface ProductFormValues {
  code: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  image: string;
  description: string;
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

export function normalizeProductCode(code: string): string {
  return code.trim().toUpperCase();
}

export const productFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "El código único debe tener al menos 3 caracteres.")
    .max(24, "El código único no puede superar los 24 caracteres.")
    .regex(
      /^[A-Za-z0-9-_]+$/,
      "El código solo puede contener letras, números, guiones (-) o guiones bajos (_).",
    ),
  name: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(120, "El nombre no puede superar los 120 caracteres."),
  category: z
    .string()
    .trim()
    .min(1, "Seleccioná una categoría."),
  price: z
    .string()
    .trim()
    .min(1, "Ingresá un precio.")
    .refine(
      (value) => !Number.isNaN(Number(value)) && Number(value) > 0,
      "El precio debe ser un número mayor a 0.",
    ),
  stock: z
    .string()
    .trim()
    .min(1, "Ingresá el stock disponible.")
    .refine(
      (value) =>
        !Number.isNaN(Number(value)) &&
        Number.isInteger(Number(value)) &&
        Number(value) >= 0,
      "El stock debe ser un número entero mayor o igual a 0.",
    ),
  image: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("/") ||
        value.startsWith("data:image/"),
      "La imagen debe ser una URL válida (http://, https:// o ruta relativa).",
    ),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(1000, "La descripción no puede superar los 1000 caracteres."),
});

export function validateProductForm(
  values: ProductFormValues,
  existingProducts: Product[],
  editingProductId?: string | null,
): ProductFormErrors {
  const errors: ProductFormErrors = {};
  const result = productFormSchema.safeParse(values);

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ProductFormValues | undefined;
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
  }

  const normalizedCode = normalizeProductCode(values.code);
  if (normalizedCode && !errors.code) {
    const duplicate = existingProducts.find(
      (product) =>
        product.id !== editingProductId &&
        normalizeProductCode(product.code ?? product.id) === normalizedCode,
    );
    if (duplicate) {
      errors.code = `El código "${normalizedCode}" ya está en uso por "${duplicate.name}".`;
    }
  }

  return errors;
}
