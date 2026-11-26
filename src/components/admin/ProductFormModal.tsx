import { useEffect, type BaseSyntheticEvent } from "react";
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import {
  PRODUCT_CATEGORIES,
  type ProductFormValues,
} from "../../schemas/productSchema";

interface ProductFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  register: UseFormRegister<ProductFormValues>;
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void> | void;
  onClose: () => void;
}

export default function ProductFormModal({
  isOpen,
  isEditing,
  register,
  control,
  errors,
  onSubmit,
  onClose,
}: ProductFormModalProps) {
  const categoryValue = useWatch({ control, name: "category" });
  const imageValue = useWatch({ control, name: "image" });
  const descriptionValue = useWatch({ control, name: "description" });

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
    categoryValue as (typeof PRODUCT_CATEGORIES)[number],
  )
    ? [...PRODUCT_CATEGORIES]
    : [categoryValue, ...PRODUCT_CATEGORIES].filter(Boolean);

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
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <input
                    id="prod-code"
                    name={field.name}
                    type="text"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    onBlur={field.onBlur}
                    ref={field.ref}
                    placeholder="Ej: DT-TEC-010"
                    aria-invalid={Boolean(errors.code)}
                  />
                )}
              />
              {errors.code ? (
                <span className="admin-field-error">{errors.code.message}</span>
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
                aria-invalid={Boolean(errors.category)}
                {...register("category")}
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="admin-field-error">
                  {errors.category.message}
                </span>
              )}
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="prod-name">
              Nombre del producto <span className="admin-required">*</span>
            </label>
            <input
              id="prod-name"
              type="text"
              placeholder="Ej: Auriculares Inalámbricos Noise Cancelling"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name && (
              <span className="admin-field-error">{errors.name.message}</span>
            )}
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="prod-price">
                Precio (ARS) <span className="admin-required">*</span>
              </label>
              <input
                id="prod-price"
                type="number"
                min="1"
                step="1"
                placeholder="Ej: 149999"
                aria-invalid={Boolean(errors.price)}
                {...register("price")}
              />
              {errors.price && (
                <span className="admin-field-error">
                  {errors.price.message}
                </span>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="prod-stock">
                Stock disponible <span className="admin-required">*</span>
              </label>
              <input
                id="prod-stock"
                type="number"
                min="0"
                step="1"
                placeholder="Ej: 15"
                aria-invalid={Boolean(errors.stock)}
                {...register("stock")}
              />
              {errors.stock && (
                <span className="admin-field-error">
                  {errors.stock.message}
                </span>
              )}
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="prod-image">URL de imagen (opcional)</label>
            <input
              id="prod-image"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              aria-invalid={Boolean(errors.image)}
              {...register("image")}
            />
            {errors.image && (
              <span className="admin-field-error">{errors.image.message}</span>
            )}
            {imageValue.trim() && !errors.image && (
              <div className="admin-image-preview">
                <img src={imageValue.trim()} alt="Vista previa del producto" />
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
              rows={4}
              placeholder="Describí las características principales del producto (mínimo 10 caracteres)..."
              aria-invalid={Boolean(errors.description)}
              {...register("description")}
            />
            <div className="admin-field-footer">
              {errors.description ? (
                <span className="admin-field-error">
                  {errors.description.message}
                </span>
              ) : (
                <span className="admin-field-hint">Mínimo 10 caracteres.</span>
              )}
              <span className="admin-char-count">
                {descriptionValue.length}/1000
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
