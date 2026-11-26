import { useState, type FormEvent } from "react";
import "./ResellersSection.css";

type Product = {
  name: string;
  category: string;
  icon: string;
};

const productPool: Product[] = [
  { name: "Auriculares inalámbricos", category: "Tecnología", icon: "🎧" },
  { name: "Smartwatch", category: "Tecnología", icon: "⌚" },
  { name: "Licuadora", category: "Electrodomésticos", icon: "🥤" },
  { name: "Pava eléctrica", category: "Electrodomésticos", icon: "🫖" },
  { name: "Taladro eléctrico", category: "Herramientas", icon: "🔧" },
  { name: "Set de herramientas", category: "Herramientas", icon: "🧰" },
  { name: "Pelota de fútbol", category: "Deportes", icon: "⚽" },
  { name: "Mancuernas", category: "Deportes", icon: "🏋️" },
  { name: "Parlante portátil", category: "Tecnología", icon: "🔊" },
  { name: "Tostadora", category: "Electrodomésticos", icon: "🍞" },
  { name: "Kit de destornilladores", category: "Herramientas", icon: "🪛" },
  { name: "Botella deportiva", category: "Deportes", icon: "🥤" },
];

function getRandomProducts(): Product[] {
  return [...productPool].sort(() => Math.random() - 0.5).slice(0, 5);
}

function isValidCuil(cuil: string): boolean {
  if (!/^\d{11}$/.test(cuil)) return false;

  const allowedPrefixes = new Set(["20", "23", "24", "27", "30", "33", "34"]);
  if (!allowedPrefixes.has(cuil.slice(0, 2))) return false;

  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce(
    (total, weight, index) => total + Number(cuil[index]) * weight,
    0,
  );
  let checkDigit = 11 - (sum % 11);

  if (checkDigit === 11) checkDigit = 0;
  if (checkDigit === 10) checkDigit = 9;

  return checkDigit === Number(cuil[10]);
}

function ResellersSection() {
  const [featuredProducts] = useState(getRandomProducts);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const dniInput = form.elements.namedItem("idNumber") as HTMLInputElement;
    const cuilInput = form.elements.namedItem("cuil") as HTMLInputElement;
    dniInput.setCustomValidity("");
    cuilInput.setCustomValidity("");

    if (!isValidCuil(cuilInput.value)) {
      cuilInput.setCustomValidity("Ingresá un CUIL válido de 11 dígitos.");
    } else if (cuilInput.value.slice(2, 10) !== dniInput.value) {
      cuilInput.setCustomValidity("El DNI incluido en el CUIL debe coincidir con el DNI ingresado.");
    }

    if (!form.reportValidity()) return;
    setSubmitted(true);
  }

  return (
    <main className="resellers-page">
      <section className="resellers-shell" aria-labelledby="resellers-title">
        <div className="resellers-intro">
          <span className="resellers-eyebrow">TIENDA LIEBRE · VENTAS MAYORISTAS</span>
          <h1 id="resellers-title">Hacé crecer tu negocio</h1>
          <p className="resellers-lead">
            Unite a nuestro programa para revendedores y accedé a beneficios
            especiales en una selección de productos.
          </p>

          <div className="resellers-benefits" aria-label="Beneficios para revendedores">
            <article className="resellers-benefit">
              <span className="resellers-benefit-value">10%</span>
              <p>de descuento comprando 3 productos o más</p>
            </article>
            <article className="resellers-benefit">
              <span className="resellers-benefit-value">+5%</span>
              <p>de descuento adicional pagando en efectivo</p>
            </article>
            <article className="resellers-benefit resellers-benefit-renewal">
              <span className="resellers-benefit-value">30 días</span>
              <p>de vigencia para renovar y mantener activa tu cuenta</p>
            </article>
          </div>

          <div className="resellers-selection">
            <div className="resellers-selection-heading">
              <div>
                <span className="resellers-eyebrow">SELECCIÓN DESTACADA</span>
                <h2>5 productos para descubrir</h2>
              </div>
              <span className="resellers-random-tag">Selección al azar</span>
            </div>
            <div className="resellers-products">
              {featuredProducts.map((product) => (
                <article className="resellers-product" key={product.name}>
                  <span className="resellers-product-icon" aria-hidden="true">
                    {product.icon}
                  </span>
                  <span className="resellers-product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="resellers-form-panel" aria-labelledby="resellers-form-title">
          <span className="resellers-form-step">PROGRAMA DE REVENDEDORES</span>
          <h2 id="resellers-form-title">Solicitá tu cuenta</h2>
          <p className="resellers-form-description">
            Completá tus datos y preparate para comprar al por mayor.
          </p>

          <form className="resellers-form" onSubmit={handleSubmit}>
            <label className="resellers-field">
              <span>Nombre</span>
              <input name="firstName" type="text" autoComplete="given-name" placeholder="Tu nombre" required />
            </label>
            <label className="resellers-field">
              <span>Apellido</span>
              <input name="lastName" type="text" autoComplete="family-name" placeholder="Tu apellido" required />
            </label>
            <label className="resellers-field">
              <span>Número de documento</span>
              <input
                name="idNumber"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="8 dígitos, sin puntos"
                pattern="[0-9]{8}"
                minLength={8}
                maxLength={8}
                title="Ingresá exactamente 8 números, sin puntos ni espacios."
                onInput={(event) => {
                  event.currentTarget.setCustomValidity("");
                  const cuil = event.currentTarget.form?.elements.namedItem("cuil") as HTMLInputElement | null;
                  cuil?.setCustomValidity("");
                }}
                required
              />
            </label>
            <label className="resellers-field">
              <span>CUIL</span>
              <input
                name="cuil"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="11 dígitos, sin guiones"
                pattern="[0-9]{11}"
                minLength={11}
                maxLength={11}
                title="Ingresá los 11 números del CUIL, sin guiones ni espacios."
                onInput={(event) => event.currentTarget.setCustomValidity("")}
                required
              />
            </label>
            <label className="resellers-field">
              <span>Correo electrónico</span>
              <input name="email" type="email" autoComplete="email" placeholder="nombre@correo.com" required />
            </label>
            <label className="resellers-field">
              <span>Teléfono</span>
              <input name="phone" type="tel" autoComplete="tel" placeholder="Tu número de teléfono" required />
            </label>

            <button className="resellers-submit" type="submit">
              Solicitar cuenta mayorista <span aria-hidden="true">→</span>
            </button>
            {submitted && (
              <p className="resellers-form-feedback" role="status">
                Formulario completado. La solicitud todavía debe conectarse al servicio de registro.
              </p>
            )}
          </form>
          <p className="resellers-privacy">
            Usaremos tus datos únicamente para gestionar tu solicitud de cuenta mayorista.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default ResellersSection;
