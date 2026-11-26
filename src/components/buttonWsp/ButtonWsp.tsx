import { FaWhatsapp } from 'react-icons/fa'
import './ButtonWsp.css'

const phoneNumber = '5493813190987'
const message = 'Hola, quiero más información sobre sus productos'
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

function ButtonWsp() {
  return (
    <a
      href={whatsappUrl}
      className="buttonWsp"
      aria-label="Contactanos por WhatsApp"
      target="_blank"
      rel="noreferrer"
    >
      <FaWhatsapp />
    </a>
  )
}

export default ButtonWsp