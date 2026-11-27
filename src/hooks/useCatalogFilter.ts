import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product } from "../types/productMedia";

export type CatalogSortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "stock-desc";

export type CatalogStockFilter = "all" | "in-stock" | "out-of-stock";

const ALL_CATEGORIES_VALUE = "Todas";

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.+$/, "");
}

export function useCatalogFilter(products: Product[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stockFilter, setStockFilter] = useState<CatalogStockFilter>("all");
  const [sortBy, setSortBy] = useState<CatalogSortOption>("featured");

  const searchQuery = searchParams.get("q") ?? "";
  const rawCategoryParam = searchParams.get("categoria") ?? ALL_CATEGORIES_VALUE;

  const categories = useMemo<string[]>(() => {
    const unique = new Map<string, string>();
    for (const product of products) {
      const cleaned = product.category.trim();
      if (!cleaned) continue;
      const key = normalizeText(cleaned);
      if (!unique.has(key)) {
        unique.set(key, cleaned);
      }
    }
    return [
      ALL_CATEGORIES_VALUE,
      ...Array.from(unique.values()).sort((a, b) => a.localeCompare(b, "es")),
    ];
  }, [products]);

  const selectedCategory = useMemo(() => {
    const normalizedParam = normalizeText(rawCategoryParam);
    if (
      !normalizedParam ||
      normalizedParam === normalizeText(ALL_CATEGORIES_VALUE) ||
      normalizedParam === normalizeText("Todas las categorías")
    ) {
      return ALL_CATEGORIES_VALUE;
    }

    const exactMatch = categories.find(
      (cat) => normalizeText(cat) === normalizedParam,
    );
    if (exactMatch) return exactMatch;

    const partialMatch = categories.find(
      (cat) =>
        cat !== ALL_CATEGORIES_VALUE &&
        (normalizeText(cat).includes(normalizedParam) ||
          normalizedParam.includes(normalizeText(cat))),
    );
    return partialMatch ?? rawCategoryParam.trim();
  }, [categories, rawCategoryParam]);

  const setSearchQuery = useCallback(
    (nextQuery: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (nextQuery.trim()) {
            next.set("q", nextQuery);
          } else {
            next.delete("q");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSelectedCategory = useCallback(
    (nextCategory: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!nextCategory || nextCategory === ALL_CATEGORIES_VALUE) {
            next.delete("categoria");
          } else {
            next.set("categoria", nextCategory);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setStockFilter("all");
    setSortBy("featured");
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(searchQuery);
    const normalizedCategory = normalizeText(selectedCategory);
    const filterByCategory =
      selectedCategory !== ALL_CATEGORIES_VALUE && normalizedCategory !== "";

    const matched = products.filter((product) => {
      if (normalizedSearch) {
        const haystack = normalizeText(
          `${product.name} ${product.category} ${product.code ?? ""} ${product.description}`,
        );
        if (!haystack.includes(normalizedSearch)) return false;
      }

      if (filterByCategory) {
        const productCategory = normalizeText(product.category);
        if (
          productCategory !== normalizedCategory &&
          !productCategory.includes(normalizedCategory)
        ) {
          return false;
        }
      }

      if (stockFilter === "in-stock" && product.stock <= 0) return false;
      if (stockFilter === "out-of-stock" && product.stock > 0) return false;

      return true;
    });

    if (sortBy === "featured") return matched;

    return [...matched].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name, "es");
        case "stock-desc":
          return b.stock - a.stock;
        default:
          return 0;
      }
    });
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== ALL_CATEGORIES_VALUE ||
    stockFilter !== "all" ||
    sortBy !== "featured";

  return {
    categories,
    searchQuery,
    selectedCategory,
    stockFilter,
    sortBy,
    filteredProducts,
    hasActiveFilters,
    setSearchQuery,
    setSelectedCategory,
    setStockFilter,
    setSortBy,
    clearFilters,
  };
}
