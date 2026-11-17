import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types/productMedia";
import { initialProducts } from "../data/initialProducts";

const STORAGE_KEY = "products";

type NewProduct = Omit<Product, "id">;

interface ProductsContextValue {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (data: NewProduct) => Product;
  updateProduct: (id: string, data: NewProduct) => void;
  deleteProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

function loadProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Product[]) : initialProducts;
  } catch {
    // JSON roto o localStorage no disponible
    return initialProducts;
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  // Guarda automáticamente cada vez que cambia el inventario
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

  return (
    <ProductsContext.Provider
      value={{ products, getProductById, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts debe usarse dentro de <ProductsProvider>");
  }
  return context;
}