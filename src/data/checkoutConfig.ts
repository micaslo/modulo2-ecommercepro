import type {
  CardBrand,
  FiscalCondition,
  InstallmentOption,
} from "../types/cart";

export const ARGENTINA_PROVINCES: string[] = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

export const FISCAL_CONDITIONS: Array<{
  value: FiscalCondition;
  label: string;
}> = [
  { value: "consumidor_final", label: "Consumidor Final" },
  { value: "monotributista", label: "Monotributista" },
  { value: "responsable_inscripto", label: "Responsable Inscripto" },
  { value: "exento", label: "Exento" },
];

export const PROMO_COUPONS: Record<string, { discountPercent: number; label: string }> = {
  LIEBRE25: {
    discountPercent: 25,
    label: "PROMO LIEBRE25 (-25%)",
  },
};

export function formatARS(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function stripDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function detectCardBrand(rawNumber: string): CardBrand {
  const digits = stripDigits(rawNumber);
  if (!digits) return "unknown";

  if (/^3[47]/.test(digits)) {
    return "amex";
  }

  if (/^4/.test(digits)) {
    return "visa";
  }

  if (
    /^5[1-5]/.test(digits) ||
    /^222[1-9]/.test(digits) ||
    /^22[3-9]/.test(digits) ||
    /^2[3-6]/.test(digits) ||
    /^27[01]/.test(digits) ||
    /^2720/.test(digits)
  ) {
    return "mastercard";
  }

  return "unknown";
}

export function getCardBrandLabel(brand: CardBrand): string {
  switch (brand) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "amex":
      return "American Express";
    default:
      return "Tarjeta";
  }
}

export function formatCardNumberDisplay(rawNumber: string, brand: CardBrand): string {
  const maxLen = brand === "amex" ? 15 : 16;
  const digits = stripDigits(rawNumber).slice(0, maxLen);

  if (brand === "amex") {
    const p1 = digits.slice(0, 4);
    const p2 = digits.slice(4, 10);
    const p3 = digits.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(" ");
  }

  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiryDisplay(rawValue: string): string {
  const digits = stripDigits(rawValue).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatCuitDisplay(rawValue: string): string {
  const digits = stripDigits(rawValue).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`;
}

interface RawPlan {
  count: number;
  interestRate: number;
  cftnaLabel: string;
}

const BRAND_PLANS: Record<Exclude<CardBrand, "unknown">, RawPlan[]> = {
  visa: [
    { count: 1, interestRate: 0, cftnaLabel: "CFT 0,00%" },
    { count: 3, interestRate: 0, cftnaLabel: "CFT 0,00%" },
    { count: 6, interestRate: 0, cftnaLabel: "CFT 0,00%" },
    { count: 9, interestRate: 0, cftnaLabel: "CFT 0,00%" },
    { count: 12, interestRate: 0, cftnaLabel: "CFT 0,00%" },
  ],
  amex: [
    { count: 1, interestRate: 0, cftnaLabel: "CFT 0,00%" },
    { count: 3, interestRate: 0, cftnaLabel: "CFT 0,00%" },
    { count: 6, interestRate: 0, cftnaLabel: "CFT 0,00%" },
    { count: 9, interestRate: 0.34, cftnaLabel: "TEA 76,5% · CFT 97,8%" },
    { count: 12, interestRate: 0.46, cftnaLabel: "TEA 82,0% · CFT 105,4%" },
  ],
  mastercard: [
    { count: 1, interestRate: 0, cftnaLabel: "CFT 0,00%" },
    { count: 3, interestRate: 0.12, cftnaLabel: "TEA 58,0% · CFT 72,4%" },
    { count: 6, interestRate: 0.22, cftnaLabel: "TEA 66,5% · CFT 84,1%" },
    { count: 9, interestRate: 0.34, cftnaLabel: "TEA 76,5% · CFT 97,8%" },
    { count: 12, interestRate: 0.46, cftnaLabel: "TEA 82,0% · CFT 105,4%" },
  ],
};

export function getInstallmentOptions(
  brand: CardBrand,
  baseAmount: number,
): InstallmentOption[] {
  if (brand === "unknown") return [];

  return BRAND_PLANS[brand].map((plan) => {
    const totalWithInterest = Math.round(baseAmount * (1 + plan.interestRate));
    const interestAmount = totalWithInterest - baseAmount;
    const installmentAmount = Math.round(totalWithInterest / plan.count);

    return {
      count: plan.count,
      interestRate: plan.interestRate,
      interestFree: plan.interestRate === 0,
      cftnaLabel: plan.cftnaLabel,
      totalWithInterest,
      installmentAmount,
      interestAmount,
    };
  });
}

export function getFiscalConditionLabel(condition: FiscalCondition): string {
  return (
    FISCAL_CONDITIONS.find((c) => c.value === condition)?.label ?? condition
  );
}
