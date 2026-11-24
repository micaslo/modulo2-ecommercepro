import { Link } from "react-router-dom";
import "./sobrenosotros.css";

function SobreNosotros() {
  return (
    <main className="sobre-nosotros">

      {/* PRESENTACIÓN */}
      <section className="sobre-hero">

        <div className="sobre-hero-texto">

          <span className="sobre-etiqueta">
            MÁS QUE UNA TIENDA
          </span>

          <h1>
            Comprá fácil.
            <br />
            Viví mejor.
          </h1>

          <p>
            Conectamos personas con productos para
            todos los días, en un solo lugar.
          </p>

          <Link to="/sobre-nosotros" className="sobre-boton">
            Conocé nuestra historia →
          </Link>

        </div>

        <div className="sobre-hero-imagen">
          <img
            src="/images/sobre-nosotros.jpg"
            alt="Productos de DeTodito Market"
          />
        </div>

      </section>

      {/* NUESTRA IDENTIDAD */}
      <section className="sobre-identidad">

        <span className="sobre-subtitulo">
          NUESTRA IDENTIDAD
        </span>

        <h2>¿Qué nos hace diferentes?</h2>

        <p className="sobre-descripcion">
          Creamos una experiencia de compra pensada para vos.
        </p>

        <div className="sobre-grid">

          <article className="sobre-card">
            <span>🎯</span>
            <h3>Nuestra misión</h3>
            <p>
              Hacer que comprar sea fácil y accesible.
            </p>
          </article>

          <article className="sobre-card">
            <span>🚀</span>
            <h3>Nuestra visión</h3>
            <p>
              Crecer y conectar cada vez a más personas.
            </p>
          </article>

          <article className="sobre-card">
            <span>🤝</span>
            <h3>Confianza</h3>
            <p>
              Construir relaciones transparentes.
            </p>
          </article>

          <article className="sobre-card">
            <span>⭐</span>
            <h3>Compromiso</h3>
            <p>
              Mejorar cada experiencia de compra.
            </p>
          </article>

        </div>

      </section>

      {/* SECCIÓN FINAL */}
      <section className="sobre-final">

        <h2>Todo lo que necesitás, más cerca.</h2>

        <p>
          Descubrí nuestros productos y encontrá eso
          que estás buscando.
        </p>

        <Link to="/productos" className="sobre-boton">
          Explorar productos →
        </Link>

      </section>

    </main>
  );
}

export default SobreNosotros;