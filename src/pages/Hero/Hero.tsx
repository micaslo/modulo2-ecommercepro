import "./Hero.css";

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

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__payment-bar" aria-label="Promociones con tarjetas">
          <div className="hero__payment-intro">
            <span className="hero__payment-icon" aria-hidden="true">↗</span>
            <span>Elegí cómo pagar</span>
          </div>

          <div className="hero__payment-list">
            {paymentOptions.map((option) => (
              <div className="hero__payment" key={option.brand}>
                <span className={`hero__brand hero__brand--${option.tone}`}>
                  {option.brand}
                </span>
                <span className="hero__payment-detail">{option.detail}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__feature-grid">
          <article className="hero__feature">
            <div className="hero__feature-copy">
              <p className="hero__eyebrow">
                <span className="hero__sparkle">✳</span>
                Temporada de buenos hallazgos
              </p>
              <h1 id="hero-title">
                Un mundo de<br />
                <em>posibilidades</em>
              </h1>
              <p className="hero__lead">
                Lo que buscás, lo que soñás y eso que todavía no sabías que necesitabas.
              </p>
              <a className="hero__button" href="#categorias">
                Explorá la tienda <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="hero__art" aria-hidden="true">
              <div className="hero__sun" />
              <div className="hero__orbit hero__orbit--one" />
              <div className="hero__orbit hero__orbit--two" />
              <div className="hero__shape hero__shape--pink">✳</div>
              <div className="hero__shape hero__shape--orange">✦</div>
              <div className="hero__shape hero__shape--blue">◈</div>
              <div className="hero__art-label">
                COSAS<br />BUENAS<br /><span>pasan acá</span>
              </div>
            </div>
          </article>

          <aside className="hero__side-promos" aria-label="Promociones destacadas">
            <article className="hero__promo hero__promo--coins">
              <span className="hero__promo-kicker">Tu próxima compra</span>
              <h2>tiene premio</h2>
              <p>Sumá beneficios en cada pedido.</p>
              <a href="#beneficios" className="hero__promo-link">
                Ver beneficios <span aria-hidden="true">↗</span>
              </a>
              <span className="hero__coin" aria-hidden="true">✦</span>
            </article>

            <article className="hero__promo hero__promo--coupon">
              <span className="hero__promo-kicker">Una sorpresa para vos</span>
              <h2>Estrená con<br />un descuento</h2>
              <a href="#ofertas" className="hero__promo-link">
                Descubrir ofertas <span aria-hidden="true">↗</span>
              </a>
              <span className="hero__ticket" aria-hidden="true">%</span>
            </article>
          </aside>
        </div>

        <nav className="hero__categories" id="categorias" aria-label="Explorar categorías">
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