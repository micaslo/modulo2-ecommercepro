import type {
  Product,
  ProductColorVariant,
  ProductMedia,
} from "../types/productMedia";

const imageModules = import.meta.glob<string>(
  "../assets/images/productPage/images/**/*.{webp,png,jpg,jpeg}",
  { eager: true, import: "default" },
);

type MediaMode = "phone" | "car" | "controller" | "gallery";

interface ColorMeta {
  label: string;
  hex: string;
}

interface MediaConfigEntry {
  imagesDir: string;
  modelDir?: string;
  mode: MediaMode;
  defaultColor?: string;
  colorOverrides?: Record<string, Partial<ColorMeta>>;
}

const MEDIA_CONFIG: Record<string, MediaConfigEntry> = {
  "iphone-18-pro": {
    imagesDir: "iphone18Pro",
    modelDir: "appleIphone18ProMaxBurgundy",
    mode: "phone",
    defaultColor: "burgundy",
  },
  "samsung-s26-ultra": {
    imagesDir: "samsungS26Ultra",
    modelDir: "samsungS26Ultra",
    mode: "phone",
    defaultColor: "skyblue",
  },
  "chevrolet-captiva": {
    imagesDir: "chevroletCaptiva",
    modelDir: "chevroletCaptivaPremier",
    mode: "car",
    defaultColor: "red",
  },
  "chevrolet-traverse": {
    imagesDir: "chevroletTraverse",
    modelDir: "chevroletTraverse",
    mode: "car",
    defaultColor: "black",
  },
  "canon-eos-5d-mark-iv": {
    imagesDir: "canon",
    modelDir: "canonEos5dMarkIv",
    mode: "gallery",
  },
  "nikon-z9": {
    imagesDir: "nikon",
    modelDir: "nikonD6",
    mode: "gallery",
  },
  "ps5-dualsense": {
    imagesDir: "ps5Controller",
    modelDir: "playstation5Dualsense",
    mode: "controller",
    defaultColor: "white",
    colorOverrides: {
      blue: { label: "Azul", hex: "#4bb5f5" },
      grey: { label: "Plata", hex: "#b8bec7" },
    },
  },
  "iphone-18-pro-skyblue": {
    imagesDir: "iphone18Pro",
    modelDir: "appleIphone18ProMaxBurgundy",
    mode: "phone",
    defaultColor: "skyblue",
  },
  "samsung-s26-ultra-pink": {
    imagesDir: "samsungS26Ultra",
    modelDir: "samsungS26Ultra",
    mode: "phone",
    defaultColor: "pink",
  },
  "samsung-s26-ultra-purple": {
    imagesDir: "samsungS26Ultra",
    modelDir: "samsungS26Ultra",
    mode: "phone",
    defaultColor: "purple",
  },
  "chevrolet-captiva-silver": {
    imagesDir: "chevroletCaptiva",
    modelDir: "chevroletCaptivaPremier",
    mode: "car",
    defaultColor: "silver",
  },
  "chevrolet-traverse-white": {
    imagesDir: "chevroletTraverse",
    modelDir: "chevroletTraverse",
    mode: "car",
    defaultColor: "white",
  },
  "canon-eos-r6-mark-ii": {
    imagesDir: "canon",
    modelDir: "canonEos5dMarkIv",
    mode: "gallery",
  },
  "nikon-z8": {
    imagesDir: "nikon",
    modelDir: "nikonD6",
    mode: "gallery",
  },
  "ps5-dualsense-blue": {
    imagesDir: "ps5Controller",
    modelDir: "playstation5Dualsense",
    mode: "controller",
    defaultColor: "blue",
  },
  "ps5-dualsense-camouflage": {
    imagesDir: "ps5Controller",
    modelDir: "playstation5Dualsense",
    mode: "controller",
    defaultColor: "camouflage",
  },
  "iphone-18-pro-black": {
    imagesDir: "iphone18Pro",
    modelDir: "appleIphone18ProMaxBurgundy",
    mode: "phone",
    defaultColor: "black",
  },
  "samsung-s26-ultra-silver": {
    imagesDir: "samsungS26Ultra",
    modelDir: "samsungS26Ultra",
    mode: "phone",
    defaultColor: "silver",
  },
  "chevrolet-captiva-black": {
    imagesDir: "chevroletCaptiva",
    modelDir: "chevroletCaptivaPremier",
    mode: "car",
    defaultColor: "black",
  },
  "chevrolet-traverse-grey": {
    imagesDir: "chevroletTraverse",
    modelDir: "chevroletTraverse",
    mode: "car",
    defaultColor: "grey",
  },
  "canon-ef-50mm": {
    imagesDir: "canon",
    modelDir: "canonEos5dMarkIv",
    mode: "gallery",
  },
  "nikon-z9-kit": {
    imagesDir: "nikon",
    modelDir: "nikonD6",
    mode: "gallery",
  },
  "ps5-dualsense-black": {
    imagesDir: "ps5Controller",
    modelDir: "playstation5Dualsense",
    mode: "controller",
    defaultColor: "black",
  },
  "ps5-dualsense-grey": {
    imagesDir: "ps5Controller",
    modelDir: "playstation5Dualsense",
    mode: "controller",
    defaultColor: "grey",
  },
};

const COLOR_META: Record<string, ColorMeta> = {
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
  camouflage: { label: "Camuflado", hex: "#5a6065" },
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

const CONTROLLER_SUFFIX_ORDER: Record<string, number> = {
  "": 0,
  detail: 1,
  hand: 2,
  hands: 2,
  specs: 3,
  tech: 4,
  inside: 5,
  measures: 6,
  box: 7,
};

function parseControllerImages(
  entries: ImageEntry[],
  defaultColor?: string,
  colorOverrides?: Record<string, Partial<ColorMeta>>,
): ProductColorVariant[] {
  const colorGroups = new Map<string, Array<{ suffix: string; url: string }>>();
  const sharedImages: string[] = [];

  for (const entry of entries) {

    const match = entry.baseName.match(/^[a-z0-9]+-([a-z]+)(?:-(.+))?$/);
    if (match && KNOWN_COLORS.includes(match[1])) {
      const colorKey = match[1];
      const suffix = match[2] ?? "";
      const list = colorGroups.get(colorKey) ?? [];
      list.push({ suffix, url: entry.url });
      colorGroups.set(colorKey, list);
      continue;
    }
    sharedImages.push(entry.url);
  }

  const orderedKeys = Array.from(colorGroups.keys()).sort((a, b) => {
    if (a === defaultColor) return -1;
    if (b === defaultColor) return 1;
    return a.localeCompare(b);
  });

  return orderedKeys.map((colorKey) => {
    const items = colorGroups.get(colorKey)!.sort((a, b) => {
      const orderA = CONTROLLER_SUFFIX_ORDER[a.suffix] ?? 99;
      const orderB = CONTROLLER_SUFFIX_ORDER[b.suffix] ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.suffix.localeCompare(b.suffix);
    });

    const colorImages = items.map((item) => item.url);
    const baseMeta = COLOR_META[colorKey] ?? { label: colorKey, hex: "#91a0b4" };
    const override = colorOverrides?.[colorKey];
    const meta: ColorMeta = {
      label: override?.label ?? baseMeta.label,
      hex: override?.hex ?? baseMeta.hex,
    };

    return {
      id: colorKey,
      label: meta.label,
      hex: meta.hex,
      previewImage: colorImages[0] ?? sharedImages[0] ?? "",
      images: [...colorImages, ...sharedImages],
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
  if (lowerName.includes("canon") || lowerName.includes("5d")) {
    return MEDIA_CONFIG["canon-eos-5d-mark-iv"];
  }
  if (lowerName.includes("nikon") || lowerName.includes("z 9") || lowerName.includes("z9")) {
    return MEDIA_CONFIG["nikon-z9"];
  }
  if (
    lowerName.includes("dualsense") ||
    lowerName.includes("ps5") ||
    lowerName.includes("playstation") ||
    lowerName.includes("joystick")
  ) {
    return MEDIA_CONFIG["ps5-dualsense"];
  }
  return undefined;
}

function getCustomImages(product: Product): string[] {
  const candidates = [
    ...(Array.isArray(product.images) ? product.images : []),
    ...(product.image ? [product.image] : []),
  ]
    .map((img) => img.trim())
    .filter(Boolean);

  return Array.from(new Set(candidates));
}

export function getBundledProductImages(product: Product): string[] {
  const config = resolveConfig(product);
  if (!config) return [];

  const entries = getFolderEntries(config.imagesDir);
  let colors: ProductColorVariant[] = [];
  if (config.mode === "phone") {
    colors = parsePhoneImages(entries, config.defaultColor);
  } else if (config.mode === "car") {
    colors = parseCarImages(entries, config.defaultColor);
  } else if (config.mode === "controller") {
    colors = parseControllerImages(
      entries,
      config.defaultColor,
      config.colorOverrides,
    );
  }

  const ordered = [
    ...(colors[0]?.images ?? []),
    ...colors.flatMap((variant) => variant.images),
    ...entries.map((entry) => entry.url),
  ].filter(Boolean);

  return Array.from(new Set(ordered));
}

export interface EditableProductImage {
  url: string;
  source: "bundled" | "custom";
}

export function getEditableProductImages(
  product: Product,
): EditableProductImage[] {
  const removedSet = new Set(product.removedImages ?? []);
  const customImages = getCustomImages(product).filter(
    (url) => !removedSet.has(url),
  );
  const bundledImages = getBundledProductImages(product).filter(
    (url) => !removedSet.has(url),
  );

  const seen = new Set<string>();
  const result: EditableProductImage[] = [];

  for (const url of bundledImages) {
    if (seen.has(url)) continue;
    seen.add(url);
    result.push({ url, source: "bundled" });
  }

  for (const url of customImages) {
    if (seen.has(url)) continue;
    seen.add(url);
    result.push({ url, source: "custom" });
  }

  return result;
}

export function getProductMedia(product: Product): ProductMedia {
  const config = resolveConfig(product);
  const customImages = getCustomImages(product);
  const removedSet = new Set(product.removedImages ?? []);

  const resolvedModel3D =
    product.model3D !== undefined
      ? product.model3D.trim() || undefined
      : config?.modelDir
        ? `/models/${config.modelDir}/scene.gltf`
        : undefined;

  if (!config) {
    const visibleCustom = customImages.filter((img) => !removedSet.has(img));
    return {
      images: visibleCustom,
      colors: [],
      model3D: resolvedModel3D,
    };
  }

  const entries = getFolderEntries(config.imagesDir);
  let colors: ProductColorVariant[] = [];
  if (config.mode === "phone") {
    colors = parsePhoneImages(entries, config.defaultColor);
  } else if (config.mode === "car") {
    colors = parseCarImages(entries, config.defaultColor);
  } else if (config.mode === "controller") {
    colors = parseControllerImages(
      entries,
      config.defaultColor,
      config.colorOverrides,
    );
  }

  const visibleCustom = customImages.filter((img) => !removedSet.has(img));
  const filteredColors = colors
    .map((variant) => {
      const kept = variant.images.filter((img) => !removedSet.has(img));
      if (kept.length === 0) return null;
      const merged = Array.from(new Set([...kept, ...visibleCustom]));
      return {
        ...variant,
        previewImage: kept[0] ?? merged[0] ?? "",
        images: merged,
      };
    })
    .filter((variant): variant is ProductColorVariant => variant !== null);

  const fallbackImages = entries
    .map((e) => e.url)
    .filter((img) => !removedSet.has(img));

  const defaultImages =
    filteredColors[0]?.images ??
    Array.from(new Set([...fallbackImages, ...visibleCustom]));

  return {
    images: defaultImages,
    colors: filteredColors,
    model3D: resolvedModel3D,
  };
}

export function getCoverImage(product: Product, colorId?: string): string {
  const media = getProductMedia(product);
  if (colorId) {
    const variant = media.colors.find((c) => c.id === colorId);
    if (variant?.previewImage) return variant.previewImage;
  }
  return media.images[0] ?? product.image;
}
