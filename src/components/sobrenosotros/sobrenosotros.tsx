import "./sobrenosotros.css";

import luiss from "../../assets/images/nuestroequipo/luiss.webp";
import mica from "../../assets/images/nuestroequipo/mica.webp";
import rosario from "../../assets/images/nuestroequipo/rosario.webp";
import tanque from "../../assets/images/nuestroequipo/tanque.webp";

interface Integrante {
  nombre: string;
  rol: string;
  descripcion: string;
  foto: string;
}

const integrantes: Integrante[] = [
  {
    nombre: "Rosario",
    rol: "Developer",
    descripcion: "Parte del equipo de DeTodito Market.",
    foto: rosario,
  },
  {
    nombre: "Micaela",
    rol: "Team Leader (TL)",
    descripcion: "Parte del equipo de DeTodito Market.",
    foto: mica,
  },
  {
    nombre: "Luis",
    rol: "Developer",
    descripcion: "Parte del equipo de DeTodito Market.",
    foto: luiss,
  },
  {
    nombre: "Juan Pablo",
    rol: "Srum Master",
    descripcion: "Parte del equipo de DeTodito Market.",
    foto: tanque,
  },
];

function SobreNosotros() {
  return (
    <main className="pagina-equipo">

      
      <section className="equipo-portada">
        <div className="equipo-portada-contenido">

          <span className="equipo-etiqueta">
            DETRÁS DE DETODITO MARKET
          </span>

          <h1>Sobre Nosotros</h1>

          <p>
            Conocé a las personas que están detrás de
            DeTodito Market. Un equipo que trabaja con
            compromiso, creatividad y dedicación.
          </p>

        </div>
      </section>

      
      <section className="equipo-seccion">

        <div className="equipo-titulo">
          <span>PERSONAS QUE HACEN POSIBLE ESTA IDEA</span>

          <h2>Detrás de DeTodito Market</h2>

          <p>
            Cada integrante aporta sus ideas, habilidades
            y esfuerzo para construir este proyecto.
          </p>
        </div>

       
        <div className="equipo-grid">

          {integrantes.map((persona) => (
            <article
              className="integrante-card"
              key={persona.nombre}
            >

              <div className="integrante-foto">
                <img
                  src={persona.foto}
                  alt={`Foto de ${persona.nombre}`}
                  loading="lazy"
                />
              </div>

              <div className="integrante-info">
                <h3>{persona.nombre}</h3>

                <span className="integrante-rol">
                  {persona.rol}
                </span>

                <p>{persona.descripcion}</p>
              </div>

            </article>
          ))}

        </div>

      </section>

    
      <section className="equipo-final">

        <h2>¡Gracias por conocernos!</h2>

        <p>
          Seguimos trabajando para ofrecerte una mejor
          experiencia de compra.
        </p>

      </section>

    </main>
  );
}

export default SobreNosotros;