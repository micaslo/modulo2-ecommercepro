import './Error-404.css'

type Error404Props = {
  homeHref?: string
}

export default function Error404({ homeHref = '/' }: Error404Props) {
  return (
    <main className="error404-page">
      <a className="error404-brand" href={homeHref} aria-label="Ecommerce, ir al inicio">
        <span className="error404-brand__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 8h16l-1.4 12H5.4L4 8Z" />
            <path d="M8 9V6a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
        <span>Detodito market</span>
      </a>

      <section className="error404-card" aria-labelledby="error404-title">
        <div className="error404-copy">
          <p className="error404-code">Error 404</p>
          <h1 id="error404-title">¡Ups! Página no encontrada</h1>
          <p className="error404-description">
            Parece que este producto se perdió en el camino. Volvamos al inicio y
            encontremos algo genial.
          </p>
          <a className="error404-home" href={homeHref}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />
            </svg>
            <span>Ir al inicio</span>
          </a>
        </div>

        <div className="error404-art" aria-hidden="true">
          <span className="error404-spark error404-spark--one">✦</span>
          <span className="error404-spark error404-spark--two">✦</span>
          <span className="error404-spark error404-spark--three">✦</span>
          <svg className="error404-bag" viewBox="0 0 360 420" fill="none">
            <path className="error404-bag__body" d="M79 91h202l35 282H44L79 91Z" />
            <path className="error404-bag__handle" d="M115 108V75a65 65 0 0 1 130 0v33" />
            <circle className="error404-bag__face" cx="132" cy="213" r="8" />
            <circle className="error404-bag__face" cx="228" cy="213" r="8" />
            <path className="error404-bag__smile" d="M146 256q33 29 67 0" />
            <path className="error404-bag__detail" d="M126 301h108" />
          </svg>
        </div>
      </section>
    </main>
  )
}
