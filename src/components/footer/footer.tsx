import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
  FaApplePay,
  FaCcAmex,
  FaLock,
} from "react-icons/fa6";
import logoWhite from "../../assets/images/logo/tl-imagotype-white.webp";
import "./footer.css";

const WHATSAPP_URL = "https://wa.me/5493813190987";
const EMAIL = "contacto@tiendaliebre.com";

const socials = [
  { label: "Instagram", href: "https://instagram.com", icon: <FaInstagram /> },
  { label: "Facebook", href: "https://facebook.com", icon: <FaFacebookF /> },
  { label: "TikTok", href: "https://tiktok.com", icon: <FaTiktok /> },
  { label: "YouTube", href: "https://youtube.com", icon: <FaYoutube /> },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footerAccentLine" aria-hidden="true" />

      <div className="footerInner">
        <div className="footerBrand">
          <Link to="/" className="footerLogo" aria-label="Tienda Liebre, inicio">
            <img
              src={logoWhite}
              alt="Tienda Liebre"
              className="footerLogoImg"
            />
          </Link>

          <p className="footerTagline">
            Todo lo que buscás, en un solo lugar. Encontrá tecnología, ofertas
            y las mejores oportunidades con envío ágil a todo el país.
          </p>

          <div className="footerSocials">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className="footerSocial"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <nav className="footerCol" aria-label="Información">
          <h3 className="footerTitle">INFORMACIÓN</h3>
          <ul>
            <li>
              <Link to="/sobrenosotros">Sobre nosotros</Link>
            </li>
            <li>
              <Link to="/productos">Catálogo</Link>
            </li>
            <li>
              <Link to="/resellers">Revendedores</Link>
            </li>
          </ul>
        </nav>

        <nav className="footerCol" aria-label="Ayuda y contacto">
          <h3 className="footerTitle">AYUDA Y CONTACTO</h3>
          <ul>
            <li>
              <Link to="/como-llegar">Cómo llegar</Link>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
          </ul>
        </nav>

        <div className="footerCol">
          <h3 className="footerTitle">PAGOS Y CONFIANZA</h3>

          <p className="footerPaymentText">
            Tus pagos están protegidos y tus datos siempre seguros.
          </p>

          <div className="footerPayments">
            <span>
              <FaCcVisa />
            </span>
            <span>
              <FaCcMastercard />
            </span>
            <span>
              <FaCcAmex />
            </span>
            <span>
              <FaApplePay />
            </span>
          </div>

          <div className="footerSecurity">
            <FaLock />
            <span>Compra segura y protegida</span>
          </div>
        </div>
      </div>

      <div className="footerBottom">
        <div className="footerBottomInner">
          <span>© {year} Tienda Liebre. Todos los derechos reservados.</span>

          <div className="footerBottomLinks">
            <Link to="/privacidad">Privacidad</Link>
            <Link to="/terminos">Términos</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/accesibilidad">Accesibilidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
