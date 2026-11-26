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
    detail: "Últimas ofertas en stock para renovar tus dispositivos con envío express.",
  },
  {
    title: "Zapatillas urbanas",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2200&q=90",
    category: "MODA",
    discount: "HASTA 40% OFF",
    detail: "Encontrá tu próximo par con financiación sin interés en Tienda Liebre.",
  },
  {
    title: "Auriculares pro",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=2200&q=90",
    category: "TECNOLOGÍA · AUDIO",
    discount: "HASTA 50% OFF",
    detail: "Sonido envolvente para acompañarte todos los días. Últimas unidades.",
  },
  {
    title: "Relojes y accesorios",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=2200&q=90",
    category: "ACCESORIOS",
    discount: "HASTA 60% OFF",
    detail: "Diseño minimalista y oportunidades por tiempo limitado.",
  },
  {
    title: "Hogar y diseño",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=90",
    category: "HOGAR",
    discount: "HASTA 50% OFF",
    detail: "Renová tus espacios con las últimas ofertas seleccionadas.",
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
    <section className="hero" aria-label="Ofertas destacadas de Tienda Liebre">
      <div className="hero__inner">
        <div
          className="hero__carousel"
          aria-roledescription="carrusel"
          aria-label="Ofertas destacadas"
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
              <div className="hero__slide-eyebrows">
                <span className="hero__slide-kicker">TIENDA LIEBRE · DESTACADOS</span>
                <span className="hero__slide-category">{currentSlide.category}</span>
              </div>
              <h1>{currentSlide.title}</h1>
              <p className="hero__slide-detail">{currentSlide.detail}</p>

              <div className="hero__pills" aria-label="Promoción y financiación">
                <span className="hero__pill hero__pill--discount">
                  {currentSlide.discount}
                </span>
                <span className="hero__pill hero__pill--installments">
                  Hasta 18 cuotas
                  <small>sin interés</small>
                </span>
              </div>

              <Link className="hero__button" to="/productos">
                Explorar ofertas <span aria-hidden="true">→</span>
              </Link>
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
          <article className="hero__promo hero__promo--gradient">
            <span className="hero__promo-kicker">Tecnología en oferta</span>
            <h2>
              Smartphones
              <br />
              para elegir
            </h2>
            <Link to="/productos?categoria=Tecnolog%C3%ADa" className="hero__promo-link">
              Ver productos <span aria-hidden="true">↗</span>
            </Link>
            <img
              className="hero__promo-image"
              src={slides[0].image}
              alt="Smartphones en oferta"
              loading="lazy"
            />
          </article>

          <article className="hero__promo hero__promo--gradient">
            <span className="hero__promo-kicker">Últimas unidades</span>
            <h2>
              Oportunidades
              <br />
              hasta 40% OFF
            </h2>
            <Link to="/mas-vendidos" className="hero__promo-link">
              Comprar ahora <span aria-hidden="true">↗</span>
            </Link>
            <img
              className="hero__promo-image"
              src={slides[1].image}
              alt="Ofertas destacadas"
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
      </div>
    </section>
  );
}
