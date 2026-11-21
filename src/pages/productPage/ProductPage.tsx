import { useEffect, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { getProductMedia } from "../../data/productMedia";
import { getProductDetails } from "../../data/productDetails";
import type { Product } from "../../types/productMedia";
import ImageCarousel from "../../components/productPage/imageCarousel/ImageCarousel";
import ColorSelector from "../../components/productPage/colorSelector/ColorSelector";
import ProductSpecs from "../../components/productPage/productSpecs/ProductSpecs";
import Model3DViewer from "../../components/productPage/model3DViewer/Model3DViewer";
import RelatedProducts from "../../components/productPage/relatedProducts/RelatedProducts";
import ProductReviews from "../../components/productPage/productReviews/ProductReviews";
import {
  Cube3DIcon,
  HeartIcon,
  ReturnIcon,
  SpecIcon,
  StarIcon,
  TruckIcon,
} from "../../components/productPage/productIcons/ProductIcons";
import "./ProductPage.css";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

interface ProductPageContentProps {
  product: Product;
  allProducts: Product[];
}

function ProductPageContent({
  product,
  allProducts,
}: ProductPageContentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const media = getProductMedia(product);
  const details = getProductDetails(product);

  const queryColor = searchParams.get("color");
  const selectedColorId =
    media.colors.find((c) => c.id === queryColor)?.id ??
    media.colors[0]?.id ??
    "";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product.id, queryColor]);

  const activeColorVariant =
    media.colors.find((c) => c.id === selectedColorId) ?? media.colors[0];

  const activeImages = activeColorVariant?.images ?? media.images;
  const outOfStock = product.stock <= 0;

  const discountPercent =
    details.originalPrice && details.originalPrice > product.price
      ? Math.round(
          ((details.originalPrice - product.price) / details.originalPrice) *
            100,
        )
      : 0;

  const installmentAmount = Math.round(
    product.price / details.installmentsCount,
  );

  const averageRating =
    details.reviews.length > 0
      ? details.reviews.reduce((sum, r) => sum + r.rating, 0) /
        details.reviews.length
      : 5;

  const handleSelectColor = (colorId: string) => {
    setActionMessage(null);
    setSearchParams({ color: colorId }, { replace: true });
  };

  const handleBuyAction = (mode: "buy" | "cart") => {
    const colorSuffix = activeColorVariant
      ? ` (${activeColorVariant.label})`
      : "";
    if (mode === "cart") {
      setActionMessage(
        `Agregaste ${quantity} ${quantity === 1 ? "unidad" : "unidades"} de ${product.name}${colorSuffix} al carrito.`,
      );
    } else {
      setActionMessage(
        `Iniciando compra de ${quantity} ${quantity === 1 ? "unidad" : "unidades"} de ${product.name}${colorSuffix}.`,
      );
    }
  };

  return (
    <main className="productPage">
      <nav className="productPageBreadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumbBack">
          Volver al listado
        </Link>
        <span className="breadcrumbDivider" aria-hidden="true">
          |
        </span>
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">›</span>
        <span>{product.category}</span>
        <span aria-hidden="true">›</span>
        <span className="breadcrumbCurrent">{product.name}</span>
      </nav>
      <section className="productPageMain pageCard">
        <div className="productPageGallery">
          <ImageCarousel
            key={`${product.id}-${selectedColorId}`}
            images={activeImages}
            alt={
              activeColorVariant
                ? `${product.name} ${activeColorVariant.label}`
                : product.name
            }
          />
        </div>

        <div className="productPageSummary">
          <div className="productMetaRow">
            <span className="productCondition">
              {details.condition} <span aria-hidden="true">|</span>{" "}
              {details.soldText}
            </span>
            <button
              type="button"
              className={`productFavBtn ${isFavorite ? "isActive" : ""}`}
              onClick={() => setIsFavorite((prev) => !prev)}
              aria-label={
                isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
              }
              aria-pressed={isFavorite}
            >
              <HeartIcon filled={isFavorite} size={20} />
            </button>
          </div>

          <h1 className="productPageTitle">{product.name}</h1>

          <a href="#opiniones" className="productRatingLink">
            <span className="productRatingScore">
              {averageRating.toFixed(1)}
            </span>
            <span className="productRatingStars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon
                  key={i}
                  filled={averageRating >= i + 0.8}
                  half={averageRating < i + 0.8 && averageRating >= i + 0.3}
                  size={15}
                />
              ))}
            </span>
            <span className="productRatingCount">
              ({details.reviews.length} opiniones)
            </span>
          </a>

          <div className="productPriceBlock">
            {details.originalPrice && discountPercent > 0 && (
              <span className="productOldPrice">
                {formatPrice(details.originalPrice)}
              </span>
            )}
            <div className="productPriceRow">
              <p className="productPagePrice">{formatPrice(product.price)}</p>
              {discountPercent > 0 && (
                <span className="productDiscountBadge">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <p className="productInstallments">
              en{" "}
              <strong>
                {details.installmentsCount} cuotas sin interés de{" "}
                {formatPrice(installmentAmount)}
              </strong>
            </p>
          </div>

          <ColorSelector
            colors={media.colors}
            selectedColorId={selectedColorId}
            onSelectColor={handleSelectColor}
          />
        </div>

        <aside className="productBuyBox">
          <div className="buyBoxShipping">
            <span className="buyBoxShippingIcon">
              <TruckIcon size={20} />
            </span>
            <div>
              <p className="buyBoxShippingTitle">{details.shippingTitle}</p>
              <p className="buyBoxShippingSub">{details.shippingSubtitle}</p>
            </div>
          </div>

          <div className="buyBoxStockBlock">
            <p className={`productPageStock ${outOfStock ? "isOut" : ""}`}>
              {outOfStock ? "Sin stock disponible" : "Stock disponible"}
            </p>
            {activeColorVariant && (
              <p className="buyBoxSelectedColor">
                Color elegido: <strong>{activeColorVariant.label}</strong>
              </p>
            )}
          </div>

          {!outOfStock && (
            <label className="productPageQuantity">
              <span>Cantidad:</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {Array.from(
                  { length: Math.min(product.stock, 6) },
                  (_, i) => i + 1,
                ).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "unidad" : "unidades"}
                  </option>
                ))}
              </select>
              <span className="productPageAvailable">
                ({product.stock}{" "}
                {product.stock === 1 ? "disponible" : "disponibles"})
              </span>
            </label>
          )}

          <div className="productPageActions">
            <button
              type="button"
              className="productBtn productBtnPrimary"
              disabled={outOfStock}
              onClick={() => handleBuyAction("buy")}
            >
              {details.productKind === "car"
                ? "Reservar ahora"
                : "Comprar ahora"}
            </button>
            <button
              type="button"
              className="productBtn productBtnSoft"
              disabled={outOfStock}
              onClick={() => handleBuyAction("cart")}
            >
              Agregar al carrito
            </button>
          </div>

          {actionMessage && (
            <p className="buyBoxFeedback" role="status">
              {actionMessage}
            </p>
          )}

          <ul className="buyBoxGuarantees">
            <li>
              <ReturnIcon size={17} className="guaranteeIcon" />
              <span>
                <strong>Devolución gratis.</strong> Tenés 30 días desde que lo
                recibís.
              </span>
            </li>
            <li>
              <SpecIcon name="shield" size={17} className="guaranteeIcon" />
              <span>
                <strong>Compra Protegida.</strong> {details.warranty}.
              </span>
            </li>
          </ul>
        </aside>
      </section>

      <section className="productPageSection pageCard productHighlightsSection">
        <div className="sectionHeader">
          <h2>Lo que tenés que saber de este producto</h2>
          <a href="#caracteristicas" className="productJumpLink">
            Ver características ↓
          </a>
        </div>
        <ul className="productHighlightsList">
          {details.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <ProductSpecs
        productKind={details.productKind}
        keySpecs={details.keySpecs}
        specGroups={details.specGroups}
      />


      {media.model3D && (
        <section className="productPageSection pageCard" id="modelo-3d">
          <div className="sectionHeader">
            <h2 className="sectionTitleWithIcon">
              <Cube3DIcon size={22} />
              <span>Mirá este producto en 3D</span>
            </h2>
            <span className="sectionBadge">Vista interactiva 360°</span>
          </div>
          <p className="productPageHint">
            Activá el modelo 3D interactivo para girar el producto, acercarlo y
            revisar cada ángulo antes de decidir.
          </p>
          <Model3DViewer
            key={media.model3D}
            src={media.model3D}
            poster={activeImages[0]}
            alt={product.name}
          />
        </section>
      )}

      <RelatedProducts currentProduct={product} allProducts={allProducts} />

      <section
        className="productPageSection pageCard productDescription"
        id="descripcion"
      >
        <h2>Descripción</h2>
        <div className="descriptionParagraphs">
          {details.extendedDescription.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {details.includedItems.length > 0 && (
          <div className="descriptionIncluded">
            <h3>
              {details.productKind === "car"
                ? "¿Qué incluye la entrega?"
                : "¿Qué incluye la caja?"}
            </h3>
            <ul>
              {details.includedItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <ProductReviews
        key={product.id}
        productId={product.id}
        initialReviews={details.reviews}
        featureRatings={details.featureRatings}
      />
    </main>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { products, getProductById } = useProducts();

  const product = id ? getProductById(id) : undefined;
  if (!product) return <Navigate to="/404" replace />;

  return (
    <ProductPageContent
      key={product.id}
      product={product}
      allProducts={products}
    />
  );
}
