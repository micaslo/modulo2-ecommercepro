import type { ReactNode } from 'react'
import { useSellProductForm } from '../../hooks/useSellProductForm'
import { sellProductCategories, sellProductConditions } from '../../schemas/sellProductSchema'
import './SellProductSection.css'

const formatPrice = (value: number): string =>
  `$ ${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`

const getInputClass = (hasError: boolean): string =>
  hasError ? 'sellProductInput sellProductInputInvalid' : 'sellProductInput'

interface FieldProps {
  id: string
  label: string
  error?: string
  required?: boolean
  fullWidth?: boolean
  children: ReactNode
}

function Field({ id, label, error, required = false, fullWidth = false, children }: FieldProps) {
  return (
    <div className={fullWidth ? 'sellProductField sellProductFieldFull' : 'sellProductField'}>
      <label htmlFor={id} className="sellProductLabel">
        {label} {required && <span className="sellProductRequired">*</span>}
      </label>
      {children}
      {error && <small className="sellProductError">{error}</small>}
    </div>
  )
}

function SellProductSection() {
  const {
    register,
    errors,
    image,
    descriptionLength,
    receipt,
    handleImage,
    handleSubmit,
    resetReceipt,
  } = useSellProductForm()

  if (receipt) {
    return (
      <section className="sellProduct" id="sellProduct">
        <div className="sellProductInner">
          <div className="sellProductReceipt">
            <span className="sellProductReceiptIcon" aria-hidden="true">✓</span>
            <h2 className="sellProductReceiptTitle">¡Recibimos tu producto!</h2>
            <p className="sellProductReceiptText">
              Vamos a revisar la publicación y te escribiremos a {receipt.email} en menos de 24
              horas hábiles.
            </p>

            <article className="sellProductPreview">
              <div className="sellProductPreviewMedia">
                <img
                  className="sellProductPreviewImage"
                  src={receipt.imageUrl}
                  alt={receipt.productName}
                />
              </div>
              <div className="sellProductPreviewBody">
                <span className="sellProductPreviewTag">{receipt.condition}</span>
                <h3 className="sellProductPreviewName">{receipt.productName}</h3>
                <p className="sellProductPreviewPrice">{formatPrice(receipt.price)}</p>
                <p className="sellProductPreviewCategory">{receipt.category}</p>
                <p className="sellProductPreviewDescription">{receipt.description}</p>
              </div>
            </article>

            <dl className="sellProductReceiptList">
              <div className="sellProductReceiptRow">
                <dt className="sellProductReceiptLabel">Referencia</dt>
                <dd className="sellProductReceiptValue">{receipt.reference}</dd>
              </div>
              <div className="sellProductReceiptRow">
                <dt className="sellProductReceiptLabel">Fecha</dt>
                <dd className="sellProductReceiptValue">{receipt.date}</dd>
              </div>
            </dl>

            <button type="button" className="sellProductButton" onClick={resetReceipt}>
              Publicar otro producto
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="sellProduct" id="sellProduct">
      <div className="sellProductInner">
        <header className="sellProductHeader">
          <span className="sellProductEyebrow">TIENDA LIEBRE · PUBLICÁ GRATIS</span>
          <h2 className="sellProductTitle">Quiero vender mi producto</h2>
          <p className="sellProductText">
            Publicá tu producto en Tienda Liebre y llegá a miles de compradores. Completá el formulario
            y nuestro equipo se va a contactar con vos en menos de 24 horas hábiles.
          </p>
        </header>

        <form className="sellProductForm" onSubmit={handleSubmit} noValidate>
          <div className="sellProductGrid">
            <Field id="firstName" label="Nombre" required error={errors.firstName?.message}>
              <input
                id="firstName"
                type="text"
                placeholder="Ej. Martín"
                className={getInputClass(Boolean(errors.firstName))}
                aria-invalid={Boolean(errors.firstName)}
                {...register('firstName')}
              />
            </Field>

            <Field id="lastName" label="Apellido" required error={errors.lastName?.message}>
              <input
                id="lastName"
                type="text"
                placeholder="Ej. González"
                className={getInputClass(Boolean(errors.lastName))}
                aria-invalid={Boolean(errors.lastName)}
                {...register('lastName')}
              />
            </Field>

            <Field id="email" label="Email" required fullWidth error={errors.email?.message}>
              <input
                id="email"
                type="email"
                placeholder="martin@correo.com"
                className={getInputClass(Boolean(errors.email))}
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
            </Field>

            <Field
              id="productName"
              label="Nombre del producto"
              required
              fullWidth
              error={errors.productName?.message}
            >
              <input
                id="productName"
                type="text"
                placeholder="Ej. Taladro percutor inalámbrico 20V"
                className={getInputClass(Boolean(errors.productName))}
                aria-invalid={Boolean(errors.productName)}
                {...register('productName')}
              />
            </Field>

            <Field id="category" label="Categoría" required error={errors.category?.message}>
              <select
                id="category"
                className={getInputClass(Boolean(errors.category))}
                aria-invalid={Boolean(errors.category)}
                {...register('category')}
              >
                <option value="">Seleccioná una categoría</option>
                {sellProductCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="condition" label="Estado" required error={errors.condition?.message}>
              <select
                id="condition"
                className={getInputClass(Boolean(errors.condition))}
                aria-invalid={Boolean(errors.condition)}
                {...register('condition')}
              >
                <option value="">Seleccioná el estado</option>
                {sellProductConditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="price" label="Precio (ARS)" required fullWidth error={errors.price?.message}>
              <input
                id="price"
                type="text"
                inputMode="numeric"
                placeholder="Ej. 89900"
                className={getInputClass(Boolean(errors.price))}
                aria-invalid={Boolean(errors.price)}
                {...register('price')}
              />
            </Field>

            <Field id="image" label="Foto del producto" required fullWidth error={errors.image?.message}>
              <div
                className={
                  errors.image
                    ? 'sellProductDropzone sellProductDropzoneInvalid'
                    : 'sellProductDropzone'
                }
              >
                <span className="sellProductDropzoneIcon" aria-hidden="true">⬆</span>
                <span className="sellProductDropzoneTitle">
                  {image
                    ? image.name
                    : 'Hacé clic para adjuntar una foto o arrastrala acá'}
                </span>
                <span className="sellProductDropzoneHelp">
                  Archivos aceptados: PNG, JPG o WEBP (máx. 5MB)
                </span>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImage}
                  className="sellProductFileInput"
                />
              </div>
            </Field>

            <Field
              id="description"
              label="Descripción"
              required
              fullWidth
              error={errors.description?.message}
            >
              <textarea
                id="description"
                rows={4}
                placeholder="Contanos las características y el estado de tu producto"
                className={`${getInputClass(Boolean(errors.description))} sellProductTextarea`}
                aria-invalid={Boolean(errors.description)}
                {...register('description')}
              />
              <span className="sellProductCounter">{descriptionLength}/500</span>
            </Field>

            <div className="sellProductField sellProductFieldFull">
              <button type="submit" className="sellProductButton">
                <span aria-hidden="true">➤</span> Enviar producto para publicar
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default SellProductSection
