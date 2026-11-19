import './How-to-get-there.css'

const branch = {
  name: 'Detodito Market',
  address: 'Calle Gral. Paz 576, Entrepiso, 4000 San Miguel de Tucumán, Tucumán',
  streetLine: 'Gral. Paz 576 · San Miguel de Tucumán',
  hours: 'Lunes a sábado',
  time: '09:00 a 18:00 hs',
  floor: 'Entrepiso',
  latitude: -26.8366,
  longitude: -65.2072,
}

const mapPoint = [
  'point',
  branch.latitude,
  branch.longitude,
  `${branch.name} - ${branch.streetLine}`,
  branch.floor,
].join('_')

const bingMapsUrl = `https://www.bing.com/maps/default.aspx?${new URLSearchParams({
  cp: `${branch.latitude}~${branch.longitude}`,
  lvl: '17',
  sp: mapPoint,
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
    <main className="how-to-get-there">
      <section className="how-to-get-there__panel" aria-labelledby="directions-title">
        <div className="how-to-get-there__details">
          <p className="how-to-get-there__eyebrow">Cómo llegar</p>
          <h1 id="directions-title">Te esperamos en <span>{branch.name}</span></h1>
          <div className="how-to-get-there__address">
            <span className="how-to-get-there__address-icon"><LocationPin /></span>
            <p>{branch.address}</p>
          </div>
          <ul className="how-to-get-there__hours" aria-label="Horario y ubicación">
            <li>{branch.hours}</li>
            <li>{branch.time}</li>
            <li>{branch.floor}</li>
          </ul>
          <a className="how-to-get-there__button" href={bingMapsUrl} target="_blank" rel="noopener noreferrer">
            <LocationPin />
            <span>Abrir en Bing Maps</span>
            <svg className="how-to-get-there__external" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </div>
        <div className="how-to-get-there__map-card" aria-label="Referencia de ubicación de Detodito Market">
          <div className="how-to-get-there__map-art" aria-hidden="true">
            <svg className="how-to-get-there__map-grid" viewBox="0 0 680 410" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="map-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M48 0H0V48" fill="none" className="map-grid-line" />
                </pattern>
              </defs>
              <rect width="680" height="410" fill="currentColor" />
              <rect width="680" height="410" fill="url(#map-grid)" />
              <path className="map-road" d="M0 202H680" />
              <path className="map-road map-road--vertical" d="M392 0V410" />
              <path className="map-road-center" d="M0 202H680" />
              <path className="map-road-center map-road-center--vertical" d="M392 0V410" />
            </svg>
            <span className="how-to-get-there__map-pin"><LocationPin /></span>
          </div>
          <div className="how-to-get-there__map-label">
            <div className="how-to-get-there__map-label-icon"><LocationPin /></div>
            <div className="how-to-get-there__map-label-copy">
              <strong>{branch.name}</strong>
              <span>{branch.streetLine}</span>
            </div>
            <span className="how-to-get-there__coordinates">{branch.latitude.toFixed(4)}, {branch.longitude.toFixed(4)}</span>
          </div>
        </div>
      </section>
    </main>
  )
}
