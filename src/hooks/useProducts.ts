import { useCallback, useEffect, useState } from "react";
import type { NewProduct, Product } from "../types/productMedia";
import { initialProducts } from "../data/initialProducts";

export type { NewProduct };

const STORAGE_KEY = "products";
const SEEDED_IDS_KEY = "products_seeded_ids";
const PRODUCTS_UPDATED_EVENT = "products-updated";

function saveProducts(products: Product[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("No se pudo guardar en localStorage", error);
  }
}

function notifyProductsUpdated() {
  window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT));
}

function loadProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const allInitialIds = initialProducts.map((p) => p.id);

    if (!saved) {
      localStorage.setItem(SEEDED_IDS_KEY, JSON.stringify(allInitialIds));
      saveProducts(initialProducts);
      return initialProducts;
    }

    const parsed = JSON.parse(saved) as Product[];
    if (!Array.isArray(parsed)) {
      localStorage.setItem(SEEDED_IDS_KEY, JSON.stringify(allInitialIds));
      saveProducts(initialProducts);
      return initialProducts;
    }

    const savedSeededRaw = localStorage.getItem(SEEDED_IDS_KEY);
    const seededIds = new Set<string>(
      savedSeededRaw
        ? (JSON.parse(savedSeededRaw) as string[])
        : parsed.map((p) => p.id),
    );
    const existingIds = new Set(parsed.map((p) => p.id));

    const newSeedProducts = initialProducts.filter(
      (p) => !seededIds.has(p.id) && !existingIds.has(p.id),
    );

    if (newSeedProducts.length > 0 || !savedSeededRaw) {
      for (const id of allInitialIds) {
        seededIds.add(id);
      }
      localStorage.setItem(
        SEEDED_IDS_KEY,
        JSON.stringify(Array.from(seededIds)),
      );
    }

    if (newSeedProducts.length > 0) {
      const merged = [...parsed, ...newSeedProducts];
      saveProducts(merged);
      return merged;
    }

    return parsed;
  } catch {
    return initialProducts;
  }
}

function generateProductId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  useEffect(() => {
    const syncProducts = () => {
      setProducts(loadProducts());
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === STORAGE_KEY) {
        syncProducts();
      }
    };

    window.addEventListener(PRODUCTS_UPDATED_EVENT, syncProducts);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, syncProducts);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  );

  const addProduct = useCallback((data: NewProduct) => {
    const newProduct: Product = { ...data, id: generateProductId() };
    const next = [...loadProducts(), newProduct];
    saveProducts(next);
    setProducts(next);
    notifyProductsUpdated();
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, data: NewProduct) => {
    const next = loadProducts().map((p) => (p.id === id ? { ...data, id } : p));
    saveProducts(next);
    setProducts(next);
    notifyProductsUpdated();
  }, []);

  const deleteProduct = useCallback((id: string) => {
    const next = loadProducts().filter((p) => p.id !== id);
    saveProducts(next);
    setProducts(next);
    notifyProductsUpdated();
  }, []);

  return {
    products,
    deleteProduct,
    updateProduct,
    addProduct,
    getProductById,
  };
}

