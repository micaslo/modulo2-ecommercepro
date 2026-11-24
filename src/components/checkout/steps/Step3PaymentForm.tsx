import { useState, type ChangeEvent, type SubmitEvent } from "react";
import Cards, { type Focused } from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import {
  FaArrowLeft,
  FaCreditCard,
  FaEye,
  FaEyeSlash,
  FaLock,
} from "react-icons/fa";
import {
  detectCardBrand,
  formatARS,
  formatCardNumberDisplay,
  formatExpiryDisplay,
  getCardBrandLabel,
  getInstallmentOptions,
  stripDigits,
} from "../../../data/checkoutConfig";
import {
  validatePaymentForm,
  type PaymentFormErrors,
} from "../../../schemas/checkoutSchema";
import type { InstallmentOption, PaymentFormData } from "../../../types/cart";

interface Step3PaymentFormProps {
  data: PaymentFormData;
  baseAmount: number;
  onChange: (next: PaymentFormData) => void;
  onBack: () => void;
  onConfirmPayment: (selectedPlan: InstallmentOption) => void;
}

export default function Step3PaymentForm({
  data,
  baseAmount,
  onChange,
  onBack,
  onConfirmPayment,
}: Step3PaymentFormProps) {
  const [focused, setFocused] = useState<Focused>("");
  const [showCvc, setShowCvc] = useState(false);
  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof PaymentFormData, boolean>>
  >({});

  const digitsOnly = stripDigits(data.number);
  const brand = detectCardBrand(digitsOnly);
  const installmentOptions = getInstallmentOptions(brand, baseAmount);

  const activePlan =
    installmentOptions.find((opt) => opt.count === data.installments) ??
    installmentOptions[0] ??
    null;

  const updateField = <K extends keyof PaymentFormData>(
    field: K,
    value: PaymentFormData[K],
  ) => {
    const next = { ...data, [field]: value };
    onChange(next);
    if (touched[field]) {
      const nextErrors = validatePaymentForm(next);
      setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
    }
  };

  const handleBlur = (field: keyof PaymentFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const nextErrors = validatePaymentForm(data);
    setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
  };

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextDigits = stripDigits(e.target.value);
    const nextBrand = detectCardBrand(nextDigits);
    const formatted = formatCardNumberDisplay(nextDigits, nextBrand);

    // Si cambia de marca y la cantidad de cuotas no existe en la nueva marca, reseteamos a 1
    const nextOptions = getInstallmentOptions(nextBrand, baseAmount);
    const stillValid = nextOptions.some((o) => o.count === data.installments);
    const nextCvcMax = nextBrand === "amex" ? 4 : 3;

    const nextData: PaymentFormData = {
      ...data,
      number: formatted,
      cvc: stripDigits(data.cvc).slice(0, nextCvcMax),
      installments: stillValid ? data.installments : 1,
    };

    onChange(nextData);
    if (touched.number) {
      const nextErrors = validatePaymentForm(nextData);
      setErrors((prev) => ({ ...prev, number: nextErrors.number }));
    }
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateField("expiry", formatExpiryDisplay(e.target.value));
  };

  const handleCvcChange = (e: ChangeEvent<HTMLInputElement>) => {
    const maxLen = brand === "amex" ? 4 : 3;
    updateField("cvc", stripDigits(e.target.value).slice(0, maxLen));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validatePaymentForm(data);
    setErrors(validationErrors);
    setTouched({
      number: true,
      name: true,
      expiry: true,
      cvc: true,
      installments: true,
    });

    if (Object.keys(validationErrors).length === 0 && activePlan) {
      onConfirmPayment(activePlan);
    }
  };

  return (
    <section className="checkoutCard" aria-labelledby="step3-heading">
      <div className="checkoutCardHeader">
        <div>
          <h2 id="step3-heading" className="checkoutCardTitle">
            Pago con tarjeta
          </h2>
          <p className="checkoutCardSubtitle">
            Ingresá los datos de tu tarjeta Visa, Mastercard o American Express.
          </p>
        </div>
        <span className="paymentSecureBadge">
          <FaLock size={12} />
          <span>Pago encriptado</span>
        </span>
      </div>

      {/* Vista previa interactiva de react-credit-cards-2 */}
      <div className="creditCardShowcase">
        <div className="creditCardPreviewWrap">
          <Cards
            number={digitsOnly}
            name={data.name}
            expiry={stripDigits(data.expiry)}
            cvc={showCvc ? data.cvc : "•".repeat(data.cvc.length)}
            focused={showCvc ? "cvc" : focused}
            acceptedCards={["visa", "mastercard", "american-express"]}
            placeholders={{ name: "TU NOMBRE" }}
            locale={{ valid: "VÁLIDA HASTA" }}
          />
        </div>

        <div className="creditCardBrandHints">
          <span
            className={`cardBrandChip ${brand === "visa" ? "isDetected" : ""}`}
          >
            <strong>Visa</strong> · empieza con 4 · Hasta 12 sin interés
          </span>
          <span
            className={`cardBrandChip ${brand === "amex" ? "isDetected" : ""}`}
          >
            <strong>Amex</strong> · empieza con 34 o 37 · Hasta 6 sin interés
          </span>
          <span
            className={`cardBrandChip ${
              brand === "mastercard" ? "isDetected" : ""
            }`}
          >
            <strong>Mastercard</strong> · empieza con 51-55 · 1 sin interés /
            cuotas con interés
          </span>
        </div>
      </div>

      <form className="checkoutForm" onSubmit={handleSubmit} noValidate>
        <div className="formField">
          <label htmlFor="card-number">Número de tarjeta</label>
          <input
            id="card-number"
            name="number"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4509 1234 5678 9012"
            value={data.number}
            maxLength={brand === "amex" ? 17 : 19}
            className={errors.number ? "isInvalid" : ""}
            onFocus={() => setFocused("number")}
            onChange={handleCardNumberChange}
            onBlur={() => handleBlur("number")}
          />
          {errors.number && (
            <span className="fieldError" role="alert">
              {errors.number}
            </span>
          )}
        </div>

        <div className="formField">
          <label htmlFor="card-name">Nombre y apellido del titular</label>
          <input
            id="card-name"
            name="name"
            type="text"
            autoComplete="cc-name"
            placeholder="Como figura en la tarjeta"
            value={data.name}
            maxLength={50}
            className={errors.name ? "isInvalid" : ""}
            onFocus={() => setFocused("name")}
            onChange={(e) =>
              updateField("name", e.target.value.toUpperCase())
            }
            onBlur={() => handleBlur("name")}
          />
          {errors.name && (
            <span className="fieldError" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className="formRowTwo">
          <div className="formField">
            <label htmlFor="card-expiry">Vencimiento (MM/AA)</label>
            <input
              id="card-expiry"
              name="expiry"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              value={data.expiry}
              maxLength={5}
              className={errors.expiry ? "isInvalid" : ""}
              onFocus={() => setFocused("expiry")}
              onChange={handleExpiryChange}
              onBlur={() => handleBlur("expiry")}
            />
            {errors.expiry && (
              <span className="fieldError" role="alert">
                {errors.expiry}
              </span>
            )}
          </div>

          <div className="formField">
            <label htmlFor="card-cvc">
              {brand === "amex"
                ? "Código de seguridad (CID · 4 dígitos)"
                : "Código de seguridad (CVC · 3 dígitos)"}
            </label>
            <div className="cvcInputWrap">
              <input
                id="card-cvc"
                name="cvc"
                type={showCvc ? "text" : "password"}
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder={brand === "amex" ? "••••" : "•••"}
                value={data.cvc}
                maxLength={brand === "amex" ? 4 : 3}
                className={errors.cvc ? "isInvalid" : ""}
                onFocus={() => setFocused("cvc")}
                onChange={handleCvcChange}
                onBlur={() => {
                  setFocused("");
                  setShowCvc(false);
                  handleBlur("cvc");
                }}
              />
              <button
                type="button"
                className={`cvcRevealBtn ${showCvc ? "isHolding" : ""}`}
                aria-label="Mantené presionado para ver el código de seguridad"
                title="Mantené presionado para ver el código"
                onMouseDown={(e) => e.preventDefault()}
                onPointerDown={() => setShowCvc(true)}
                onPointerUp={() => setShowCvc(false)}
                onPointerLeave={() => setShowCvc(false)}
                onPointerCancel={() => setShowCvc(false)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") setShowCvc(true);
                }}
                onKeyUp={() => setShowCvc(false)}
                onBlur={() => setShowCvc(false)}
              >
                {showCvc ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
              </button>
            </div>
            {errors.cvc && (
              <span className="fieldError" role="alert">
                {errors.cvc}
              </span>
            )}
          </div>
        </div>

        {/* Selector dinámico de cuotas según marca detectada */}
        <div className="formSectionDivider">
          <span>
            <FaCreditCard size={13} /> Cuotas disponibles
            {brand !== "unknown" ? ` · ${getCardBrandLabel(brand)}` : ""}
          </span>
        </div>

        {brand === "unknown" ? (
          <div className="installmentsPlaceholder">
            Ingresá los primeros dígitos de tu tarjeta{" "}
            <strong>Visa</strong>, <strong>Mastercard</strong> o{" "}
            <strong>American Express</strong> para ver los planes de cuotas y
            financiación disponibles.
          </div>
        ) : (
          <div
            className="installmentsList"
            role="radiogroup"
            aria-label={`Planes de cuotas para ${getCardBrandLabel(brand)}`}
          >
            {installmentOptions.map((option) => {
              const isSelected = activePlan?.count === option.count;
              const surchargePercent = Math.round(option.interestRate * 100);

              return (
                <label
                  key={option.count}
                  className={`installmentOption ${
                    isSelected ? "isSelected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="installments"
                    value={option.count}
                    checked={isSelected}
                    onChange={() => updateField("installments", option.count)}
                  />
                  <div className="installmentMain">
                    <span className="installmentTitle">
                      <strong>
                        {option.count}{" "}
                        {option.count === 1 ? "cuota" : "cuotas"}
                      </strong>{" "}
                      de <strong>{formatARS(option.installmentAmount)}</strong>
                    </span>
                    <span className="installmentSub">{option.cftnaLabel}</span>
                  </div>

                  <div className="installmentRight">
                    <span
                      className={`installmentBadge ${
                        option.interestFree
                          ? "installmentBadge--free"
                          : "installmentBadge--interest"
                      }`}
                    >
                      {option.interestFree
                        ? "Sin interés"
                        : `Con interés (+${surchargePercent}%)`}
                    </span>
                    <span className="installmentTotal">
                      Total: {formatARS(option.totalWithInterest)}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        <div className="checkoutStepFooter">
          <button type="button" className="checkoutBackBtn" onClick={onBack}>
            <FaArrowLeft size={12} />
            <span>Volver a tus datos</span>
          </button>

          <button type="submit" className="btn-primary checkoutNextBtn">
            <FaLock size={12} />
            <span>
              Confirmar y pagar{" "}
              {activePlan ? formatARS(activePlan.totalWithInterest) : ""}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}
