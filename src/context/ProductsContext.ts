import { createContext } from "react";
import type { Product } from "../types/productMedia";

export type NewProduct = Omit<Product, "id">;

export interface ProductsContextValue {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (data: NewProduct) => Product;
  updateProduct: (id: string, data: NewProduct) => void;
  deleteProduct: (id: string) => void;
}

export const ProductsContext = createContext<ProductsContextValue | null>(null);
