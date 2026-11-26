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
      <div className="navbarTop">
        <div className="navbarTopInner">
          <div className="navbarTopLeft">
            <span className="navbarPromo">LIEBRE25 · 25% OFF</span>
            <span className="navbarTopItem">
              ENVÍOS GRATIS A TODO EL PAÍS CON COMPRAS SUPERIORES A $300.000
            </span>
          </div>
        </div>
      </div>

      <div className="navbar__main">
        <div className="navbarMainInner">
          <Link
            to="/"
            className="navbarBrand"
            aria-label="Tienda Liebre, ir al inicio"
            onClick={closeMenu}
          >
            <img
              src={logoDarkText}
              alt="Tienda Liebre"
              className="navbarLogo navbarLogoLight"
            />
            <img
              src={logoWhiteText}
              alt="Tienda Liebre"
              className="navbarLogo navbarLogoDark"
            />
          </Link>

          <form className="navbarSearch" onSubmit={handleSearch} role="search">
            <div className="navbarSelectWrap">
              <select
                className="navbarSelect"
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
              <svg
                className="navbarSelectChevron"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="search"
              className="navbarInput"
              placeholder="Buscar productos, marcas y más..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar productos"
            />
            <button type="submit" className="navbarSearchBtn">
              Buscar
            </button>
          </form>

          <div className="navbarActions">
            <ThemeToggle className="navbarThemeToggle" />

            {isAuthenticated && (
              <Link
                to="/favoritos"
                className="navbarIconBtn"
                aria-label={`Favoritos, ${activeWishlistCount}`}
                onClick={closeMenu}
              >
                ♡
                {activeWishlistCount > 0 && (
                  <span className="navbarBadge navbarBadgeViolet">
                    {activeWishlistCount}
                  </span>
                )}
              </Link>
            )}

            <Link
              to="/cart"
              className="navbarCart"
              aria-label={`Carrito, ${cartCount} productos`}
              onClick={closeMenu}
            >
              <span className="navbarCartIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 5h2l2.2 10.2a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L20.5 8H6.2" />
                  <circle cx="9.5" cy="19.5" r="1.3" />
                  <circle cx="17" cy="19.5" r="1.3" />
                </svg>
                {cartCount > 0 && (
                  <span className="navbarBadge navbarBadgePrimary">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="navbarCartTotal">{formattedTotal}</span>
            </Link>

            <Link
              to={isAuthenticated ? "/perfil" : "/login"}
              className="navbarUser"
              onClick={closeMenu}
              aria-label={
                displayName
                  ? `Perfil de ${displayName} (${isAdmin ? "Administrador" : "Invitado"})`
                  : "Iniciar sesión"
              }
            >
              <span className="navbarAvatar">
                {displayName ? (
                  displayName.charAt(0).toUpperCase()
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8.5" r="3.5" />
                    <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
                  </svg>
                )}
              </span>
              <span className="navbarUserText navbarHideMd">
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
              className="navbarToggle"
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
        className={`navbarNav ${menuOpen ? "navbarNavOpen" : ""}`}
        aria-label="Navegación principal"
      >
        <div className="navbarNavInner">
          <ul className="navbarLinks">
            {baseNavLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      "navbarLink",
                      link.highlight ? "navbarLinkPill" : "",
                      isActive ? "navbarLinkActive" : "",
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
                      "navbarLink",
                      isActive ? "navbarLinkActive" : "",
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
                      "navbarLink",
                      isActive ? "navbarLinkActive" : "",
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
                      "navbarLink",
                      isActive ? "navbarLinkActive" : "",
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

          <div className="navbarPerks">
            <span>↩ Devoluciones gratis por 30 días</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
