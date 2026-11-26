import { useState } from "react";
import { Link } from "react-router-dom";
import { getCoverImage } from "../../data/productMedia";
import { useAuth } from "../../hooks/useAuth";
import { useProducts } from "../../hooks/useProducts";
import { useWishlist } from "../../hooks/useWishlist";
import "./WishList.css";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);

export default function WishList() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { wishlistIds, remove, clear } = useWishlist();
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

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

  return (
    <main className="wishlistPage">
      <section className="wishlistContainer" aria-labelledby="wishlist-title">
        <header className="wishlistHeader">
          <div>
            <span className="wishlistEyebrow">
              TUS FAVORITOS{user ? ` · ${user.firstName.toUpperCase()}` : ""}
            </span>
            <h1 id="wishlist-title">Mi lista de deseos</h1>
            <p>Guardá productos en tu lista personal para volver a encontrarlos cuando quieras.</p>
          </div>
          {savedProducts.length > 0 && (
            <button
              className="wishlistClear"
              type="button"
              onClick={clear}
            >
              Vaciar lista
            </button>
          )}
        </header>

        {savedProducts.length === 0 ? (
          <div className="wishlistEmpty">
            <span className="wishlistEmptyIcon" aria-hidden="true">♡</span>
            <h2>Todavía no guardaste favoritos</h2>
            <p>Explorá el catálogo y tocá el corazón para guardarlos acá.</p>
            <Link className="wishlistBrowse" to="/productos">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlistToolbar">
              <label className="wishlistSearch">
                <span className="wishlistVisuallyHidden">Buscar en tu lista</span>
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar en esta lista"
                />
              </label>

              <label className="wishlistSelectWrap">
                <span className="wishlistVisuallyHidden">Filtrar por disponibilidad</span>
                <select
                  value={availability}
                  onChange={(event) => setAvailability(event.target.value)}
                >
                  <option value="all">Todos los productos</option>
                  <option value="available">Disponibles</option>
                  <option value="unavailable">Sin stock</option>
                </select>
              </label>

              <label className="wishlistSelectWrap">
                <span className="wishlistVisuallyHidden">Ordenar productos</span>
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

            <p className="wishlistCount" aria-live="polite">
              {visibleProducts.length} de {savedProducts.length}{" "}
              {savedProducts.length === 1
                ? "producto guardado"
                : "productos guardados"}
            </p>

            {visibleProducts.length === 0 ? (
              <div className="wishlistNoResults">
                No encontramos productos que coincidan con esos filtros.
              </div>
            ) : (
              <div className="wishlistList">
                {visibleProducts.map((product) => {
                  const image = getCoverImage(product);

                  return (
                    <article className="wishlistItem" key={product.id}>
                      <Link
                        className="wishlistImageLink"
                        to={`/product/${product.id}`}
                        aria-label={`Ver ${product.name}`}
                      >
                        {image ? (
                          <img
                            className="wishlistImage"
                            src={image}
                            alt={product.name}
                          />
                        ) : (
                          <span
                            className="wishlistImagePlaceholder"
                            aria-hidden="true"
                          >
                            ♡
                          </span>
                        )}
                      </Link>
                      <div className="wishlistItemDetails">
                        <span className="wishlistCategory">
                          {product.category}
                        </span>
                        <h2 className="wishlistProductName">
                          <Link to={`/product/${product.id}`}>
                            {product.name}
                          </Link>
                        </h2>
                        <p className="wishlistPrice">
                          {formatPrice(product.price)}
                        </p>
                        <p
                          className={`wishlistStock ${
                            product.stock > 0 ? "is-available" : "is-unavailable"
                          }`}
                        >
                          {product.stock > 0
                            ? `Disponible · ${product.stock} en stock`
                            : "Sin stock por el momento"}
                        </p>
                        <div className="wishlistItemActions">
                          <Link
                            className="wishlistView"
                            to={`/product/${product.id}`}
                          >
                            Ver producto
                          </Link>
                          <button
                            className="wishlistRemove"
                            type="button"
                            onClick={() => remove(product.id)}
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
