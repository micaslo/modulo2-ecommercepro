import "./Hero.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import tecnologiaImg from "../../assets/images/categories/tecnologia.webp";
import hogarImg from "../../assets/images/categories/hogar.webp";
import modaImg from "../../assets/images/categories/moda.webp";
import bellezaImg from "../../assets/images/categories/belleza.webp";

const categories = [
  { image: tecnologiaImg, title: "Tecnología", subtitle: "Innovación para todos los días" },
  { image: hogarImg, title: "Hogar", subtitle: "Un espacio más tuyo" },
  { image: modaImg, title: "Moda", subtitle: "Tu estilo, a tu manera" },
  { image: bellezaImg, title: "Belleza", subtitle: "Pequeños grandes rituales" },
];

const slides = [
  {
    title: "Smartphones y tablets",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=2200&q=90",
    category: "TECNOLOGÍA",
    discount: "HASTA 45% OFF",
    detail: "Últimas ofertas en stock para renovar tus dispositivos.",
  },
  {
    title: "Zapatillas",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2200&q=90",
    category: "MODA",
    discount: "HASTA 40% OFF",
    detail: "Encontrá tu próximo par entre las ofertas Black Friday.",
  },
  {
    title: "Auriculares",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=2200&q=90",
    category: "TECNOLOGÍA · AUDIO",
    discount: "HASTA 50% OFF",
    detail: "Sonido para acompañarte todos los días. Últimas unidades.",
  },
  {
    title: "Relojes",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=2200&q=90",
    category: "ACCESORIOS",
    discount: "HASTA 60% OFF",
    detail: "Elegí tu estilo y aprovechá las ofertas por tiempo limitado.",
  },
  {
    title: "Hogar y jardín",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=90",
    category: "HOGAR",
    discount: "HASTA 50% OFF",
    detail: "Renová tus espacios con las últimas ofertas en stock.",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const currentSlide = slides[activeSlide];

  useEffect(() => {
    if (carouselPaused) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [carouselPaused]);

  const showSlide = (index: number) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  return (
    <section className="hero" aria-label="Ofertas Black Friday">
      <div className="hero__inner">
        <div
          className="hero__carousel"
          aria-roledescription="carrusel"
          aria-label="Ofertas Black Friday"
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
        >
          <article className="hero__slide" key={currentSlide.title}>
            <img
              className="hero__slide-image"
              src={currentSlide.image}
              alt={currentSlide.title}
            />
            <div className="hero__slide-shade" />

            <div className="hero__slide-copy">
              <p className="hero__slide-kicker">ÚLTIMOS DÍAS DE BLACK FRIDAY</p>
              <span className="hero__slide-category">{currentSlide.category}</span>
              <h1>{currentSlide.title}</h1>
              <p className="hero__slide-detail">{currentSlide.detail}</p>

              <div className="hero__pills" aria-label="Promoción y financiación">
                <span className="hero__pill hero__pill--discount">
                  {currentSlide.discount}
                </span>
                <span className="hero__pill hero__pill--installments">
                  HASTA 18 CUOTAS
                  <small>SIN INTERÉS</small>
                </span>
              </div>

              <a className="hero__button" href="#ofertas">
                Ver ofertas <span aria-hidden="true">→</span>
              </a>
            </div>

            <button
              className="hero__carousel-arrow hero__carousel-arrow--prev"
              type="button"
              aria-label="Imagen anterior"
              onClick={() => showSlide(activeSlide - 1)}
            >
              ‹
            </button>
            <button
              className="hero__carousel-arrow hero__carousel-arrow--next"
              type="button"
              aria-label="Imagen siguiente"
              onClick={() => showSlide(activeSlide + 1)}
            >
              ›
            </button>

            <div className="hero__carousel-dots" aria-label="Elegir imagen">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={`hero__carousel-dot${
                    index === activeSlide ? " is-active" : ""
                  }`}
                  aria-label={`Ver oferta de ${slide.title}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                  onClick={() => showSlide(index)}
                />
              ))}
            </div>
          </article>
        </div>

        <aside className="hero__side-promos" aria-label="Más ofertas destacadas">
          <article className="hero__promo hero__promo--coins">
            <span className="hero__promo-kicker">Tecnología en oferta</span>
            <h2>Smartphones<br />para elegir</h2>
            <a href="#tecnologia" className="hero__promo-link">
              Ver productos <span aria-hidden="true">↗</span>
            </a>
            <img
              className="hero__promo-image"
              src={slides[0].image}
              alt="Smartphones en oferta"
              loading="lazy"
            />
          </article>

          <article className="hero__promo hero__promo--coupon">
            <span className="hero__promo-kicker">Últimas unidades</span>
            <h2>Zapatillas<br />40% OFF</h2>
            <a href="#ofertas" className="hero__promo-link">
              Comprar ahora <span aria-hidden="true">↗</span>
            </a>
            <img
              className="hero__promo-image"
              src={slides[1].image}
              alt="Zapatillas con descuento"
              loading="lazy"
            />
          </article>
        </aside>

        <nav className="hero__categories" id="categorias" aria-label="Explorar categorías">
          {categories.map((category) => (
            <Link
              className="hero__category"
              to="/error-404"
              key={category.title}
            >
              <img
                className="hero__category-image"
                src={category.image}
                alt={category.title}
              />
              <span className="hero__category-copy">
                <strong>{category.title}</strong>
                <small>{category.subtitle}</small>
              </span>
              <span className="hero__category-arrow" aria-hidden="true">↗</span>
            </Link>
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
            <strong>Últimas ofertas</strong>
            <span>hasta agotar stock</span>
          </div>
          <div className="hero__deal">
            <strong>Hasta 18 cuotas</strong>
            <span>sin interés</span>
          </div>
          <a href="#ofertas" className="hero__deal-cta">
            Ver todas las ofertas <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}