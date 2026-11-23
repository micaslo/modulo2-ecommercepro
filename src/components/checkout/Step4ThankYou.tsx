import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaCreditCard,
  FaMapMarkerAlt,
  FaPrint,
  FaReceipt,
} from "react-icons/fa";
import {
  formatARS,
  getCardBrandLabel,
  getFiscalConditionLabel,
} from "../../data/checkoutConfig";
import type { CompletedOrder } from "../../types/cart";

interface Step4ThankYouProps {
  order: CompletedOrder;
}

export default function Step4ThankYou({ order }: Step4ThankYouProps) {
  const { customer, payment, items } = order;

  return (
    <section className="checkoutCard thankYouCard" aria-labelledby="step4-heading">
      <div className="thankYouHero">
        <div className="thankYouIcon">
          <FaCheckCircle size={42} />
        </div>
        <span className="thankYouBadge">Compra confirmada</span>
        <h2 id="step4-heading" className="thankYouTitle">
          ¡Gracias por tu compra, {customer.firstName}!
        </h2>
        <p className="thankYouSubtitle">
          Te enviamos el comprobante y el seguimiento de tu pedido a{" "}
          <strong>{customer.email}</strong>.
        </p>

        <div className="thankYouOrderMeta">
          <div>
            <span>Número de orden</span>
            <strong>{order.orderNumber}</strong>
          </div>
          <div>
            <span>Fecha</span>
            <strong>{order.createdAt}</strong>
          </div>
          <div>
            <span>Total abonado</span>
            <strong>{formatARS(order.finalTotal)}</strong>
          </div>
        </div>
      </div>

      <div className="thankYouGrid">
        <div className="thankYouInfoBox">
          <h3>
            <FaMapMarkerAlt size={14} /> Datos de envío y contacto
          </h3>
          <p>
            <strong>
              {customer.firstName} {customer.lastName}
            </strong>
          </p>
          <p>Tel: +54 {customer.phone}</p>
          <p>
            {customer.address}, {customer.locality}
          </p>
          <p>
            {customer.province} (CP {customer.postalCode})
          </p>
        </div>

        <div className="thankYouInfoBox">
          <h3>
            <FaReceipt size={14} /> Facturación
          </h3>
          <p>
            <strong>{getFiscalConditionLabel(customer.fiscalCondition)}</strong>
          </p>
          <p>DNI: {customer.dni}</p>
          {customer.cuit && <p>CUIT: {customer.cuit}</p>}
          {customer.businessName && (
            <p>Razón social: {customer.businessName}</p>
          )}
        </div>

        <div className="thankYouInfoBox thankYouInfoBox--full">
          <h3>
            <FaCreditCard size={14} /> Medio de pago
          </h3>
          <p>
            <strong>{getCardBrandLabel(payment.brand)}</strong> terminada en{" "}
            <strong>•••• {payment.last4}</strong> — Titular:{" "}
            {payment.holderName}
          </p>
          <p>
            Plan elegido:{" "}
            <strong>
              {payment.installments.count}{" "}
              {payment.installments.count === 1 ? "cuota" : "cuotas"} de{" "}
              {formatARS(payment.installments.installmentAmount)}
            </strong>{" "}
            (
            {payment.installments.interestFree
              ? "Sin interés"
              : `${payment.installments.cftnaLabel}`}
            )
          </p>
        </div>
      </div>

      <div className="thankYouItemsSection">
        <h3>Productos comprados</h3>
        <ul className="thankYouItemsList">
          {items.map((item) => (
            <li key={item.key} className="thankYouItemRow">
              <img src={item.image} alt={item.name} />
              <div className="thankYouItemInfo">
                <strong>{item.name}</strong>
                <span>
                  Cantidad: {item.quantity}
                  {item.colorLabel ? ` · Color: ${item.colorLabel}` : ""}
                </span>
              </div>
              <strong className="thankYouItemPrice">
                {formatARS(item.price * item.quantity)}
              </strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="thankYouActions">
        <button
          type="button"
          className="checkoutBackBtn"
          onClick={() => window.print()}
        >
          <FaPrint size={14} />
          <span>Imprimir comprobante</span>
        </button>

        <Link to="/" className="btn-primary checkoutNextBtn">
          Volver a la tienda
        </Link>
      </div>
    </section>
  );
}
