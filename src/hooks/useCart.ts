import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AddToCartPayload,
  CartActionResult,
  CartItem,
} from "../types/cart";

const CART_STORAGE_KEY = "detodito_cart_v1";
const CART_UPDATED_EVENT = "detodito-cart-updated";

function makeCartItemKey(
  productId: string,
  colorId?: string,
  isCar?: boolean,
): string {
  
  if (isCar) return productId;
  return colorId ? `${productId}__${colorId}` : productId;
}

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item) &&
        typeof item.key === "string" &&
        typeof item.productId === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("No se pudo guardar el carrito en localStorage:", error);
  }
}

function notifyCartUpdated() {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);

  useEffect(() => {
    const syncCart = () => {
      setItems(loadCartFromStorage());
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === CART_STORAGE_KEY) {
        syncCart();
      }
    };

    window.addEventListener(CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const persist = useCallback((nextItems: CartItem[]) => {
    saveCartToStorage(nextItems);
    setItems(nextItems);
    notifyCartUpdated();
  }, []);

  const getProductQuantityInCart = useCallback(
    (productId: string) =>
      items
        .filter((item) => item.productId === productId)
        .reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const addToCart = useCallback(
    (payload: AddToCartPayload): CartActionResult => {
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

      const currentItems = loadCartFromStorage();
      const totalExistingForProduct = currentItems
        .filter((item) => item.productId === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);

      // Regla de autos: máximo 1 unidad por vehículo
      if (isCar) {
        if (totalExistingForProduct >= 1 || quantity > 1) {
          return { ok: false, reason: "car_limit" };
        }
      }

      // Regla de stock general (sumando variantes de color del mismo producto)
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
    [persist],
  );

  const incrementItem = useCallback(
    (key: string): CartActionResult => {
      const currentItems = loadCartFromStorage();
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
    [persist],
  );

  const decrementItem = useCallback(
    (key: string) => {
      const currentItems = loadCartFromStorage();
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
    [persist],
  );

  const removeItem = useCallback(
    (key: string) => {
      const currentItems = loadCartFromStorage();
      persist(currentItems.filter((item) => item.key !== key));
    },
    [persist],
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

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
    getProductQuantityInCart,
  };
}
