import { useState, type KeyboardEvent, type TouchEvent } from "react";
import "./ImageCarousel.css";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const total = images.length;
  if (total === 0) return <div className="carousel carouselEmpty">Sin imágenes</div>;

  const goTo = (index: number) => setCurrent((index + total) % total);
  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

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
    <div className="carousel" onKeyDown={handleKeyDown}>
      <ul className="carouselThumbs" aria-label="Miniaturas">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              className={`carouselThumb ${i === current ? "isActive" : ""}`}
              onMouseEnter={() => setCurrent(i)}
              onFocus={() => setCurrent(i)}
              onClick={() => setCurrent(i)}
              aria-label={`Ver imagen ${i + 1} de ${total}`}
              aria-current={i === current}
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
        <img
          key={images[current]}
          className="carouselMain"
          src={images[current]}
          alt={`${alt} - imagen ${current + 1}`}
        />

        {total > 1 && (
          <>
            <button type="button" className="carouselArrow carouselArrowPrev" onClick={prev} aria-label="Imagen anterior">
              ‹
            </button>
            <button type="button" className="carouselArrow carouselArrowNext" onClick={next} aria-label="Imagen siguiente">
              ›
            </button>
          </>
        )}

        <span className="carouselCounter" aria-live="polite">
          {current + 1} / {total}
        </span>
      </div>
    </div>
  );
}