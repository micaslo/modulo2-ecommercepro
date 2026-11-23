import { useState, type ChangeEvent, type FormEvent } from "react";
import { FaArrowLeft, FaArrowRight, FaInfoCircle } from "react-icons/fa";
import {
  ARGENTINA_PROVINCES,
  FISCAL_CONDITIONS,
  formatCuitDisplay,
  stripDigits,
} from "../../data/checkoutConfig";
import {
  validateCustomerForm,
  type CustomerFormErrors,
} from "../../schemas/checkoutSchema";
import type { CustomerFormData, FiscalCondition } from "../../types/cart";

interface Step2CustomerFormProps {
  data: CustomerFormData;
  onChange: (next: CustomerFormData) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function Step2CustomerForm({
  data,
  onChange,
  onBack,
  onContinue,
}: Step2CustomerFormProps) {
  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof CustomerFormData, boolean>>
  >({});
  const [dniTipOpen, setDniTipOpen] = useState(false);
  const [dniDotAttempted, setDniDotAttempted] = useState(false);

  const showCuit = data.fiscalCondition !== "consumidor_final";
  const showBusinessName =
    data.fiscalCondition === "responsable_inscripto" ||
    data.fiscalCondition === "exento";

  const updateField = <K extends keyof CustomerFormData>(
    field: K,
    value: CustomerFormData[K],
  ) => {
    const next = { ...data, [field]: value };
    onChange(next);
    if (touched[field]) {
      const nextErrors = validateCustomerForm(next);
      setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
    }
  };

  const handleBlur = (field: keyof CustomerFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const nextErrors = validateCustomerForm(data);
    setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = stripDigits(e.target.value).slice(0, 13);
    updateField("phone", digits);
  };

  const handleDniChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw.includes(".")) {
      setDniDotAttempted(true);
    } else {
      setDniDotAttempted(false);
    }
    setDniTipOpen(true);
    const cleaned = stripDigits(raw).slice(0, 8);
    updateField("dni", cleaned);
  };

  const handleCuitChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateField("cuit", formatCuitDisplay(e.target.value));
  };

  const handleFiscalChange = (condition: FiscalCondition) => {
    const next: CustomerFormData = {
      ...data,
      fiscalCondition: condition,
      cuit: condition === "consumidor_final" ? "" : data.cuit,
      businessName:
        condition === "responsable_inscripto" || condition === "exento"
          ? data.businessName
          : "",
    };
    onChange(next);
    setErrors((prev) => ({
      ...prev,
      cuit: undefined,
      businessName: undefined,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCustomerForm(data);
    setErrors(validationErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      locality: true,
      province: true,
      postalCode: true,
      fiscalCondition: true,
      dni: true,
      cuit: showCuit,
      businessName: showBusinessName,
    });

    if (Object.keys(validationErrors).length === 0) {
      onContinue();
    }
  };

  return (
    <section className="checkoutCard" aria-labelledby="step2-heading">
      <div className="checkoutCardHeader">
        <div>
          <h2 id="step2-heading" className="checkoutCardTitle">
            Tus datos
          </h2>
          <p className="checkoutCardSubtitle">
            Completá tus datos personales, de envío y facturación para continuar.
          </p>
        </div>
      </div>

      <form className="checkoutForm" onSubmit={handleSubmit} noValidate>
        {/* Nombre y Apellido */}
        <div className="formRowTwo">
          <div className="formField">
            <label htmlFor="checkout-firstName">Nombre</label>
            <input
              id="checkout-firstName"
              type="text"
              placeholder="Nombre"
              value={data.firstName}
              maxLength={50}
              className={errors.firstName ? "isInvalid" : ""}
              onChange={(e) => updateField("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
            />
            {errors.firstName && (
              <span className="fieldError" role="alert">
                {errors.firstName}
              </span>
            )}
          </div>

          <div className="formField">
            <label htmlFor="checkout-lastName">Apellido</label>
            <input
              id="checkout-lastName"
              type="text"
              placeholder="Apellido"
              value={data.lastName}
              maxLength={50}
              className={errors.lastName ? "isInvalid" : ""}
              onChange={(e) => updateField("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
            />
            {errors.lastName && (
              <span className="fieldError" role="alert">
                {errors.lastName}
              </span>
            )}
          </div>
        </div>

        {/* Correo electrónico */}
        <div className="formField">
          <label htmlFor="checkout-email">Correo electrónico</label>
          <input
            id="checkout-email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={data.email}
            className={errors.email ? "isInvalid" : ""}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={() => handleBlur("email")}
          />
          {errors.email && (
            <span className="fieldError" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {/* Teléfono con +54 */}
        <div className="formField">
          <label htmlFor="checkout-phone">Teléfono</label>
          <div className="phoneInputGroup">
            <span
              className={`phonePrefixBox ${errors.phone ? "isInvalid" : ""}`}
              aria-hidden="true"
            >
              +54
            </span>
            <input
              id="checkout-phone"
              type="tel"
              inputMode="numeric"
              placeholder="Ej: 1145678901"
              value={data.phone}
              maxLength={13}
              className={errors.phone ? "isInvalid" : ""}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur("phone")}
            />
          </div>
          {errors.phone && (
            <span className="fieldError" role="alert">
              {errors.phone}
            </span>
          )}
        </div>

        {/* Dirección de envío */}
        <div className="formSectionDivider">
          <span>Domicilio de entrega</span>
        </div>

        <div className="formRowTwo formRowAddress">
          <div className="formField">
            <label htmlFor="checkout-address">Dirección</label>
            <input
              id="checkout-address"
              type="text"
              placeholder="Calle, altura, piso / depto"
              value={data.address}
              maxLength={100}
              className={errors.address ? "isInvalid" : ""}
              onChange={(e) => updateField("address", e.target.value)}
              onBlur={() => handleBlur("address")}
            />
            {errors.address && (
              <span className="fieldError" role="alert">
                {errors.address}
              </span>
            )}
          </div>

          <div className="formField">
            <label htmlFor="checkout-postalCode">Código postal</label>
            <input
              id="checkout-postalCode"
              type="text"
              placeholder="Ej: 4000"
              value={data.postalCode}
              maxLength={8}
              className={errors.postalCode ? "isInvalid" : ""}
              onChange={(e) =>
                updateField("postalCode", e.target.value.toUpperCase())
              }
              onBlur={() => handleBlur("postalCode")}
            />
            {errors.postalCode && (
              <span className="fieldError" role="alert">
                {errors.postalCode}
              </span>
            )}
          </div>
        </div>

        <div className="formRowTwo">
          <div className="formField">
            <label htmlFor="checkout-locality">Localidad o partido</label>
            <input
              id="checkout-locality"
              type="text"
              placeholder="Ej: San Miguel de Tucumán"
              value={data.locality}
              maxLength={80}
              className={errors.locality ? "isInvalid" : ""}
              onChange={(e) => updateField("locality", e.target.value)}
              onBlur={() => handleBlur("locality")}
            />
            {errors.locality && (
              <span className="fieldError" role="alert">
                {errors.locality}
              </span>
            )}
          </div>

          <div className="formField">
            <label htmlFor="checkout-province">Provincia</label>
            <select
              id="checkout-province"
              value={data.province}
              className={errors.province ? "isInvalid" : ""}
              onChange={(e) => updateField("province", e.target.value)}
              onBlur={() => handleBlur("province")}
            >
              <option value="">Seleccioná una provincia</option>
              {ARGENTINA_PROVINCES.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            {errors.province && (
              <span className="fieldError" role="alert">
                {errors.province}
              </span>
            )}
          </div>
        </div>

        {/* Condición fiscal */}
        <div className="formSectionDivider">
          <span>Condición fiscal</span>
        </div>

        <div className="formField">
          <label htmlFor="checkout-fiscalCondition">
            Seleccioná tu condición frente al IVA
          </label>
          <select
            id="checkout-fiscalCondition"
            value={data.fiscalCondition}
            onChange={(e) =>
              handleFiscalChange(e.target.value as FiscalCondition)
            }
          >
            {FISCAL_CONDITIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="fiscalFieldsPanel">
          <div className={showCuit ? "formRowTwo" : "formFieldSingle"}>
            {/* DNI con ventanita flotante al escribir */}
            <div className="formField formField--withPopover">
              <label htmlFor="checkout-dni">
                Documento (DNI sin puntos)
              </label>

              {dniTipOpen && (
                <div
                  className={`dniHelperPopover ${
                    dniDotAttempted ? "isEmphasized" : ""
                  }`}
                  role="status"
                >
                  <FaInfoCircle size={13} />
                  <span>escribilo sin puntos ej:44555666</span>
                </div>
              )}

              <input
                id="checkout-dni"
                type="text"
                inputMode="numeric"
                placeholder="44555666"
                value={data.dni}
                maxLength={8}
                className={errors.dni ? "isInvalid" : ""}
                onFocus={() => setDniTipOpen(true)}
                onChange={handleDniChange}
                onBlur={() => {
                  setDniTipOpen(false);
                  setDniDotAttempted(false);
                  handleBlur("dni");
                }}
              />
              {errors.dni && (
                <span className="fieldError" role="alert">
                  {errors.dni}
                </span>
              )}
            </div>

            {showCuit && (
              <div className="formField">
                <label htmlFor="checkout-cuit">CUIT</label>
                <input
                  id="checkout-cuit"
                  type="text"
                  inputMode="numeric"
                  placeholder="20-44555666-7"
                  value={data.cuit}
                  maxLength={13}
                  className={errors.cuit ? "isInvalid" : ""}
                  onChange={handleCuitChange}
                  onBlur={() => handleBlur("cuit")}
                />
                {errors.cuit && (
                  <span className="fieldError" role="alert">
                    {errors.cuit}
                  </span>
                )}
              </div>
            )}
          </div>

          {showBusinessName && (
            <div className="formField">
              <label htmlFor="checkout-businessName">Razón social</label>
              <input
                id="checkout-businessName"
                type="text"
                placeholder="Ej: Detodito S.A."
                value={data.businessName}
                maxLength={100}
                className={errors.businessName ? "isInvalid" : ""}
                onChange={(e) => updateField("businessName", e.target.value)}
                onBlur={() => handleBlur("businessName")}
              />
              {errors.businessName && (
                <span className="fieldError" role="alert">
                  {errors.businessName}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="checkoutStepFooter">
          <button
            type="button"
            className="checkoutBackBtn"
            onClick={onBack}
          >
            <FaArrowLeft size={12} />
            <span>Volver al carrito</span>
          </button>

          <button type="submit" className="btn-primary checkoutNextBtn">
            <span>Continuar al pago</span>
            <FaArrowRight size={13} />
          </button>
        </div>
      </form>
    </section>
  );
}
