const WISHLIST_STORAGE_KEY = "detodito-wishlist";
export const WISHLIST_CHANGE_EVENT = "detodito:wishlist-change";

export function getWishlistStorageKey(userId?: string | null): string {
  return userId ? `${WISHLIST_STORAGE_KEY}:${userId}` : WISHLIST_STORAGE_KEY;
}

export function getWishlistIds(userId?: string | null): string[] {
  try {
    const savedIds = localStorage.getItem(getWishlistStorageKey(userId));
    if (!savedIds) return [];

    const parsed: unknown = JSON.parse(savedIds);
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((id): id is string => typeof id === "string"))]
      : [];
  } catch {
    return [];
  }
}

export function seedWishlistIfMissing(
  defaultIds: string[],
  userId?: string | null,
): string[] {
  try {
    const key = getWishlistStorageKey(userId);
    const saved = localStorage.getItem(key);
    if (saved !== null) return getWishlistIds(userId);

    const ids = [...new Set(defaultIds)].slice(0, 5);
    localStorage.setItem(key, JSON.stringify(ids));
    return ids;
  } catch {
    return [];
  }
}

function saveWishlistIds(ids: string[], userId?: string | null) {
  try {
    localStorage.setItem(getWishlistStorageKey(userId), JSON.stringify(ids));
    window.dispatchEvent(new Event(WISHLIST_CHANGE_EVENT));
  } catch (error) {
    console.error("No se pudo guardar la lista de deseos", error);
  }
}

export function toggleWishlistProduct(
  productId: string,
  userId?: string | null,
): boolean {
  const ids = getWishlistIds(userId);
  const isSaved = ids.includes(productId);
  saveWishlistIds(
    isSaved ? ids.filter((id) => id !== productId) : [...ids, productId],
    userId,
  );
  return !isSaved;
}

export function removeWishlistProduct(
  productId: string,
  userId?: string | null,
) {
  saveWishlistIds(
    getWishlistIds(userId).filter((id) => id !== productId),
    userId,
  );
}

export function clearWishlist(userId?: string | null) {
  saveWishlistIds([], userId);
}

export function clearUserWishlistStorage(userId: string) {
  try {
    localStorage.removeItem(getWishlistStorageKey(userId));
    window.dispatchEvent(new Event(WISHLIST_CHANGE_EVENT));
  } catch (error) {
    console.error("No se pudo limpiar la lista de deseos del usuario", error);
  }
}
