import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useAuth } from "./useAuth";
import {
  clearWishlist,
  getWishlistStorageKey,
  removeWishlistProduct,
  toggleWishlistProduct,
  WISHLIST_CHANGE_EVENT,
} from "../utils/wishlist";

function subscribeToWishlist(callback: () => void) {
  window.addEventListener(WISHLIST_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(WISHLIST_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useWishlist() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const canUseWishlist = isAuthenticated && !isAdmin;
  const userId = canUseWishlist ? (user?.id ?? null) : null;

  const rawSnapshot = useSyncExternalStore(
    subscribeToWishlist,
    () => {
      if (!userId) return "[]";
      try {
        return localStorage.getItem(getWishlistStorageKey(userId)) ?? "[]";
      } catch {
        return "[]";
      }
    },
    () => "[]",
  );

  const wishlistIds = useMemo<string[]>(() => {
    if (!userId) return [];
    try {
      const parsed: unknown = JSON.parse(rawSnapshot);
      return Array.isArray(parsed)
        ? [...new Set(parsed.filter((id): id is string => typeof id === "string"))]
        : [];
    } catch {
      return [];
    }
  }, [rawSnapshot, userId]);

  const isFavorite = useCallback(
    (productId: string) => canUseWishlist && wishlistIds.includes(productId),
    [canUseWishlist, wishlistIds],
  );

  const toggle = useCallback(
    (productId: string): boolean => {
      if (!userId) return false;
      return toggleWishlistProduct(productId, userId);
    },
    [userId],
  );

  const remove = useCallback(
    (productId: string) => {
      if (!userId) return;
      removeWishlistProduct(productId, userId);
    },
    [userId],
  );

  const clear = useCallback(() => {
    if (!userId) return;
    clearWishlist(userId);
  }, [userId]);

  return {
    wishlistIds,
    count: wishlistIds.length,
    canUseWishlist,
    isFavorite,
    toggle,
    remove,
    clear,
  };
}
