import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ThemeToggle from "../../components/themeToggle/ThemeToggle";
import logoDarkText from "../../assets/images/logo/tl-imagotype-black.webp";
import logoWhiteText from "../../assets/images/logo/tl-imagotype-white.webp";
import logoIsotype from "../../assets/images/logo/tl-isotype.webp";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../../schemas/authSchema";
import "./LoginPage.css";

interface LoginLocationState {
  from?: string;
}

function LoginPage() {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as LoginLocationState | null)?.from;

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "info">("error");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      notARobot: false,
    },
  });

  if (isAuthenticated && user) {
    const defaultTarget = user.role === "admin" ? "/admin" : "/perfil";
    const target =
      fromPath && (fromPath !== "/admin" || user.role === "admin")
        ? fromPath
        : defaultTarget;
    return <Navigate to={target} replace />;
  }

  const showMessage = (
    text: string,
    type: "error" | "info" = "error",
  ) => {
    setMessage(text);
    setMessageType(type);
  };

  const onSubmit = (values: LoginFormValues) => {
    setMessage("");

    const result = login(values.email, values.password);
    if (!result.ok) {
      showMessage(result.error, "error");
      return;
    }

    const defaultTarget = result.user.role === "admin" ? "/admin" : "/perfil";
    const target =
      fromPath && (fromPath !== "/admin" || result.user.role === "admin")
        ? fromPath
        : defaultTarget;

    navigate(target, { replace: true });
  };

  const onInvalid = () => {
    setMessage("");
  };

  const handleForgotPassword = () => {
    if (!getValues("email").trim()) {
      showMessage("Primero ingresá tu correo electrónico.");
      return;
    }

    showMessage(
      "La recuperación de contraseña todavía no está conectada.",
      "info",
    );
  };

  return (
    <main className="loginPage">
      <header className="loginHeader">
        <Link to="/" className="loginBack" aria-label="Volver al inicio">
          ‹
        </Link>

        <Link to="/" className="loginHeaderLogo" aria-label="Tienda Liebre, inicio">
          <img
            src={logoDarkText}
            alt="Tienda Liebre"
            className="loginHeaderLogoImg loginHeaderLogoImgLight"
          />
          <img
            src={logoWhiteText}
            alt="Tienda Liebre"
            className="loginHeaderLogoImg loginHeaderLogoImgDark"
          />
        </Link>

        <span className="loginHeaderTitle">Iniciar sesión</span>

        <div className="loginHeaderActions">
          <ThemeToggle />
          <div className="loginUserIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c0-4 2.8-6 7-6s7 2 7 6" />
            </svg>
          </div>
        </div>
      </header>

      <section className="loginContent">
        <div className="loginIntro">
          <div className="loginBrandIcon" aria-hidden="true">
            <img src={logoIsotype} alt="" />
          </div>

          <h1>¡Bienvenido de nuevo!</h1>

          <p>
            Ingresá tus credenciales para acceder
            <br className="desktopBreak" /> a tu cuenta de Tienda Liebre.
          </p>
        </div>

        <section className="loginCard">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
            <div className="loginField">
              <label htmlFor="login-email">Correo electrónico</label>

              <div
                className={`loginInputWrapper ${errors.email ? "isInvalid" : ""}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 7 9-7" />
                </svg>

                <input
                  id="login-email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <span className="loginFieldError" role="alert">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="loginField">
              <label htmlFor="login-password">Contraseña</label>

              <div
                className={`loginInputWrapper ${errors.password ? "isInvalid" : ""}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <path d="M12 14v3" />
                </svg>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresá tu contraseña"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />

                <button
                  type="button"
                  className="loginEye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  title={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9 7-.2 1-1 2.2-2.1 3.3" />
                      <path d="M6.2 6.2C3.8 7.7 2.3 10 2 12c.5 2.5 4 7 10 7 1.2 0 2.3-.2 3.3-.6" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="loginFieldError" role="alert">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="loginField">
              <div
                className={`loginCaptcha ${errors.notARobot ? "isInvalid" : ""}`}
              >
                <label className="loginCaptchaLabel">
                  <input
                    type="checkbox"
                    aria-invalid={Boolean(errors.notARobot)}
                    {...register("notARobot")}
                  />

                  <span className="loginCaptchaText">No soy un robot</span>
                </label>

                <div className="loginCaptchaBrand">
                  <span className="captchaCheck">✓</span>
                  <small>Verificación</small>
                </div>
              </div>
              {errors.notARobot && (
                <span className="loginFieldError" role="alert">
                  {errors.notARobot.message}
                </span>
              )}
            </div>

            <div className="loginOptions">
              <button
                type="button"
                className="loginForgot"
                onClick={handleForgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {message && (
              <div className={`loginMessage ${messageType}`} role="alert">
                {message}
              </div>
            )}

            <button type="submit" className="loginSubmit">
              Iniciar sesión
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>

        <div className="loginRegister">
          <span>¿No tenés una cuenta?</span>

          <Link
            to="/crear-cuenta"
            state={fromPath ? { from: fromPath } : undefined}
          >
            Registrate <span aria-hidden="true">›</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
