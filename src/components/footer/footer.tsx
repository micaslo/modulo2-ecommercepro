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

const WHATSAPP_URL = "https://wa.me/3810000000";
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
      <div className="footer__accent-line" aria-hidden="true" />

      <div className="footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo" aria-label="Tienda Liebre, inicio">
            <img
              src={logoWhite}
              alt="Tienda Liebre"
              className="footer__logo-img"
            />
          </Link>

          <p className="footer__tagline">
            Todo lo que buscás, en un solo lugar. Encontrá tecnología, ofertas
            y las mejores oportunidades con envío ágil a todo el país.
          </p>

          <div className="footer__socials">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className="footer__social"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <nav className="footer__col" aria-label="Información">
          <h3 className="footer__title">INFORMACIÓN</h3>
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
            <li>
              <Link to="/sell-my-product">Vender mi producto</Link>
            </li>
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Ayuda y contacto">
          <h3 className="footer__title">AYUDA Y CONTACTO</h3>
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

        <div className="footer__col">
          <h3 className="footer__title">PAGOS Y CONFIANZA</h3>

          <p className="footer__payment-text">
            Tus pagos están protegidos y tus datos siempre seguros.
          </p>

          <div className="footer__payments">
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

          <div className="footer__security">
            <FaLock />
            <span>Compra segura y protegida</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <span>© {year} Tienda Liebre. Todos los derechos reservados.</span>

          <div className="footer__bottom-links">
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
