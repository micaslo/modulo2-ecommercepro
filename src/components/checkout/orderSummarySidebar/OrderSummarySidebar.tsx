import { useState, type SubmitEvent } from "react";
import { FaShieldAlt, FaTag, FaTimes } from "react-icons/fa";
import { formatARS, PROMO_COUPONS } from "../../../data/checkoutConfig";
import logoIsotype from "../../../assets/images/logo/tl-isotype.webp";
import type { CartItem, CheckoutStep, InstallmentOption } from "../../../types/cart";

export type ApplyCouponResult = "applied" | "already_applied" | "invalid";

interface OrderSummarySidebarProps {
  items: CartItem[];
  subtotal: number;
  appliedCoupon: string | null;
  discountAmount: number;
  selectedInstallment: InstallmentOption | null;
  currentStep: CheckoutStep;
  onApplyCoupon: (code: string) => ApplyCouponResult;
  onRemoveCoupon: () => void;
}

export default function OrderSummarySidebar({
  items,
  subtotal,
  appliedCoupon,
  discountAmount,
  selectedInstallment,
  currentStep,
  onApplyCoupon,
  onRemoveCoupon,
}: OrderSummarySidebarProps) {
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const netAfterCoupon = Math.max(0, subtotal - discountAmount);
  const interestAmount =
    currentStep >= 3 && selectedInstallment
      ? selectedInstallment.interestAmount
      : 0;
  const finalTotal = netAfterCoupon + interestAmount;

  const catalogSavings = items.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);
  const totalSavings = catalogSavings + discountAmount;

  const couponInfo = appliedCoupon ? PROMO_COUPONS[appliedCoupon] : null;

  const handleCouponSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleaned = couponInput.trim().toUpperCase();
    if (!cleaned) {
      setCouponFeedback("Ingresá un código de cupón.");
      return;
    }
    const result = onApplyCoupon(cleaned);
    if (result === "applied") {
      setCouponFeedback(null);
      setCouponInput("");
    } else if (result === "already_applied") {
      setCouponFeedback(null);
      setCouponInput("");
    } else {
      setCouponFeedback("Cupón inválido. Probá con LIEBRE25.");
    }
  };

  return (
    <aside className="summaryCard" aria-label="Resumen de compra">
      <div className="summaryCardBanner">
        <div className="summaryBannerLeft">
          <span className="summaryBannerLogo" aria-hidden="true">
            <img src={logoIsotype} alt="" />
          </span>
          <strong>TIENDA LIEBRE PAY</strong>
        </div>
        <span className="summaryBannerRight">
          <FaShieldAlt size={13} />
          <span>
            {totalItems} {totalItems === 1 ? "producto" : "productos"}
          </span>
        </span>
      </div>

      <div className="summaryCardBody">
        <div className="summaryItemsPreview">
          {items.length === 0 ? (
            <p className="summaryEmptyText">
              Todavía no agregaste productos a tu carrito.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.key} className="summaryMiniItem">
                <div className="summaryMiniThumb">
                  <img src={item.image} alt={item.name} />
                  <span className="summaryMiniQty">{item.quantity}</span>
                </div>
                <div className="summaryMiniInfo">
                  <span className="summaryMiniCat">{item.category}</span>
                  <strong className="summaryMiniName" title={item.name}>
                    {item.name}
                  </strong>
                  {item.colorLabel && (
                    <span className="summaryMiniMeta">
                      Color: {item.colorLabel}
                    </span>
                  )}
                </div>
                <span className="summaryMiniPrice">
                  {formatARS(item.price * item.quantity)}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="summaryDivider" />

        <div className="summaryBreakdown">
          <div className="summaryRow">
            <span>Subtotal ({totalItems} u.)</span>
            <span>{formatARS(subtotal)}</span>
          </div>

          <div className="summaryRow">
            <span>Envío</span>
            <span className="summaryFree">Gratis</span>
          </div>

          {appliedCoupon && couponInfo && discountAmount > 0 && (
            <div className="summaryRow summaryRow--discount">
              <span className="summaryCouponTag">
                <span>CUPÓN</span>
                <span className="summaryDiscountPill">
                  -{couponInfo.discountPercent}%
                </span>
                {currentStep < 4 && (
                  <button
                    type="button"
                    className="summaryRemoveCoupon"
                    onClick={onRemoveCoupon}
                    aria-label="Quitar cupón"
                    title="Quitar cupón"
                  >
                    <FaTimes size={10} />
                  </button>
                )}
              </span>
              <strong>-{formatARS(discountAmount)}</strong>
            </div>
          )}

          {currentStep >= 3 && selectedInstallment && interestAmount > 0 && (
            <div className="summaryRow summaryRow--interest">
              <span>
                Financiación ({selectedInstallment.count} cuotas)
              </span>
              <span>+{formatARS(interestAmount)}</span>
            </div>
          )}
        </div>

        <div className="summaryDivider" />

        <div className="summaryTotalRow">
          <div>
            <strong className="summaryTotalLabel">Total</strong>
            {totalSavings > 0 && (
              <p className="summarySavings">
                Ahorrás {formatARS(totalSavings)}
              </p>
            )}
            {currentStep >= 3 && selectedInstallment && (
              <p className="summaryInstallmentNote">
                {selectedInstallment.count}{" "}
                {selectedInstallment.count === 1 ? "cuota" : "cuotas"} de{" "}
                <strong>{formatARS(selectedInstallment.installmentAmount)}</strong>{" "}
                {selectedInstallment.interestFree ? "sin interés" : "con interés"}
              </p>
            )}
          </div>
          <strong className="summaryTotalValue">{formatARS(finalTotal)}</strong>
        </div>

        {currentStep < 4 && items.length > 0 && (
          <form className="summaryCouponForm" onSubmit={handleCouponSubmit}>
            <div className="summaryCouponRow">
              <div className="summaryCouponInputWrap">
                <FaTag className="summaryCouponIcon" size={12} />
                <input
                  type="text"
                  placeholder="CÓDIGO DE CUPÓN"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponFeedback(null);
                  }}
                  aria-label="Código de cupón"
                />
              </div>
              <button type="submit" className="summaryCouponApplyBtn">
                Aplicar
              </button>
            </div>
            {couponFeedback && (
              <p className="summaryCouponError">{couponFeedback}</p>
            )}
            {!appliedCoupon && !couponFeedback && (
              <p className="summaryCouponHint">
                Tip: usá <strong>LIEBRE25</strong> para 25% OFF.
              </p>
            )}
          </form>
        )}
      </div>
    </aside>
  );
}
