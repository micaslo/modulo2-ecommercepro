import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useWishlist } from "../../hooks/useWishlist";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import logoDarkText from "../../assets/images/logo/tl-imagotype-black.webp";
import logoWhiteText from "../../assets/images/logo/tl-imagotype-white.webp";
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
  { label: "Nosotros", to: "/sobrenosotros" },
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

  const handleSearch = (e: SubmitEvent<HTMLFormElement>) => {
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
            <span className="navbar__promo">LIEBRE25 · 25% OFF</span>
            <span className="navbar__top-item">
              ENVÍOS GRATIS A TODO EL PAÍS CON COMPRAS SUPERIORES A $300.000
            </span>
          </div>
        </div>
      </div>

      <div className="navbar__main">
        <div className="navbar__main-inner">
          <Link
            to="/"
            className="navbar__brand"
            aria-label="Tienda Liebre, ir al inicio"
            onClick={closeMenu}
          >
            <img
              src={logoDarkText}
              alt="Tienda Liebre"
              className="navbar__logo navbar__logo--light"
            />
            <img
              src={logoWhiteText}
              alt="Tienda Liebre"
              className="navbar__logo navbar__logo--dark"
            />
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
              Buscar
            </button>
          </form>

          <div className="navbar__actions">
            <ThemeToggle className="navbar__theme-toggle" />

            {isAuthenticated && (
              <Link
                to="/favoritos"
                className="navbar__icon-btn"
                aria-label={`Favoritos, ${activeWishlistCount}`}
                onClick={closeMenu}
              >
                ♡
                {activeWishlistCount > 0 && (
                  <span className="navbar__badge navbar__badge--violet">
                    {activeWishlistCount}
                  </span>
                )}
              </Link>
            )}

            <Link
              to="/cart"
              className="navbar__cart"
              aria-label={`Carrito, ${cartCount} productos`}
              onClick={closeMenu}
            >
              <span className="navbar__cart-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 5h2l2.2 10.2a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L20.5 8H6.2" />
                  <circle cx="9.5" cy="19.5" r="1.3" />
                  <circle cx="17" cy="19.5" r="1.3" />
                </svg>
                {cartCount > 0 && (
                  <span className="navbar__badge navbar__badge--primary">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="navbar__cart-total">{formattedTotal}</span>
            </Link>

            <Link
              to={isAuthenticated ? "/perfil" : "/login"}
              className="navbar__user"
              onClick={closeMenu}
              aria-label={
                displayName
                  ? `Perfil de ${displayName} (${isAdmin ? "Administrador" : "Invitado"})`
                  : "Iniciar sesión"
              }
            >
              <span className="navbar__avatar">
                {displayName ? (
                  displayName.charAt(0).toUpperCase()
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8.5" r="3.5" />
                    <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
                  </svg>
                )}
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
              type="button"
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
                    ]
                      .filter(Boolean)
                      .join(" ")
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
                    ]
                      .filter(Boolean)
                      .join(" ")
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
                    ]
                      .filter(Boolean)
                      .join(" ")
                  }
                >
                  Panel Admin
                </NavLink>
              </li>
            )}

            {!isAuthenticated && (
              <li>
                <NavLink
                  to="/crear-cuenta"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      "navbar__link",
                      isActive ? "navbar__link--active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")
                  }
                >
                  Registrarse
                </NavLink>
              </li>
            )}
          </ul>

          <div className="navbar__perks">
            <span>↩ Devoluciones gratis por 30 días</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
