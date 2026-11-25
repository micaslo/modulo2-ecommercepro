import "./CreateAnAccount.css";
import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  extractZodFieldErrors,
  registerSchema,
  type RegisterFormValues,
} from "../../schemas/authSchema";

export type CreateAccountData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

type PageToCreateAnAccountProps = {
  onCreateAccount?: (data: CreateAccountData) => void;
};

export default function PageToCreateAnAccount({
  onCreateAccount,
}: PageToCreateAnAccountProps) {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof RegisterFormValues, string>>
  >({});
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    const formData = new FormData(event.currentTarget);
    const rawValues = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      password: String(formData.get("password") ?? ""),
      passwordConfirmation: String(formData.get("passwordConfirmation") ?? ""),
      terms: formData.get("terms") === "on",
    };

    const parsed = registerSchema.safeParse(rawValues);
    if (!parsed.success) {
      const nextErrors = extractZodFieldErrors(parsed.error);
      setFieldErrors(nextErrors);
      setErrorMessage("Revisá los campos marcados antes de continuar.");
      return;
    }

    setFieldErrors({});

    const accountData: CreateAccountData = {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? "",
      password: parsed.data.password,
    };

    if (onCreateAccount) {
      onCreateAccount(accountData);
    }

    const result = register(accountData);
    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    setStatusMessage(
      `¡Cuenta creada! Bienvenido/a, ${result.user.firstName}. Redirigiendo a tu perfil...`,
    );
    navigate("/perfil");
  }

  return (
    <main className="create-account-page">
      <section
        className="create-account-card"
        aria-labelledby="create-account-title"
      >
        <aside className="create-account-aside">
          <Link
            className="create-account-brand"
            to="/"
            aria-label="Detodito Market, inicio"
          >
            <span className="create-account-brand__mark" aria-hidden="true">
              D
            </span>
            <span className="create-account-brand__name">
              <strong>Detodito</strong>
              <small>Market</small>
            </span>
          </Link>

          <div className="create-account-aside__copy">
            <p className="create-account-eyebrow">Bienvenido a tu tienda</p>
            <h1>Todo lo que buscas, en un solo lugar.</h1>
            <p>
              Creá tu cuenta de invitado para guardar favoritos y disfrutar una
              experiencia de compra más simple.
            </p>
          </div>

          <div className="create-account-decoration" aria-hidden="true">
            <span>+</span>
            <span>✦</span>
            <span>+</span>
          </div>
        </aside>

        <div className="create-account-content">
          <header className="create-account-heading">
            <p className="create-account-eyebrow">Empezá ahora</p>
            <h2 id="create-account-title">Crear cuenta</h2>
            <p>Completá tus datos para registrarte como usuario Invitado.</p>
          </header>

          <form
            className="create-account-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="create-account-fields create-account-fields--two-columns">
              <div className="create-account-field">
                <label htmlFor="firstName">Nombre</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Tu nombre"
                  aria-invalid={Boolean(fieldErrors.firstName)}
                  required
                />
                {fieldErrors.firstName && (
                  <span className="create-account-field-error">
                    {fieldErrors.firstName}
                  </span>
                )}
              </div>

              <div className="create-account-field">
                <label htmlFor="lastName">Apellido</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Tu apellido"
                  aria-invalid={Boolean(fieldErrors.lastName)}
                  required
                />
                {fieldErrors.lastName && (
                  <span className="create-account-field-error">
                    {fieldErrors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className="create-account-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@correo.com"
                aria-invalid={Boolean(fieldErrors.email)}
                required
              />
              {fieldErrors.email && (
                <span className="create-account-field-error">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className="create-account-field">
              <label htmlFor="phone">
                Teléfono <span>(opcional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+54 9 381 ..."
                aria-invalid={Boolean(fieldErrors.phone)}
              />
              {fieldErrors.phone && (
                <span className="create-account-field-error">
                  {fieldErrors.phone}
                </span>
              )}
            </div>

            <div className="create-account-fields create-account-fields--two-columns">
              <div className="create-account-field">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mín. 8 caracteres, letra y número"
                  aria-invalid={Boolean(fieldErrors.password)}
                  required
                />
                {fieldErrors.password && (
                  <span className="create-account-field-error">
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <div className="create-account-field">
                <label htmlFor="passwordConfirmation">
                  Confirmar contraseña
                </label>
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repetí tu contraseña"
                  aria-invalid={Boolean(fieldErrors.passwordConfirmation)}
                  required
                />
                {fieldErrors.passwordConfirmation && (
                  <span className="create-account-field-error">
                    {fieldErrors.passwordConfirmation}
                  </span>
                )}
              </div>
            </div>

            <button
              className="create-account-password-toggle"
              type="button"
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? "Ocultar contraseñas" : "Mostrar contraseñas"}
            </button>

            <div className="create-account-field">
              <label className="create-account-terms">
                <input name="terms" type="checkbox" required />
                <span>
                  Acepto los términos y condiciones y la política de privacidad.
                </span>
              </label>
              {fieldErrors.terms && (
                <span className="create-account-field-error">
                  {fieldErrors.terms}
                </span>
              )}
            </div>

            {errorMessage && (
              <p
                className="create-account-message create-account-message--error"
                role="alert"
              >
                {errorMessage}
              </p>
            )}
            {statusMessage && (
              <p
                className="create-account-message create-account-message--success"
                role="status"
              >
                {statusMessage}
              </p>
            )}

            <button className="create-account-submit" type="submit">
              Crear cuenta
            </button>
          </form>

          <p className="create-account-login">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
