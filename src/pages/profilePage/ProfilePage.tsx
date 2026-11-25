import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import {
  extractZodFieldErrors,
  profileUpdateSchema,
  type ProfileUpdateValues,
} from "../../schemas/authSchema";
import "./ProfilePage.css";

function formatDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

interface ProfileEditFormProps {
  initialFirstName: string;
  initialLastName: string;
  initialPhone: string;
  onSave: (values: ProfileUpdateValues) => { ok: boolean; error?: string };
}

function ProfileEditForm({
  initialFirstName,
  initialLastName,
  initialPhone,
  onSave,
}: ProfileEditFormProps) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [phone, setPhone] = useState(initialPhone);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileUpdateValues, string>>
  >({});
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    const parsed = profileUpdateSchema.safeParse({ firstName, lastName, phone });
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

    setStatus({
      type: "success",
      message: "Datos del perfil actualizados correctamente.",
    });
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
      <div className="profile-form-grid">
        <div className="profile-field">
          <label htmlFor="profile-firstName">Nombre</label>
          <input
            id="profile-firstName"
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setErrors((prev) => ({ ...prev, firstName: undefined }));
            }}
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
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setErrors((prev) => ({ ...prev, lastName: undefined }));
            }}
            aria-invalid={Boolean(errors.lastName)}
          />
          {errors.lastName && (
            <span className="profile-field-error">{errors.lastName}</span>
          )}
        </div>
      </div>

      <div className="profile-field">
        <label htmlFor="profile-phone">Teléfono</label>
        <input
          id="profile-phone"
          type="tel"
          value={phone}
          placeholder="+54 9 381 ..."
          onChange={(e) => {
            setPhone(e.target.value);
            setErrors((prev) => ({ ...prev, phone: undefined }));
          }}
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone && (
          <span className="profile-field-error">{errors.phone}</span>
        )}
      </div>

      {status && (
        <p
          className={`profile-status profile-status--${status.type}`}
          role="status"
        >
          {status.message}
        </p>
      )}

      <button type="submit" className="btn-primary profile-save-btn">
        Guardar cambios
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const { user, isAdmin, logout, updateProfile, loginAsDemo } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { totalItems: cartCount } = useCart();
  const navigate = useNavigate();

  if (!user) return null;

  const initials =
    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() || "U";
  const roleLabel = isAdmin ? "Administrador" : "Invitado";

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
              <div className="profile-badges">
                <span
                  className={`profile-role-badge ${
                    isAdmin ? "is-admin" : "is-guest"
                  }`}
                >
                  Perfil {roleLabel}
                </span>
                <span className="profile-session-badge">Sesión persistente activa</span>
              </div>
              <h1>{user.name}</h1>
              <p className="profile-email">{user.email}</p>
              <p className="profile-member-since">
                Miembro desde {formatDate(user.createdAt)}
              </p>
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

          <Link
            to={isAdmin ? "/admin" : "/productos"}
            className="profile-stat-card"
          >
            <span className="profile-stat-label">Rol de la sesión</span>
            <strong className="profile-stat-value">{roleLabel}</strong>
            <span className="profile-stat-hint">
              {isAdmin ? "Abrir panel CRUD y usuarios →" : "Explorar catálogo →"}
            </span>
          </Link>
        </section>

        <div className="profile-layout">
          <section className="profile-panel" aria-labelledby="profile-edit-title">
            <header className="profile-panel-header">
              <h2 id="profile-edit-title">Datos personales</h2>
              <p>Actualizá tu nombre y teléfono asociados a esta cuenta.</p>
            </header>

            <ProfileEditForm
              key={user.id}
              initialFirstName={user.firstName}
              initialLastName={user.lastName}
              initialPhone={user.phone ?? ""}
              onSave={(values) => {
                const res = updateProfile(values);
                return res.ok ? { ok: true } : { ok: false, error: res.error };
              }}
            />
          </section>

          <aside className="profile-sidebar">
            <section className="profile-panel">
              <header className="profile-panel-header">
                <h2>Accesos rápidos</h2>
                <p>Navegá directo a las secciones habilitadas para tu perfil.</p>
              </header>

              <nav className="profile-quick-links" aria-label="Accesos rápidos">
                <Link to="/productos" className="profile-quick-link">
                  <span>Catálogo dinámico</span>
                  <small>Filtrá productos por nombre y categoría</small>
                </Link>
                <Link to="/favoritos" className="profile-quick-link">
                  <span>Mi lista de deseos</span>
                  <small>Visible solo con tu sesión iniciada</small>
                </Link>
                <Link to="/cart" className="profile-quick-link">
                  <span>Mi carrito</span>
                  <small>Revisá tus productos y finalizá tu compra</small>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="profile-quick-link profile-quick-link--admin"
                  >
                    <span>Panel de Administración</span>
                    <small>CRUD de productos, inventario y usuarios</small>
                  </Link>
                )}
              </nav>
            </section>

            <section className="profile-panel profile-demo-panel">
              <header className="profile-panel-header">
                <h2>Cambiar perfil (Demo)</h2>
                <p>
                  Alterná entre Invitado y Administrador para probar los permisos y
                  la persistencia de sesión.
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
