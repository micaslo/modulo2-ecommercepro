import { useEffect, useState } from "react";
import "./BlackFridayBanner.css";

// Lunes 30 de noviembre de 2026 a las 23:59:59 (hora Argentina, UTC-3)
const BLACK_FRIDAY_END_TIMESTAMP = new Date("2026-11-30T23:59:59-03:00").getTime();

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeRemaining(targetTimestamp: number): TimeRemaining | null {
  const diff = targetTimestamp - Date.now();

  if (diff <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function padTwo(value: number): string {
  return String(value).padStart(2, "0");
}

export default function BlackFridayBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(() =>
    getTimeRemaining(BLACK_FRIDAY_END_TIMESTAMP)
  );

  const isActive = timeLeft !== null;

  useEffect(() => {
    if (!isActive) return;

    const intervalId = window.setInterval(() => {
      const next = getTimeRemaining(BLACK_FRIDAY_END_TIMESTAMP);
      setTimeLeft(next);

      if (!next) {
        window.clearInterval(intervalId);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isActive]);

  if (!timeLeft) {
    return null;
  }

  const units = [
    { value: padTwo(timeLeft.days), label: "Días" },
    { value: padTwo(timeLeft.hours), label: "Horas" },
    { value: padTwo(timeLeft.minutes), label: "Minutos" },
    { value: padTwo(timeLeft.seconds), label: "Segundos" },
  ];

  return (
    <section
      className="bf-section"
      id="ofertas"
      aria-label="Conteo regresivo Black Friday extendido"
    >
      <div className="bf-banner">
        <div className="bf-banner__glow bf-banner__glow--violet" aria-hidden="true" />
        <div className="bf-banner__glow bf-banner__glow--orange" aria-hidden="true" />

        <div className="bf-banner__inner">
          <div className="bf-banner__copy">
            <div className="bf-banner__badges">
              <span className="bf-banner__badge bf-banner__badge--live">
                <span className="bf-banner__dot" aria-hidden="true" />
                BLACK FRIDAY EXTENDIDO
              </span>
              <span className="bf-banner__badge bf-banner__badge--deadline">
                HASTA EL LUNES 30 · 23:59 HS
              </span>
            </div>

            <h2 className="bf-banner__title">
              APROVECHÁ TODOS NUESTROS DESCUENTOS
            </h2>
            <p className="bf-banner__subtitle">
              ¡¡EXTENDEMOS EL BLACK FRIDAY HASTA EL LUNES!!
            </p>
          </div>

          <div
            className="bf-banner__countdown"
            role="timer"
            aria-live="off"
            aria-label={`Faltan ${timeLeft.days} días, ${timeLeft.hours} horas, ${timeLeft.minutes} minutos y ${timeLeft.seconds} segundos para que termine el Black Friday`}
          >
            <span className="bf-banner__countdown-kicker">Termina en</span>

            <div className="bf-banner__grid">
              {units.map((unit, index) => (
                <div className="bf-banner__unit-wrap" key={unit.label}>
                  <div className="bf-banner__unit">
                    <strong className="bf-banner__value">{unit.value}</strong>
                    <span className="bf-banner__label">{unit.label}</span>
                  </div>
                  {index < units.length - 1 && (
                    <span className="bf-banner__sep" aria-hidden="true">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
