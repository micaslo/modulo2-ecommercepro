import { useEffect, useId, useRef, useState } from 'react'
import type { Product, ShippingType } from '../../types/productCategory'
import './BestSellers.css'

const formatPrice = (value: number): string =>
  `$ ${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`

const getDiscount = (price: number, originalPrice: number): number =>
  Math.round((1 - price / originalPrice) * 100)

const shippingLabels: Record<ShippingType, string> = {
  tomorrow: 'Llega gratis mañana',
  free: 'Envío gratis',
}

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const { title, image, price, originalPrice, sold, installments, shipping, full, href } = product

  return (
    <article className="bestSellersCard" tabIndex={0}>
      <div className="bestSellersCardInner">
        <div className="bestSellersCardFront">
          <div className="bestSellersCardMedia">
            <img className="bestSellersCardImage" src={image} alt={title} loading="lazy" />
            <span className="bestSellersCardHint" aria-hidden="true">↻</span>
          </div>

          <div className="bestSellersCardBody">
            <h3 className="bestSellersCardTitle">{title}</h3>

            {originalPrice && (
              <div className="bestSellersCardDiscount">
                <span className="bestSellersCardBadge">{getDiscount(price, originalPrice)}% OFF</span>
                <span className="bestSellersCardOldPrice">{formatPrice(originalPrice)}</span>
              </div>
            )}

            <p className="bestSellersCardPrice">{formatPrice(price)}</p>

            {sold && <p className="bestSellersCardSold">{sold}</p>}
          </div>
        </div>

        <div className="bestSellersCardBack">
          <h3 className="bestSellersCardBackTitle">{title}</h3>

          <p className="bestSellersCardBackPrice">{formatPrice(price)}</p>

          {installments && (
            <p className="bestSellersCardInstallments">
              {installments.count} cuotas de {formatPrice(installments.amount)} con{' '}
              {installments.provider}
            </p>
          )}

          {shipping === 'tomorrow' && (
            <span className="bestSellersCardTag">{shippingLabels.tomorrow}</span>
          )}
          {shipping === 'free' && (
            <p className="bestSellersCardShipping">{shippingLabels.free}</p>
          )}

          {full && (
            <p className="bestSellersCardFull">
              <span aria-hidden="true">⚡</span> <strong>FULL</strong> por ser tu primera compra
            </p>
          )}

          <a className="bestSellersCardButton" href={href}>Ver producto</a>
        </div>
      </div>
    </article>
  )
}

interface BestSellersProps {
  title: string
  products: Product[]
  linkLabel?: string
  linkHref?: string
}

function BestSellers({
  title,
  products,
  linkLabel = 'Ir a Más vendidos',
  linkHref = '#',
}: BestSellersProps) {
  const titleId = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const updateArrows = (): void => {
      setCanScrollPrev(track.scrollLeft > 4)
      setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4)
    }

    updateArrows()
    track.addEventListener('scroll', updateArrows)
    window.addEventListener('resize', updateArrows)

    return () => {
      track.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [products])

  const scrollByPage = (direction: 1 | -1): void => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section className="bestSellers" aria-labelledby={titleId}>
      <div className="bestSellersInner">
        <header className="bestSellersHeader">
          <h2 className="bestSellersTitle" id={titleId}>{title}</h2>
          <a className="bestSellersLink" href={linkHref}>{linkLabel}</a>
        </header>

        <div className="bestSellersCarousel">
          {canScrollPrev && (
            <button
              type="button"
              className="bestSellersArrow bestSellersArrowPrev"
              onClick={() => scrollByPage(-1)}
              aria-label="Ver productos anteriores"
            >
              ‹
            </button>
          )}

          <div className="bestSellersTrack" ref={trackRef}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {canScrollNext && (
            <button
              type="button"
              className="bestSellersArrow bestSellersArrowNext"
              onClick={() => scrollByPage(1)}
              aria-label="Ver más productos"
            >
              ›
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default BestSellers