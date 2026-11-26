import { Link } from "react-router-dom";
import type { Product } from "../../../types/productMedia";
import { getCoverImage, getProductMedia } from "../../../data/productMedia";
import { getProductDetails } from "../../../data/productDetails";
import { CURATED_RELATED_PRODUCTS } from "../../../data/relatedProductsData";
import "./RelatedProducts.css";

interface RelatedProductsProps {
  currentProduct: Product;
  allProducts: Product[];
}

interface RelatedCardItem {
  key: string;
  to: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageFit?: "contain" | "cover";
  imagePosition?: string;
  shippingLabel: string;
  installmentsCount: number;
  badge?: string;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

function productToCard(
  p: Product,
  options?: {
    showBadge?: boolean;
    imageOverride?: string;
    imageFit?: "contain" | "cover";
    imagePosition?: string;
  },
): RelatedCardItem {
  const details = getProductDetails(p);
  return {
    key: p.id,
    to: `/product/${p.id}`,
    title: p.name,
    price: p.price,
    originalPrice: details.originalPrice,
    image: options?.imageOverride ?? getCoverImage(p),
    imageFit: options?.imageFit ?? "contain",
    imagePosition: options?.imagePosition,
    shippingLabel:
      details.productKind === "car" ? "0 km · Entrega oficial" : "Envío gratis",
    installmentsCount: details.installmentsCount,
    badge: options?.showBadge ? "Misma categoría" : undefined,
  };
}

function buildRelatedCards(
  currentProduct: Product,
  allProducts: Product[],
): RelatedCardItem[] {
  const curated = CURATED_RELATED_PRODUCTS[currentProduct.id];

  if (curated) {
    const cards: RelatedCardItem[] = [];

    for (const entry of curated) {
      if (entry.type === "product") {
        const match = allProducts.find((p) => p.id === entry.productId);
        if (match) {
          cards.push(
            productToCard(match, {
              imageOverride: entry.imageOverride,
              imageFit: entry.imageFit,
              imagePosition: entry.imagePosition,
            }),
          );
        }
      } else {
        cards.push(entry.item);
      }
    }

    return cards.slice(0, 4);
  }

  const others = allProducts
    .filter((p) => p.id !== currentProduct.id)
    .sort((a, b) => {
      const aSame = a.category === currentProduct.category ? 0 : 1;
      const bSame = b.category === currentProduct.category ? 0 : 1;
      return aSame - bSame;
    });

  const cards: RelatedCardItem[] = others
    .slice(0, 4)
    .map((p) =>
      productToCard(p, { showBadge: p.category === currentProduct.category }),
    );

  if (cards.length < 4) {
    const sameCategoryCandidates = [
      ...others.filter((p) => p.category === currentProduct.category),
      currentProduct,
    ];

    for (const candidate of sameCategoryCandidates) {
      if (cards.length >= 4) break;
      const media = getProductMedia(candidate);
      const details = getProductDetails(candidate);

      for (const variant of media.colors.slice(1)) {
        if (cards.length >= 4) break;
        const cardKey = `${candidate.id}-${variant.id}`;
        if (cards.some((c) => c.key === cardKey)) continue;

        cards.push({
          key: cardKey,
          to: `/product/${candidate.id}?color=${variant.id}`,
          title: `${candidate.name} — ${variant.label}`,
          price: candidate.price,
          originalPrice: details.originalPrice,
          image: variant.previewImage,
          imageFit: "contain",
          shippingLabel:
            details.productKind === "car"
              ? "0 km · Entrega oficial"
              : "Envío gratis",
          installmentsCount: details.installmentsCount,
          badge: `Color ${variant.label}`,
        });
      }
    }
  }

  return cards.slice(0, 4);
}

export default function RelatedProducts({
  currentProduct,
  allProducts,
}: RelatedProductsProps) {
  const cards = buildRelatedCards(currentProduct, allProducts);

  if (cards.length === 0) return null;

  return (
    <section className="productPageSection pageCard relatedSection" id="relacionados">
      <div className="sectionHeader">
        <h2>Productos relacionados</h2>
        <span className="relatedCount">{cards.length} opciones sugeridas</span>
      </div>

      <div className="relatedGrid">
        {cards.map((card) => {
          const discountPercent =
            card.originalPrice && card.originalPrice > card.price
              ? Math.round(
                  ((card.originalPrice - card.price) / card.originalPrice) * 100,
                )
              : 0;
          const installmentAmount = Math.round(card.price / card.installmentsCount);
          const isCover = card.imageFit === "cover";

          return (
            <Link key={card.key} to={card.to} className="relatedCard">
              <div
                className={`relatedCardMedia${isCover ? " relatedCardMediaCover" : ""}`}
              >
                {card.badge && (
                  <span className="relatedCardBadge">{card.badge}</span>
                )}
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  style={
                    card.imagePosition
                      ? { objectPosition: card.imagePosition }
                      : undefined
                  }
                />
              </div>

              <div className="relatedCardBody">
                <h3 className="relatedCardTitle" title={card.title}>
                  {card.title}
                </h3>

                <span
                  className="relatedCardOldPrice"
                  aria-hidden={!(card.originalPrice && discountPercent > 0)}
                >
                  {card.originalPrice && discountPercent > 0
                    ? formatPrice(card.originalPrice)
                    : "\u00A0"}
                </span>

                <div className="relatedCardPriceRow">
                  <strong className="relatedCardPrice">
                    {formatPrice(card.price)}
                  </strong>
                  {discountPercent > 0 && (
                    <span className="relatedCardDiscount">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                <p className="relatedCardInstallments">
                  en {card.installmentsCount} cuotas sin interés de{" "}
                  {formatPrice(installmentAmount)}
                </p>

                <span className="relatedCardShipping">{card.shippingLabel}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
