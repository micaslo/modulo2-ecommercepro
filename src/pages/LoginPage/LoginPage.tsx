import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import logoDarkText from "../../assets/images/logo/tl-imagotype-black.webp";
import logoWhiteText from "../../assets/images/logo/tl-imagotype-white.webp";
import logoIsotype from "../../assets/images/logo/tl-isotype.webp";
import "./LoginPage.css";

function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [noSoyRobot, setNoSoyRobot] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"error" | "info">("error");

  const mostrarMensaje = (
    texto: string,
    tipo: "error" | "info" = "error"
  ) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");

    if (!correo.trim() || !contrasena.trim()) {
      mostrarMensaje("Completá todos los campos.");
      return;
    }

    if (!noSoyRobot) {
      mostrarMensaje("Confirmá que no sos un robot.");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(correo)) {
      mostrarMensaje("Ingresá un correo electrónico válido.");
      return;
    }

    if (contrasena.length < 6) {
      mostrarMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    mostrarMensaje(
      "Los datos son válidos. Falta conectar el servicio de inicio de sesión.",
      "info"
    );
  };

  const recuperarContrasena = () => {
    if (!correo.trim()) {
      mostrarMensaje("Primero ingresá tu correo electrónico.");
      return;
    }

    mostrarMensaje(
      "La recuperación de contraseña todavía no está conectada.",
      "info"
    );
  };

  const accesoGoogle = () => {
    mostrarMensaje(
      "El acceso con Google necesita configurarse con su servicio de autenticación.",
      "info"
    );
  };

  return (
    <main className="login-page">
      <header className="login-header">
        <Link to="/" className="login-back" aria-label="Volver al inicio">
          ‹
        </Link>

        <Link to="/" className="login-header-logo" aria-label="Tienda Liebre, inicio">
          <img
            src={logoDarkText}
            alt="Tienda Liebre"
            className="login-header-logo__img login-header-logo__img--light"
          />
          <img
            src={logoWhiteText}
            alt="Tienda Liebre"
            className="login-header-logo__img login-header-logo__img--dark"
          />
        </Link>

        <span className="login-header-title">Iniciar sesión</span>

        <div className="login-header-actions">
          <ThemeToggle />
          <div className="login-user-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c0-4 2.8-6 7-6s7 2 7 6" />
            </svg>
          </div>
        </div>
      </header>

      <section className="login-content">
        <div className="login-intro">
          <div className="login-brand-icon" aria-hidden="true">
            <img src={logoIsotype} alt="" />
          </div>

          <h1>¡Bienvenido de nuevo!</h1>

          <p>
            Ingresá tus credenciales para acceder
            <br className="desktop-break" /> a tu cuenta de Tienda Liebre.
          </p>
        </div>

        <section className="login-card">
          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email">Correo electrónico</label>

              <div className="login-input-wrapper">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 7 9-7" />
                </svg>

                <input
                  id="login-email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Contraseña</label>

              <div className="login-input-wrapper">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <path d="M12 14v3" />
                </svg>

                <input
                  id="login-password"
                  type={mostrarContrasena ? "text" : "password"}
                  placeholder="Ingresá tu contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  aria-label={
                    mostrarContrasena
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  title={
                    mostrarContrasena
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {mostrarContrasena ? (
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
            </div>

            <div className="login-captcha">
              <label className="login-captcha-label">
                <input
                  type="checkbox"
                  checked={noSoyRobot}
                  onChange={(e) => setNoSoyRobot(e.target.checked)}
                />

                <span className="login-captcha-text">No soy un robot</span>
              </label>

              <div className="login-captcha-brand">
                <span className="captcha-check">✓</span>
                <small>Verificación</small>
              </div>
            </div>

            <div className="login-options">
              <button
                type="button"
                className="login-forgot"
                onClick={recuperarContrasena}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {mensaje && (
              <div className={`login-message ${tipoMensaje}`} role="alert">
                {mensaje}
              </div>
            )}

            <button type="submit" className="login-submit">
              Iniciar sesión
              <span aria-hidden="true">→</span>
            </button>

            <div className="login-divider">
              <span></span>
              <p>O continuá con</p>
              <span></span>
            </div>

            <div className="login-social">
              <button
                type="button"
                onClick={accesoGoogle}
                aria-label="Ingresar con Google"
              >
                <FcGoogle size={26} />
              </button>
            </div>
          </form>
        </section>

        <div className="login-register">
          <span>¿No tenés una cuenta?</span>

          <Link to="/crear-cuenta">
            Registrate <span aria-hidden="true">›</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
