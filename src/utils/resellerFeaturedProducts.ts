import type { Product } from "../types/productMedia";

const FEATURED_IDS_KEY = "detodito-reseller-featured-product-ids";
const FEATURED_COUNT = 5;

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

function readSavedFeaturedProducts(products: Product[]): Product[] | null {
  try {
    const savedIds = localStorage.getItem(FEATURED_IDS_KEY);
    if (!savedIds) return null;

    const ids: unknown = JSON.parse(savedIds);
    if (!Array.isArray(ids)) return null;

    const savedProducts = ids
      .filter((id): id is string => typeof id === "string")
      .map((id) => products.find((product) => product.id === id))
      .filter((product) => product !== undefined);

    if (savedProducts.length === FEATURED_COUNT) return savedProducts;
  } catch {
    return null;
  }

  return null;
}

export function getResellerFeaturedProducts(products: Product[]): Product[] {
  const savedProducts = readSavedFeaturedProducts(products);
  if (savedProducts) return savedProducts;

  const availableProducts = shuffle(products.filter((product) => product.stock > 0));
  const selected: Product[] = [];
  const selectedCategories = new Set<string>();

  for (const product of availableProducts) {
    if (!selectedCategories.has(product.category)) {
      selected.push(product);
      selectedCategories.add(product.category);
    }
    if (selected.length === FEATURED_COUNT) break;
  }

  for (const product of availableProducts) {
    if (selected.length === FEATURED_COUNT) break;
    if (!selected.some((selectedProduct) => selectedProduct.id === product.id)) {
      selected.push(product);
    }
  }

  try {
    localStorage.setItem(
      FEATURED_IDS_KEY,
      JSON.stringify(selected.map((product) => product.id)),
    );
  } catch {
    // La selección continúa disponible mientras esta página esté abierta.
  }

  return selected;
}
