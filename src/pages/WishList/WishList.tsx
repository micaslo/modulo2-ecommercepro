import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCoverImage } from "../../data/productMedia";
import { useProducts } from "../../hooks/useProducts";
import {
  clearWishlist,
  getWishlistIds,
  removeWishlistProduct,
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
  const [wishlistIds, setWishlistIds] = useState<string[]>(getWishlistIds);

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
            <p className="wishlist-count" aria-live="polite">
              {savedProducts.length} {savedProducts.length === 1 ? "producto guardado" : "productos guardados"}
            </p>
            <div className="wishlist-grid">
              {savedProducts.map((product) => {
                const image = getCoverImage(product);

                return (
                  <article className="wishlist-card" key={product.id}>
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
                    <div className="wishlist-card-content">
                      <span className="wishlist-category">{product.category}</span>
                      <h2>
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                      </h2>
                      <p className="wishlist-price">{formatPrice(product.price)}</p>
                      <div className="wishlist-card-actions">
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
          </>
        )}
      </section>
    </main>
  );
}
