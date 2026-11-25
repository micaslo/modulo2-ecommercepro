import "./Hero.css";
import { useEffect, useState } from "react";

const paymentOptions = [
  { brand: "VISA", detail: "12 cuotas sin interés", tone: "visa" },
  { brand: "AMERICAN EXPRESS", detail: "Hasta 6 cuotas sin interés", tone: "amex" },
  { brand: "mastercard", detail: "1 cuota sin interés", tone: "mastercard" },
];

const categories = [
  { icon: "✦", title: "Tecnología", subtitle: "Innovación para todos los días" },
  { icon: "◈", title: "Hogar", subtitle: "Un espacio más tuyo" },
  { icon: "♧", title: "Moda", subtitle: "Tu estilo, a tu manera" },
  { icon: "☆", title: "Belleza", subtitle: "Pequeños grandes rituales" },
];

const products = [
  {
    name: "Auriculares",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=520&q=85",
    className: "headphones",
  },
  {
    name: "Zapatillas",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=520&q=85",
    className: "sneakers",
  },
  {
    name: "Reloj",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=520&q=85",
    className: "watch",
  },
];

export default function Hero() {
  const [activePayment, setActivePayment] = useState(0);
  const [paymentPaused, setPaymentPaused] = useState(false);

  useEffect(() => {
    if (paymentPaused) return;

    const timer = window.setInterval(() => {
      setActivePayment((current) => (current + 1) % paymentOptions.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [paymentPaused]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__payment-bar" aria-label="Promociones con tarjetas">
          <div className="hero__payment-intro">
            <span className="hero__payment-icon" aria-hidden="true">↗</span>
            <span>Elegí cómo pagar</span>
          </div>

          <div
            className="hero__payment-list"
            onMouseLeave={() => setPaymentPaused(false)}
          >
            {paymentOptions.map((option, index) => (
              <button
                className={`hero__payment${activePayment === index ? " is-active" : ""}`}
                key={option.brand}
                type="button"
                aria-pressed={activePayment === index}
                onMouseEnter={() => {
                  setActivePayment(index);
                  setPaymentPaused(true);
                }}
                onFocus={() => {
                  setActivePayment(index);
                  setPaymentPaused(true);
                }}
                onBlur={() => setPaymentPaused(false)}
                onClick={() => {
                  setActivePayment(index);
                  setPaymentPaused(true);
                }}
              >
                <span className={`hero__brand hero__brand--${option.tone}`}>
                  {option.brand}
                </span>
                <span className="hero__payment-detail">
                  <strong>{option.detail}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="hero__feature-grid">
          <article className="hero__feature">
            <div className="hero__feature-copy">
              <p className="hero__eyebrow">
                <span className="hero__sparkle">✳</span>
                Oportunidades por tiempo limitado
              </p>
              <h1 id="hero-title">
                ÚLTIMOS DÍAS<br />
                DE <em>BLACK FRIDAY</em>
              </h1>
              <p className="hero__lead">
                Últimas ofertas en stock. Encontrá tus favoritos antes de que se agoten.
              </p>
              <a className="hero__button" href="#ofertas">
                Ver últimas ofertas <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="hero__products" aria-label="Productos destacados">
              {products.map((product, index) => (
                <article
                  className={`hero__product hero__product--${product.className}`}
                  key={product.name}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <span className="hero__product-tag">Black Friday</span>
                  <span className="hero__product-name">{product.name}</span>
                </article>
              ))}
            </div>
          </article>

          <aside className="hero__side-promos" aria-label="Promociones destacadas">
            <article className="hero__promo hero__promo--coins">
              <span className="hero__promo-kicker">Tecnología en oferta</span>
              <h2>Equipate<br />por menos</h2>
              <a href="#tecnologia" className="hero__promo-link">
                Ver productos <span aria-hidden="true">↗</span>
              </a>
              <img
                className="hero__promo-image"
                src={products[0].image}
                alt="Auriculares en oferta"
                loading="lazy"
              />
            </article>

            <article className="hero__promo hero__promo--coupon">
              <span className="hero__promo-kicker">Últimas unidades</span>
              <h2>Encontrá tu<br />próximo favorito</h2>
              <a href="#ofertas" className="hero__promo-link">
                Comprar ahora <span aria-hidden="true">↗</span>
              </a>
              <img
                className="hero__promo-image"
                src={products[1].image}
                alt="Zapatilla en oferta"
                loading="lazy"
              />
            </article>
          </aside>
        </div>

        <nav
          className="hero__categories"
          id="categorias"
          aria-label="Explorar categorías"
        >
          {categories.map((category) => (
            <a
              className="hero__category"
              href={`#${category.title.toLowerCase()}`}
              key={category.title}
            >
              <span className="hero__category-icon" aria-hidden="true">
                {category.icon}
              </span>
              <span className="hero__category-copy">
                <strong>{category.title}</strong>
                <small>{category.subtitle}</small>
              </span>
              <span className="hero__category-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>

        <div className="hero__deal-bar" id="ofertas">
          <div className="hero__deal-title">
            <span className="hero__deal-mark" aria-hidden="true">✳</span>
            <span>Más motivos<br />para elegir</span>
          </div>
          <div className="hero__deal">
            <strong>Envío gratis</strong>
            <span>en compras seleccionadas</span>
          </div>
          <div className="hero__deal">
            <strong>Nuevos hallazgos</strong>
            <span>para todos los días</span>
          </div>
          <div className="hero__deal">
            <strong>Ofertas especiales</strong>
            <span>que te van a gustar</span>
          </div>
          <a href="#ofertas" className="hero__deal-cta">
            Ver todas las ofertas <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}