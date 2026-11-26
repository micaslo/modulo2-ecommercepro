import type { Product } from "../types/productMedia";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductCategorySlug(
  product: Pick<Product, "id" | "category"> & Partial<Pick<Product, "name">>,
): string {
  const catNorm = slugify(product.category);
  const nameAndId = `${product.id} ${product.name ?? ""}`.toLowerCase();

  if (
    catNorm === "tecnologia" &&
    /\b(iphone|samsung|galaxy|celular|smartphone)\b/.test(nameAndId)
  ) {
    return "celulares";
  }

  if (catNorm === "camaras-y-accesorios" || catNorm.startsWith("camara")) {
    return "camaras";
  }

  if (catNorm.startsWith("vehiculo")) {
    return "vehiculos";
  }

  if (catNorm === "gaming") {
    return "gaming";
  }

  return catNorm || "general";
}

export function getProductPath(
  product: Pick<Product, "id" | "category"> & Partial<Pick<Product, "name">>,
  colorId?: string,
): string {
  const categorySlug = getProductCategorySlug(product);
  const basePath = `/productos/${categorySlug}/${product.id}`;
  return colorId ? `${basePath}?color=${encodeURIComponent(colorId)}` : basePath;
}
