import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cards, { type Focused } from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { FaEye, FaEyeSlash, FaPen, FaTimes, FaTrashAlt } from "react-icons/fa";
import {
  ARGENTINA_PROVINCES,
  detectCardBrand,
  formatCardNumberDisplay,
  formatExpiryDisplay,
  getCardBrandLabel,
  stripDigits,
} from "../../data/checkoutConfig";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import {
  extractZodFieldErrors,
  profileUpdateSchema,
  savedCardSchema,
  type ProfileUpdateValues,
  type SavedCardValues,
} from "../../schemas/authSchema";
import type { SavedCard, SessionUser } from "../../types/auth";
import "./ProfilePage.css";

interface PersonalDataPanelProps {
  user: SessionUser;
  onSave: (values: ProfileUpdateValues) => { ok: boolean; error?: string };
}

function PersonalDataPanel({ user, onSave }: PersonalDataPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ProfileUpdateValues>({
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
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileUpdateValues, string>>
  >({});
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const startEditing = () => {
    setForm({
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
    });
    setErrors({});
    setStatus(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setErrors({});
    setStatus(null);
    setIsEditing(false);
  };

  const updateField = <K extends keyof ProfileUpdateValues>(
    field: K,
    value: ProfileUpdateValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    setStatus(null);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    const parsed = profileUpdateSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(extractZodFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    const result = onSave(parsed.data);
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
    <section className="profile-panel" aria-labelledby="profile-edit-title">
      <header className="profile-panel-header profile-panel-header--row">
        <div>
          <h2 id="profile-edit-title">Datos personales</h2>
          <p>
            Estos datos se completan automáticamente al momento de realizar una
            compra.
          </p>
        </div>

        <button
          type="button"
          className={`profile-icon-edit-btn ${isEditing ? "is-active" : ""}`}
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
          <dl className="profile-info-grid">
            <div className="profile-info-item">
              <dt>Nombre</dt>
              <dd>{user.firstName}</dd>
            </div>
            <div className="profile-info-item">
              <dt>Apellido</dt>
              <dd>{user.lastName}</dd>
            </div>
            <div className="profile-info-item">
              <dt>Correo electrónico</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="profile-info-item">
              <dt>Teléfono</dt>
              <dd>{user.phone ? `+54 ${stripDigits(user.phone)}` : "Sin especificar"}</dd>
            </div>
            <div className="profile-info-item">
              <dt>DNI</dt>
              <dd>{user.dni || "Sin especificar"}</dd>
            </div>
            <div className="profile-info-item">
              <dt>Dirección</dt>
              <dd>{user.address || "Sin especificar"}</dd>
            </div>
            <div className="profile-info-item">
              <dt>Localidad</dt>
              <dd>{user.locality || "Sin especificar"}</dd>
            </div>
            <div className="profile-info-item">
              <dt>Provincia</dt>
              <dd>{user.province || "Sin especificar"}</dd>
            </div>
            <div className="profile-info-item">
              <dt>Código postal</dt>
              <dd>{user.postalCode || "Sin especificar"}</dd>
            </div>
          </dl>

          {status && (
            <p
              className={`profile-status profile-status--${status.type}`}
              role="status"
            >
              {status.message}
            </p>
          )}
        </>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit} noValidate>
          <div className="profile-form-grid">
            <div className="profile-field">
              <label htmlFor="profile-firstName">Nombre</label>
              <input
                id="profile-firstName"
                type="text"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                aria-invalid={Boolean(errors.firstName)}
              />
              {errors.firstName && (
                <span className="profile-field-error">{errors.firstName}</span>
              )}
            </div>

            <div className="profile-field">
              <label htmlFor="profile-lastName">Apellido</label>
              <input
                id="profile-lastName"
                type="text"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                aria-invalid={Boolean(errors.lastName)}
              />
              {errors.lastName && (
                <span className="profile-field-error">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="profile-form-grid">
            <div className="profile-field">
              <label htmlFor="profile-email">Correo electrónico</label>
              <input
                id="profile-email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <span className="profile-field-error">{errors.email}</span>
              )}
            </div>

            <div className="profile-field">
              <label htmlFor="profile-phone">Teléfono</label>
              <div className="profile-phone-group">
                <span className="profile-phone-prefix" aria-hidden="true">
                  +54
                </span>
                <input
                  id="profile-phone"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  maxLength={13}
                  placeholder="3815550240"
                  onChange={(e) =>
                    updateField("phone", stripDigits(e.target.value).slice(0, 13))
                  }
                  aria-invalid={Boolean(errors.phone)}
                />
              </div>
              {errors.phone && (
                <span className="profile-field-error">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="profile-form-grid">
            <div className="profile-field">
              <label htmlFor="profile-dni">DNI (sin puntos)</label>
              <input
                id="profile-dni"
                type="text"
                inputMode="numeric"
                value={form.dni}
                maxLength={8}
                placeholder="42589123"
                onChange={(e) =>
                  updateField("dni", stripDigits(e.target.value).slice(0, 8))
                }
                aria-invalid={Boolean(errors.dni)}
              />
              {errors.dni && (
                <span className="profile-field-error">{errors.dni}</span>
              )}
            </div>

            <div className="profile-field">
              <label htmlFor="profile-postalCode">Código postal</label>
              <input
                id="profile-postalCode"
                type="text"
                value={form.postalCode}
                maxLength={8}
                placeholder="4000"
                onChange={(e) =>
                  updateField("postalCode", e.target.value.toUpperCase())
                }
                aria-invalid={Boolean(errors.postalCode)}
              />
              {errors.postalCode && (
                <span className="profile-field-error">{errors.postalCode}</span>
              )}
            </div>
          </div>

          <div className="profile-field">
            <label htmlFor="profile-address">Dirección</label>
            <input
              id="profile-address"
              type="text"
              value={form.address}
              maxLength={100}
              placeholder="Calle, altura, piso / depto"
              onChange={(e) => updateField("address", e.target.value)}
              aria-invalid={Boolean(errors.address)}
            />
            {errors.address && (
              <span className="profile-field-error">{errors.address}</span>
            )}
          </div>

          <div className="profile-form-grid">
            <div className="profile-field">
              <label htmlFor="profile-locality">Localidad o partido</label>
              <input
                id="profile-locality"
                type="text"
                value={form.locality}
                maxLength={80}
                placeholder="Ej: San Miguel de Tucumán"
                onChange={(e) => updateField("locality", e.target.value)}
                aria-invalid={Boolean(errors.locality)}
              />
              {errors.locality && (
                <span className="profile-field-error">{errors.locality}</span>
              )}
            </div>

            <div className="profile-field">
              <label htmlFor="profile-province">Provincia</label>
              <select
                id="profile-province"
                value={form.province}
                onChange={(e) => updateField("province", e.target.value)}
              >
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
              className={`profile-status profile-status--${status.type}`}
              role="status"
            >
              {status.message}
            </p>
          )}

          <div className="profile-form-actions">
            <button type="submit" className="btn-primary">
              Guardar cambios
            </button>
            <button
              type="button"
              className="profile-cancel-btn"
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

interface SavedCardPanelProps {
  user: SessionUser;
  onSaveCard: (card: SavedCard | null) => { ok: boolean; error?: string };
}

function SavedCardPanel({ user, onSaveCard }: SavedCardPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [card, setCard] = useState<SavedCardValues>({
    number: user.savedCard?.number ?? "",
    name: user.savedCard?.name ?? user.name.toUpperCase(),
    expiry: user.savedCard?.expiry ?? "",
    cvc: user.savedCard?.cvc ?? "",
  });
  const [focused, setFocused] = useState<Focused>("");
  const [showCvc, setShowCvc] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SavedCardValues, string>>
  >({});
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const displayedCard = isEditing ? card : user.savedCard;
  const digitsOnly = stripDigits(displayedCard?.number ?? "");
  const brand = detectCardBrand(digitsOnly);
  const last4 = digitsOnly.slice(-4);

  const startEditing = () => {
    setCard({
      number: user.savedCard?.number ?? "",
      name: user.savedCard?.name ?? user.name.toUpperCase(),
      expiry: user.savedCard?.expiry ?? "",
      cvc: user.savedCard?.cvc ?? "",
    });
    setErrors({});
    setStatus(null);
    setFocused("");
    setShowCvc(false);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setErrors({});
    setStatus(null);
    setFocused("");
    setShowCvc(false);
    setIsEditing(false);
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextDigits = stripDigits(e.target.value);
    const nextBrand = detectCardBrand(nextDigits);
    const formatted = formatCardNumberDisplay(nextDigits, nextBrand);
    const maxCvc = nextBrand === "amex" ? 4 : 3;

    setCard((prev) => ({
      ...prev,
      number: formatted,
      cvc: stripDigits(prev.cvc).slice(0, maxCvc),
    }));
    setErrors((prev) => ({ ...prev, number: undefined }));
    setStatus(null);
  };

  const handleRemoveCard = () => {
    const result = onSaveCard(null);
    if (result.ok) {
      setCard({
        number: "",
        name: user.name.toUpperCase(),
        expiry: "",
        cvc: "",
      });
      setErrors({});
      setIsEditing(false);
      setStatus({
        type: "success",
        message: "Se quitó la tarjeta asociada.",
      });
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    const parsed = savedCardSchema.safeParse(card);
    if (!parsed.success) {
      setErrors(extractZodFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    const result = onSaveCard(parsed.data);
    if (!result.ok) {
      setStatus({
        type: "error",
        message: result.error ?? "No se pudo guardar la tarjeta.",
      });
      return;
    }

    setIsEditing(false);
    setStatus({
      type: "success",
      message: "Tarjeta asociada actualizada.",
    });
  };

  return (
    <section className="profile-panel" aria-labelledby="profile-card-title">
      <header className="profile-panel-header profile-panel-header--row">
        <div>
          <h2 id="profile-card-title">Tarjeta asociada</h2>
          <p>Se autocompleta automáticamente en el paso de pago.</p>
        </div>

        <button
          type="button"
          className={`profile-icon-edit-btn ${isEditing ? "is-active" : ""}`}
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
      </header>

      {(displayedCard || isEditing) && (
        <div className="profile-card-preview">
          <Cards
            number={digitsOnly}
            name={displayedCard?.name ?? ""}
            expiry={stripDigits(displayedCard?.expiry ?? "")}
            cvc={
              isEditing && showCvc
                ? card.cvc
                : "•".repeat((displayedCard?.cvc ?? "").length)
            }
            focused={isEditing ? (showCvc ? "cvc" : focused) : ""}
            acceptedCards={["visa", "mastercard", "american-express"]}
            placeholders={{ name: "TU NOMBRE" }}
            locale={{ valid: "VÁLIDA HASTA" }}
          />
        </div>
      )}

      {!isEditing ? (
        <>
          {user.savedCard ? (
            <dl className="profile-info-grid profile-info-grid--compact">
              <div className="profile-info-item">
                <dt>Tarjeta</dt>
                <dd>
                  {getCardBrandLabel(brand)} terminada en {last4}
                </dd>
              </div>
              <div className="profile-info-item">
                <dt>Vencimiento</dt>
                <dd>{user.savedCard.expiry}</dd>
              </div>
              <div className="profile-info-item profile-info-item--full">
                <dt>Titular</dt>
                <dd>{user.savedCard.name}</dd>
              </div>
            </dl>
          ) : (
            <p className="profile-empty-card">
              Todavía no tenés una tarjeta asociada. Tocá el lápiz para agregar
              una.
            </p>
          )}

          {status && (
            <p
              className={`profile-status profile-status--${status.type}`}
              role="status"
            >
              {status.message}
            </p>
          )}
        </>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit} noValidate>
          <div className="profile-field">
            <label htmlFor="profile-card-number">Número de tarjeta</label>
            <input
              id="profile-card-number"
              type="text"
              inputMode="numeric"
              placeholder="4509 9535 6623 1904"
              value={card.number}
              maxLength={brand === "amex" ? 17 : 19}
              onFocus={() => setFocused("number")}
              onBlur={() => setFocused("")}
              onChange={handleNumberChange}
              aria-invalid={Boolean(errors.number)}
            />
            {errors.number && (
              <span className="profile-field-error">{errors.number}</span>
            )}
          </div>

          <div className="profile-field">
            <label htmlFor="profile-card-name">Titular</label>
            <input
              id="profile-card-name"
              type="text"
              placeholder="COMO FIGURA EN LA TARJETA"
              value={card.name}
              maxLength={50}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused("")}
              onChange={(e) => {
                setCard((prev) => ({
                  ...prev,
                  name: e.target.value.toUpperCase(),
                }));
                setErrors((prev) => ({ ...prev, name: undefined }));
                setStatus(null);
              }}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <span className="profile-field-error">{errors.name}</span>
            )}
          </div>

          <div className="profile-form-grid">
            <div className="profile-field">
              <label htmlFor="profile-card-expiry">Vencimiento</label>
              <input
                id="profile-card-expiry"
                type="text"
                inputMode="numeric"
                placeholder="MM/AA"
                value={card.expiry}
                maxLength={5}
                onFocus={() => setFocused("expiry")}
                onBlur={() => setFocused("")}
                onChange={(e) => {
                  setCard((prev) => ({
                    ...prev,
                    expiry: formatExpiryDisplay(e.target.value),
                  }));
                  setErrors((prev) => ({ ...prev, expiry: undefined }));
                  setStatus(null);
                }}
                aria-invalid={Boolean(errors.expiry)}
              />
              {errors.expiry && (
                <span className="profile-field-error">{errors.expiry}</span>
              )}
            </div>

            <div className="profile-field">
              <label htmlFor="profile-card-cvc">CVC</label>
              <div className="profile-cvc-wrap">
                <input
                  id="profile-card-cvc"
                  type={showCvc ? "text" : "password"}
                  inputMode="numeric"
                  placeholder={brand === "amex" ? "••••" : "•••"}
                  value={card.cvc}
                  maxLength={brand === "amex" ? 4 : 3}
                  onFocus={() => setFocused("cvc")}
                  onBlur={() => setFocused("")}
                  onChange={(e) => {
                    const maxLen = brand === "amex" ? 4 : 3;
                    setCard((prev) => ({
                      ...prev,
                      cvc: stripDigits(e.target.value).slice(0, maxLen),
                    }));
                    setErrors((prev) => ({ ...prev, cvc: undefined }));
                    setStatus(null);
                  }}
                  aria-invalid={Boolean(errors.cvc)}
                />
                <button
                  type="button"
                  className="profile-cvc-toggle"
                  onClick={() => setShowCvc((prev) => !prev)}
                  aria-label={showCvc ? "Ocultar CVC" : "Mostrar CVC"}
                >
                  {showCvc ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
              {errors.cvc && (
                <span className="profile-field-error">{errors.cvc}</span>
              )}
            </div>
          </div>

          {status && (
            <p
              className={`profile-status profile-status--${status.type}`}
              role="status"
            >
              {status.message}
            </p>
          )}

          <div className="profile-card-actions">
            <button type="submit" className="btn-primary">
              Guardar tarjeta
            </button>
            <button
              type="button"
              className="profile-cancel-btn"
              onClick={cancelEditing}
            >
              Cancelar
            </button>
            {user.savedCard && (
              <button
                type="button"
                className="profile-remove-card-btn"
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
    <main className="profile-page">
      <div className="profile-container">
        <section className="profile-hero">
          <div className="profile-identity">
            <div
              className={`profile-avatar ${isAdmin ? "is-admin" : ""}`}
              aria-hidden="true"
            >
              {initials}
            </div>
            <div>
              <h1>{user.name}</h1>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>

          <div className="profile-hero-actions">
            {isAdmin && (
              <Link to="/admin" className="btn-primary profile-link-btn">
                Ir al Panel Admin
              </Link>
            )}
            <button
              type="button"
              className="profile-logout-btn"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </section>

        <section className="profile-stats" aria-label="Resumen de tu cuenta">
          <Link to="/favoritos" className="profile-stat-card">
            <span className="profile-stat-label">Lista de deseos</span>
            <strong className="profile-stat-value">{wishlistCount}</strong>
            <span className="profile-stat-hint">Ver productos guardados →</span>
          </Link>

          <Link to="/cart" className="profile-stat-card">
            <span className="profile-stat-label">En tu carrito</span>
            <strong className="profile-stat-value">{cartCount}</strong>
            <span className="profile-stat-hint">Ir al carrito de compras →</span>
          </Link>
        </section>

        <div className="profile-layout">
          <PersonalDataPanel
            key={user.id}
            user={user}
            onSave={(values) => {
              const res = updateProfile(values);
              return res.ok ? { ok: true } : { ok: false, error: res.error };
            }}
          />

          <aside className="profile-sidebar">
            <SavedCardPanel
              key={user.id}
              user={user}
              onSaveCard={(card) => {
                const res = updateSavedCard(card);
                return res.ok ? { ok: true } : { ok: false, error: res.error };
              }}
            />

            <section className="profile-panel profile-demo-panel">
              <header className="profile-panel-header">
                <h2>Cambiar perfil (Demo)</h2>
                <p>
                  Solo para pruebas mientras se integra la página de inicio de
                  sesión.
                </p>
              </header>
              <div className="profile-demo-actions">
                <button
                  type="button"
                  className={`profile-demo-btn ${!isAdmin ? "is-current" : ""}`}
                  onClick={() => loginAsDemo("guest")}
                >
                  Usar Invitado
                </button>
                <button
                  type="button"
                  className={`profile-demo-btn ${isAdmin ? "is-current" : ""}`}
                  onClick={() => loginAsDemo("admin")}
                >
                  Usar Administrador
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
