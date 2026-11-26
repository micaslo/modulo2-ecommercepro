import "./CreateAnAccount.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import logoWhite from "../../assets/images/logo/tl-imagotype-white.webp";
import {
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
  const { register: registerAccount } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
      terms: false,
    },
  });

  function onSubmit(values: RegisterFormValues) {
    setErrorMessage("");
    setStatusMessage("");

    const accountData: CreateAccountData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    };

    if (onCreateAccount) {
      onCreateAccount(accountData);
    }

    const result = registerAccount(accountData);
    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    setStatusMessage(
      `¡Cuenta creada! Bienvenido/a, ${result.user.firstName}. Redirigiendo a tu perfil...`,
    );
    navigate("/perfil");
  }

  function onInvalid() {
    setStatusMessage("");
    setErrorMessage("Revisá los campos marcados antes de continuar.");
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
            aria-label="Tienda Liebre, inicio"
          >
            <img
              src={logoWhite}
              alt="Tienda Liebre"
              className="create-account-brand__logo"
            />
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
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            noValidate
          >
            <div className="create-account-fields create-account-fields--two-columns">
              <div className="create-account-field">
                <label htmlFor="firstName">Nombre</label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Tu nombre"
                  aria-invalid={Boolean(errors.firstName)}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <span className="create-account-field-error">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className="create-account-field">
                <label htmlFor="lastName">Apellido</label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Tu apellido"
                  aria-invalid={Boolean(errors.lastName)}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <span className="create-account-field-error">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            <div className="create-account-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@correo.com"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <span className="create-account-field-error">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="create-account-field">
              <label htmlFor="phone">
                Teléfono <span>(opcional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+54 9 381 ..."
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />
              {errors.phone && (
                <span className="create-account-field-error">
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div className="create-account-fields create-account-fields--two-columns">
              <div className="create-account-field">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mín. 8 caracteres, letra y número"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                {errors.password && (
                  <span className="create-account-field-error">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="create-account-field">
                <label htmlFor="passwordConfirmation">
                  Confirmar contraseña
                </label>
                <input
                  id="passwordConfirmation"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repetí tu contraseña"
                  aria-invalid={Boolean(errors.passwordConfirmation)}
                  {...register("passwordConfirmation")}
                />
                {errors.passwordConfirmation && (
                  <span className="create-account-field-error">
                    {errors.passwordConfirmation.message}
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
                <input
                  type="checkbox"
                  aria-invalid={Boolean(errors.terms)}
                  {...register("terms")}
                />
                <span>
                  Acepto los términos y condiciones y la política de privacidad.
                </span>
              </label>
              {errors.terms && (
                <span className="create-account-field-error">
                  {errors.terms.message}
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
