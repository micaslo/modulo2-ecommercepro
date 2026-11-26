import { Link } from 'react-router-dom'
import './Error-404.css'
import logoDarkText from '../../assets/images/logo/tl-imagotype-black.webp'
import logoWhiteText from '../../assets/images/logo/tl-imagotype-white.webp'

type Error404Props = {
  homeHref?: string
}

export default function Error404({ homeHref = '/' }: Error404Props) {
  return (
    <main className="error404Page">
      <span className="error404Glow error404GlowOne" aria-hidden="true" />
      <span className="error404Glow error404GlowTwo" aria-hidden="true" />

      <Link className="error404Brand" to={homeHref} aria-label="Tienda Liebre, ir al inicio">
        <img
          src={logoDarkText}
          alt="Tienda Liebre"
          className="error404BrandLogo error404BrandLogoLight"
        />
        <img
          src={logoWhiteText}
          alt="Tienda Liebre"
          className="error404BrandLogo error404BrandLogoDark"
        />
      </Link>

      <section className="error404Card" aria-labelledby="error404-title">
        <div className="error404Copy">
          <span className="error404Badge">
            <span className="error404BadgeDot" aria-hidden="true" />
            Ruta no encontrada
          </span>

          <p className="error404Code" aria-hidden="true">404</p>
          <h1 id="error404-title">Esta página se fue de paseo</h1>
          <p className="error404Description">
            No encontramos lo que buscabas, pero la tienda sigue acá. Volvé al inicio
            y descubrí productos que sí están disponibles.
          </p>

          <div className="error404Actions">
            <Link className="btnPrimary error404Home" to={homeHref}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />
              </svg>
              <span>Volver al inicio</span>
            </Link>
            <Link className="btnSecondary error404Explore" to="/productos">
              <span>Explorar productos</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h13m-5-5 5 5-5 5" />
              </svg>
            </Link>
          </div>

          <p className="error404Hint">
            Si llegaste desde un producto nuevo, su ficha todavía está en preparación.
          </p>
        </div>

        <div className="error404Art" aria-hidden="true">
          <span className="error404Orbit error404OrbitOne" />
          <span className="error404Orbit error404OrbitTwo" />
          <span className="error404Spark error404SparkOne">✦</span>
          <span className="error404Spark error404SparkTwo">✦</span>
          <span className="error404Spark error404SparkThree">✦</span>

          <div className="error404BagWrap">
            <span className="error404Tag error404TagOne">¡Ups!</span>
            <span className="error404Tag error404TagTwo">404</span>
            <svg className="error404Bag" viewBox="0 0 360 420" fill="none">
              <path className="error404BagBody" d="M79 91h202l35 282H44L79 91Z" />
              <path className="error404BagHandle" d="M115 108V75a65 65 0 0 1 130 0v33" />
              <circle className="error404BagFace" cx="132" cy="213" r="8" />
              <circle className="error404BagFace" cx="228" cy="213" r="8" />
              <path className="error404BagSmile" d="M146 256q33 29 67 0" />
              <path className="error404BagDetail" d="M126 301h108" />
            </svg>
          </div>
        </div>
      </section>
    </main>
  )
}
