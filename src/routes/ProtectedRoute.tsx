import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";
import "./ProtectedRoute.css";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  sectionName?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  sectionName = "esta sección",
}: ProtectedRouteProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <main className="protectedRoute">
        <section className="protectedCard" aria-labelledby="protected-title">
          <span className="protectedEyebrow">ACCESO PROTEGIDO</span>
          <h1 id="protected-title">
            Necesitás iniciar sesión para ver {sectionName}
          </h1>
          <p className="protectedCopy">
            Esta vista está reservada para usuarios con sesión activa. Iniciá
            sesión con tu cuenta o registrate como invitado para continuar.
          </p>

          <div className="protectedActions">
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="btnPrimary protectedLinkBtn"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/crear-cuenta"
              className="btnSecondary protectedLinkBtn"
            >
              Crear cuenta
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const handleSwitchAccount = () => {
      logout();
      navigate("/login", { state: { from: location.pathname } });
    };

    return (
      <main className="protectedRoute">
        <section className="protectedCard" aria-labelledby="forbidden-title">
          <span className="protectedEyebrow protectedEyebrowDanger">
            PERMISO DENEGADO
          </span>
          <h1 id="forbidden-title">Acceso exclusivo para Administradores</h1>
          <p className="protectedCopy">
            Tu sesión actual corresponde al perfil <strong>Invitado</strong> (
            {user.email}). Para acceder al Panel de Administración necesitás
            iniciar sesión con una cuenta de <strong>Administrador</strong>.
          </p>

          <div className="protectedActions">
            <Link to="/perfil" className="btnPrimary protectedLinkBtn">
              Volver a mi perfil
            </Link>
            <button
              type="button"
              className="btnSecondary protectedLinkBtn"
              onClick={handleSwitchAccount}
            >
              Ingresar con otra cuenta
            </button>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
