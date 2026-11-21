import { useEffect, useState } from "react";
import { type NewProduct } from "../context/ProductsContext";
import type { Product } from "../types/productMedia";
import { initialProducts } from "../data/initialProducts";

const STORAGE_KEY = "products";
const SEEDED_IDS_KEY = "products_seeded_ids";

function loadProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const allInitialIds = initialProducts.map((p) => p.id);

    if (!saved) {
      localStorage.setItem(SEEDED_IDS_KEY, JSON.stringify(allInitialIds));
      return initialProducts;
    }

    const parsed = JSON.parse(saved) as Product[];
    if (!Array.isArray(parsed)) {
      localStorage.setItem(SEEDED_IDS_KEY, JSON.stringify(allInitialIds));
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

    return newSeedProducts.length > 0
      ? [...parsed, ...newSeedProducts]
      : parsed;
  } catch {
    return initialProducts;
  }
}

export function useProducts() {
const [products, setProducts] = useState<Product[]>(loadProducts);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("No se pudo guardar en localStorage", error);
    }
  }, [products]);

  const getProductById = (id: string) => products.find((p) => p.id === id);

  const addProduct = (data: NewProduct) => {
    const newProduct: Product = { ...data, id: crypto.randomUUID() };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, data: NewProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...data, id } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  return {
    products,
    deleteProduct,
    updateProduct,
    addProduct,
    getProductById
  }
}

