import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resellerSchema,
  type ResellerFormValues,
} from "../../schemas/resellerSchema";
import "./ResellersSection.css";

function ResellersSection() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResellerFormValues>({
    resolver: zodResolver(resellerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      cuil: "",
      email: "",
      phone: "",
    },
  });

  function onSubmit() {
    setSubmitted(true);
    reset();
  }

  return (
    <main className="resellersPage">
      <section className="resellersShell" aria-labelledby="resellers-title">
        <div className="resellersIntro">
          <span className="resellersEyebrow">TIENDA LIEBRE · VENTAS MAYORISTAS</span>
          <h1 id="resellers-title">Hacé crecer tu negocio</h1>
          <p className="resellersLead">
            Unite a nuestro programa para revendedores y accedé a beneficios
            especiales en una selección de productos.
          </p>

          <div className="resellersBenefits" aria-label="Beneficios para revendedores">
            <article className="resellersBenefit">
              <span className="resellersBenefitValue">10%</span>
              <p>de descuento comprando 3 productos o más</p>
            </article>
            <article className="resellersBenefit">
              <span className="resellersBenefitValue">+5%</span>
              <p>de descuento adicional pagando en efectivo</p>
            </article>
            <article className="resellersBenefit resellersBenefitRenewal">
              <span className="resellersBenefitValue">30 días</span>
              <p>de vigencia para renovar y mantener activa tu cuenta</p>
            </article>
          </div>
        </div>

        <aside className="resellersFormPanel" aria-labelledby="resellers-form-title">
          <span className="resellersFormStep">PROGRAMA DE REVENDEDORES</span>
          <h2 id="resellers-form-title">Solicitá tu cuenta</h2>
          <p className="resellersFormDescription">
            Completá tus datos y preparate para comprar al por mayor.
          </p>

          <form
            className="resellersForm"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <label className="resellersField">
              <span>Nombre</span>
              <input
                type="text"
                autoComplete="given-name"
                placeholder="Tu nombre"
                aria-invalid={Boolean(errors.firstName)}
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="resellersFieldError" role="alert">
                  {errors.firstName.message}
                </span>
              )}
            </label>

            <label className="resellersField">
              <span>Apellido</span>
              <input
                type="text"
                autoComplete="family-name"
                placeholder="Tu apellido"
                aria-invalid={Boolean(errors.lastName)}
                {...register("lastName")}
              />
              {errors.lastName && (
                <span className="resellersFieldError" role="alert">
                  {errors.lastName.message}
                </span>
              )}
            </label>

            <label className="resellersField">
              <span>Número de documento</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="8 dígitos, sin puntos"
                maxLength={8}
                aria-invalid={Boolean(errors.idNumber)}
                {...register("idNumber")}
              />
              {errors.idNumber && (
                <span className="resellersFieldError" role="alert">
                  {errors.idNumber.message}
                </span>
              )}
            </label>

            <label className="resellersField">
              <span>CUIL</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="11 dígitos, sin guiones"
                maxLength={11}
                aria-invalid={Boolean(errors.cuil)}
                {...register("cuil")}
              />
              {errors.cuil && (
                <span className="resellersFieldError" role="alert">
                  {errors.cuil.message}
                </span>
              )}
            </label>

            <label className="resellersField">
              <span>Correo electrónico</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="nombre@correo.com"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <span className="resellersFieldError" role="alert">
                  {errors.email.message}
                </span>
              )}
            </label>

            <label className="resellersField">
              <span>Teléfono</span>
              <input
                type="tel"
                autoComplete="tel"
                placeholder="Tu número de teléfono"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />
              {errors.phone && (
                <span className="resellersFieldError" role="alert">
                  {errors.phone.message}
                </span>
              )}
            </label>

            <button className="resellersSubmit" type="submit">
              Solicitar cuenta mayorista <span aria-hidden="true">→</span>
            </button>
            {submitted && (
              <p className="resellersFormFeedback" role="status">
                Formulario completado. La solicitud todavía debe conectarse al servicio de registro.
              </p>
            )}
          </form>
          <p className="resellersPrivacy">
            Usaremos tus datos únicamente para gestionar tu solicitud de cuenta mayorista.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default ResellersSection;
