import './How-to-get-there.css'
import logoIsotype from '../../assets/images/logo/tl-isotype.webp'

const branch = {
  name: 'Tienda Liebre',
  address: 'Gral. José María Paz 576, T4000 San Miguel de Tucumán, Tucumán, Argentina',
  mapAddress: 'Gral. Paz 576 · San Miguel de Tucumán',
  hours: 'Lun. a sáb.',
  time: '09:00 a 21:00 hs',
  floor: 'Entrepiso',
  latitude: -26.8366,
  longitude: -65.2072,
}

const bingMapsUrl = `https://www.bing.com/maps/default.aspx?${new URLSearchParams({
  where1: branch.address,
}).toString()}`

function LocationPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

export default function HowToGetThere() {
  return (
    <section className="how-to-get-there">
      <div
        className="how-to-get-there__panel"
        aria-labelledby="directions-title"
      >
        <div className="how-to-get-there__details">
          <p className="how-to-get-there__eyebrow">Cómo llegar</p>
          <h2 id="directions-title">
            Te esperamos en <span>{branch.name}</span>
          </h2>

          <ul className="how-to-get-there__hours" aria-label="Horario y ubicación">
            <li>{branch.hours}</li>
            <li>{branch.time}</li>
            <li>{branch.floor}</li>
          </ul>

          <a
            className="how-to-get-there__button"
            href={bingMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LocationPin />
            <span>Abrir en Bing Maps</span>
            <svg
              className="how-to-get-there__external"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </div>

        <div
          className="how-to-get-there__map-card"
          aria-label="Ubicación de Tienda Liebre"
        >
          <div className="how-to-get-there__map-art">
            <iframe
              className="how-to-get-there__map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.1110035048696!2d-65.20970432488996!3d-26.836421490020065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225c0e8d3f160f%3A0xaf25f4de8ee29e12!2sGral.%20Jos%C3%A9%20Mar%C3%ADa%20Paz%20576%2C%20T4000%20San%20Miguel%20de%20Tucum%C3%A1n%2C%20Tucum%C3%A1n!5e0!3m2!1ses-419!2sar!4v1795120033082!5m2!1ses-419!2sar"
              title="Mapa de Tienda Liebre, Gral. Paz 576, San Miguel de Tucumán"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="how-to-get-there__map-label">
            <div className="how-to-get-there__map-label-icon">
              <img src={logoIsotype} alt="" aria-hidden="true" />
            </div>

            <div className="how-to-get-there__map-label-copy">
              <strong>{branch.name}</strong>
              <span>{branch.mapAddress}</span>
            </div>

            <span className="how-to-get-there__coordinates">
              {branch.latitude.toFixed(4)}, {branch.longitude.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
