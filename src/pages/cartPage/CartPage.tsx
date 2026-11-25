import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import type { SessionUser } from "../../types/auth";
import { getCoverImage, getProductMedia } from "../../data/productMedia";
import { getProductDetails } from "../../data/productDetails";
import {
  detectCardBrand,
  getInstallmentOptions,
  PROMO_COUPONS,
  stripDigits,
} from "../../data/checkoutConfig";
import CheckoutStepper from "../../components/checkout/checkoutStepper/CheckoutStepper";
import OrderSummarySidebar, {
  type ApplyCouponResult,
} from "../../components/checkout/orderSummarySidebar/OrderSummarySidebar";
import Step1CartList from "../../components/checkout/steps/Step1CartList";
import Step2CustomerForm from "../../components/checkout/steps/Step2CustomerForm";
import Step3PaymentForm from "../../components/checkout/steps/Step3PaymentForm";
import Step4ThankYou from "../../components/checkout/steps/Step4ThankYou";
import {
  CarAgentModal,
  CouponAlreadyAppliedModal,
  StockLimitModal,
} from "../../components/checkout/cartModals/CartModals";
import type {
  CheckoutStep,
  CompletedOrder,
  CustomerFormData,
  InstallmentOption,
  PaymentFormData,
} from "../../types/cart";
import type { Product } from "../../types/productMedia";
import "./CartPage.css";

const INITIAL_CUSTOMER: CustomerFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  locality: "",
  province: "",
  postalCode: "",
  fiscalCondition: "consumidor_final",
  dni: "",
  cuit: "",
  businessName: "",
};

const INITIAL_PAYMENT: PaymentFormData = {
  number: "",
  name: "",
  expiry: "",
  cvc: "",
  installments: 1,
};

function buildInitialCustomer(user: SessionUser | null): CustomerFormData {
  if (!user) return INITIAL_CUSTOMER;
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    phone: user.phone ? stripDigits(user.phone).slice(0, 13) : "",
    address: user.address ?? "",
    locality: user.locality ?? "",
    province: user.province ?? "",
    postalCode: user.postalCode ?? "",
    fiscalCondition: user.fiscalCondition ?? "consumidor_final",
    dni: user.dni ? stripDigits(user.dni).slice(0, 8) : "",
    cuit: user.cuit ?? "",
    businessName: user.businessName ?? "",
  };
}

function buildInitialPayment(user: SessionUser | null): PaymentFormData {
  if (!user?.savedCard) return INITIAL_PAYMENT;
  return {
    number: user.savedCard.number,
    name: user.savedCard.name,
    expiry: user.savedCard.expiry,
    cvc: user.savedCard.cvc,
    installments: 1,
  };
}

function generateOrderNumber(): string {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `DT-${new Date().getFullYear()}-${randomPart}`;
}

export default function CartPage() {
  const { user } = useAuth();
  const profileSignature = user
    ? `${user.id}:${user.email}:${user.address ?? ""}:${user.dni ?? ""}:${user.savedCard?.number ?? ""}`
    : "guest-anon";

  return <CartPageContent key={profileSignature} user={user} />;
}

function CartPageContent({ user }: { user: SessionUser | null }) {
  const {
    items,
    subtotal,
    addToCart,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart();
  const { products } = useProducts();

  const [step, setStep] = useState<CheckoutStep>(1);
  const [customerData, setCustomerData] = useState<CustomerFormData>(() =>
    buildInitialCustomer(user),
  );
  const [paymentData, setPaymentData] = useState<PaymentFormData>(() =>
    buildInitialPayment(user),
  );
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(
    null,
  );

  const [stockModal, setStockModal] = useState<{
    open: boolean;
    productName: string;
    maxStock: number;
  }>({ open: false, productName: "", maxStock: 0 });

  const [carModal, setCarModal] = useState<{
    open: boolean;
    productName: string;
  }>({ open: false, productName: "" });

  const [duplicateCouponModal, setDuplicateCouponModal] = useState<{
    open: boolean;
    couponCode: string;
  }>({ open: false, couponCode: "" });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const effectiveStep: CheckoutStep =
    step !== 4 && items.length === 0 ? 1 : step;

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const promo = PROMO_COUPONS[appliedCoupon];
    if (!promo) return 0;
    return Math.round(subtotal * (promo.discountPercent / 100));
  }, [appliedCoupon, subtotal]);

  const netAmount = Math.max(0, subtotal - discountAmount);

  const selectedInstallment = useMemo<InstallmentOption | null>(() => {
    const brand = detectCardBrand(paymentData.number);
    const options = getInstallmentOptions(brand, netAmount);
    if (options.length === 0) return null;
    return (
      options.find((opt) => opt.count === paymentData.installments) ??
      options[0]
    );
  }, [paymentData.number, paymentData.installments, netAmount]);

  const handleApplyCoupon = (code: string): ApplyCouponResult => {
    const normalized = code.trim().toUpperCase();
    if (!PROMO_COUPONS[normalized]) return "invalid";
    if (appliedCoupon === normalized) {
      setDuplicateCouponModal({ open: true, couponCode: normalized });
      return "already_applied";
    }
    setAppliedCoupon(normalized);
    return "applied";
  };

  const handleQuickAddProduct = (product: Product) => {
    const details = getProductDetails(product);
    const media = getProductMedia(product);
    const defaultColor = media.colors[0];

    const result = addToCart({
      product,
      quantity: 1,
      image: getCoverImage(product, defaultColor?.id),
      colorId: defaultColor?.id,
      colorLabel: defaultColor?.label,
      originalPrice: details.originalPrice,
      isCar: details.productKind === "car" || product.category === "Vehículos",
    });

    if (!result.ok) {
      if (result.reason === "car_limit") {
        setCarModal({ open: true, productName: product.name });
      } else if (result.reason === "stock_limit") {
        setStockModal({
          open: true,
          productName: product.name,
          maxStock: product.stock,
        });
      }
    } else if (result.reachedStockLimit) {
      setStockModal({
        open: true,
        productName: product.name,
        maxStock: product.stock,
      });
    }
  };

  const handleConfirmPayment = (selectedPlan: InstallmentOption) => {
    const digits = stripDigits(paymentData.number);
    const brand = detectCardBrand(digits);

    const newOrder: CompletedOrder = {
      orderNumber: generateOrderNumber(),
      createdAt: new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
      items: [...items],
      subtotal,
      discountAmount,
      couponCode: appliedCoupon,
      customer: { ...customerData },
      payment: {
        brand,
        last4: digits.slice(-4),
        holderName: paymentData.name.trim(),
        installments: selectedPlan,
      },
      finalTotal: selectedPlan.totalWithInterest,
    };

    setCompletedOrder(newOrder);
    clearCart();
    setStep(4);
  };

  const sidebarItems =
    effectiveStep === 4 && completedOrder ? completedOrder.items : items;
  const sidebarSubtotal =
    effectiveStep === 4 && completedOrder ? completedOrder.subtotal : subtotal;
  const sidebarDiscount =
    effectiveStep === 4 && completedOrder
      ? completedOrder.discountAmount
      : discountAmount;
  const sidebarCoupon =
    effectiveStep === 4 && completedOrder
      ? completedOrder.couponCode
      : appliedCoupon;
  const sidebarInstallment =
    effectiveStep === 4 && completedOrder
      ? completedOrder.payment.installments
      : selectedInstallment;

  return (
    <main className="checkoutPage">
      <div className="checkoutContainer">
        <div
          className={`checkoutLayout ${
            effectiveStep === 4 ? "checkoutLayout--single" : ""
          }`}
        >
          <div className="checkoutMainColumn">
            <CheckoutStepper
              currentStep={effectiveStep}
              onGoToStep={(target) => setStep(target)}
            />

            {effectiveStep === 1 && (
              <Step1CartList
                items={items}
                catalogProducts={products}
                onIncrement={incrementItem}
                onDecrement={decrementItem}
                onRemove={removeItem}
                onClearCart={clearCart}
                onQuickAddProduct={handleQuickAddProduct}
                onStockLimit={(productName, maxStock) =>
                  setStockModal({ open: true, productName, maxStock })
                }
                onCarLimit={(productName) =>
                  setCarModal({ open: true, productName })
                }
                onContinue={() => setStep(2)}
              />
            )}

            {effectiveStep === 2 && (
              <Step2CustomerForm
                data={customerData}
                onChange={setCustomerData}
                onBack={() => setStep(1)}
                onContinue={() => setStep(3)}
              />
            )}

            {effectiveStep === 3 && (
              <Step3PaymentForm
                data={paymentData}
                baseAmount={netAmount}
                onChange={setPaymentData}
                onBack={() => setStep(2)}
                onConfirmPayment={handleConfirmPayment}
              />
            )}

            {effectiveStep === 4 && completedOrder && (
              <Step4ThankYou order={completedOrder} />
            )}
          </div>

          {effectiveStep !== 4 && (
            <div className="checkoutSidebarColumn">
              <OrderSummarySidebar
                items={sidebarItems}
                subtotal={sidebarSubtotal}
                appliedCoupon={sidebarCoupon}
                discountAmount={sidebarDiscount}
                selectedInstallment={sidebarInstallment}
                currentStep={effectiveStep}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={() => setAppliedCoupon(null)}
              />
            </div>
          )}
        </div>
      </div>

      <StockLimitModal
        isOpen={stockModal.open}
        productName={stockModal.productName}
        maxStock={stockModal.maxStock}
        onClose={() => setStockModal((prev) => ({ ...prev, open: false }))}
      />

      <CarAgentModal
        isOpen={carModal.open}
        productName={carModal.productName}
        onClose={() => setCarModal((prev) => ({ ...prev, open: false }))}
      />

      <CouponAlreadyAppliedModal
        isOpen={duplicateCouponModal.open}
        couponCode={duplicateCouponModal.couponCode}
        onClose={() =>
          setDuplicateCouponModal((prev) => ({ ...prev, open: false }))
        }
      />
    </main>
  );
}
