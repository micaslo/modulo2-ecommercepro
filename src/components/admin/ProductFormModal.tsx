import {
  useEffect,
  useRef,
  useState,
  type BaseSyntheticEvent,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import type { ProductImageMode } from "../../hooks/useAdminProductForm";
import {
  PRODUCT_CATEGORIES,
  type ProductFormValues,
} from "../../schemas/productSchema";

interface ProductFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  imageMode: ProductImageMode;
  uploadedFileName: string;
  isProcessingImage: boolean;
  register: UseFormRegister<ProductFormValues>;
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  onImageModeChange: (mode: ProductImageMode) => void;
  onImageFileSelect: (file: File | null) => Promise<void> | void;
  onClearImage: () => void;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void> | void;
  onClose: () => void;
}

export default function ProductFormModal({
  isOpen,
  isEditing,
  imageMode,
  uploadedFileName,
  isProcessingImage,
  register,
  control,
  errors,
  onImageModeChange,
  onImageFileSelect,
  onClearImage,
  onSubmit,
  onClose,
}: ProductFormModalProps) {
  const categoryValue = useWatch({ control, name: "category" });
  const imageValue = useWatch({ control, name: "image" });
  const descriptionValue = useWatch({ control, name: "description" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

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

  const isDataImage = imageValue.startsWith("data:image/");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    void onImageFileSelect(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingFile(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    void onImageFileSelect(file);
  };

  const handleClearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClearImage();
  };

  return (
    <div
      className="adminModalBackdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="adminModal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="adminModalHeader">
          <div>
            <span className="adminEyebrow">GESTIÓN DE INVENTARIO</span>
            <h2 id="product-modal-title">
              {isEditing ? "Editar producto" : "Agregar nuevo producto"}
            </h2>
          </div>
          <button
            type="button"
            className="adminModalClose"
            onClick={onClose}
            aria-label="Cerrar formulario"
          >
            ✕
          </button>
        </header>

        <form className="adminForm" onSubmit={onSubmit} noValidate>
          <div className="adminFormGrid">
            <div className="adminField">
              <label htmlFor="prod-code">
                Código único (SKU) <span className="adminRequired">*</span>
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
                <span className="adminFieldError">{errors.code.message}</span>
              ) : (
                <span className="adminFieldHint">
                  Debe ser único en todo el inventario (letras, números, - o _).
                </span>
              )}
            </div>

            <div className="adminField">
              <label htmlFor="prod-category">
                Categoría <span className="adminRequired">*</span>
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
                <span className="adminFieldError">
                  {errors.category.message}
                </span>
              )}
            </div>
          </div>

          <div className="adminField">
            <label htmlFor="prod-name">
              Nombre del producto <span className="adminRequired">*</span>
            </label>
            <input
              id="prod-name"
              type="text"
              placeholder="Ej: Auriculares Inalámbricos Noise Cancelling"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name && (
              <span className="adminFieldError">{errors.name.message}</span>
            )}
          </div>

          <div className="adminFormGrid">
            <div className="adminField">
              <label htmlFor="prod-price">
                Precio (ARS) <span className="adminRequired">*</span>
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
                <span className="adminFieldError">
                  {errors.price.message}
                </span>
              )}
            </div>

            <div className="adminField">
              <label htmlFor="prod-stock">
                Stock disponible <span className="adminRequired">*</span>
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
                <span className="adminFieldError">
                  {errors.stock.message}
                </span>
              )}
            </div>
          </div>

          <div className="adminField">
            <label htmlFor={imageMode === "url" ? "prod-image" : "prod-image-file"}>
              Imagen del producto <span className="adminRequired">*</span>
            </label>

            <div
              className="adminImageModeSwitch"
              role="group"
              aria-label="Origen de la imagen del producto"
            >
              <button
                type="button"
                className={`adminImageModeBtn ${imageMode === "url" ? "isActive" : ""}`}
                onClick={() => onImageModeChange("url")}
              >
                URL de imagen
              </button>
              <button
                type="button"
                className={`adminImageModeBtn ${imageMode === "file" ? "isActive" : ""}`}
                onClick={() => onImageModeChange("file")}
              >
                Subir desde PC
              </button>
            </div>

            {imageMode === "url" ? (
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <input
                    id="prod-image"
                    name={field.name}
                    type="url"
                    value={field.value.startsWith("data:image/") ? "" : field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    aria-invalid={Boolean(errors.image)}
                  />
                )}
              />
            ) : (
              <div
                className={`adminFileDropzone ${isDraggingFile ? "isDragging" : ""} ${errors.image ? "isInvalid" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={handleDrop}
              >
                <span className="adminFileDropzoneTitle">
                  {isProcessingImage
                    ? "Procesando imagen..."
                    : uploadedFileName
                      ? uploadedFileName
                      : isDataImage
                        ? "Imagen cargada desde PC (hacé clic para reemplazar)"
                        : "Hacé clic para elegir una imagen o arrastrala acá"}
                </span>
                <span className="adminFileDropzoneHint">
                  PNG, JPG, WEBP o GIF (máx. 5 MB)
                </span>
                <input
                  ref={fileInputRef}
                  id="prod-image-file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="adminFileInputHidden"
                  aria-invalid={Boolean(errors.image)}
                  onChange={handleFileChange}
                />
              </div>
            )}

            {errors.image && (
              <span className="adminFieldError">{errors.image.message}</span>
            )}
            {imageValue.trim() && !errors.image && (
              <div className="adminImagePreview">
                <img src={imageValue.trim()} alt="Vista previa del producto" />
                <span>
                  {uploadedFileName ||
                    (isDataImage ? "Imagen cargada desde PC" : "Vista previa")}
                </span>
                <button
                  type="button"
                  className="adminImageClearBtn"
                  onClick={handleClearImage}
                >
                  Quitar
                </button>
              </div>
            )}
          </div>

          <div className="adminField">
            <label htmlFor="prod-description">
              Descripción <span className="adminRequired">*</span>
            </label>
            <textarea
              id="prod-description"
              rows={4}
              placeholder="Describí las características principales del producto (mínimo 10 caracteres)..."
              aria-invalid={Boolean(errors.description)}
              {...register("description")}
            />
            <div className="adminFieldFooter">
              {errors.description ? (
                <span className="adminFieldError">
                  {errors.description.message}
                </span>
              ) : (
                <span className="adminFieldHint">Mínimo 10 caracteres.</span>
              )}
              <span className="adminCharCount">
                {descriptionValue.length}/1000
              </span>
            </div>
          </div>

          <div className="adminModalActions">
            <button
              type="button"
              className="adminBtnGhost"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btnPrimary"
              disabled={isProcessingImage}
            >
              {isProcessingImage
                ? "Procesando imagen..."
                : isEditing
                  ? "Guardar cambios"
                  : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
