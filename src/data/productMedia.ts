import type {
  Product,
  ProductColorVariant,
  ProductMedia,
} from "../types/productMedia";

const imageModules = import.meta.glob<string>(
  "../assets/images/product-page/images/**/*.{webp,png,jpg,jpeg}",
  { eager: true, import: "default" },
);

type MediaMode = "phone" | "car";

interface MediaConfigEntry {
  imagesDir: string;
  modelDir?: string;
  mode: MediaMode;
  defaultColor?: string;
}

const MEDIA_CONFIG: Record<string, MediaConfigEntry> = {
  "iphone-18-pro": {
    imagesDir: "iphone-18-pro",
    modelDir: "apple-iphone-18-pro-max-burgundy",
    mode: "phone",
    defaultColor: "burgundy",
  },
  "samsung-s26-ultra": {
    imagesDir: "samsung-s26-ultra",
    modelDir: "samsung-s26-ultra",
    mode: "phone",
    defaultColor: "skyblue",
  },
  "chevrolet-captiva": {
    imagesDir: "chevrolet-captiva",
    modelDir: "chevrolet-captiva-premier",
    mode: "car",
    defaultColor: "red",
  },
  "chevrolet-traverse": {
    imagesDir: "chevrolet-traverse",
    modelDir: "chevrolet-traverse",
    mode: "car",
    defaultColor: "black",
  },
};

const COLOR_META: Record<string, { label: string; hex: string }> = {
  burgundy: { label: "Borgoña", hex: "#6b1f32" },
  black: { label: "Negro", hex: "#1e232b" },
  white: { label: "Blanco", hex: "#f4f6f8" },
  skyblue: { label: "Celeste", hex: "#9acae8" },
  pink: { label: "Rosa", hex: "#f1c4c2" },
  purple: { label: "Violeta", hex: "#9b89be" },
  silver: { label: "Plata", hex: "#c8ced6" },
  grey: { label: "Gris", hex: "#6b7480" },
  gray: { label: "Gris", hex: "#6b7480" },
  red: { label: "Rojo", hex: "#c81d2a" },
  blue: { label: "Azul", hex: "#285ea8" },
  gold: { label: "Dorado", hex: "#d6b87c" },
  green: { label: "Verde", hex: "#3d7a5b" },
};

const KNOWN_COLORS = Object.keys(COLOR_META);

interface ImageEntry {
  filename: string;
  baseName: string;
  url: string;
}

function getFolderEntries(imagesDir: string): ImageEntry[] {
  return Object.entries(imageModules)
    .filter(([filePath]) => filePath.includes(`/images/${imagesDir}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([filePath, url]) => {
      const filename = filePath.split("/").pop() ?? "";
      const baseName = filename.replace(/\.[^.]+$/, "").toLowerCase();
      return { filename, baseName, url };
    });
}

function parsePhoneImages(
  entries: ImageEntry[],
  defaultColor?: string,
): ProductColorVariant[] {
  const colorGroups = new Map<string, { back?: string; front?: string }>();
  const sharedImages: string[] = [];

  for (const entry of entries) {
    // Detecta patrones como iphone-back-burgundy-, iphone-front-black, samsung-back-pink
    const match = entry.baseName.match(/-(front|back)-([a-z]+)-?$/);
    if (match) {
      const view = match[1] as "front" | "back";
      const colorKey = match[2];
      if (KNOWN_COLORS.includes(colorKey)) {
        const current = colorGroups.get(colorKey) ?? {};
        current[view] = entry.url;
        colorGroups.set(colorKey, current);
        continue;
      }
    }
    sharedImages.push(entry.url);
  }

  const orderedKeys = Array.from(colorGroups.keys()).sort((a, b) => {
    if (a === defaultColor) return -1;
    if (b === defaultColor) return 1;
    return a.localeCompare(b);
  });

  return orderedKeys.map((colorKey) => {
    const views = colorGroups.get(colorKey)!;
    // Priorizamos back (muestra espalda + frente) seguido de front, y luego el resto de la carpeta
    const colorImages = [views.back, views.front].filter(
      (img): img is string => Boolean(img),
    );
    const meta = COLOR_META[colorKey] ?? { label: colorKey, hex: "#91a0b4" };

    return {
      id: colorKey,
      label: meta.label,
      hex: meta.hex,
      previewImage: colorImages[0] ?? sharedImages[0] ?? "",
      images: [...colorImages, ...sharedImages],
    };
  });
}

function parseCarImages(
  entries: ImageEntry[],
  defaultColor?: string,
): ProductColorVariant[] {
  const colorCutouts = new Map<string, string>();
  const sharedMockups: string[] = [];

  for (const entry of entries) {
    // Detecta exactamente <modelo>-<color> (imágenes sin fondo), ej: captiva-red, traverse-black
    // Excluye mockups con fondo como captiva-grey-back, captiva-display-red, traverse-red-1
    const match = entry.baseName.match(/^[a-z0-9]+-([a-z]+)$/);
    if (match && KNOWN_COLORS.includes(match[1])) {
      colorCutouts.set(match[1], entry.url);
      continue;
    }
    sharedMockups.push(entry.url);
  }

  const orderedKeys = Array.from(colorCutouts.keys()).sort((a, b) => {
    if (a === defaultColor) return -1;
    if (b === defaultColor) return 1;
    return a.localeCompare(b);
  });

  return orderedKeys.map((colorKey) => {
    const cutout = colorCutouts.get(colorKey)!;
    const meta = COLOR_META[colorKey] ?? { label: colorKey, hex: "#91a0b4" };

    return {
      id: colorKey,
      label: meta.label,
      hex: meta.hex,
      previewImage: cutout,
      images: [cutout, ...sharedMockups],
    };
  });
}

function resolveConfig(product: Product): MediaConfigEntry | undefined {
  if (MEDIA_CONFIG[product.id]) return MEDIA_CONFIG[product.id];
  const lowerName = product.name.toLowerCase();
  if (lowerName.includes("iphone")) return MEDIA_CONFIG["iphone-18-pro"];
  if (lowerName.includes("samsung") || lowerName.includes("galaxy")) {
    return MEDIA_CONFIG["samsung-s26-ultra"];
  }
  if (lowerName.includes("captiva")) return MEDIA_CONFIG["chevrolet-captiva"];
  if (lowerName.includes("traverse")) return MEDIA_CONFIG["chevrolet-traverse"];
  return undefined;
}

/**
 * Devuelve la galería (agrupada por color), lista de variantes de color y ruta al modelo 3D.
 * Si el producto no tiene carpeta local (ej: creado desde un panel admin), usa `product.image`.
 */
export function getProductMedia(product: Product): ProductMedia {
  const config = resolveConfig(product);
  if (!config) {
    return {
      images: product.image ? [product.image] : [],
      colors: [],
    };
  }

  const entries = getFolderEntries(config.imagesDir);
  const colors =
    config.mode === "phone"
      ? parsePhoneImages(entries, config.defaultColor)
      : parseCarImages(entries, config.defaultColor);

  const fallbackImages = entries.map((e) => e.url);
  const defaultImages =
    colors[0]?.images ??
    (fallbackImages.length ? fallbackImages : product.image ? [product.image] : []);

  return {
    images: defaultImages,
    colors,
    model3D: config.modelDir ? `/models/${config.modelDir}/scene.gltf` : undefined,
  };
}

/** Imagen de portada para las tarjetas del catálogo o productos relacionados. */
export function getCoverImage(product: Product, colorId?: string): string {
  const media = getProductMedia(product);
  if (colorId) {
    const variant = media.colors.find((c) => c.id === colorId);
    if (variant?.previewImage) return variant.previewImage;
  }
  return media.images[0] ?? product.image;
}
