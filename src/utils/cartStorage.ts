import type { CartItem } from "../types/cart";

const CART_STORAGE_KEY = "detodito_cart_v1";
export const CART_UPDATED_EVENT = "detodito-cart-updated";

export function getCartStorageKey(userId: string): string {
  return `${CART_STORAGE_KEY}:${userId}`;
}

export function parseCartItems(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as CartItem).key === "string" &&
        typeof (item as CartItem).productId === "string" &&
        typeof (item as CartItem).name === "string" &&
        typeof (item as CartItem).price === "number" &&
        typeof (item as CartItem).quantity === "number" &&
        (item as CartItem).quantity > 0,
    );
  } catch {
    return [];
  }
}

export function loadUserCartFromStorage(userId: string): CartItem[] {
  try {
    return parseCartItems(localStorage.getItem(getCartStorageKey(userId)));
  } catch {
    return [];
  }
}

export function saveUserCartToStorage(userId: string, items: CartItem[]) {
  try {
    localStorage.setItem(getCartStorageKey(userId), JSON.stringify(items));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  } catch (error) {
    console.error("No se pudo guardar el carrito en localStorage:", error);
  }
}

export function clearUserCartStorage(userId: string) {
  try {
    localStorage.removeItem(getCartStorageKey(userId));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  } catch (error) {
    console.error("No se pudo limpiar el carrito del usuario:", error);
  }
}
