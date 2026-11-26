import { useState, type ChangeEvent } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaArrowLeft, FaArrowRight, FaInfoCircle } from "react-icons/fa";
import {
  ARGENTINA_PROVINCES,
  FISCAL_CONDITIONS,
  formatCuitDisplay,
  stripDigits,
} from "../../../data/checkoutConfig";
import { customerFormSchema } from "../../../schemas/checkoutSchema";
import type { CustomerFormData, FiscalCondition } from "../../../types/cart";

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
  const [dniTipOpen, setDniTipOpen] = useState(false);
  const [dniDotAttempted, setDniDotAttempted] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: data,
    mode: "onTouched",
  });

  const fiscalCondition = useWatch({ control, name: "fiscalCondition" });
  const showCuit = fiscalCondition !== "consumidor_final";
  const showBusinessName =
    fiscalCondition === "responsable_inscripto" || fiscalCondition === "exento";

  const handleFiscalChange = (condition: FiscalCondition) => {
    setValue("fiscalCondition", condition, { shouldDirty: true });
    if (condition === "consumidor_final") {
      setValue("cuit", "");
    }
    if (condition !== "responsable_inscripto" && condition !== "exento") {
      setValue("businessName", "");
    }
    clearErrors(["cuit", "businessName"]);
  };

  const handleBack = () => {
    onChange(getValues());
    onBack();
  };

  const onSubmit = (validData: CustomerFormData) => {
    onChange(validData);
    onContinue();
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

      <form
        className="checkoutForm"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="formRowTwo">
          <div className="formField">
            <label htmlFor="checkout-firstName">Nombre</label>
            <input
              id="checkout-firstName"
              type="text"
              placeholder="Nombre"
              maxLength={50}
              className={errors.firstName ? "isInvalid" : ""}
              aria-invalid={Boolean(errors.firstName)}
              {...register("firstName")}
            />
            {errors.firstName && (
              <span className="fieldError" role="alert">
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div className="formField">
            <label htmlFor="checkout-lastName">Apellido</label>
            <input
              id="checkout-lastName"
              type="text"
              placeholder="Apellido"
              maxLength={50}
              className={errors.lastName ? "isInvalid" : ""}
              aria-invalid={Boolean(errors.lastName)}
              {...register("lastName")}
            />
            {errors.lastName && (
              <span className="fieldError" role="alert">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        <div className="formField">
          <label htmlFor="checkout-email">Correo electrónico</label>
          <input
            id="checkout-email"
            type="email"
            placeholder="ejemplo@correo.com"
            className={errors.email ? "isInvalid" : ""}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <span className="fieldError" role="alert">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="formField">
          <label htmlFor="checkout-phone">Teléfono</label>
          <div className="phoneInputGroup">
            <span
              className={`phonePrefixBox ${errors.phone ? "isInvalid" : ""}`}
              aria-hidden="true"
            >
              +54
            </span>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <input
                  id="checkout-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Ej: 1145678901"
                  value={field.value}
                  maxLength={13}
                  className={errors.phone ? "isInvalid" : ""}
                  aria-invalid={Boolean(errors.phone)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    field.onChange(stripDigits(e.target.value).slice(0, 13))
                  }
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              )}
            />
          </div>
          {errors.phone && (
            <span className="fieldError" role="alert">
              {errors.phone.message}
            </span>
          )}
        </div>

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
              maxLength={100}
              className={errors.address ? "isInvalid" : ""}
              aria-invalid={Boolean(errors.address)}
              {...register("address")}
            />
            {errors.address && (
              <span className="fieldError" role="alert">
                {errors.address.message}
              </span>
            )}
          </div>

          <div className="formField">
            <label htmlFor="checkout-postalCode">Código postal</label>
            <Controller
              name="postalCode"
              control={control}
              render={({ field }) => (
                <input
                  id="checkout-postalCode"
                  type="text"
                  placeholder="Ej: 4000"
                  value={field.value}
                  maxLength={8}
                  className={errors.postalCode ? "isInvalid" : ""}
                  aria-invalid={Boolean(errors.postalCode)}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              )}
            />
            {errors.postalCode && (
              <span className="fieldError" role="alert">
                {errors.postalCode.message}
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
              maxLength={80}
              className={errors.locality ? "isInvalid" : ""}
              aria-invalid={Boolean(errors.locality)}
              {...register("locality")}
            />
            {errors.locality && (
              <span className="fieldError" role="alert">
                {errors.locality.message}
              </span>
            )}
          </div>

          <div className="formField">
            <label htmlFor="checkout-province">Provincia</label>
            <select
              id="checkout-province"
              className={errors.province ? "isInvalid" : ""}
              aria-invalid={Boolean(errors.province)}
              {...register("province")}
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
                {errors.province.message}
              </span>
            )}
          </div>
        </div>

        <div className="formSectionDivider">
          <span>Condición fiscal</span>
        </div>

        <div className="formField">
          <label htmlFor="checkout-fiscalCondition">
            Seleccioná tu condición frente al IVA
          </label>
          <select
            id="checkout-fiscalCondition"
            value={fiscalCondition}
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
            <div className="formField formFieldWithPopover">
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

              <Controller
                name="dni"
                control={control}
                render={({ field }) => (
                  <input
                    id="checkout-dni"
                    type="text"
                    inputMode="numeric"
                    placeholder="44555666"
                    value={field.value}
                    maxLength={8}
                    className={errors.dni ? "isInvalid" : ""}
                    aria-invalid={Boolean(errors.dni)}
                    onFocus={() => setDniTipOpen(true)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const raw = e.target.value;
                      setDniDotAttempted(raw.includes("."));
                      setDniTipOpen(true);
                      field.onChange(stripDigits(raw).slice(0, 8));
                    }}
                    onBlur={() => {
                      setDniTipOpen(false);
                      setDniDotAttempted(false);
                      field.onBlur();
                    }}
                    ref={field.ref}
                  />
                )}
              />
              {errors.dni && (
                <span className="fieldError" role="alert">
                  {errors.dni.message}
                </span>
              )}
            </div>

            {showCuit && (
              <div className="formField">
                <label htmlFor="checkout-cuit">CUIT</label>
                <Controller
                  name="cuit"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="checkout-cuit"
                      type="text"
                      inputMode="numeric"
                      placeholder="20-44555666-7"
                      value={field.value}
                      maxLength={13}
                      className={errors.cuit ? "isInvalid" : ""}
                      aria-invalid={Boolean(errors.cuit)}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        field.onChange(formatCuitDisplay(e.target.value))
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
                {errors.cuit && (
                  <span className="fieldError" role="alert">
                    {errors.cuit.message}
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
                placeholder="Ej: Tienda Liebre S.A."
                maxLength={100}
                className={errors.businessName ? "isInvalid" : ""}
                aria-invalid={Boolean(errors.businessName)}
                {...register("businessName")}
              />
              {errors.businessName && (
                <span className="fieldError" role="alert">
                  {errors.businessName.message}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="checkoutStepFooter">
          <button
            type="button"
            className="checkoutBackBtn"
            onClick={handleBack}
          >
            <FaArrowLeft size={12} />
            <span>Volver al carrito</span>
          </button>

          <button type="submit" className="btnPrimary checkoutNextBtn">
            <span>Continuar al pago</span>
            <FaArrowRight size={13} />
          </button>
        </div>
      </form>
    </section>
  );
}
