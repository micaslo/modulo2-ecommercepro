import type { Product } from "../types/productMedia";

const imageModules = import.meta.glob<string>(
  "../assets/images/product-page/images/**/*.{webp,png,jpg,jpeg}",
  { eager: true, import: "default" },
);

/** slug del producto -> carpeta de imágenes y carpeta del modelo 3D */
const MEDIA_CONFIG: Record<string, { imagesDir: string; modelDir?: string }> = {
  "iphone-18-pro": { imagesDir: "iphone-18-pro", modelDir: "apple-iphone-18-pro-max-burgundy" },
  "samsung-s26-ultra": { imagesDir: "samsung-s26-ultra", modelDir: "samsung-s26-ultra" },
  "chevrolet-captiva": { imagesDir: "chevrolet-captiva", modelDir: "chevrolet-captiva-premier" },
  "chevrolet-traverse": { imagesDir: "chevrolet-traverse", modelDir: "chevrolet-traverse" },
};

function imagesOf(imagesDir: string): string[] {
  return Object.entries(imageModules)
    .filter(([path]) => path.includes(`/images/${imagesDir}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, url]) => url);
}

export interface ProductMedia {
  images: string[];
  model3D?: string;
}

/**
 * Devuelve la galería de un producto.
 * Si no tiene galería local (ej: producto creado por el admin), usa su campo `image`.
 */
export function getProductMedia(product: Product): ProductMedia {
  const config = product.name ? MEDIA_CONFIG[product.name] : undefined;
  if (!config) return { images: product.image ? [product.image] : [] };

  const images = imagesOf(config.imagesDir);
  return {
    images: images.length ? images : [product.image],
    model3D: config.modelDir ? `/models/${config.modelDir}/scene.gltf` : undefined,
  };
}

/** Imagen de portada para las tarjetas del catálogo. */
export function getCoverImage(product: Product): string {
  return getProductMedia(product).images[0] ?? product.image;
}