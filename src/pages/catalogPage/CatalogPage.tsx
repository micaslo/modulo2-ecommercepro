import { useState } from "react";
import { Link } from "react-router-dom";
import { getCoverImage } from "../../data/productMedia";
import { getProductDetails } from "../../data/productDetails";
import { getProductPath } from "../../utils/productRoute";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import {
  useCatalogFilter,
  type CatalogSortOption,
  type CatalogStockFilter,
} from "../../hooks/useCatalogFilter";
import { useProducts } from "../../hooks/useProducts";
import { useWishlist } from "../../hooks/useWishlist";
import type { Product } from "../../types/productMedia";
import { HeartIcon } from "../../components/productPage/productIcons/ProductIcons";
import "./CatalogPage.css";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function CatalogPage() {
  const { products } = useProducts();
  const { isAdmin } = useAuth();
  const { canUseWishlist, isFavorite, toggle } = useWishlist();
  const { addToCart } = useCart();
  const [feedback, setFeedback] = useState<{
    productId: string;
    message: string;
    isError?: boolean;
  } | null>(null);

  const {
    categories,
    searchQuery,
    selectedCategory,
    stockFilter,
    sortBy,
    filteredProducts,
    hasActiveFilters,
    setSearchQuery,
    setSelectedCategory,
    setStockFilter,
    setSortBy,
    clearFilters,
  } = useCatalogFilter(products);

  const handleQuickAdd = (product: Product) => {
    const details = getProductDetails(product);
    const isCar =
      details.productKind === "car" || product.category === "Vehículos";
    const result = addToCart({
      product,
      quantity: 1,
      image: getCoverImage(product),
      originalPrice: details.originalPrice,
      isCar,
    });

    if (!result.ok) {
      const reasonMessage =
        result.reason === "car_limit"
          ? "Solo podés reservar 1 unidad de este vehículo."
          : result.reason === "stock_limit"
            ? "Ya alcanzaste el límite de stock disponible en tu carrito."
            : "Producto sin stock disponible.";
      setFeedback({ productId: product.id, message: reasonMessage, isError: true });
      return;
    }

    setFeedback({
      productId: product.id,
      message: "Agregado al carrito.",
    });
  };

  return (
    <main className="catalogPage">
      <div className="catalogContainer">
        <header className="catalogHeader">
          <div>
            <span className="catalogEyebrow">CATÁLOGO DINÁMICO</span>
            <h1>Explorá todos nuestros productos</h1>
            <p>
              Filtrá en tiempo real por nombre, código o categoría y consultá el
              detalle completo de cada artículo.
            </p>
          </div>
          {isAdmin && (
            <Link to="/admin" className="btnSecondary catalogAdminBtn">
              Gestionar inventario
            </Link>
          )}
        </header>

        <section className="catalogControls" aria-label="Filtros de catálogo">
          <div className="catalogSearchRow">
            <label className="catalogSearch">
              <span className="catalogSrOnly">Buscar por nombre o código</span>
              <span className="catalogSearchIcon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar por nombre, código o descripción..."
              />
              {searchQuery && (
                <button
                  type="button"
                  className="catalogInputClear"
                  onClick={() => setSearchQuery("")}
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </label>

            <label className="catalogSelectBox">
              <span className="catalogSrOnly">Filtrar por categoría</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "Todas" ? "Todas las categorías" : cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="catalogSelectBox">
              <span className="catalogSrOnly">Filtrar por stock</span>
              <select
                value={stockFilter}
                onChange={(event) =>
                  setStockFilter(event.target.value as CatalogStockFilter)
                }
              >
                <option value="all">Todo el stock</option>
                <option value="in-stock">Disponibles</option>
                <option value="out-of-stock">Sin stock</option>
              </select>
            </label>

            <label className="catalogSelectBox">
              <span className="catalogSrOnly">Ordenar resultados</span>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as CatalogSortOption)
                }
              >
                <option value="featured">Orden destacado</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre: A a Z</option>
                <option value="stock-desc">Mayor stock</option>
              </select>
            </label>
          </div>

          <div
            className="catalogCategoryChips"
            role="group"
            aria-label="Categorías rápidas"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`catalogChip ${active ? "isActive" : ""}`}
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="catalogMetaBar">
            <p className="catalogCount" aria-live="polite">
              Mostrando <strong>{filteredProducts.length}</strong> de{" "}
              <strong>{products.length}</strong>{" "}
              {products.length === 1 ? "producto" : "productos"}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                className="catalogResetBtn"
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </section>

        {filteredProducts.length === 0 ? (
          <section className="catalogEmpty">
            <h2>No encontramos productos con esos filtros</h2>
            <p>
              Probá con otro término de búsqueda o restablecé las categorías para
              ver todo el inventario disponible.
            </p>
            <button
              type="button"
              className="btnPrimary"
              onClick={clearFilters}
            >
              Ver todos los productos
            </button>
          </section>
        ) : (
          <section className="catalogGrid" aria-label="Listado de productos">
            {filteredProducts.map((product) => {
              const cover = getCoverImage(product);
              const saved = isFavorite(product.id);
              const outOfStock = product.stock <= 0;
              const productFeedback =
                feedback?.productId === product.id ? feedback : null;

              return (
                <article key={product.id} className="catalogCard">
                  <div className="catalogCardMedia">
                    <Link
                      to={getProductPath(product)}
                      className="catalogCardImgLink"
                      aria-label={`Ver detalle de ${product.name}`}
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt={product.name}
                          loading="lazy"
                          className="catalogCardImg"
                        />
                      ) : (
                        <span className="catalogCardPlaceholder" aria-hidden="true">
                          Sin imagen
                        </span>
                      )}
                    </Link>

                    {canUseWishlist && (
                      <button
                        type="button"
                        className={`catalogFavBtn ${saved ? "isActive" : ""}`}
                        onClick={() => toggle(product.id)}
                        aria-label={
                          saved
                            ? `Quitar ${product.name} de favoritos`
                            : `Agregar ${product.name} a favoritos`
                        }
                        aria-pressed={saved}
                      >
                        <HeartIcon filled={saved} size={18} />
                      </button>
                    )}

                    <span className="catalogCardCategory">
                      {product.category}
                    </span>
                  </div>

                  <div className="catalogCardBody">
                    {product.code && (
                      <span className="catalogCardCode">{product.code}</span>
                    )}

                    <h2 className="catalogCardTitle">
                      <Link to={getProductPath(product)}>{product.name}</Link>
                    </h2>

                    <p className="catalogCardDescription">
                      {product.description}
                    </p>

                    <div className="catalogCardPricing">
                      <strong className="catalogCardPrice">
                        {formatPrice(product.price)}
                      </strong>
                      <span
                        className={`catalogStockBadge ${
                          outOfStock ? "isOut" : "isIn"
                        }`}
                      >
                        {outOfStock
                          ? "Sin stock"
                          : `Stock: ${product.stock} u.`}
                      </span>
                    </div>

                    {productFeedback && (
                      <p
                        className={`catalogCardFeedback ${
                          productFeedback.isError ? "isError" : "isOk"
                        }`}
                        role="status"
                      >
                        {productFeedback.message}{" "}
                        {!productFeedback.isError && (
                          <Link to="/cart">Ver carrito</Link>
                        )}
                      </p>
                    )}

                    <div className="catalogCardActions">
                      <Link
                        to={getProductPath(product)}
                        className="catalogBtnDetail"
                      >
                        Ver detalle
                      </Link>
                      <button
                        type="button"
                        className="catalogBtnCart"
                        disabled={outOfStock}
                        onClick={() => handleQuickAdd(product)}
                      >
                        {outOfStock ? "Agotado" : "Agregar"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
