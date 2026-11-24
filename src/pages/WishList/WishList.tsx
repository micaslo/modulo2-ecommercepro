import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCoverImage } from "../../data/productMedia";
import { useProducts } from "../../hooks/useProducts";
import { getResellerFeaturedProducts } from "../../utils/resellerFeaturedProducts";
import {
  clearWishlist,
  getWishlistIds,
  removeWishlistProduct,
  seedWishlistIfMissing,
  WISHLIST_CHANGE_EVENT,
} from "../../utils/wishlist";
import "./WishList.css";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);

export default function WishList() {
  const { products } = useProducts();
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    seedWishlistIfMissing(
      getResellerFeaturedProducts(products).map((product) => product.id),
    ),
  );
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const refreshWishlist = () => setWishlistIds(getWishlistIds());
    window.addEventListener(WISHLIST_CHANGE_EVENT, refreshWishlist);
    window.addEventListener("storage", refreshWishlist);
    return () => {
      window.removeEventListener(WISHLIST_CHANGE_EVENT, refreshWishlist);
      window.removeEventListener("storage", refreshWishlist);
    };
  }, []);

  const savedProducts = wishlistIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product) => product !== undefined);

  const visibleProducts = savedProducts
    .filter((product) => {
      const matchesSearch = `${product.name} ${product.category}`
        .toLocaleLowerCase("es")
        .includes(search.trim().toLocaleLowerCase("es"));
      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && product.stock > 0) ||
        (availability === "unavailable" && product.stock <= 0);

      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === "price-ascending") return a.price - b.price;
      if (sortBy === "price-descending") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name, "es");
      return wishlistIds.indexOf(a.id) - wishlistIds.indexOf(b.id);
    });

  function handleClearWishlist() {
    clearWishlist();
    setWishlistIds([]);
  }

  return (
    <main className="wishlist-page">
      <section className="wishlist-container" aria-labelledby="wishlist-title">
        <header className="wishlist-header">
          <div>
            <span className="wishlist-eyebrow">TUS FAVORITOS</span>
            <h1 id="wishlist-title">Mi lista de deseos</h1>
            <p>Guardá productos para volver a encontrarlos cuando quieras.</p>
          </div>
          {savedProducts.length > 0 && (
            <button
              className="wishlist-clear"
              type="button"
              onClick={handleClearWishlist}
            >
              Vaciar lista
            </button>
          )}
        </header>

        {savedProducts.length === 0 ? (
          <div className="wishlist-empty">
            <span className="wishlist-empty-icon" aria-hidden="true">♡</span>
            <h2>Todavía no guardaste favoritos</h2>
            <p>Explorá los productos y tocá el corazón para guardarlos acá.</p>
            <Link className="wishlist-browse" to="/">
              Explorar productos
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlist-toolbar">
              <label className="wishlist-search">
                <span className="wishlist-visually-hidden">Buscar en tu lista</span>
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar en esta lista"
                />
              </label>

              <label className="wishlist-select-wrap">
                <span className="wishlist-visually-hidden">Filtrar por disponibilidad</span>
                <select
                  value={availability}
                  onChange={(event) => setAvailability(event.target.value)}
                >
                  <option value="all">Todos los productos</option>
                  <option value="available">Disponibles</option>
                  <option value="unavailable">Sin stock</option>
                </select>
              </label>

              <label className="wishlist-select-wrap">
                <span className="wishlist-visually-hidden">Ordenar productos</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="recent">Agregados recientemente</option>
                  <option value="price-ascending">Precio: menor a mayor</option>
                  <option value="price-descending">Precio: mayor a menor</option>
                  <option value="name">Nombre: A a Z</option>
                </select>
              </label>
            </div>

            <p className="wishlist-count" aria-live="polite">
              {visibleProducts.length} de {savedProducts.length} {savedProducts.length === 1 ? "producto guardado" : "productos guardados"}
            </p>

            {visibleProducts.length === 0 ? (
              <div className="wishlist-no-results">
                No encontramos productos que coincidan con esos filtros.
              </div>
            ) : (
              <div className="wishlist-list">
                {visibleProducts.map((product) => {
                const image = getCoverImage(product);

                return (
                  <article className="wishlist-item" key={product.id}>
                    <Link
                      className="wishlist-image-link"
                      to={`/product/${product.id}`}
                      aria-label={`Ver ${product.name}`}
                    >
                      {image ? (
                        <img className="wishlist-image" src={image} alt={product.name} />
                      ) : (
                        <span className="wishlist-image-placeholder" aria-hidden="true">♡</span>
                      )}
                    </Link>
                    <div className="wishlist-item-details">
                      <span className="wishlist-category">{product.category}</span>
                      <h2 className="wishlist-product-name">
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                      </h2>
                      <p className="wishlist-price">{formatPrice(product.price)}</p>
                      <p className={`wishlist-stock ${product.stock > 0 ? "is-available" : "is-unavailable"}`}>
                        {product.stock > 0
                          ? `Disponible · ${product.stock} en stock`
                          : "Sin stock por el momento"}
                      </p>
                      <div className="wishlist-item-actions">
                        <Link className="wishlist-view" to={`/product/${product.id}`}>
                          Ver producto
                        </Link>
                        <button
                          className="wishlist-remove"
                          type="button"
                          onClick={() => removeWishlistProduct(product.id)}
                          aria-label={`Quitar ${product.name} de favoritos`}
                        >
                          Quitar <span aria-hidden="true">×</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
