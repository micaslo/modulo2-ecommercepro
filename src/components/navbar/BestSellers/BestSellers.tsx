import { useEffect, useId, useRef, useState } from 'react'
import type { Product, ShippingType } from '../../../types/productCategory'
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
    <article className="productCard">
      <a className="productCardLink" href={href}>
        <div className="productCardMedia">
          <img className="productCardImage" src={image} alt={title} loading="lazy" />
        </div>

        <div className="productCardBody">
          <h3 className="productCardTitle">{title}</h3>

          {originalPrice && (
            <div className="productCardDiscount">
              <span className="productCardBadge">{getDiscount(price, originalPrice)}% OFF</span>
              <span className="productCardOldPrice">{formatPrice(originalPrice)}</span>
            </div>
          )}

          <p className="productCardPrice">{formatPrice(price)}</p>

          {sold && <p className="productCardSold">{sold}</p>}

          {installments && (
            <p className="productCardInstallments">
              {installments.count} cuotas de {formatPrice(installments.amount)} con{' '}
              {installments.provider}
            </p>
          )}

          {shipping === 'tomorrow' && (
            <span className="productCardTag">{shippingLabels.tomorrow}</span>
          )}
          {shipping === 'free' && (
            <p className="productCardShipping">{shippingLabels.free}</p>
          )}

          {full && (
            <p className="productCardFull">
              <span aria-hidden="true">⚡</span> <strong>FULL</strong> por ser tu primera compra
            </p>
          )}
        </div>
      </a>
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
    </section>
  )
}

export default BestSellers