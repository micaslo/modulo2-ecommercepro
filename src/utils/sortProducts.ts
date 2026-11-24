export type SortOption =
  | "none"
  | "price-desc"
  | "price-asc"
  | "name-asc"
  | "name-desc";

interface Sortable {
  name: string;
  price: number | string;
}

function parsePrice(price: number | string): number {
  if (typeof price === "number") return price;
  // Formato argentino: "$1.200,50" -> 1200.50
  const clean = price.replace(/[^\d,-]/g, "").replace(",", ".");
  return Number(clean) || 0;
}

export function sortProducts<T extends Sortable>(
  products: T[],
  sortBy: SortOption,
): T[] {
  const copy = [...products];

  switch (sortBy) {
    case "price-desc":
      return copy.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    case "price-asc":
      return copy.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    case "name-asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name, "es"));
    case "name-desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name, "es"));
    default:
      return products;
  }
}