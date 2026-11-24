export interface TilliProductCard {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  isCar: boolean;
  defaultColorId?: string;
  defaultColorLabel?: string;
  badge?: string;
}

export interface TilliComparisonRow {
  label: string;
  valueA: string;
  valueB: string;
}

export interface TilliComparison {
  productA: TilliProductCard;
  productB: TilliProductCard;
  rows: TilliComparisonRow[];
}

export interface TilliActionLink {
  label: string;
  kind: "route" | "external" | "whatsapp" | "prompt";
  to: string;
}

export interface TilliMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  products?: TilliProductCard[];
  comparison?: TilliComparison;
  actions?: TilliActionLink[];
  quickReplies?: string[];
}

export interface TilliCartSnapshot {
  totalItems: number;
  subtotal: number;
  itemNames: Array<{ name: string; quantity: number; price: number }>;
}
