import { useEffect, useState } from "react";
import {
  FaCarSide,
  FaExclamationTriangle,
  FaRobot,
  FaTag,
  FaTimes,
} from "react-icons/fa";
import "./CartModals.css";

interface StockLimitModalProps {
  isOpen: boolean;
  productName: string;
  maxStock: number;
  onClose: () => void;
}

export function StockLimitModal({
  isOpen,
  productName,
  maxStock,
  onClose,
}: StockLimitModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="cartModalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stock-modal-title"
      onClick={onClose}
    >
      <div className="cartModalCard" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="cartModalClose"
          onClick={onClose}
          aria-label="Cerrar ventana"
        >
          <FaTimes />
        </button>

        <div className="cartModalIcon cartModalIcon--warning">
          <FaExclamationTriangle />
        </div>

        <h3 id="stock-modal-title" className="cartModalTitle">
          Llegaste al límite de stock
        </h3>

        <p className="cartModalText">
          Alcanzaste el máximo disponible para <strong>{productName}</strong> (
          {maxStock} {maxStock === 1 ? "unidad disponible" : "unidades disponibles"}
          ).
        </p>

        <div className="cartModalActions">
          <button
            type="button"
            className="btn-primary cartModalPrimaryBtn"
            onClick={onClose}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

interface CarAgentModalProps {
  isOpen: boolean;
  productName: string;
  onClose: () => void;
}

export function CarAgentModal({
  isOpen,
  productName,
  onClose,
}: CarAgentModalProps) {
  const [botRequested, setBotRequested] = useState(false);

  const handleClose = () => {
    setBotRequested(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBotRequested(false);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoToBot = () => {
    window.dispatchEvent(
      new CustomEvent("open-chat-bot", {
        detail: {
          topic: "compra-vehiculos-flota",
          productName,
        },
      }),
    );
    setBotRequested(true);
  };

  return (
    <div
      className="cartModalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="car-agent-modal-title"
      onClick={handleClose}
    >
      <div className="cartModalCard" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="cartModalClose"
          onClick={handleClose}
          aria-label="Cerrar ventana"
        >
          <FaTimes />
        </button>

        <div className="cartModalIcon cartModalIcon--agent">
          <FaCarSide />
        </div>

        <h3 id="car-agent-modal-title" className="cartModalTitle">
          Contactá con un agente comercial
        </h3>

        <p className="cartModalText">
          De <strong>{productName}</strong> solo se puede comprar{" "}
          <strong>hasta 1 unidad</strong> de forma online. Para compras
          superiores, ventas corporativas o flotas, comunicate con un asesor a
          través de nuestro bot de atención.
        </p>

        {botRequested && (
          <div className="cartModalBotNotice" role="status">
            <FaRobot />
            <span>
              Bot de Tienda Liebre en preparación: muy pronto te conectaremos
              automáticamente con un asesor desde esta ventana.
            </span>
          </div>
        )}

        <div className="cartModalActions">
          <button
            type="button"
            className="btn-primary cartModalBotBtn"
            data-bot-trigger="true"
            onClick={handleGoToBot}
          >
            <FaRobot />
            <span>Ir al bot de la página</span>
          </button>
          <button
            type="button"
            className="cartModalSecondaryBtn"
            onClick={handleClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

interface CouponAlreadyAppliedModalProps {
  isOpen: boolean;
  couponCode: string;
  onClose: () => void;
}

export function CouponAlreadyAppliedModal({
  isOpen,
  couponCode,
  onClose,
}: CouponAlreadyAppliedModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="cartModalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coupon-duplicate-modal-title"
      onClick={onClose}
    >
      <div className="cartModalCard" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="cartModalClose"
          onClick={onClose}
          aria-label="Cerrar ventana"
        >
          <FaTimes />
        </button>

        <div className="cartModalIcon cartModalIcon--info">
          <FaTag />
        </div>

        <h3 id="coupon-duplicate-modal-title" className="cartModalTitle">
          Ya tenés ese descuento aplicado
        </h3>

        <p className="cartModalText">
          El cupón <strong>{couponCode}</strong> ya se encuentra activo en tu
          resumen de compra.
        </p>

        <div className="cartModalActions">
          <button
            type="button"
            className="btn-primary cartModalPrimaryBtn"
            onClick={onClose}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
