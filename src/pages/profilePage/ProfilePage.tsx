import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cards, { type Focused } from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { FaEye, FaEyeSlash, FaPen, FaTimes, FaTrashAlt } from "react-icons/fa";
import {
  ARGENTINA_PROVINCES,
  detectCardBrand,
  formatCardNumberDisplay,
  formatCuitDisplay,
  formatExpiryDisplay,
  getCardBrandLabel,
  stripDigits,
} from "../../data/checkoutConfig";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import {
  profileUpdateSchema,
  savedCardSchema,
  type ProfileUpdateValues,
  type SavedCardValues,
} from "../../schemas/authSchema";
import type { SavedCard, SessionUser } from "../../types/auth";
import "./ProfilePage.css";

function buildProfileDefaults(user: SessionUser): ProfileUpdateValues {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ? stripDigits(user.phone) : "",
    address: user.address ?? "",
    locality: user.locality ?? "",
    province: user.province ?? "",
    postalCode: user.postalCode ?? "",
    fiscalCondition: user.fiscalCondition ?? "consumidor_final",
    dni: user.dni ?? "",
    cuit: user.cuit ?? "",
    businessName: user.businessName ?? "",
  };
}

function buildCardDefaults(user: SessionUser): SavedCardValues {
  return {
    number: user.savedCard?.number ?? "",
    name: user.savedCard?.name ?? user.name.toUpperCase(),
    expiry: user.savedCard?.expiry ?? "",
    cvc: user.savedCard?.cvc ?? "",
  };
}

interface PersonalDataPanelProps {
  user: SessionUser;
  onSave: (values: ProfileUpdateValues) => { ok: boolean; error?: string };
}

function PersonalDataPanel({ user, onSave }: PersonalDataPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: buildProfileDefaults(user),
  });

  const fiscalCondition = useWatch({ control, name: "fiscalCondition" });
  const cuit = useWatch({ control, name: "cuit" });
  const businessName = useWatch({ control, name: "businessName" });

  const startEditing = () => {
    reset(buildProfileDefaults(user));
    setStatus(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    reset(buildProfileDefaults(user));
    setStatus(null);
    setIsEditing(false);
  };

  const onSubmit = (validData: ProfileUpdateValues) => {
    setStatus(null);

    const result = onSave(validData);
    if (!result.ok) {
      setStatus({
        type: "error",
        message: result.error ?? "No se pudieron guardar los cambios.",
      });
      return;
    }

    setIsEditing(false);
    setStatus({
      type: "success",
      message: "Datos personales actualizados.",
    });
  };

  return (
    <section className="profilePanel" aria-labelledby="profile-edit-title">
      <header className="profilePanelHeader profilePanelHeaderRow">
        <div>
          <h2 id="profile-edit-title">Datos personales</h2>
          <p>
            Estos datos se completan automáticamente al momento de realizar una
            compra.
          </p>
        </div>

        <button
          type="button"
          className={`profileIconEditBtn ${isEditing ? "isActive" : ""}`}
          onClick={isEditing ? cancelEditing : startEditing}
          aria-label={
            isEditing ? "Cancelar edición" : "Editar datos personales"
          }
          title={isEditing ? "Cancelar edición" : "Editar datos personales"}
        >
          {isEditing ? <FaTimes size={14} /> : <FaPen size={13} />}
        </button>
      </header>

      {!isEditing ? (
        <>
          <dl className="profileInfoGrid">
            <div className="profileInfoItem">
              <dt>Nombre</dt>
              <dd>{user.firstName}</dd>
            </div>
            <div className="profileInfoItem">
              <dt>Apellido</dt>
              <dd>{user.lastName}</dd>
            </div>
            <div className="profileInfoItem">
              <dt>Correo electrónico</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="profileInfoItem">
              <dt>Teléfono</dt>
              <dd>{user.phone ? `+54 ${stripDigits(user.phone)}` : "Sin especificar"}</dd>
            </div>
            <div className="profileInfoItem">
              <dt>DNI</dt>
              <dd>{user.dni || "Sin especificar"}</dd>
            </div>
            {(user.cuit ||
              (user.fiscalCondition &&
                user.fiscalCondition !== "consumidor_final")) && (
              <div className="profileInfoItem">
                <dt>CUIT</dt>
                <dd>{user.cuit || "Sin especificar"}</dd>
              </div>
            )}
            {(user.businessName ||
              user.fiscalCondition === "responsable_inscripto" ||
              user.fiscalCondition === "exento") && (
              <div className="profileInfoItem">
                <dt>Razón social</dt>
                <dd>{user.businessName || "Sin especificar"}</dd>
              </div>
            )}
            <div className="profileInfoItem">
              <dt>Dirección</dt>
              <dd>{user.address || "Sin especificar"}</dd>
            </div>
            <div className="profileInfoItem">
              <dt>Localidad</dt>
              <dd>{user.locality || "Sin especificar"}</dd>
            </div>
            <div className="profileInfoItem">
              <dt>Provincia</dt>
              <dd>{user.province || "Sin especificar"}</dd>
            </div>
            <div className="profileInfoItem">
              <dt>Código postal</dt>
              <dd>{user.postalCode || "Sin especificar"}</dd>
            </div>
          </dl>

          {status && (
            <p
              className={`profileStatus ${status.type === "success" ? "profileStatusSuccess" : "profileStatusError"}`}
              role="status"
            >
              {status.message}
            </p>
          )}
        </>
      ) : (
        <form
          className="profileForm"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="profileFormGrid">
            <div className="profileField">
              <label htmlFor="profile-firstName">Nombre</label>
              <input
                id="profile-firstName"
                type="text"
                aria-invalid={Boolean(errors.firstName)}
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="profileFieldError">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            <div className="profileField">
              <label htmlFor="profile-lastName">Apellido</label>
              <input
                id="profile-lastName"
                type="text"
                aria-invalid={Boolean(errors.lastName)}
                {...register("lastName")}
              />
              {errors.lastName && (
                <span className="profileFieldError">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>

          <div className="profileFormGrid">
            <div className="profileField">
              <label htmlFor="profile-email">Correo electrónico</label>
              <input
                id="profile-email"
                type="email"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <span className="profileFieldError">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="profileField">
              <label htmlFor="profile-phone">Teléfono</label>
              <div className="profilePhoneGroup">
                <span className="profilePhonePrefix" aria-hidden="true">
                  +54
                </span>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="profile-phone"
                      type="tel"
                      inputMode="numeric"
                      value={field.value}
                      maxLength={13}
                      placeholder="3815550240"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        field.onChange(stripDigits(e.target.value).slice(0, 13))
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                      aria-invalid={Boolean(errors.phone)}
                    />
                  )}
                />
              </div>
              {errors.phone && (
                <span className="profileFieldError">
                  {errors.phone.message}
                </span>
              )}
            </div>
          </div>

          <div className="profileFormGrid">
            <div className="profileField">
              <label htmlFor="profile-dni">DNI (sin puntos)</label>
              <Controller
                name="dni"
                control={control}
                render={({ field }) => (
                  <input
                    id="profile-dni"
                    type="text"
                    inputMode="numeric"
                    value={field.value}
                    maxLength={8}
                    placeholder="42589123"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      field.onChange(stripDigits(e.target.value).slice(0, 8))
                    }
                    onBlur={field.onBlur}
                    ref={field.ref}
                    aria-invalid={Boolean(errors.dni)}
                  />
                )}
              />
              {errors.dni && (
                <span className="profileFieldError">{errors.dni.message}</span>
              )}
            </div>

            <div className="profileField">
              <label htmlFor="profile-postalCode">Código postal</label>
              <Controller
                name="postalCode"
                control={control}
                render={({ field }) => (
                  <input
                    id="profile-postalCode"
                    type="text"
                    value={field.value}
                    maxLength={8}
                    placeholder="4000"
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    onBlur={field.onBlur}
                    ref={field.ref}
                    aria-invalid={Boolean(errors.postalCode)}
                  />
                )}
              />
              {errors.postalCode && (
                <span className="profileFieldError">
                  {errors.postalCode.message}
                </span>
              )}
            </div>
          </div>

          {(fiscalCondition !== "consumidor_final" ||
            Boolean(cuit) ||
            Boolean(businessName)) && (
            <div className="profileFormGrid">
              <div className="profileField">
                <label htmlFor="profile-cuit">CUIT</label>
                <Controller
                  name="cuit"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="profile-cuit"
                      type="text"
                      inputMode="numeric"
                      value={field.value}
                      maxLength={13}
                      placeholder="20-40112876-3"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        field.onChange(formatCuitDisplay(e.target.value))
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                      aria-invalid={Boolean(errors.cuit)}
                    />
                  )}
                />
                {errors.cuit && (
                  <span className="profileFieldError">
                    {errors.cuit.message}
                  </span>
                )}
              </div>

              {(fiscalCondition === "responsable_inscripto" ||
                fiscalCondition === "exento" ||
                Boolean(businessName)) && (
                <div className="profileField">
                  <label htmlFor="profile-businessName">Razón social</label>
                  <input
                    id="profile-businessName"
                    type="text"
                    maxLength={100}
                    placeholder="Ej: Rorro Pirroro SA"
                    aria-invalid={Boolean(errors.businessName)}
                    {...register("businessName")}
                  />
                  {errors.businessName && (
                    <span className="profileFieldError">
                      {errors.businessName.message}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="profileField">
            <label htmlFor="profile-address">Dirección</label>
            <input
              id="profile-address"
              type="text"
              maxLength={100}
              placeholder="Calle, altura, piso / depto"
              aria-invalid={Boolean(errors.address)}
              {...register("address")}
            />
            {errors.address && (
              <span className="profileFieldError">
                {errors.address.message}
              </span>
            )}
          </div>

          <div className="profileFormGrid">
            <div className="profileField">
              <label htmlFor="profile-locality">Localidad o partido</label>
              <input
                id="profile-locality"
                type="text"
                maxLength={80}
                placeholder="Ej: San Miguel de Tucumán"
                aria-invalid={Boolean(errors.locality)}
                {...register("locality")}
              />
              {errors.locality && (
                <span className="profileFieldError">
                  {errors.locality.message}
                </span>
              )}
            </div>

            <div className="profileField">
              <label htmlFor="profile-province">Provincia</label>
              <select id="profile-province" {...register("province")}>
                <option value="">Seleccioná una provincia</option>
                {ARGENTINA_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {status && (
            <p
              className={`profileStatus ${status.type === "success" ? "profileStatusSuccess" : "profileStatusError"}`}
              role="status"
            >
              {status.message}
            </p>
          )}

          <div className="profileFormActions">
            <button type="submit" className="btnPrimary">
              Guardar cambios
            </button>
            <button
              type="button"
              className="profileCancelBtn"
              onClick={cancelEditing}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

const CARD_REVEAL_SECONDS = 10;

function getRccsIssuer(brand: ReturnType<typeof detectCardBrand>): string | undefined {
  if (brand === "amex") return "american-express";
  if (brand === "visa" || brand === "mastercard") return brand;
  return undefined;
}

function getMaskedCardDigits(digitsOnly: string, brand: ReturnType<typeof detectCardBrand>): string {
  if (!digitsOnly) return "";
  const totalLen = brand === "amex" ? 15 : 16;
  const last4 = digitsOnly.slice(-4);
  const hiddenCount = Math.max(0, totalLen - last4.length);
  return `${"•".repeat(hiddenCount)}${last4}`;
}

function formatMaskedCardText(digitsOnly: string, brand: ReturnType<typeof detectCardBrand>): string {
  const last4 = digitsOnly.slice(-4);
  if (!last4) return "••••";
  if (brand === "amex") return `•••• •••••• •${last4}`;
  return `•••• •••• •••• ${last4}`;
}

interface SavedCardPanelProps {
  user: SessionUser;
  onSaveCard: (card: SavedCard | null) => { ok: boolean; error?: string };
}

function SavedCardPanel({ user, onSaveCard }: SavedCardPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [revealSecondsLeft, setRevealSecondsLeft] = useState(0);
  const [focused, setFocused] = useState<Focused>("");
  const [showCvc, setShowCvc] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SavedCardValues>({
    resolver: zodResolver(savedCardSchema),
    defaultValues: buildCardDefaults(user),
  });

  const watchedCard = useWatch({ control });

  const isRevealed = revealSecondsLeft > 0;

  useEffect(() => {
    if (revealSecondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setRevealSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [revealSecondsLeft]);

  const displayedCard = isEditing ? watchedCard : user.savedCard;
  const digitsOnly = stripDigits(displayedCard?.number ?? "");
  const brand = detectCardBrand(digitsOnly);
  const maskedDigits = getMaskedCardDigits(digitsOnly, brand);
  const rccsIssuer = getRccsIssuer(brand);

  const handleToggleReveal = () => {
    setRevealSecondsLeft((prev) => (prev > 0 ? 0 : CARD_REVEAL_SECONDS));
  };

  const startEditing = () => {
    setRevealSecondsLeft(0);
    reset(buildCardDefaults(user));
    setStatus(null);
    setFocused("");
    setShowCvc(false);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setRevealSecondsLeft(0);
    reset(buildCardDefaults(user));
    setStatus(null);
    setFocused("");
    setShowCvc(false);
    setIsEditing(false);
  };

  const handleRemoveCard = () => {
    const result = onSaveCard(null);
    if (result.ok) {
      setRevealSecondsLeft(0);
      reset({
        number: "",
        name: user.name.toUpperCase(),
        expiry: "",
        cvc: "",
      });
      setIsEditing(false);
      setStatus({
        type: "success",
        message: "Se quitó la tarjeta asociada.",
      });
    }
  };

  const onSubmit = (validData: SavedCardValues) => {
    setStatus(null);

    const result = onSaveCard(validData);
    if (!result.ok) {
      setStatus({
        type: "error",
        message: result.error ?? "No se pudo guardar la tarjeta.",
      });
      return;
    }

    setRevealSecondsLeft(0);
    setIsEditing(false);
    setStatus({
      type: "success",
      message: "Tarjeta asociada actualizada.",
    });
  };

  const showUnmaskedCard = isEditing || isRevealed;

  return (
    <section className="profilePanel" aria-labelledby="profile-card-title">
      <header className="profilePanelHeader profilePanelHeaderRow">
        <div>
          <h2 id="profile-card-title">Tarjeta asociada</h2>
          <p>Datos protegidos · se autocompleta al momento de pagar.</p>
        </div>

        <div className="profilePanelHeaderActions">
          {!isEditing && user.savedCard && (
            <button
              type="button"
              className={`profileRevealBtn ${isRevealed ? "isRevealed" : ""}`}
              onClick={handleToggleReveal}
              aria-pressed={isRevealed}
              aria-label={
                isRevealed
                  ? "Ocultar datos de la tarjeta"
                  : "Mostrar datos de la tarjeta temporalmente"
              }
              title={
                isRevealed
                  ? "Ocultar datos"
                  : "Mostrar datos temporalmente"
              }
            >
              {isRevealed ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              <span>
                {isRevealed ? `Ocultar (${revealSecondsLeft}s)` : "Ver datos"}
              </span>
            </button>
          )}

          <button
            type="button"
            className={`profileIconEditBtn ${isEditing ? "isActive" : ""}`}
            onClick={isEditing ? cancelEditing : startEditing}
            aria-label={
              isEditing ? "Cancelar edición de tarjeta" : "Editar tarjeta asociada"
            }
            title={
              isEditing ? "Cancelar edición de tarjeta" : "Editar tarjeta asociada"
            }
          >
            {isEditing ? <FaTimes size={14} /> : <FaPen size={13} />}
          </button>
        </div>
      </header>

      {(displayedCard || isEditing) && (
        <div className="profileCardPreview">
          <Cards
            number={showUnmaskedCard ? digitsOnly : maskedDigits}
            name={displayedCard?.name ?? ""}
            expiry={
              showUnmaskedCard
                ? stripDigits(displayedCard?.expiry ?? "")
                : "••••"
            }
            cvc={
              (isEditing && showCvc) || (!isEditing && isRevealed)
                ? (displayedCard?.cvc ?? "")
                : "•".repeat((displayedCard?.cvc ?? "").length || 3)
            }
            focused={isEditing ? (showCvc ? "cvc" : focused) : ""}
            preview={!showUnmaskedCard}
            issuer={!showUnmaskedCard ? rccsIssuer : undefined}
            acceptedCards={["visa", "mastercard", "american-express"]}
            placeholders={{ name: "TU NOMBRE" }}
            locale={{ valid: "VÁLIDA HASTA" }}
          />
        </div>
      )}

      {!isEditing ? (
        <>
          {user.savedCard ? (
            <dl className="profileInfoGrid profileInfoGridCompact">
              <div className="profileInfoItem profileInfoItemFull">
                <dt>Número de tarjeta ({getCardBrandLabel(brand)})</dt>
                <dd className="profileCardMono">
                  {isRevealed
                    ? user.savedCard.number
                    : formatMaskedCardText(digitsOnly, brand)}
                </dd>
              </div>
              <div className="profileInfoItem">
                <dt>Vencimiento</dt>
                <dd className="profileCardMono">
                  {isRevealed ? user.savedCard.expiry : "••/••"}
                </dd>
              </div>
              <div className="profileInfoItem">
                <dt>Código de seguridad</dt>
                <dd className="profileCardMono">
                  {isRevealed
                    ? user.savedCard.cvc
                    : "•".repeat(user.savedCard.cvc.length || 3)}
                </dd>
              </div>
              <div className="profileInfoItem profileInfoItemFull">
                <dt>Titular</dt>
                <dd>{user.savedCard.name}</dd>
              </div>
            </dl>
          ) : (
            <p className="profileEmptyCard">
              Todavía no tenés una tarjeta asociada. Tocá el lápiz para agregar
              una.
            </p>
          )}

          {status && (
            <p
              className={`profileStatus ${status.type === "success" ? "profileStatusSuccess" : "profileStatusError"}`}
              role="status"
            >
              {status.message}
            </p>
          )}
        </>
      ) : (
        <form
          className="profileForm"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="profileField">
            <label htmlFor="profile-card-number">Número de tarjeta</label>
            <Controller
              name="number"
              control={control}
              render={({ field }) => (
                <input
                  id="profile-card-number"
                  type="text"
                  inputMode="numeric"
                  placeholder="4509 9535 6623 1904"
                  value={field.value}
                  maxLength={brand === "amex" ? 17 : 19}
                  onFocus={() => setFocused("number")}
                  onBlur={() => {
                    setFocused("");
                    field.onBlur();
                  }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const nextDigits = stripDigits(e.target.value);
                    const nextBrand = detectCardBrand(nextDigits);
                    const formatted = formatCardNumberDisplay(
                      nextDigits,
                      nextBrand,
                    );
                    const maxCvc = nextBrand === "amex" ? 4 : 3;
                    const currentCvc = getValues("cvc");
                    const trimmedCvc = stripDigits(currentCvc).slice(0, maxCvc);

                    field.onChange(formatted);
                    if (trimmedCvc !== currentCvc) {
                      setValue("cvc", trimmedCvc);
                    }
                    setStatus(null);
                  }}
                  ref={field.ref}
                  aria-invalid={Boolean(errors.number)}
                />
              )}
            />
            {errors.number && (
              <span className="profileFieldError">
                {errors.number.message}
              </span>
            )}
          </div>

          <div className="profileField">
            <label htmlFor="profile-card-name">Titular</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  id="profile-card-name"
                  type="text"
                  placeholder="COMO FIGURA EN LA TARJETA"
                  value={field.value}
                  maxLength={50}
                  onFocus={() => setFocused("name")}
                  onBlur={() => {
                    setFocused("");
                    field.onBlur();
                  }}
                  onChange={(e) => {
                    field.onChange(e.target.value.toUpperCase());
                    setStatus(null);
                  }}
                  ref={field.ref}
                  aria-invalid={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && (
              <span className="profileFieldError">{errors.name.message}</span>
            )}
          </div>

          <div className="profileFormGrid">
            <div className="profileField">
              <label htmlFor="profile-card-expiry">Vencimiento</label>
              <Controller
                name="expiry"
                control={control}
                render={({ field }) => (
                  <input
                    id="profile-card-expiry"
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/AA"
                    value={field.value}
                    maxLength={5}
                    onFocus={() => setFocused("expiry")}
                    onBlur={() => {
                      setFocused("");
                      field.onBlur();
                    }}
                    onChange={(e) => {
                      field.onChange(formatExpiryDisplay(e.target.value));
                      setStatus(null);
                    }}
                    ref={field.ref}
                    aria-invalid={Boolean(errors.expiry)}
                  />
                )}
              />
              {errors.expiry && (
                <span className="profileFieldError">
                  {errors.expiry.message}
                </span>
              )}
            </div>

            <div className="profileField">
              <label htmlFor="profile-card-cvc">CVC</label>
              <div className="profileCvcWrap">
                <Controller
                  name="cvc"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="profile-card-cvc"
                      type={showCvc ? "text" : "password"}
                      inputMode="numeric"
                      placeholder={brand === "amex" ? "••••" : "•••"}
                      value={field.value}
                      maxLength={brand === "amex" ? 4 : 3}
                      onFocus={() => setFocused("cvc")}
                      onBlur={() => {
                        setFocused("");
                        field.onBlur();
                      }}
                      onChange={(e) => {
                        const maxLen = brand === "amex" ? 4 : 3;
                        field.onChange(
                          stripDigits(e.target.value).slice(0, maxLen),
                        );
                        setStatus(null);
                      }}
                      ref={field.ref}
                      aria-invalid={Boolean(errors.cvc)}
                    />
                  )}
                />
                <button
                  type="button"
                  className="profileCvcToggle"
                  onClick={() => setShowCvc((prev) => !prev)}
                  aria-label={showCvc ? "Ocultar CVC" : "Mostrar CVC"}
                >
                  {showCvc ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
              {errors.cvc && (
                <span className="profileFieldError">{errors.cvc.message}</span>
              )}
            </div>
          </div>

          {status && (
            <p
              className={`profileStatus ${status.type === "success" ? "profileStatusSuccess" : "profileStatusError"}`}
              role="status"
            >
              {status.message}
            </p>
          )}

          <div className="profileCardActions">
            <button type="submit" className="btnPrimary">
              Guardar tarjeta
            </button>
            <button
              type="button"
              className="profileCancelBtn"
              onClick={cancelEditing}
            >
              Cancelar
            </button>
            {user.savedCard && (
              <button
                type="button"
                className="profileRemoveCardBtn"
                onClick={handleRemoveCard}
              >
                <FaTrashAlt size={12} />
                <span>Quitar</span>
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}

export default function ProfilePage() {
  const {
    user,
    isAdmin,
    logout,
    updateProfile,
    updateSavedCard,
    loginAsDemo,
  } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { totalItems: cartCount } = useCart();
  const navigate = useNavigate();

  if (!user) return null;

  const initials =
    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <main className="profilePage">
      <div className="profileContainer">
        <section className="profileHero">
          <div className="profileIdentity">
            <div
              className={`profileAvatar ${isAdmin ? "isAdmin" : ""}`}
              aria-hidden="true"
            >
              {initials}
            </div>
            <div>
              <h1>{user.name}</h1>
              <p className="profileEmail">{user.email}</p>
            </div>
          </div>

          <div className="profileHeroActions">
            {isAdmin && (
              <Link to="/admin" className="btnPrimary profileLinkBtn">
                Ir al Panel Admin
              </Link>
            )}
            <button
              type="button"
              className="profileLogoutBtn"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </section>

        <section className="profileStats" aria-label="Resumen de tu cuenta">
          <Link to="/favoritos" className="profileStatCard">
            <span className="profileStatLabel">Lista de deseos</span>
            <strong className="profileStatValue">{wishlistCount}</strong>
            <span className="profileStatHint">Ver productos guardados →</span>
          </Link>

          <Link to="/cart" className="profileStatCard">
            <span className="profileStatLabel">En tu carrito</span>
            <strong className="profileStatValue">{cartCount}</strong>
            <span className="profileStatHint">Ir al carrito de compras →</span>
          </Link>
        </section>

        <div className="profileLayout">
          <PersonalDataPanel
            key={user.id}
            user={user}
            onSave={(values) => {
              const res = updateProfile(values);
              return res.ok ? { ok: true } : { ok: false, error: res.error };
            }}
          />

          <aside className="profileSidebar">
            <SavedCardPanel
              key={user.id}
              user={user}
              onSaveCard={(card) => {
                const res = updateSavedCard(card);
                return res.ok ? { ok: true } : { ok: false, error: res.error };
              }}
            />

            <section className="profilePanel profileDemoPanel">
              <header className="profilePanelHeader">
                <h2>Cambiar de cuenta</h2>
                <p>
                  Alterná rápidamente entre cuentas de prueba o iniciá sesión
                  con otro usuario.
                </p>
              </header>
              <div className="profileDemoActions">
                <button
                  type="button"
                  className={`profileDemoBtn ${user.id === "guest-demo-1" ? "isCurrent" : ""}`}
                  onClick={() => loginAsDemo("guest", "guest-demo-1")}
                >
                  Micaela (Invitado)
                </button>
                <button
                  type="button"
                  className={`profileDemoBtn ${user.id === "guest-demo-2" ? "isCurrent" : ""}`}
                  onClick={() => loginAsDemo("guest", "guest-demo-2")}
                >
                  Juan Pablo (Invitado)
                </button>
                <button
                  type="button"
                  className={`profileDemoBtn profileDemoBtnFull ${isAdmin ? "isCurrent" : ""}`}
                  onClick={() => loginAsDemo("admin", "admin-root-1")}
                >
                  Sofía (Administrador)
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
