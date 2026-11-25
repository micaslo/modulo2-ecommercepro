import { useState } from "react";
import type { FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useWishlist } from "../../hooks/useWishlist";
import "./Navbar.css";

interface NavbarProps {
  cartCount?: number;
  cartTotal?: number;
  wishlistCount?: number;
  userName?: string | null;
}

const categories: string[] = [
  "Todas las categorías",
  "Tecnología",
  "Vehículos",
  "Cámaras y Accesorios",
  "Gaming",
  "Electrodomésticos",
  "Hogar",
  "Deportes",
  "Ropa",
  "Accesorios",
  "Belleza",
  "Mascotas",
];

const baseNavLinks = [
  { label: "Catálogo", to: "/productos", highlight: true },
  { label: "Más vendidos", to: "/mas-vendidos" },
  { label: "Revendedores", to: "/resellers" },
  { label: "Vender", to: "/sell-my-product" },
];

export default function Navbar({
  cartCount = 0,
  cartTotal = 0,
  wishlistCount,
  userName,
}: NavbarProps) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { count: personalWishlistCount } = useWishlist();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<string>(categories[0]);
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  const displayName = userName ?? user?.firstName ?? null;
  const activeWishlistCount = wishlistCount ?? personalWishlistCount;

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== categories[0]) params.set("categoria", category);
    navigate(`/productos?${params.toString()}`);
    closeMenu();
  };

  const formattedTotal = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(cartTotal);

  return (
    <header className="navbar">
      <div className="navbar__top">
        <div className="navbar__top-inner">
          <div className="navbar__top-left">
            <span className="navbar__top-item navbar__top-item--accent">
              🚚 ENVÍO EXPRESS A TODO EL PAÍS
            </span>
            <span className="navbar__top-item navbar__hide-md">
              ENVÍO ESTÁNDAR GRATIS EN COMPRAS MAYORES A $150.000
            </span>
          </div>
          <div className="navbar__top-right">
            <span className="navbar__promo">PROMO: DETODITO25 (-25%)</span>
            {!isAuthenticated && (
              <Link to="/registro" className="navbar__top-link navbar__hide-md">
                CREAR CUENTA
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="navbar__top-link navbar__hide-md">
                PANEL ADMIN
              </Link>
            )}
            <span className="navbar__top-link navbar__hide-md">ARS ($)</span>
          </div>
        </div>
      </div>

      <div className="navbar__main">
        <div className="navbar__main-inner">
          <Link to="/" className="navbar__brand" onClick={closeMenu}>
            <span className="navbar__brand-icon">D</span>
            <span className="navbar__brand-text">
              <strong>Detodito</strong>
              <small>MARKET</small>
            </span>
          </Link>

          <form className="navbar__search" onSubmit={handleSearch} role="search">
            <select
              className="navbar__select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Categoría"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="search"
              className="navbar__input"
              placeholder="Buscar productos, marcas y más..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar productos"
            />
            <button type="submit" className="navbar__search-btn">
              Explorar
            </button>
          </form>

          <div className="navbar__actions">
            {isAuthenticated && (
              <Link
                to="/favoritos"
                className="navbar__icon-btn"
                aria-label={`Favoritos, ${activeWishlistCount}`}
                onClick={closeMenu}
              >
                ♡
                {activeWishlistCount > 0 && (
                  <span className="navbar__badge">{activeWishlistCount}</span>
                )}
              </Link>
            )}

            <Link
              to="/cart"
              className="navbar__cart"
              aria-label={`Carrito, ${cartCount} productos`}
              onClick={closeMenu}
            >
              <span className="navbar__cart-icon">
                🛒
                {cartCount > 0 && (
                  <span className="navbar__badge navbar__badge--primary">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="navbar__cart-total">{formattedTotal}</span>
            </Link>

            <Link
              to="/perfil"
              className="navbar__user"
              onClick={closeMenu}
              aria-label={
                displayName
                  ? `Perfil de ${displayName} (${isAdmin ? "Administrador" : "Invitado"})`
                  : "Mi cuenta"
              }
            >
              <span className="navbar__avatar">
                {displayName ? displayName.charAt(0).toUpperCase() : "👤"}
              </span>
              <span className="navbar__user-text navbar__hide-md">
                <small>
                  {isAuthenticated
                    ? isAdmin
                      ? "Administrador"
                      : "Invitado"
                    : "Mi cuenta"}
                </small>
                <strong>{displayName ?? "Acceder"}</strong>
              </span>
            </Link>

            <button
              className="navbar__toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      <nav
        className={`navbar__nav ${menuOpen ? "navbar__nav--open" : ""}`}
        aria-label="Navegación principal"
      >
        <div className="navbar__nav-inner">
          <ul className="navbar__links">
            {baseNavLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      "navbar__link",
                      link.highlight ? "navbar__link--pill" : "",
                      isActive ? "navbar__link--active" : "",
                    ].join(" ")
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            {isAuthenticated && (
              <li>
                <NavLink
                  to="/favoritos"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      "navbar__link",
                      isActive ? "navbar__link--active" : "",
                    ].join(" ")
                  }
                >
                  Favoritos
                </NavLink>
              </li>
            )}

            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      "navbar__link",
                      isActive ? "navbar__link--active" : "",
                    ].join(" ")
                  }
                >
                  Panel Admin
                </NavLink>
              </li>
            )}

            {!isAuthenticated && (
              <li>
                <NavLink
                  to="/registro"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      "navbar__link",
                      isActive ? "navbar__link--active" : "",
                    ].join(" ")
                  }
                >
                  Registrarse
                </NavLink>
              </li>
            )}
          </ul>

          <div className="navbar__perks">
            <span>↩ Devoluciones por 30 días</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
