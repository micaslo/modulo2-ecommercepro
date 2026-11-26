import "./sobrenosotros.css";

import luis from "../../assets/images/about-us/luis.webp";
import mica from "../../assets/images/about-us/mica.webp";
import rosario from "../../assets/images/about-us/rosario.webp";
import tanque from "../../assets/images/about-us/tanque.webp";

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
    descripcion: "Parte del equipo de Tienda Liebre.",
    foto: rosario,
  },
  {
    nombre: "Micaela",
    rol: "Team Leader (TL)",
    descripcion: "Parte del equipo de Tienda Liebre.",
    foto: mica,
  },
  {
    nombre: "Luis",
    rol: "Developer",
    descripcion: "Parte del equipo de Tienda Liebre.",
    foto: luis,
  },
  {
    nombre: "Juan Pablo",
    rol: "Scrum Master",
    descripcion: "Parte del equipo de Tienda Liebre.",
    foto: tanque,
  },
];

function SobreNosotros() {
  return (
    <main className="paginaEquipo">
      <section className="equipoPortada">
        <div className="equipoPortadaContenido">
          <span className="equipoEtiqueta">DETRÁS DE TIENDA LIEBRE</span>

          <h1>Sobre Nosotros</h1>

          <p>
            Conocé a las personas que están detrás de Tienda Liebre. Un equipo
            que trabaja con compromiso, creatividad y dedicación.
          </p>
        </div>
      </section>

      <section className="equipoSeccion">
        <div className="equipoTitulo">
          <span>PERSONAS QUE HACEN POSIBLE ESTA IDEA</span>

          <h2>Detrás de Tienda Liebre</h2>

          <p>
            Cada integrante aporta sus ideas, habilidades y esfuerzo para
            construir una experiencia de compra ágil y transparente.
          </p>
        </div>

        <div className="equipoGrid">
          {integrantes.map((persona) => (
            <article className="integranteCard" key={persona.nombre}>
              <div className="integranteFoto">
                <img
                  src={persona.foto}
                  alt={`Foto de ${persona.nombre}`}
                  loading="lazy"
                />
              </div>

              <div className="integranteInfo">
                <h3>{persona.nombre}</h3>

                <span className="integranteRol">{persona.rol}</span>

                <p>{persona.descripcion}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="equipoFinal">
        <h2>¡Gracias por conocernos!</h2>

        <p>
          Seguimos trabajando para ofrecerte la mejor experiencia en Tienda
          Liebre.
        </p>
      </section>
    </main>
  );
}

export default SobreNosotros;
