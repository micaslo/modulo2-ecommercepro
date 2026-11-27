import { useCallback, useEffect, useState } from "react";
import type { NewProduct, Product } from "../types/productMedia";
import { initialProducts } from "../data/initialProducts";
import { normalizeProductCode } from "../schemas/productSchema";
import {
  reserveSku,
  suggestNextSku,
  syncSkuSequencesWithProducts,
} from "../utils/skuGenerator";
import { deleteModelBlobFromIdb, isStoredModelRef } from "../utils/model3dStorage";

export type { NewProduct };

const STORAGE_KEY = "products";
const SEEDED_IDS_KEY = "products_seeded_ids";
const PRODUCTS_UPDATED_EVENT = "products-updated";

const initialCodeById = new Map(
  initialProducts.map((product) => [product.id, product.code]),
);

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

function ensureProductCodes(products: Product[]): {
  items: Product[];
  changed: boolean;
} {
  let changed = false;
  const resolved: Product[] = [];

  for (const product of products) {
    const existingCode = product.code?.trim();
    if (existingCode) {
      const normalized = normalizeProductCode(existingCode);
      if (normalized !== product.code) {
        changed = true;
        resolved.push({ ...product, code: normalized });
      } else {
        resolved.push(product);
      }
      continue;
    }

    const seededCode = initialCodeById.get(product.id);
    const usedSoFar = new Set(
      resolved.map((item) => normalizeProductCode(item.code ?? item.id)),
    );
    const candidate =
      seededCode && !usedSoFar.has(normalizeProductCode(seededCode))
        ? normalizeProductCode(seededCode)
        : suggestNextSku(product.category, resolved);

    changed = true;
    resolved.push({ ...product, code: candidate });
  }

  syncSkuSequencesWithProducts(resolved);
  return { items: resolved, changed };
}

function loadProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const allInitialIds = initialProducts.map((p) => p.id);

    if (!saved) {
      localStorage.setItem(SEEDED_IDS_KEY, JSON.stringify(allInitialIds));
      saveProducts(initialProducts);
      syncSkuSequencesWithProducts(initialProducts);
      return initialProducts;
    }

    const parsed = JSON.parse(saved) as Product[];
    if (!Array.isArray(parsed)) {
      localStorage.setItem(SEEDED_IDS_KEY, JSON.stringify(allInitialIds));
      saveProducts(initialProducts);
      syncSkuSequencesWithProducts(initialProducts);
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

    const combined =
      newSeedProducts.length > 0 ? [...parsed, ...newSeedProducts] : parsed;
    const { items, changed } = ensureProductCodes(combined);

    if (newSeedProducts.length > 0 || changed) {
      saveProducts(items);
    }

    return items;
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

  const isCodeTaken = useCallback(
    (code: string, excludeId?: string) => {
      const normalized = normalizeProductCode(code);
      if (!normalized) return false;
      return products.some(
        (p) =>
          p.id !== excludeId &&
          normalizeProductCode(p.code ?? p.id) === normalized,
      );
    },
    [products],
  );

  const addProduct = useCallback((data: NewProduct) => {
    const current = loadProducts();
    const id = generateProductId();
    const normalizedCode = data.code?.trim()
      ? normalizeProductCode(data.code)
      : suggestNextSku(data.category, current);

    const duplicate = current.some(
      (p) => normalizeProductCode(p.code ?? p.id) === normalizedCode,
    );
    if (duplicate) {
      throw new Error(`El código "${normalizedCode}" ya existe en el inventario.`);
    }

    const newProduct: Product = {
      ...data,
      id,
      code: normalizedCode,
    };
    const next = [...current, newProduct];
    saveProducts(next);
    reserveSku(normalizedCode, next);
    setProducts(next);
    notifyProductsUpdated();
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, data: NewProduct) => {
    const current = loadProducts();
    const normalizedCode = data.code?.trim()
      ? normalizeProductCode(data.code)
      : undefined;

    if (normalizedCode) {
      const duplicate = current.some(
        (p) =>
          p.id !== id &&
          normalizeProductCode(p.code ?? p.id) === normalizedCode,
      );
      if (duplicate) {
        throw new Error(`El código "${normalizedCode}" ya existe en el inventario.`);
      }
    }

    const next = current.map((p) =>
      p.id === id
        ? { ...data, id, code: normalizedCode ?? p.code }
        : p,
    );
    saveProducts(next);
    if (normalizedCode) {
      reserveSku(normalizedCode, next);
    }
    setProducts(next);
    notifyProductsUpdated();
  }, []);

  const deleteProduct = useCallback((id: string) => {
    const current = loadProducts();
    const target = current.find((p) => p.id === id);
    const next = current.filter((p) => p.id !== id);
    saveProducts(next);
    setProducts(next);
    notifyProductsUpdated();
    if (target?.model3D && isStoredModelRef(target.model3D)) {
      void deleteModelBlobFromIdb(target.model3D);
    }
  }, []);

  return {
    products,
    deleteProduct,
    updateProduct,
    addProduct,
    getProductById,
    isCodeTaken,
  };
}
