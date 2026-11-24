import { useMemo } from "react";
import {
  getCardBrandLabel,
  getFiscalConditionLabel,
  PROMO_COUPONS,
} from "../../../data/checkoutConfig";
import type { CompletedOrder } from "../../../types/cart";
import "./PrintableInvoice.css";

interface PrintableInvoiceProps {
  order: CompletedOrder;
}

const ISSUER = {
  name: "DeTodito Market S.A.",
  address: "Av. Mate de Luna 2150, San Miguel de Tucumán, Tucumán, Argentina.",
  ivaCondition: "IVA Responsable Inscripto",
  cuit: "30-71849250-9",
  cuitDigits: "30718492509",
  iibb: "30718492509",
  startDate: "01/03/2020",
  pointOfSale: "0001",
};

function formatNumberAR(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDniDots(dni: string): string {
  const digits = dni.replace(/\D/g, "");
  if (!digits) return dni;
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getShortSku(productId: string): string {
  const clean = productId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return `DT-${clean.slice(0, 6)}`;
}

function formatDateOnly(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function buildDeterministicDigits(seed: string, length: number): string {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  let result = "";
  let state = Math.abs(hash) || 135792468;
  while (result.length < length) {
    state = (state * 1664525 + 1013904223) % 2147483647;
    result += String(state % 10);
  }
  return result.slice(0, length);
}

function buildBarcodeBars(code: string): Array<{ x: number; width: number }> {
  const bars: Array<{ x: number; width: number }> = [];
  let cursor = 4;

  bars.push({ x: cursor, width: 1.5 });
  cursor += 3;
  bars.push({ x: cursor, width: 1.5 });
  cursor += 3;

  for (let i = 0; i < code.length; i += 1) {
    const digit = Number(code[i]) || 0;
    const barW = digit % 3 === 0 ? 2.6 : digit % 2 === 0 ? 1.8 : 1.1;
    const gapW = (digit + i) % 3 === 0 ? 2.2 : 1.3;
    bars.push({ x: cursor, width: barW });
    cursor += barW + gapW;
  }

  bars.push({ x: cursor, width: 2.6 });
  cursor += 4;
  bars.push({ x: cursor, width: 1.2 });

  return bars;
}

export default function PrintableInvoice({ order }: PrintableInvoiceProps) {
  const { customer, payment, items } = order;

  const isFacturaA =
    customer.fiscalCondition === "responsable_inscripto" ||
    customer.fiscalCondition === "monotributista";

  const invoiceLetter = isFacturaA ? "A" : "B";
  const invoiceTypeCode = isFacturaA ? "001" : "006";

  const orderDigits = order.orderNumber.replace(/\D/g, "").slice(-8).padStart(8, "0");
  const invoiceNumber = `${invoiceLetter}-${ISSUER.pointOfSale}-${orderDigits}`;

  const issueDateStr = order.createdAt.split(",")[0]?.trim() || formatDateOnly(new Date());

  const caeExpiryDateStr = useMemo(() => {
    const parts = issueDateStr.split("/");
    let baseDate = new Date();
    if (parts.length === 3) {
      const parsed = new Date(
        Number(parts[2]),
        Number(parts[1]) - 1,
        Number(parts[0]),
      );
      if (!Number.isNaN(parsed.getTime())) {
        baseDate = parsed;
      }
    }
    const vto = new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000);
    return formatDateOnly(vto);
  }, [issueDateStr]);

  const caeNumber = useMemo(
    () => `74${buildDeterministicDigits(order.orderNumber, 12)}`,
    [order.orderNumber],
  );

  const caeExpiryCompact = useMemo(() => {
    const [dd = "01", mm = "01", yyyy = "2026"] = caeExpiryDateStr.split("/");
    return `${yyyy}${mm}${dd}`;
  }, [caeExpiryDateStr]);

  const barcodeDigits = `${ISSUER.cuitDigits}${invoiceTypeCode}${ISSUER.pointOfSale}${caeNumber}${caeExpiryCompact}7`;

  const barcodeBars = useMemo(
    () => buildBarcodeBars(barcodeDigits),
    [barcodeDigits],
  );
  const barcodeTotalWidth = useMemo(() => {
    const last = barcodeBars[barcodeBars.length - 1];
    return last ? last.x + last.width + 4 : 260;
  }, [barcodeBars]);

  const discountPercent =
    order.couponCode && PROMO_COUPONS[order.couponCode]
      ? PROMO_COUPONS[order.couponCode].discountPercent
      : 0;

  const netTaxable = isFacturaA ? order.finalTotal / 1.21 : order.finalTotal;
  const iva21Amount = isFacturaA ? order.finalTotal - netTaxable : 0;

  const recipientDisplay = customer.businessName
    ? customer.businessName.toUpperCase()
    : `${customer.lastName}, ${customer.firstName}`.toUpperCase();

  const paymentMethodLabel = `${getCardBrandLabel(payment.brand)} •••• ${
    payment.last4
  } — ${payment.installments.count} ${
    payment.installments.count === 1 ? "cuota" : "cuotas"
  } ${payment.installments.interestFree ? "sin interés" : "con interés"}`;

  return (
    <article className="invoiceDoc" aria-label="Factura de venta">
      <div className="invoiceDocTop">
        <header className="invoiceHeader">
          <div className="invoiceIssuer">
            <div className="invoiceBrandRow">
              <span className="invoiceBrandMark" aria-hidden="true">
                D
              </span>
              <div className="invoiceBrandText">
                <strong>DETODITO</strong>
                <span>MARKET ONLINE</span>
              </div>
            </div>
            <p className="invoiceIssuerName">{ISSUER.name}</p>
            <p className="invoiceIssuerMeta">{ISSUER.address}</p>
            <p className="invoiceIssuerMeta">{ISSUER.ivaCondition}</p>
          </div>

          <div className="invoiceLetterCol">
            <div className="invoiceLetterBox">
              <span className="invoiceLetter">{invoiceLetter}</span>
              <span className="invoiceTypeCode">COD. {invoiceTypeCode}</span>
            </div>
            <span className="invoiceTypeSub">ORIGINAL</span>
          </div>

          <div className="invoiceMetaCol">
            <h1 className="invoiceDocTitle">FACTURA DE VENTA</h1>
            <dl className="invoiceMetaList">
              <div>
                <dt>Número:</dt>
                <dd>{invoiceNumber}</dd>
              </div>
              <div>
                <dt>Fecha:</dt>
                <dd>{issueDateStr}</dd>
              </div>
              <div>
                <dt>CUIT:</dt>
                <dd>{ISSUER.cuit}</dd>
              </div>
              <div>
                <dt>Ing. Brutos:</dt>
                <dd>{ISSUER.iibb}</dd>
              </div>
              <div>
                <dt>Inicio Act.:</dt>
                <dd>{ISSUER.startDate}</dd>
              </div>
            </dl>
          </div>
        </header>

        <section className="invoiceCustomerSection">
          <div className="invoiceCustomerCol">
            <div className="invoiceDataRow">
              <span className="invoiceDataLabel">Sr. (es):</span>
              <span className="invoiceDataValue">{recipientDisplay}</span>
            </div>
            <div className="invoiceDataRow">
              <span className="invoiceDataLabel">Domicilio:</span>
              <span className="invoiceDataValue">
                {customer.address}, {customer.locality}, {customer.province} (CP{" "}
                {customer.postalCode}), Argentina.
              </span>
            </div>
            <div className="invoiceDataRow">
              <span className="invoiceDataLabel">Contacto:</span>
              <span className="invoiceDataValue">
                {customer.email} · +54 {customer.phone}
              </span>
            </div>
          </div>

          <div className="invoiceCustomerCol">
            <div className="invoiceDataRow">
              <span className="invoiceDataLabel">DNI:</span>
              <span className="invoiceDataValue">
                {formatDniDots(customer.dni)}
              </span>
            </div>
            {customer.cuit && (
              <div className="invoiceDataRow">
                <span className="invoiceDataLabel">CUIT:</span>
                <span className="invoiceDataValue">{customer.cuit}</span>
              </div>
            )}
            <div className="invoiceDataRow">
              <span className="invoiceDataLabel">Cond. IVA:</span>
              <span className="invoiceDataValue">
                {getFiscalConditionLabel(customer.fiscalCondition)}
              </span>
            </div>
          </div>
        </section>

        <section className="invoiceTermsRow">
          <div>
            <strong>Moneda:</strong> Pesos Argentinos
          </div>
          <div>
            <strong>Forma de pago:</strong> {paymentMethodLabel}
          </div>
        </section>

        <section className="invoiceItemsSection">
          <table className="invoiceTable">
            <thead>
              <tr>
                <th>Cód.</th>
                <th>Artículo</th>
                <th>Observaciones</th>
                <th className="isRight">Cantidad</th>
                <th className="isRight">Precio</th>
                <th className="isRight">% Dto.</th>
                <th className="isRight">Importe</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const rawLine = item.price * item.quantity;
                const lineDiscount =
                  discountPercent > 0
                    ? Math.round(rawLine * (discountPercent / 100))
                    : 0;
                const netLine = rawLine - lineDiscount;

                return (
                  <tr key={item.key}>
                    <td className="invoiceMono">{getShortSku(item.productId)}</td>
                    <td className="invoiceArticleCell">{item.name}</td>
                    <td>
                      {item.colorLabel ? `Color: ${item.colorLabel}` : item.category}
                    </td>
                    <td className="isRight">{formatNumberAR(item.quantity)}</td>
                    <td className="isRight">{formatNumberAR(item.price)}</td>
                    <td className="isRight">{formatNumberAR(discountPercent)}</td>
                    <td className="isRight invoiceBoldCell">
                      {formatNumberAR(netLine)}
                    </td>
                  </tr>
                );
              })}

              {payment.installments.interestAmount > 0 && (
                <tr>
                  <td className="invoiceMono">FIN-{payment.installments.count}C</td>
                  <td className="invoiceArticleCell">
                    Financiación en {payment.installments.count} cuotas
                  </td>
                  <td>{payment.installments.cftnaLabel}</td>
                  <td className="isRight">1,00</td>
                  <td className="isRight">
                    {formatNumberAR(payment.installments.interestAmount)}
                  </td>
                  <td className="isRight">0,00</td>
                  <td className="isRight invoiceBoldCell">
                    {formatNumberAR(payment.installments.interestAmount)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      <footer className="invoiceBottom">
        <div className="invoiceIvaRow">
          <span>
            <strong>IVA 2.5%:</strong> 0,00
          </span>
          <span>
            <strong>IVA 5%:</strong> 0,00
          </span>
          <span>
            <strong>IVA 10.5%:</strong> 0,00
          </span>
          <span>
            <strong>IVA 21%:</strong> {formatNumberAR(iva21Amount)}
          </span>
          <span>
            <strong>IVA 27%:</strong> 0,00
          </span>
        </div>

        <div className="invoiceTotalsBar">
          <span>
            <strong>Bruto:</strong> $ {formatNumberAR(netTaxable)}
          </span>
          {order.discountAmount > 0 && (
            <span>
              <strong>Cupón ({order.couponCode}):</strong> -$
              {formatNumberAR(order.discountAmount)}
            </span>
          )}
          <span>
            <strong>Impuestos:</strong> $ {formatNumberAR(iva21Amount)}
          </span>
          <span className="invoiceGrandTotal">
            <strong>Total: $ {formatNumberAR(order.finalTotal)}</strong>
          </span>
        </div>

        <div className="invoiceFooterLegal">
          <div className="invoiceBarcodeBlock">
            <svg
              className="invoiceBarcodeSvg"
              viewBox={`0 0 ${barcodeTotalWidth} 44`}
              role="img"
              aria-label={`Código de barras fiscal ${barcodeDigits}`}
            >
              {barcodeBars.map((bar, idx) => (
                <rect
                  key={idx}
                  x={bar.x}
                  y={2}
                  width={bar.width}
                  height={40}
                  fill="#111111"
                />
              ))}
            </svg>
            <span className="invoiceBarcodeText">{barcodeDigits}</span>
          </div>

          <div className="invoiceFooterBottomRow">
            <div className="invoiceCaeInfo">
              <span>
                <strong>CAE:</strong> {caeNumber}
              </span>
              <span>
                <strong>Fecha Vto. CAE:</strong> {caeExpiryDateStr}
              </span>
            </div>

            <div className="invoiceFooterBrand">
              <span>COMPROBANTE EMITIDO POR</span>
              <strong>DeTodito Market</strong>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
