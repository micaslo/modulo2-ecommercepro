export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
}

export type NewProduct = Omit<Product, "id">;

export interface ProductColorVariant {
  id: string;
  label: string;
  hex: string;
  previewImage: string;
  images: string[];
}

export interface ProductMedia {
  images: string[];
  colors: ProductColorVariant[];
  model3D?: string;
}

export type SpecIconKey =
  | "screen"
  | "camera"
  | "lens"
  | "video"
  | "cpu"
  | "ram"
  | "storage"
  | "battery"
  | "signal"
  | "shield"
  | "engine"
  | "transmission"
  | "seats"
  | "safety"
  | "fuel"
  | "sunroof"
  | "trunk"
  | "connect"
  | "gamepad"
  | "haptics"
  | "mic";

export interface ProductKeySpec {
  icon: SpecIconKey;
  label: string;
  value: string;
}

export interface ProductSpecRow {
  label: string;
  value: string;
}

export interface ProductSpecGroup {
  title: string;
  rows: ProductSpecRow[];
}

export interface ProductFeatureRating {
  label: string;
  score: number;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  verified?: boolean;
}

export interface ProductDetails {
  productKind: "phone" | "car" | "camera" | "gaming" | "general";
  condition: string;
  soldText: string;
  originalPrice?: number;
  installmentsCount: number;
  shippingTitle: string;
  shippingSubtitle: string;
  warranty: string;
  highlights: string[];
  keySpecs: ProductKeySpec[];
  specGroups: ProductSpecGroup[];
  extendedDescription: string[];
  includedItems: string[];
  featureRatings: ProductFeatureRating[];
  reviews: ProductReview[];
}
