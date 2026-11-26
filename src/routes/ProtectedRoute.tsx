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
      <main className="protected-route">
        <section className="protected-card" aria-labelledby="protected-title">
          <span className="protected-eyebrow">ACCESO PROTEGIDO</span>
          <h1 id="protected-title">
            Necesitás iniciar sesión para ver {sectionName}
          </h1>
          <p className="protected-copy">
            Esta vista está reservada para usuarios con sesión activa. Iniciá
            sesión con tu cuenta o registrate como invitado para continuar.
          </p>

          <div className="protected-actions">
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="btn-primary protected-link-btn"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/crear-cuenta"
              className="btn-secondary protected-link-btn"
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
      <main className="protected-route">
        <section className="protected-card" aria-labelledby="forbidden-title">
          <span className="protected-eyebrow protected-eyebrow--danger">
            PERMISO DENEGADO
          </span>
          <h1 id="forbidden-title">Acceso exclusivo para Administradores</h1>
          <p className="protected-copy">
            Tu sesión actual corresponde al perfil <strong>Invitado</strong> (
            {user.email}). Para acceder al Panel de Administración necesitás
            iniciar sesión con una cuenta de <strong>Administrador</strong>.
          </p>

          <div className="protected-actions">
            <Link to="/perfil" className="btn-primary protected-link-btn">
              Volver a mi perfil
            </Link>
            <button
              type="button"
              className="btn-secondary protected-link-btn"
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
