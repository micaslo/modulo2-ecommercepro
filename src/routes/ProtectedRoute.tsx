import type { ReactNode } from "react";
import { Link } from "react-router-dom";
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
  const { user, isAuthenticated, loginAsDemo } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <main className="protected-route">
        <section className="protected-card" aria-labelledby="protected-title">
          <span className="protected-eyebrow">ACCESO PROTEGIDO</span>
          <h1 id="protected-title">Necesitás iniciar sesión para ver {sectionName}</h1>
          <p className="protected-copy">
            Esta vista está reservada para usuarios con sesión activa. Podés crear una cuenta
            de invitado ahora mismo o probar un perfil simulado mientras se integra la página de
            inicio de sesión.
          </p>

          <div className="protected-actions">
            <Link to="/registro" className="btn-primary protected-link-btn">
              Crear cuenta de invitado
            </Link>
            <Link to="/productos" className="btn-secondary protected-link-btn">
              Explorar catálogo
            </Link>
          </div>

          <div className="protected-demo">
            <p className="protected-demo-title">
              Simulación rápida de sesión (para pruebas de perfil)
            </p>
            <div className="protected-demo-buttons">
              <button
                type="button"
                className="protected-demo-btn"
                onClick={() => loginAsDemo("guest")}
              >
                Ingresar como Invitado (Demo)
              </button>
              <button
                type="button"
                className="protected-demo-btn protected-demo-btn--admin"
                onClick={() => loginAsDemo("admin")}
              >
                Ingresar como Administrador (Demo)
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <main className="protected-route">
        <section className="protected-card" aria-labelledby="forbidden-title">
          <span className="protected-eyebrow protected-eyebrow--danger">
            PERMISO DENEGADO
          </span>
          <h1 id="forbidden-title">Acceso exclusivo para Administradores</h1>
          <p className="protected-copy">
            Tu sesión actual corresponde al perfil <strong>Invitado</strong> ({user.email}).
            Para acceder al Panel de Administración necesitás permisos de{" "}
            <strong>Administrador</strong>.
          </p>

          <div className="protected-actions">
            <Link to="/perfil" className="btn-primary protected-link-btn">
              Volver a mi perfil
            </Link>
            <Link to="/productos" className="btn-secondary protected-link-btn">
              Ir al catálogo
            </Link>
          </div>

          <div className="protected-demo">
            <p className="protected-demo-title">
              ¿Querés probar el panel de administración en modo demo?
            </p>
            <div className="protected-demo-buttons">
              <button
                type="button"
                className="protected-demo-btn protected-demo-btn--admin"
                onClick={() => loginAsDemo("admin")}
              >
                Cambiar a sesión Administrador (Demo)
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
