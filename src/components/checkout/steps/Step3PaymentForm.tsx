import { useState, type ChangeEvent } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { paymentFormSchema } from "../../../schemas/checkoutSchema";
import type { InstallmentOption, PaymentFormData } from "../../../types/cart";

function getRccsIssuer(
  brand: ReturnType<typeof detectCardBrand>,
): string | undefined {
  if (brand === "amex") return "american-express";
  if (brand === "visa" || brand === "mastercard") return brand;
  return undefined;
}

function getMaskedCardPreviewNumber(digitsOnly: string): string {
  if (!digitsOnly) return "";
  if (digitsOnly.length <= 4) return "•".repeat(digitsOnly.length);
  return `${"•".repeat(digitsOnly.length - 4)}${digitsOnly.slice(-4)}`;
}

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

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: data,
    mode: "onTouched",
  });

  const number = useWatch({ control, name: "number" });
  const name = useWatch({ control, name: "name" });
  const expiry = useWatch({ control, name: "expiry" });
  const cvc = useWatch({ control, name: "cvc" });
  const installments = useWatch({ control, name: "installments" });

  const digitsOnly = stripDigits(number);
  const brand = detectCardBrand(digitsOnly);
  const rccsIssuer = getRccsIssuer(brand);
  const maskedPreviewNumber = getMaskedCardPreviewNumber(digitsOnly);
  const installmentOptions = getInstallmentOptions(brand, baseAmount);

  const activePlan =
    installmentOptions.find((opt) => opt.count === installments) ??
    installmentOptions[0] ??
    null;

  const handleBack = () => {
    onChange(getValues());
    onBack();
  };

  const onSubmit = (validData: PaymentFormData) => {
    onChange(validData);
    if (activePlan) {
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

      <div className="creditCardShowcase">
        <div className="creditCardPreviewWrap">
          <Cards
            number={maskedPreviewNumber}
            name={name}
            expiry={stripDigits(expiry)}
            cvc={showCvc ? cvc : "•".repeat(cvc.length)}
            focused={showCvc ? "cvc" : focused}
            preview={Boolean(rccsIssuer)}
            issuer={rccsIssuer}
            acceptedCards={["visa", "mastercard", "american-express"]}
            placeholders={{ name: "TU NOMBRE" }}
            locale={{ valid: "VÁLIDA HASTA" }}
          />
        </div>
      </div>

      <form
        className="checkoutForm"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="formField">
          <label htmlFor="card-number">Número de tarjeta</label>
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <input
                id="card-number"
                name={field.name}
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4509 1234 5678 9012"
                value={field.value}
                maxLength={brand === "amex" ? 17 : 19}
                className={errors.number ? "isInvalid" : ""}
                aria-invalid={Boolean(errors.number)}
                onFocus={() => setFocused("number")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const nextDigits = stripDigits(e.target.value);
                  const nextBrand = detectCardBrand(nextDigits);
                  const formatted = formatCardNumberDisplay(
                    nextDigits,
                    nextBrand,
                  );

                  const nextOptions = getInstallmentOptions(
                    nextBrand,
                    baseAmount,
                  );
                  const current = getValues();
                  const stillValid = nextOptions.some(
                    (o) => o.count === current.installments,
                  );
                  const nextCvcMax = nextBrand === "amex" ? 4 : 3;
                  const nextCvc = stripDigits(current.cvc).slice(0, nextCvcMax);
                  const nextInstallments = stillValid
                    ? current.installments
                    : 1;

                  field.onChange(formatted);
                  if (nextCvc !== current.cvc) {
                    setValue("cvc", nextCvc);
                  }
                  if (nextInstallments !== current.installments) {
                    setValue("installments", nextInstallments);
                  }
                  onChange({
                    ...current,
                    number: formatted,
                    cvc: nextCvc,
                    installments: nextInstallments,
                  });
                }}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            )}
          />
          {errors.number && (
            <span className="fieldError" role="alert">
              {errors.number.message}
            </span>
          )}
        </div>

        <div className="formField">
          <label htmlFor="card-name">Nombre y apellido del titular</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                id="card-name"
                name={field.name}
                type="text"
                autoComplete="cc-name"
                placeholder="Como figura en la tarjeta"
                value={field.value}
                maxLength={50}
                className={errors.name ? "isInvalid" : ""}
                aria-invalid={Boolean(errors.name)}
                onFocus={() => setFocused("name")}
                onChange={(e) => {
                  const upper = e.target.value.toUpperCase();
                  field.onChange(upper);
                  onChange({ ...getValues(), name: upper });
                }}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            )}
          />
          {errors.name && (
            <span className="fieldError" role="alert">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="formRowTwo">
          <div className="formField">
            <label htmlFor="card-expiry">Vencimiento (MM/AA)</label>
            <Controller
              name="expiry"
              control={control}
              render={({ field }) => (
                <input
                  id="card-expiry"
                  name={field.name}
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/AA"
                  value={field.value}
                  maxLength={5}
                  className={errors.expiry ? "isInvalid" : ""}
                  aria-invalid={Boolean(errors.expiry)}
                  onFocus={() => setFocused("expiry")}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const formatted = formatExpiryDisplay(e.target.value);
                    field.onChange(formatted);
                    onChange({ ...getValues(), expiry: formatted });
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              )}
            />
            {errors.expiry && (
              <span className="fieldError" role="alert">
                {errors.expiry.message}
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
              <Controller
                name="cvc"
                control={control}
                render={({ field }) => (
                  <input
                    id="card-cvc"
                    name={field.name}
                    type={showCvc ? "text" : "password"}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder={brand === "amex" ? "••••" : "•••"}
                    value={field.value}
                    maxLength={brand === "amex" ? 4 : 3}
                    className={errors.cvc ? "isInvalid" : ""}
                    aria-invalid={Boolean(errors.cvc)}
                    onFocus={() => setFocused("cvc")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const maxLen = brand === "amex" ? 4 : 3;
                      const digits = stripDigits(e.target.value).slice(
                        0,
                        maxLen,
                      );
                      field.onChange(digits);
                      onChange({ ...getValues(), cvc: digits });
                    }}
                    onBlur={() => {
                      setFocused("");
                      setShowCvc(false);
                      field.onBlur();
                    }}
                    ref={field.ref}
                  />
                )}
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
                {errors.cvc.message}
              </span>
            )}
          </div>
        </div>

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
                    onChange={() => {
                      setValue("installments", option.count, {
                        shouldDirty: true,
                      });
                      onChange({ ...getValues(), installments: option.count });
                    }}
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
                          ? "installmentBadgeFree"
                          : "installmentBadgeInterest"
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
          <button
            type="button"
            className="checkoutBackBtn"
            onClick={handleBack}
          >
            <FaArrowLeft size={12} />
            <span>Volver a tus datos</span>
          </button>

          <button type="submit" className="btnPrimary checkoutNextBtn">
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
