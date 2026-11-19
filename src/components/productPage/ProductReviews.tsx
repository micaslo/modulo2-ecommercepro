import { useState, type FormEvent } from "react";
import type {
  ProductFeatureRating,
  ProductReview,
} from "../../types/productMedia";
import { StarIcon, ThumbsUpIcon } from "./ProductIcons";
import "./ProductReviews.css";

interface ProductReviewsProps {
  productId: string;
  initialReviews: ProductReview[];
  featureRatings: ProductFeatureRating[];
}

function renderStars(score: number, size = 16) {
  return Array.from({ length: 5 }, (_, index) => {
    const starNumber = index + 1;
    const filled = score >= starNumber - 0.2;
    const half = !filled && score >= starNumber - 0.7;
    return <StarIcon key={starNumber} filled={filled} half={half} size={size} />;
  });
}

function loadSavedReviews(productId: string): ProductReview[] {
  try {
    const raw = localStorage.getItem(`product_reviews_${productId}`);
    return raw ? (JSON.parse(raw) as ProductReview[]) : [];
  } catch {
    return [];
  }
}

export default function ProductReviews({
  productId,
  initialReviews,
  featureRatings,
}: ProductReviewsProps) {
  const [userReviews, setUserReviews] = useState<ProductReview[]>(() =>
    loadSavedReviews(productId),
  );
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"helpful" | "recent">("helpful");
  const [showForm, setShowForm] = useState(false);

  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const allReviews = [...userReviews, ...initialReviews];
  const totalCount = allReviews.length;

  const averageScore =
    totalCount > 0
      ? allReviews.reduce((acc, r) => acc + r.rating, 0) / totalCount
      : 0;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = allReviews.filter((r) => r.rating === stars).length;
    const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return { stars, count, percent };
  });

  const filteredReviews = allReviews
    .filter((r) => (starFilter ? r.rating === starFilter : true))
    .sort((a, b) => {
      if (sortBy === "helpful") {
        const aVotes = a.helpful + (helpfulVotes[a.id] ? 1 : 0);
        const bVotes = b.helpful + (helpfulVotes[b.id] ? 1 : 0);
        return bVotes - aVotes;
      }
      return 0;
    });

  const toggleHelpful = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;

    const formattedDate = new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date());

    const created: ProductReview = {
      id: `user-${Date.now()}`,
      author: newAuthor.trim() || "Comprador",
      rating: newRating,
      date: formattedDate,
      comment: trimmedComment,
      helpful: 0,
      verified: true,
    };

    const updated = [created, ...userReviews];
    setUserReviews(updated);
    try {
      localStorage.setItem(
        `product_reviews_${productId}`,
        JSON.stringify(updated),
      );
    } catch {
      // Ignora errores de cuota en localStorage
    }

    setNewAuthor("");
    setNewRating(5);
    setNewComment("");
    setShowForm(false);
    setStarFilter(null);
  };

  return (
    <section className="productPageSection pageCard reviewsSection" id="opiniones">
      <div className="sectionHeader">
        <h2>Opiniones del producto</h2>
        <button
          type="button"
          className="reviewsWriteBtn"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancelar" : "Escribir una opinión"}
        </button>
      </div>

      {showForm && (
        <form className="reviewForm" onSubmit={handleSubmit}>
          <div className="reviewFormRow">
            <label className="reviewFormField">
              Tu nombre
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Ej: Valentina L."
                maxLength={40}
              />
            </label>

            <div className="reviewFormField">
              <span>Tu calificación</span>
              <div className="reviewStarPicker" role="radiogroup" aria-label="Elegir estrellas">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`reviewStarBtn ${n <= newRating ? "isActive" : ""}`}
                    onClick={() => setNewRating(n)}
                    aria-label={`${n} estrellas`}
                  >
                    <StarIcon filled={n <= newRating} size={22} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="reviewFormField">
            Contanos qué te pareció el producto
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribí tu experiencia con el producto..."
              rows={3}
              required
            />
          </label>

          <button type="submit" className="productBtn productBtnPrimary reviewSubmitBtn">
            Publicar opinión
          </button>
        </form>
      )}

      <div className="reviewsLayout">
        {/* Columna izquierda: resumen de calificación y atributos */}
        <aside className="reviewsSummary">
          <div className="reviewsScoreHeader">
            <span className="reviewsAverage">{averageScore.toFixed(1)}</span>
            <div className="reviewsScoreMeta">
              <div className="reviewsStars">{renderStars(averageScore, 18)}</div>
              <span className="reviewsTotal">
                {totalCount} {totalCount === 1 ? "calificación" : "calificaciones"}
              </span>
            </div>
          </div>

          <div className="reviewsBars">
            {distribution.map((row) => (
              <button
                key={row.stars}
                type="button"
                className={`reviewsBarRow ${starFilter === row.stars ? "isActive" : ""}`}
                onClick={() =>
                  setStarFilter((prev) => (prev === row.stars ? null : row.stars))
                }
                aria-pressed={starFilter === row.stars}
              >
                <span className="reviewsBarLabel">{row.stars} ★</span>
                <span className="reviewsBarTrack">
                  <span
                    className="reviewsBarFill"
                    style={{ width: `${row.percent}%` }}
                  />
                </span>
                <span className="reviewsBarCount">{row.count}</span>
              </button>
            ))}
          </div>

          {featureRatings.length > 0 && (
            <div className="reviewsFeatures">
              <h3>Calificación de características</h3>
              {featureRatings.map((feat) => (
                <div className="reviewsFeatureItem" key={feat.label}>
                  <div className="reviewsFeatureTop">
                    <span>{feat.label}</span>
                    <strong>{feat.score.toFixed(1)}</strong>
                  </div>
                  <div className="reviewsStars">{renderStars(feat.score, 14)}</div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Columna derecha: filtros y listado */}
        <div className="reviewsFeed">
          <div className="reviewsToolbar">
            <div className="reviewsFilterChips">
              <button
                type="button"
                className={`reviewsChip ${starFilter === null ? "isActive" : ""}`}
                onClick={() => setStarFilter(null)}
              >
                Todas ({totalCount})
              </button>
              {[5, 4, 3].map((stars) => {
                const count = allReviews.filter((r) => r.rating === stars).length;
                if (count === 0) return null;
                return (
                  <button
                    key={stars}
                    type="button"
                    className={`reviewsChip ${starFilter === stars ? "isActive" : ""}`}
                    onClick={() =>
                      setStarFilter((prev) => (prev === stars ? null : stars))
                    }
                  >
                    {stars} ★ ({count})
                  </button>
                );
              })}
            </div>

            <label className="reviewsSort">
              <span>Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "helpful" | "recent")
                }
              >
                <option value="helpful">Más útiles</option>
                <option value="recent">Más recientes</option>
              </select>
            </label>
          </div>

          {filteredReviews.length === 0 ? (
            <p className="reviewsEmpty">
              No hay opiniones con esta calificación todavía.
            </p>
          ) : (
            <ul className="reviewsList">
              {filteredReviews.map((review) => {
                const voted = Boolean(helpfulVotes[review.id]);
                const votesCount = review.helpful + (voted ? 1 : 0);
                return (
                  <li key={review.id} className="reviewCard">
                    <div className="reviewCardTop">
                      <div className="reviewsStars">
                        {renderStars(review.rating, 15)}
                      </div>
                      <span className="reviewDate">{review.date}</span>
                    </div>

                    <p className="reviewComment">{review.comment}</p>

                    <div className="reviewCardFooter">
                      <span className="reviewAuthor">
                        {review.author}
                        {review.verified && (
                          <span className="reviewVerified">Compra verificada</span>
                        )}
                      </span>

                      <button
                        type="button"
                        className={`reviewHelpfulBtn ${voted ? "isVoted" : ""}`}
                        onClick={() => toggleHelpful(review.id)}
                        aria-pressed={voted}
                      >
                        <ThumbsUpIcon size={14} />
                        <span>Es útil</span>
                        <span className="reviewHelpfulCount">{votesCount}</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
