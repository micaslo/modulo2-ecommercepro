import { useState } from "react";
import "./ProductsOnSale.css";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const featuredProducts: Product[] = [
  { id: 1, name: "Producto 1", price: 19999, image: "https://picsum.photos/seed/p1/400/560" },
  { id: 2, name: "Producto 2", price: 24999, image: "https://picsum.photos/seed/p2/400/560" },
  { id: 3, name: "Producto 3", price: 15999, image: "https://picsum.photos/seed/p3/400/560" },
  { id: 4, name: "Producto 4", price: 32999, image: "https://picsum.photos/seed/p4/400/560" },
  { id: 5, name: "Producto 5", price: 12999, image: "https://picsum.photos/seed/p5/400/560" },
  { id: 6, name: "Producto 6", price: 27999, image: "https://picsum.photos/seed/p6/400/560" },
  { id: 7, name: "Producto 7", price: 21999, image: "https://picsum.photos/seed/p7/400/560" },
];

const CARD_W = 240; // ancho de cada tarjeta (px)
const GAP = 36; // espacio entre tarjetas (px)
const VISIBLE_SIDE = 4; // tarjetas visibles a cada lado de la activa

// la lista se duplica para que nunca se repita un producto en pantalla
const looped = [...featuredProducts, ...featuredProducts];
const N = looped.length;
const HALF = N / 2;

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function ProductsOnSale() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="featured">
      <h1 className="featured-title">Productos destacados</h1>

      <div className="carousel-window">
        <div
          className="carousel-track"
          style={{ position: "relative", width: "100%", height: 440 }}
        >
          {looped.map((product, i) => {
            // distancia circular a la tarjeta activa: de -7 a 6
            const offset = mod(i - current + HALF, N) - HALF;
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
                  // las tarjetas ocultas se reubican sin animación ni vuelos
                  opacity: hidden ? 0 : undefined,
                  transition: hidden ? "none" : undefined,
                  pointerEvents: hidden ? "none" : "auto",
                }}
                onClick={() => setCurrent(i)}
              >
                <div className="product-img-wrap">
                  <img src={product.image} alt={product.name} />
                  <button className="product-btn">Ver producto</button>
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">
                  ${product.price.toLocaleString("es-AR")}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}