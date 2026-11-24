const WISHLIST_STORAGE_KEY = "detodito-wishlist";
export const WISHLIST_CHANGE_EVENT = "detodito:wishlist-change";

export function getWishlistIds(): string[] {
  try {
    const savedIds = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!savedIds) return [];

    const parsed: unknown = JSON.parse(savedIds);
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((id): id is string => typeof id === "string"))]
      : [];
  } catch {
    return [];
  }
}

function saveWishlistIds(ids: string[]) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(WISHLIST_CHANGE_EVENT));
  } catch (error) {
    console.error("No se pudo guardar la lista de deseos", error);
  }
}

export function toggleWishlistProduct(productId: string): boolean {
  const ids = getWishlistIds();
  const isSaved = ids.includes(productId);
  saveWishlistIds(
    isSaved ? ids.filter((id) => id !== productId) : [...ids, productId],
  );
  return !isSaved;
}

export function removeWishlistProduct(productId: string) {
  saveWishlistIds(getWishlistIds().filter((id) => id !== productId));
}

export function clearWishlist() {
  saveWishlistIds([]);
}
