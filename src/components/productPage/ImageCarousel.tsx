import { useEffect, useState, type KeyboardEvent, type TouchEvent } from "react";
import "./ImageCarousel.css";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = images.length;
  const safeIndex = total > 0 ? Math.min(current, total - 1) : 0;

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + total) % total);
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, total]);

  if (total === 0) {
    return <div className="carousel carouselEmpty">Sin imágenes disponibles</div>;
  }

  const goTo = (index: number) => setCurrent((index + total) % total);
  const prev = () => goTo(safeIndex - 1);
  const next = () => goTo(safeIndex + 1);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) (diff > 0 ? prev : next)();
    setTouchStartX(null);
  };

  return (
    <>
      <div className="carousel" onKeyDown={handleKeyDown}>
        <ul className="carouselThumbs" aria-label="Miniaturas del producto">
          {images.map((src, i) => (
            <li key={`${src}-${i}`}>
              <button
                type="button"
                className={`carouselThumb ${i === safeIndex ? "isActive" : ""}`}
                onMouseEnter={() => setCurrent(i)}
                onFocus={() => setCurrent(i)}
                onClick={() => setCurrent(i)}
                aria-label={`Ver imagen ${i + 1} de ${total}`}
                aria-current={i === safeIndex}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>

        <div
          className="carouselStage"
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className="carouselMainBtn"
            onClick={() => setLightboxOpen(true)}
            aria-label="Ampliar imagen del producto"
          >
            <img
              key={images[safeIndex]}
              className="carouselMain"
              src={images[safeIndex]}
              alt={`${alt} - imagen ${safeIndex + 1}`}
            />
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                className="carouselArrow carouselArrowPrev"
                onClick={prev}
                aria-label="Imagen anterior"
              >
                ‹
              </button>
              <button
                type="button"
                className="carouselArrow carouselArrowNext"
                onClick={next}
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            </>
          )}

          <span className="carouselCounter" aria-live="polite">
            {safeIndex + 1} / {total}
          </span>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="carouselLightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${alt}`}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="carouselLightboxInner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="carouselLightboxClose"
              onClick={() => setLightboxOpen(false)}
              aria-label="Cerrar vista ampliada"
            >
              ✕
            </button>

            <img
              src={images[safeIndex]}
              alt={`${alt} - vista ampliada ${safeIndex + 1}`}
              className="carouselLightboxImg"
            />

            {total > 1 && (
              <>
                <button
                  type="button"
                  className="carouselArrow carouselArrowPrev isAlwaysVisible"
                  onClick={prev}
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="carouselArrow carouselArrowNext isAlwaysVisible"
                  onClick={next}
                  aria-label="Imagen siguiente"
                >
                  ›
                </button>
              </>
            )}

            <span className="carouselCounter">
              {safeIndex + 1} / {total}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
