import "./CreateAnAccount.css";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import logoWhite from "../../assets/images/logo/tl-imagotype-white.webp";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../schemas/authSchema";

type CreateAccountData = {
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
  const location = useLocation();
  const fromPath = (location.state as { from?: string } | null)?.from;

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

    const target = fromPath && fromPath !== "/admin" ? fromPath : "/perfil";
    setStatusMessage(
      `¡Cuenta creada! Bienvenido/a, ${result.user.firstName}. Redirigiendo...`,
    );
    navigate(target, { replace: true });
  }

  function onInvalid() {
    setStatusMessage("");
    setErrorMessage("Revisá los campos marcados antes de continuar.");
  }

  return (
    <main className="createAccountPage">
      <section
        className="createAccountCard"
        aria-labelledby="create-account-title"
      >
        <aside className="createAccountAside">
          <Link
            className="createAccountBrand"
            to="/"
            aria-label="Tienda Liebre, inicio"
          >
            <img
              src={logoWhite}
              alt="Tienda Liebre"
              className="createAccountBrandLogo"
            />
          </Link>

          <div className="createAccountAsideCopy">
            <p className="createAccountEyebrow">Bienvenido a tu tienda</p>
            <h1>Todo lo que buscas, en un solo lugar.</h1>
            <p>
              Creá tu cuenta de usuario para guardar favoritos y disfrutar una
              experiencia de compra más simple.
            </p>
          </div>

          <div className="createAccountDecoration" aria-hidden="true">
            <span>+</span>
            <span>✦</span>
            <span>+</span>
          </div>
        </aside>

        <div className="createAccountContent">
          <header className="createAccountHeading">
            <p className="createAccountEyebrow">Empezá ahora</p>
            <h2 id="create-account-title">Crear cuenta</h2>
            <p>Completá tus datos para crear tu cuenta de usuario.</p>
          </header>

          <form
            className="createAccountForm"
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            noValidate
          >
            <div className="createAccountFields createAccountFieldsTwoColumns">
              <div className="createAccountField">
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
                  <span className="createAccountFieldError">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className="createAccountField">
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
                  <span className="createAccountFieldError">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            <div className="createAccountField">
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
                <span className="createAccountFieldError">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="createAccountField">
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
                <span className="createAccountFieldError">
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div className="createAccountFields createAccountFieldsTwoColumns">
              <div className="createAccountField">
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
                  <span className="createAccountFieldError">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="createAccountField">
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
                  <span className="createAccountFieldError">
                    {errors.passwordConfirmation.message}
                  </span>
                )}
              </div>
            </div>

            <button
              className="createAccountPasswordToggle"
              type="button"
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? "Ocultar contraseñas" : "Mostrar contraseñas"}
            </button>

            <div className="createAccountField">
              <label className="createAccountTerms">
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
                <span className="createAccountFieldError">
                  {errors.terms.message}
                </span>
              )}
            </div>

            {errorMessage && (
              <p
                className="createAccountMessage createAccountMessageError"
                role="alert"
              >
                {errorMessage}
              </p>
            )}
            {statusMessage && (
              <p
                className="createAccountMessage createAccountMessageSuccess"
                role="status"
              >
                {statusMessage}
              </p>
            )}

            <button className="createAccountSubmit" type="submit">
              Crear cuenta
            </button>
          </form>

          <p className="createAccountLogin">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" state={fromPath ? { from: fromPath } : undefined}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
