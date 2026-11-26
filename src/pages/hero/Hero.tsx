import "./Hero.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import techImg from "../../assets/images/categories/tecnologia.webp";
import homeImg from "../../assets/images/categories/hogar.webp";
import fashionImg from "../../assets/images/categories/moda.webp";
import beautyImg from "../../assets/images/categories/belleza.webp";

const categories = [
  { image: techImg, title: "Tecnología", subtitle: "Innovación para todos los días" },
  { image: homeImg, title: "Hogar", subtitle: "Un espacio más tuyo" },
  { image: fashionImg, title: "Moda", subtitle: "Tu estilo, a tu manera" },
  { image: beautyImg, title: "Belleza", subtitle: "Pequeños grandes rituales" },
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
      <div className="heroInner">
        <div
          className="heroCarousel"
          aria-roledescription="carrusel"
          aria-label="Ofertas destacadas"
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
        >
          <article className="heroSlide" key={currentSlide.title}>
            <img
              className="heroSlideImage"
              src={currentSlide.image}
              alt={currentSlide.title}
            />
            <div className="heroSlideShade" />

            <div className="heroSlideCopy">
              <div className="heroSlideEyebrows">
                <span className="heroSlideKicker">TIENDA LIEBRE · DESTACADOS</span>
                <span className="heroSlideCategory">{currentSlide.category}</span>
              </div>
              <h1>{currentSlide.title}</h1>
              <p className="heroSlideDetail">{currentSlide.detail}</p>

              <div className="heroPills" aria-label="Promoción y financiación">
                <span className="heroPill heroPillDiscount">
                  {currentSlide.discount}
                </span>
                <span className="heroPill heroPillInstallments">
                  Hasta 18 cuotas
                  <small>sin interés</small>
                </span>
              </div>

              <Link className="heroButton" to="/productos">
                Explorar ofertas <span aria-hidden="true">→</span>
              </Link>
            </div>

            <button
              className="heroCarouselArrow heroCarouselArrowPrev"
              type="button"
              aria-label="Imagen anterior"
              onClick={() => showSlide(activeSlide - 1)}
            >
              ‹
            </button>
            <button
              className="heroCarouselArrow heroCarouselArrowNext"
              type="button"
              aria-label="Imagen siguiente"
              onClick={() => showSlide(activeSlide + 1)}
            >
              ›
            </button>

            <div className="heroCarouselDots" aria-label="Elegir imagen">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={`heroCarouselDot${
                    index === activeSlide ? " isActive" : ""
                  }`}
                  aria-label={`Ver oferta de ${slide.title}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                  onClick={() => showSlide(index)}
                />
              ))}
            </div>
          </article>
        </div>

        <aside className="heroSidePromos" aria-label="Más ofertas destacadas">
          <article className="heroPromo heroPromoGradient">
            <span className="heroPromoKicker">Tecnología en oferta</span>
            <h2>
              Smartphones
              <br />
              para elegir
            </h2>
            <Link to="/productos?categoria=Tecnolog%C3%ADa" className="heroPromoLink">
              Ver productos <span aria-hidden="true">↗</span>
            </Link>
            <img
              className="heroPromoImage"
              src={slides[0].image}
              alt="Smartphones en oferta"
              loading="lazy"
            />
          </article>

          <article className="heroPromo heroPromoGradient">
            <span className="heroPromoKicker">Últimas unidades</span>
            <h2>
              Oportunidades
              <br />
              hasta 40% OFF
            </h2>
            <Link to="/mas-vendidos" className="heroPromoLink">
              Comprar ahora <span aria-hidden="true">↗</span>
            </Link>
            <img
              className="heroPromoImage"
              src={slides[1].image}
              alt="Ofertas destacadas"
              loading="lazy"
            />
          </article>
        </aside>

        <nav className="heroCategories" id="categorias" aria-label="Explorar categorías">
          {categories.map((category) => (
            <Link
              className="heroCategory"
              to="/error-404"
              key={category.title}
            >
              <img
                className="heroCategoryImage"
                src={category.image}
                alt={category.title}
              />
              <span className="heroCategoryCopy">
                <strong>{category.title}</strong>
                <small>{category.subtitle}</small>
              </span>
              <span className="heroCategoryArrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
