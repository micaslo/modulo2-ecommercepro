import './Error-404.css'
import logoDarkText from '../../assets/images/logo/tl-imagotype-black.webp'
import logoWhiteText from '../../assets/images/logo/tl-imagotype-white.webp'

type Error404Props = {
  homeHref?: string
}

export default function Error404({ homeHref = '/' }: Error404Props) {
  return (
    <main className="error404Page">
      <a className="error404Brand" href={homeHref} aria-label="Tienda Liebre, ir al inicio">
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
      </a>

      <section className="error404Card" aria-labelledby="error404-title">
        <div className="error404Copy">
          <p className="error404Code">Error 404</p>
          <h1 id="error404-title">¡Ups! Página no encontrada</h1>
          <p className="error404Description">
            Parece que este producto se perdió en el camino. Volvamos al inicio y
            encontremos algo genial en Tienda Liebre.
          </p>
          <a className="error404Home" href={homeHref}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />
            </svg>
            <span>Ir al inicio</span>
          </a>
        </div>

        <div className="error404Art" aria-hidden="true">
          <span className="error404Spark error404SparkOne">✦</span>
          <span className="error404Spark error404SparkTwo">✦</span>
          <span className="error404Spark error404SparkThree">✦</span>
          <svg className="error404Bag" viewBox="0 0 360 420" fill="none">
            <path className="error404BagBody" d="M79 91h202l35 282H44L79 91Z" />
            <path className="error404BagHandle" d="M115 108V75a65 65 0 0 1 130 0v33" />
            <circle className="error404BagFace" cx="132" cy="213" r="8" />
            <circle className="error404BagFace" cx="228" cy="213" r="8" />
            <path className="error404BagSmile" d="M146 256q33 29 67 0" />
            <path className="error404BagDetail" d="M126 301h108" />
          </svg>
        </div>
      </section>
    </main>
  )
}
