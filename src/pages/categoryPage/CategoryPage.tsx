import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  getCategoryConfig,
  getUpcomingProducts,
} from "../../data/categoryProducts";
import { getProductDetails, getProductPricing } from "../../data/productDetails";
import { getCoverImage } from "../../data/productMedia";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types/productMedia";
import { getProductPath } from "../../utils/productRoute";
import {
  AdminPurchaseBlockedModal,
  LoginRequiredModal,
} from "../../components/checkout/cartModals/CartModals";
import "./CategoryPage.css";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const config = getCategoryConfig(slug);
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [feedback, setFeedback] = useState<{
    productId: string;
    message: string;
    isError?: boolean;
  } | null>(null);
  const [loginModal, setLoginModal] = useState<{
    open: boolean;
    productName: string;
  }>({ open: false, productName: "" });
  const [adminBlockedModalOpen, setAdminBlockedModalOpen] = useState(false);

  if (!config) {
    return <Navigate to="/error-404" replace />;
  }

  const availableProducts = products.filter(
    (product) => product.category === config.label,
  );
  const categoryProducts = [
    ...availableProducts.map((product) => ({
      product,
      detailPath: getProductPath(product),
    })),
    ...getUpcomingProducts(config.slug).map((product) => ({
      product,
      detailPath: "/error-404",
    })),
  ];

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
      if (result.reason === "auth_required") {
        setLoginModal({ open: true, productName: product.name });
        return;
      }
      if (result.reason === "admin_forbidden") {
        setAdminBlockedModalOpen(true);
        return;
      }
      const reasonMessage =
        result.reason === "car_limit"
          ? "Solo podés reservar 1 unidad de este vehículo."
          : result.reason === "stock_limit"
            ? "Ya alcanzaste el límite de stock disponible en tu carrito."
            : "Producto sin stock disponible.";
      setFeedback({ productId: product.id, message: reasonMessage, isError: true });
      return;
    }

    setFeedback({ productId: product.id, message: "Agregado al carrito." });
  };

  return (
    <main className="categoryPage">
      <div className="categoryContainer">
        <nav className="categoryBreadcrumb" aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/productos">Productos</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{config.label}</span>
        </nav>

        <header className="categoryHeader">
          <span className="categoryEyebrow">{config.eyebrow}</span>
          <h1>{config.label}</h1>
          <p>{config.description}</p>
          <Link to="/productos" className="categoryAllLink">
            Ver el catálogo completo →
          </Link>
        </header>

        <section className="categorySection" aria-labelledby="categoryProductsTitle">
          <div className="categorySectionHead">
            <div>
              <h2 id="categoryProductsTitle">Productos</h2>
              <p>Todos los productos de esta categoría.</p>
            </div>
            <span className="categorySectionCount">
              {categoryProducts.length}{" "}
              {categoryProducts.length === 1 ? "producto" : "productos"}
            </span>
          </div>

          <div className="categoryGrid">
            {categoryProducts.map(({ product, detailPath }) => {
              const cover = getCoverImage(product);
              const pricing = getProductPricing(product);
              const outOfStock = product.stock <= 0;
              const productFeedback =
                feedback?.productId === product.id ? feedback : null;

              return (
                <article key={product.id} className="categoryCard">
                  <div className="categoryCardMedia">
                    <Link
                      to={detailPath}
                      className="categoryCardImgLink"
                      aria-label={`Ver detalle de ${product.name}`}
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt={product.name}
                          loading="lazy"
                          className="categoryCardImg"
                        />
                      ) : (
                        <span className="categoryCardPlaceholder" aria-hidden="true">
                          Sin imagen
                        </span>
                      )}
                    </Link>
                    <span className="categoryCardCategory">{product.category}</span>
                  </div>

                  <div className="categoryCardBody">
                    {product.code && (
                      <span className="categoryCardCode">{product.code}</span>
                    )}

                    <h3 className="categoryCardTitle">
                      <Link to={detailPath}>{product.name}</Link>
                    </h3>

                    <p className="categoryCardDescription">{product.description}</p>

                    <div className="categoryCardPricing">
                      <div className="categoryCardPriceGroup">
                        {pricing.originalPrice && pricing.discountPercent > 0 && (
                          <div className="categoryCardDiscountRow">
                            <span className="categoryCardOldPrice">
                              {formatPrice(pricing.originalPrice)}
                            </span>
                            <span className="categoryCardDiscountBadge">
                              {pricing.discountPercent}% OFF
                            </span>
                          </div>
                        )}
                        <strong className="categoryCardPrice">
                          {formatPrice(pricing.finalPrice)}
                        </strong>
                      </div>
                      <span
                        className={`categoryStockBadge ${
                          outOfStock ? "isOut" : "isIn"
                        }`}
                      >
                        {outOfStock ? "Sin stock" : `Stock: ${product.stock} u.`}
                      </span>
                    </div>

                    {productFeedback && (
                      <p
                        className={`categoryCardFeedback ${
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

                    <div className="categoryCardActions">
                      <Link to={detailPath} className="categoryBtnDetail">
                        Ver detalle
                      </Link>
                      <button
                        type="button"
                        className="categoryBtnCart"
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
          </div>
        </section>
      </div>

      <LoginRequiredModal
        isOpen={loginModal.open}
        productName={loginModal.productName}
        onClose={() => setLoginModal({ open: false, productName: "" })}
      />

      <AdminPurchaseBlockedModal
        isOpen={adminBlockedModalOpen}
        onClose={() => setAdminBlockedModalOpen(false)}
      />
    </main>
  );
}
