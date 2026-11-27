import type { Product } from "./productMedia";

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  colorId?: string;
  colorLabel?: string;
  quantity: number;
  stock: number;
  isCar: boolean;
}

export type CartActionResult =
  | { ok: true; reachedStockLimit?: boolean }
  | {
      ok: false;
      reason:
        | "auth_required"
        | "admin_forbidden"
        | "car_limit"
        | "stock_limit"
        | "out_of_stock";
    };

export type CheckoutStep = 1 | 2 | 3 | 4;

export type FiscalCondition =
  | "consumidor_final"
  | "monotributista"
  | "responsable_inscripto"
  | "exento";

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  locality: string;
  province: string;
  postalCode: string;
  fiscalCondition: FiscalCondition;
  dni: string;
  cuit: string;
  businessName: string;
}

export type CardBrand = "visa" | "mastercard" | "amex" | "unknown";

export interface InstallmentOption {
  count: number;
  interestRate: number;
  interestFree: boolean;
  cftnaLabel: string;
  totalWithInterest: number;
  installmentAmount: number;
  interestAmount: number;
}

export interface PaymentFormData {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  installments: number;
}

export interface CompletedOrder {
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  customer: CustomerFormData;
  payment: {
    brand: CardBrand;
    last4: string;
    holderName: string;
    installments: InstallmentOption;
  };
  finalTotal: number;
}

export interface AddToCartPayload {
  product: Product;
  quantity: number;
  image: string;
  colorId?: string;
  colorLabel?: string;
  originalPrice?: number;
  isCar: boolean;
}
