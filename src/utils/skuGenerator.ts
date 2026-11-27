import type { Product } from "../types/productMedia";

const SKU_SEQUENCES_STORAGE_KEY = "detodito_sku_sequences_v1";

const CATEGORY_SKU_PREFIX: Record<string, string> = {
  "Tecnología": "TEC",
  "Vehículos": "VEH",
  "Cámaras y Accesorios": "CAM",
  Gaming: "GAM",
  "Electrodomésticos": "ELE",
  Hogar: "HOG",
  Deportes: "DEP",
  Ropa: "ROP",
  Accesorios: "ACC",
  Belleza: "BEL",
  Mascotas: "MAS",
  Otros: "OTR",
};

export function getCategorySkuPrefix(category: string): string {
  const trimmed = category.trim();
  if (CATEGORY_SKU_PREFIX[trimmed]) {
    return CATEGORY_SKU_PREFIX[trimmed];
  }

  const normalized = trimmed
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase();

  return normalized.slice(0, 3) || "PRD";
}

function parseSkuSequence(
  code?: string | null,
): { prefix: string; seq: number } | null {
  if (!code) return null;
  const match = code.trim().toUpperCase().match(/^DT-([A-Z0-9]{2,6})-(\d+)$/);
  if (!match) return null;
  const seq = Number.parseInt(match[2], 10);
  if (Number.isNaN(seq) || seq < 0) return null;
  return { prefix: match[1], seq };
}

function loadSkuSequences(): Record<string, number> {
  try {
    const raw = localStorage.getItem(SKU_SEQUENCES_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const result: Record<string, number> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
        result[key.toUpperCase()] = value;
      }
    }
    return result;
  } catch {
    return {};
  }
}

function saveSkuSequences(sequences: Record<string, number>) {
  try {
    localStorage.setItem(SKU_SEQUENCES_STORAGE_KEY, JSON.stringify(sequences));
  } catch (error) {
    console.error("No se pudieron guardar las secuencias de SKU:", error);
  }
}

export function syncSkuSequencesWithProducts(
  products: Product[],
): Record<string, number> {
  const sequences = loadSkuSequences();
  let changed = false;

  for (const product of products) {
    const parsed = parseSkuSequence(product.code);
    if (!parsed) continue;
    const currentMax = sequences[parsed.prefix] ?? 0;
    if (parsed.seq > currentMax) {
      sequences[parsed.prefix] = parsed.seq;
      changed = true;
    }
  }

  if (changed) {
    saveSkuSequences(sequences);
  }

  return sequences;
}

export function reserveSku(code: string, products: Product[] = []) {
  const sequences = syncSkuSequencesWithProducts(products);
  const parsed = parseSkuSequence(code);
  if (!parsed) return;

  const currentMax = sequences[parsed.prefix] ?? 0;
  if (parsed.seq > currentMax) {
    sequences[parsed.prefix] = parsed.seq;
    saveSkuSequences(sequences);
  }
}

export function suggestNextSku(
  category: string,
  existingProducts: Product[],
  excludeProductId?: string | null,
): string {
  const prefix = getCategorySkuPrefix(category);
  const sequences = loadSkuSequences();
  const usedCodes = new Set<string>();
  let maxSeq = sequences[prefix] ?? 0;

  for (const product of existingProducts) {
    const normalizedCode = (product.code ?? product.id).trim().toUpperCase();
    if (product.id !== excludeProductId) {
      usedCodes.add(normalizedCode);
    }
    const parsed = parseSkuSequence(product.code);
    if (parsed && parsed.prefix === prefix && parsed.seq > maxSeq) {
      maxSeq = parsed.seq;
    }
  }

  let nextSeq = maxSeq + 1;
  let candidate = `DT-${prefix}-${String(nextSeq).padStart(3, "0")}`;
  while (usedCodes.has(candidate)) {
    nextSeq += 1;
    candidate = `DT-${prefix}-${String(nextSeq).padStart(3, "0")}`;
  }

  return candidate;
}
