import "./AboutUs.css";

import luis from "../../assets/images/aboutUs/luis.webp";
import mica from "../../assets/images/aboutUs/mica.webp";
import rosario from "../../assets/images/aboutUs/rosario.webp";
import tanque from "../../assets/images/aboutUs/tanque.webp";

interface TeamMember {
  name: string;
  role: string;
  photo: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Micaela",
    role: "Tech Leader (TL)",
    photo: mica,
  },
  {
    name: "Juan Pablo",
    role: "Scrum Master",
    photo: tanque,
  },
  {
    name: "Luis",
    role: "Developer",
    photo: luis,
  },
  {
    name: "Rosario",
    role: "Developer",
    photo: rosario,
  },
];

function AboutUs() {
  return (
    <main className="aboutUsPage">
      <section className="aboutUsSection">
        <div className="aboutUsHeader">
          <span>PERSONAS QUE HACEN POSIBLE ESTA IDEA</span>

          <h1>Detrás de Tienda Liebre</h1>

          <p>
            Cada integrante aporta sus ideas, habilidades y esfuerzo para
            construir una experiencia de compra ágil y transparente.
          </p>
        </div>

        <div className="aboutUsGrid">
          {teamMembers.map((member) => (
            <article className="memberCard" key={member.name}>
              <div className="memberPhoto">
                <img
                  src={member.photo}
                  alt={`Foto de ${member.name}`}
                  loading="lazy"
                />
              </div>

              <div className="memberInfo">
                <h3>{member.name}</h3>

                <span className="memberRole">{member.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="aboutUsClosing">
        <h2>¡Gracias por conocernos!</h2>

        <p>
          Seguimos trabajando para ofrecerte la mejor experiencia en Tienda
          Liebre.
        </p>
      </section>
    </main>
  );
}

export default AboutUs;
