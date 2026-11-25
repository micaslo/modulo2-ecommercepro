import { useState } from "react";
import { Link } from "react-router-dom";
import { getCoverImage } from "../../../data/productMedia";
import { useProducts } from "../../../hooks/useProducts";
import "./ProductsOnSale.css";

const CARD_W = 240;
const GAP = 36;
const VISIBLE_SIDE = 4;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function ProductsOnSale() {
  const { products } = useProducts();
  const [current, setCurrent] = useState(0);

  const looped = [...products, ...products];
  const N = looped.length;
  const HALF = N / 2;

  if (N === 0) return null;

  const activeIndex = mod(current, N);

  return (
    <section className="featured">
      <h1 className="featured-title">Productos destacados</h1>

      <div className="carousel-window">
        <div className="carousel-track">
          {looped.map((product, i) => {
            const offset = mod(i - activeIndex + HALF, N) - HALF;
            const hidden = Math.abs(offset) > VISIBLE_SIDE;

            const x = offset * (CARD_W + GAP);
            const rotate = Math.max(-40, Math.min(40, -offset * 16));
            const scale =
              offset === 0 ? 1.1 : 1 - Math.min(Math.abs(offset) * 0.04, 0.15);

            return (
              <article
                key={`${product.id}-${i}`}
                className={`product-card ${offset === 0 ? "active" : ""}`}
                style={{
                  position: "absolute",
                  top: 40,
                  left: "50%",
                  width: CARD_W,
                  marginLeft: -CARD_W / 2,
                  transform: `translateX(${x}px) perspective(900px) rotateY(${rotate}deg) scale(${scale})`,
                  zIndex: 100 - Math.abs(offset),
                  opacity: hidden ? 0 : undefined,
                  transition: hidden ? "none" : undefined,
                  pointerEvents: hidden ? "none" : "auto",
                }}
                onClick={() => setCurrent(i)}
              >
                <div className="product-img-wrap">
                  <img
                    src={getCoverImage(product) || product.image}
                    alt={product.name}
                  />
                  <Link
                    className="product-btn"
                    to={`/product/${product.id}`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    Ver producto
                  </Link>
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{formatPrice(product.price)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
