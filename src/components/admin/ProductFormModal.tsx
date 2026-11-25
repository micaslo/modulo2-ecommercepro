import { useEffect, type ChangeEvent, type FormEvent } from "react";
import {
  PRODUCT_CATEGORIES,
  type ProductFormErrors,
  type ProductFormValues,
} from "../../schemas/productSchema";

interface ProductFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  values: ProductFormValues;
  errors: ProductFormErrors;
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export default function ProductFormModal({
  isOpen,
  isEditing,
  values,
  errors,
  onChange,
  onSubmit,
  onClose,
}: ProductFormModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categoryOptions: string[] = PRODUCT_CATEGORIES.includes(
    values.category as (typeof PRODUCT_CATEGORIES)[number],
  )
    ? [...PRODUCT_CATEGORIES]
    : [values.category, ...PRODUCT_CATEGORIES].filter(Boolean);

  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="admin-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin-modal-header">
          <div>
            <span className="admin-eyebrow">GESTIÓN DE INVENTARIO</span>
            <h2 id="product-modal-title">
              {isEditing ? "Editar producto" : "Agregar nuevo producto"}
            </h2>
          </div>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Cerrar formulario"
          >
            ✕
          </button>
        </header>

        <form className="admin-form" onSubmit={onSubmit} noValidate>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="prod-code">
                Código único (SKU) <span className="admin-required">*</span>
              </label>
              <input
                id="prod-code"
                name="code"
                type="text"
                value={values.code}
                onChange={onChange}
                placeholder="Ej: DT-TEC-010"
                aria-invalid={Boolean(errors.code)}
              />
              {errors.code ? (
                <span className="admin-field-error">{errors.code}</span>
              ) : (
                <span className="admin-field-hint">
                  Debe ser único en todo el inventario (letras, números, - o _).
                </span>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="prod-category">
                Categoría <span className="admin-required">*</span>
              </label>
              <select
                id="prod-category"
                name="category"
                value={values.category}
                onChange={onChange}
                aria-invalid={Boolean(errors.category)}
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="admin-field-error">{errors.category}</span>
              )}
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="prod-name">
              Nombre del producto <span className="admin-required">*</span>
            </label>
            <input
              id="prod-name"
              name="name"
              type="text"
              value={values.name}
              onChange={onChange}
              placeholder="Ej: Auriculares Inalámbricos Noise Cancelling"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <span className="admin-field-error">{errors.name}</span>
            )}
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="prod-price">
                Precio (ARS) <span className="admin-required">*</span>
              </label>
              <input
                id="prod-price"
                name="price"
                type="number"
                min="1"
                step="1"
                value={values.price}
                onChange={onChange}
                placeholder="Ej: 149999"
                aria-invalid={Boolean(errors.price)}
              />
              {errors.price && (
                <span className="admin-field-error">{errors.price}</span>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="prod-stock">
                Stock disponible <span className="admin-required">*</span>
              </label>
              <input
                id="prod-stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={values.stock}
                onChange={onChange}
                placeholder="Ej: 15"
                aria-invalid={Boolean(errors.stock)}
              />
              {errors.stock && (
                <span className="admin-field-error">{errors.stock}</span>
              )}
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="prod-image">URL de imagen (opcional)</label>
            <input
              id="prod-image"
              name="image"
              type="url"
              value={values.image}
              onChange={onChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              aria-invalid={Boolean(errors.image)}
            />
            {errors.image && (
              <span className="admin-field-error">{errors.image}</span>
            )}
            {values.image.trim() && !errors.image && (
              <div className="admin-image-preview">
                <img src={values.image.trim()} alt="Vista previa del producto" />
                <span>Vista previa</span>
              </div>
            )}
          </div>

          <div className="admin-field">
            <label htmlFor="prod-description">
              Descripción <span className="admin-required">*</span>
            </label>
            <textarea
              id="prod-description"
              name="description"
              rows={4}
              value={values.description}
              onChange={onChange}
              placeholder="Describí las características principales del producto (mínimo 10 caracteres)..."
              aria-invalid={Boolean(errors.description)}
            />
            <div className="admin-field-footer">
              {errors.description ? (
                <span className="admin-field-error">{errors.description}</span>
              ) : (
                <span className="admin-field-hint">Mínimo 10 caracteres.</span>
              )}
              <span className="admin-char-count">
                {values.description.length}/1000
              </span>
            </div>
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-btn-ghost"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {isEditing ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
