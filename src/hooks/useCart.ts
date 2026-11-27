import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useAuth } from "./useAuth";
import {
  CART_UPDATED_EVENT,
  getCartStorageKey,
  loadUserCartFromStorage,
  parseCartItems,
  saveUserCartToStorage,
} from "../utils/cartStorage";
import type {
  AddToCartPayload,
  CartActionResult,
  CartItem,
} from "../types/cart";

function makeCartItemKey(
  productId: string,
  colorId?: string,
  isCar?: boolean,
): string {
  if (isCar) return productId;
  return colorId ? `${productId}__${colorId}` : productId;
}

function subscribeToCart(callback: () => void) {
  window.addEventListener(CART_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useCart() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const canUseCart = isAuthenticated && !isAdmin;
  const userId = user?.id ?? null;
  const cartOwnerId = canUseCart ? userId : null;

  const rawSnapshot = useSyncExternalStore(
    subscribeToCart,
    () => {
      if (!cartOwnerId) return "[]";
      try {
        return localStorage.getItem(getCartStorageKey(cartOwnerId)) ?? "[]";
      } catch {
        return "[]";
      }
    },
    () => "[]",
  );

  const items = useMemo<CartItem[]>(
    () => (cartOwnerId ? parseCartItems(rawSnapshot) : []),
    [rawSnapshot, cartOwnerId],
  );

  const persist = useCallback(
    (nextItems: CartItem[]) => {
      if (!cartOwnerId) return;
      saveUserCartToStorage(cartOwnerId, nextItems);
    },
    [cartOwnerId],
  );

  const addToCart = useCallback(
    (payload: AddToCartPayload): CartActionResult => {
      if (!userId) {
        return { ok: false, reason: "auth_required" };
      }
      if (isAdmin || !cartOwnerId) {
        return { ok: false, reason: "admin_forbidden" };
      }

      const {
        product,
        quantity,
        image,
        colorId,
        colorLabel,
        originalPrice,
        isCar,
      } = payload;

      if (product.stock <= 0) {
        return { ok: false, reason: "out_of_stock" };
      }

      const currentItems = loadUserCartFromStorage(cartOwnerId);
      const totalExistingForProduct = currentItems
        .filter((item) => item.productId === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);

      if (isCar) {
        if (totalExistingForProduct >= 1 || quantity > 1) {
          return { ok: false, reason: "car_limit" };
        }
      }

      if (totalExistingForProduct + quantity > product.stock) {
        return { ok: false, reason: "stock_limit" };
      }

      const key = makeCartItemKey(product.id, colorId, isCar);
      const existingIndex = currentItems.findIndex((item) => item.key === key);

      let nextItems: CartItem[];
      if (existingIndex >= 0) {
        nextItems = currentItems.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                stock: product.stock,
                price: product.price,
                image: image || item.image,
              }
            : item,
        );
      } else {
        const newItem: CartItem = {
          key,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice,
          category: product.category,
          image,
          colorId,
          colorLabel,
          quantity,
          stock: product.stock,
          isCar,
        };
        nextItems = [...currentItems, newItem];
      }

      persist(nextItems);
      const newTotalForProduct = totalExistingForProduct + quantity;
      return {
        ok: true,
        reachedStockLimit: !isCar && newTotalForProduct >= product.stock,
      };
    },
    [persist, userId, isAdmin, cartOwnerId],
  );

  const incrementItem = useCallback(
    (key: string): CartActionResult => {
      if (!userId) return { ok: false, reason: "auth_required" };
      if (isAdmin || !cartOwnerId) {
        return { ok: false, reason: "admin_forbidden" };
      }

      const currentItems = loadUserCartFromStorage(cartOwnerId);
      const target = currentItems.find((item) => item.key === key);
      if (!target) return { ok: false, reason: "out_of_stock" };

      if (target.isCar) {
        return { ok: false, reason: "car_limit" };
      }

      const totalForProduct = currentItems
        .filter((item) => item.productId === target.productId)
        .reduce((sum, item) => sum + item.quantity, 0);

      if (totalForProduct >= target.stock) {
        return { ok: false, reason: "stock_limit" };
      }

      const nextItems = currentItems.map((item) =>
        item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
      );
      persist(nextItems);

      const reachedStockLimit = totalForProduct + 1 >= target.stock;
      return { ok: true, reachedStockLimit };
    },
    [persist, userId, isAdmin, cartOwnerId],
  );

  const decrementItem = useCallback(
    (key: string) => {
      if (!cartOwnerId) return;

      const currentItems = loadUserCartFromStorage(cartOwnerId);
      const target = currentItems.find((item) => item.key === key);
      if (!target) return;

      const nextItems =
        target.quantity <= 1
          ? currentItems.filter((item) => item.key !== key)
          : currentItems.map((item) =>
              item.key === key
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            );
      persist(nextItems);
    },
    [persist, cartOwnerId],
  );

  const removeItem = useCallback(
    (key: string) => {
      if (!cartOwnerId) return;

      const currentItems = loadUserCartFromStorage(cartOwnerId);
      persist(currentItems.filter((item) => item.key !== key));
    },
    [persist, cartOwnerId],
  );

  const clearCart = useCallback(() => {
    if (!cartOwnerId) return;
    persist([]);
  }, [persist, cartOwnerId]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return {
    items,
    totalItems,
    subtotal,
    addToCart,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  };
}
