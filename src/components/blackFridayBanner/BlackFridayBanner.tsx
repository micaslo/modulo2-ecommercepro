import { useEffect, useState } from "react";
import "./BlackFridayBanner.css";

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
      className="bfSection"
      id="ofertas"
      aria-label="Conteo regresivo Black Friday extendido"
    >
      <div className="bfBanner">
        <div className="bfBannerGlow bfBannerGlowViolet" aria-hidden="true" />
        <div className="bfBannerGlow bfBannerGlowOrange" aria-hidden="true" />

        <div className="bfBannerInner">
          <div className="bfBannerCopy">
            <div className="bfBannerBadges">
              <span className="bfBannerBadge bfBannerBadgeLive">
                <span className="bfBannerDot" aria-hidden="true" />
                BLACK FRIDAY EXTENDIDO
              </span>
              <span className="bfBannerBadge bfBannerBadgeDeadline">
                HASTA EL LUNES 30 · 23:59 HS
              </span>
            </div>

            <h2 className="bfBannerTitle">
              APROVECHÁ TODOS NUESTROS DESCUENTOS
            </h2>
            <p className="bfBannerSubtitle">
              ¡¡EXTENDEMOS EL BLACK FRIDAY HASTA EL LUNES!!
            </p>
          </div>

          <div
            className="bfBannerCountdown"
            role="timer"
            aria-live="off"
            aria-label={`Faltan ${timeLeft.days} días, ${timeLeft.hours} horas, ${timeLeft.minutes} minutos y ${timeLeft.seconds} segundos para que termine el Black Friday`}
          >
            <span className="bfBannerCountdownKicker">Termina en</span>

            <div className="bfBannerGrid">
              {units.map((unit, index) => (
                <div className="bfBannerUnitWrap" key={unit.label}>
                  <div className="bfBannerUnit">
                    <strong className="bfBannerValue">{unit.value}</strong>
                    <span className="bfBannerLabel">{unit.label}</span>
                  </div>
                  {index < units.length - 1 && (
                    <span className="bfBannerSep" aria-hidden="true">
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
