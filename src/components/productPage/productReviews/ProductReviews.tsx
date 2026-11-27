import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ProductFeatureRating,
  ProductReview,
} from "../../../types/productMedia";
import {
  reviewSchema,
  type ReviewFormValues,
} from "../../../schemas/reviewSchema";
import { StarIcon, ThumbsUpIcon } from "../productIcons/ProductIcons";
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

function buildUserReview(values: ReviewFormValues): ProductReview {
  const formattedDate = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return {
    id: `user-${Date.now()}`,
    author: values.author.trim() || "Comprador",
    rating: values.rating,
    date: formattedDate,
    comment: values.comment.trim(),
    helpful: 0,
    verified: true,
  };
}

const SPANISH_MONTHS: Record<string, number> = {
  ene: 0,
  feb: 1,
  mar: 2,
  abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  sep: 8,
  sept: 8,
  oct: 9,
  nov: 10,
  dic: 11,
};

function parseReviewTimestamp(review: ProductReview, fallbackIndex: number): number {
  const userIdMatch = review.id.match(/^user-(\d+)$/);
  if (userIdMatch) {
    return Number(userIdMatch[1]);
  }

  const normalized = review.date.trim().toLowerCase();
  if (normalized === "reciente") {
    return Date.now() - fallbackIndex;
  }

  const esMatch = normalized.match(/^(\d{1,2})\s+([a-záéíóú]+)\.?\s+(\d{4})$/i);
  if (esMatch) {
    const day = Number(esMatch[1]);
    const monthKey = esMatch[2].replace(/\.$/, "").slice(0, 4);
    const month =
      SPANISH_MONTHS[monthKey] ?? SPANISH_MONTHS[monthKey.slice(0, 3)];
    const year = Number(esMatch[3]);
    if (month !== undefined && !Number.isNaN(day) && !Number.isNaN(year)) {
      return new Date(year, month, day).getTime() - fallbackIndex;
    }
  }

  const parsed = Date.parse(review.date);
  return Number.isNaN(parsed) ? 0 - fallbackIndex : parsed;
}

type ReviewSortOption = "helpful" | "recent" | "oldest";

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
  const [sortBy, setSortBy] = useState<ReviewSortOption>("helpful");
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author: "",
      rating: 5,
      comment: "",
    },
  });

  const newRating = useWatch({ control, name: "rating" });

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

  const reviewTimestamps = new Map(
    allReviews.map((review, index) => [
      review.id,
      parseReviewTimestamp(review, index),
    ]),
  );

  const filteredReviews = allReviews
    .filter((r) => (starFilter ? r.rating === starFilter : true))
    .sort((a, b) => {
      if (sortBy === "helpful") {
        const aVotes = a.helpful + (helpfulVotes[a.id] ? 1 : 0);
        const bVotes = b.helpful + (helpfulVotes[b.id] ? 1 : 0);
        return bVotes - aVotes;
      }
      const timeA = reviewTimestamps.get(a.id) ?? 0;
      const timeB = reviewTimestamps.get(b.id) ?? 0;
      return sortBy === "recent" ? timeB - timeA : timeA - timeB;
    });

  const toggleHelpful = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const onValidSubmit = (values: ReviewFormValues) => {
    const created = buildUserReview(values);

    const updated = [created, ...userReviews];
    setUserReviews(updated);
    try {
      localStorage.setItem(
        `product_reviews_${productId}`,
        JSON.stringify(updated),
      );
    } catch {
      //
    }

    reset({ author: "", rating: 5, comment: "" });
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
        <form
          className="reviewForm"
          onSubmit={(e) => {
            void handleSubmit(onValidSubmit)(e);
          }}
          noValidate
        >
          <div className="reviewFormRow">
            <label className="reviewFormField">
              Tu nombre
              <input
                type="text"
                placeholder="Ej: Valentina L."
                maxLength={40}
                aria-invalid={Boolean(errors.author)}
                {...register("author")}
              />
              {errors.author && (
                <span className="reviewFieldError" role="alert">
                  {errors.author.message}
                </span>
              )}
            </label>

            <div className="reviewFormField">
              <span>Tu calificación</span>
              <div className="reviewStarPicker" role="radiogroup" aria-label="Elegir estrellas">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`reviewStarBtn ${n <= newRating ? "isActive" : ""}`}
                    onClick={() =>
                      setValue("rating", n, { shouldValidate: true })
                    }
                    aria-label={`${n} estrellas`}
                  >
                    <StarIcon filled={n <= newRating} size={22} />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <span className="reviewFieldError" role="alert">
                  {errors.rating.message}
                </span>
              )}
            </div>
          </div>

          <label className="reviewFormField">
            Contanos qué te pareció el producto
            <textarea
              placeholder="Escribí tu experiencia con el producto..."
              rows={3}
              aria-invalid={Boolean(errors.comment)}
              {...register("comment")}
            />
            {errors.comment && (
              <span className="reviewFieldError" role="alert">
                {errors.comment.message}
              </span>
            )}
          </label>

          <button type="submit" className="productBtn productBtnPrimary reviewSubmitBtn">
            Publicar opinión
          </button>
        </form>
      )}

      <div className="reviewsLayout">
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
                  setSortBy(e.target.value as ReviewSortOption)
                }
              >
                <option value="helpful">Más útiles</option>
                <option value="recent">Más recientes</option>
                <option value="oldest">Más antiguos</option>
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
