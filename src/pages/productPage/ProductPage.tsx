import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { getProductMedia } from "../../data/productMedia";
import ImageCarousel from "../../components/productPage/ImageCarousel";
import Model3DViewer from "../../components/productPage/Model3DViewer";
import "./ProductPage.css";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductPage() {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const [quantity, setQuantity] = useState(1);

  const product = id ? getProductById(id) : undefined;
  if (!product) return <Navigate to="/404" replace />;

  const { images, model3D } = getProductMedia(product);
  const outOfStock = product.stock <= 0;

  return (
    <main className="productPage">
      <nav className="productPageBreadcrumb" aria-label="Breadcrumb">
        <Link to="/">Inicio</Link>
        <span>›</span>
        <span>{product.category}</span>
      </nav>

      <section className="productPageMain pageCard">
        <div className="productPageGallery">
          <ImageCarousel images={images} alt={product.name} />
        </div>

        <aside className="productPageInfo">
          <span className="productPageTag">Nuevo</span>
          <h1 className="productPageTitle">{product.name}</h1>

          <p className="productPagePrice">{formatPrice(product.price)}</p>
          <p className="productPageShipping">Envío gratis a todo el país</p>

          <p className={`productPageStock ${outOfStock ? "isOut" : ""}`}>
            {outOfStock ? "Sin stock" : "Stock disponible"}
          </p>

          {!outOfStock && (
            <label className="productPageQuantity">
              Cantidad:
              <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                {Array.from({ length: Math.min(product.stock, 6) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "unidad" : "unidades"}
                  </option>
                ))}
              </select>
              <span className="productPageAvailable">({product.stock} disponibles)</span>
            </label>
          )}

          <div className="productPageActions">
            <button type="button" className="productBtn productBtnPrimary" disabled={outOfStock}>
              Comprar ahora
            </button>
            <button type="button" className="productBtn productBtnSoft" disabled={outOfStock}>
              Agregar al carrito
            </button>
          </div>
        </aside>
      </section>

      <section className="productPageSection pageCard">
        <h2>Descripción</h2>
        <p>{product.description}</p>
      </section>

      {model3D && (
        <section className="productPageSection pageCard">
          <h2>Mirá el producto en 3D</h2>
          <p className="productPageHint">Hacé clic para cargarlo, arrastrá para girarlo y usá la rueda para acercarte.</p>
          <Model3DViewer src={model3D} poster={images[0]} alt={product.name} />
        </section>
      )}
    </main>
  );
}