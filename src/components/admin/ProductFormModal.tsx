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
import type { EditableProductImage } from "../../data/productMedia";
import type {
  ProductImageMode,
  ProductModel3DMode,
} from "../../hooks/useAdminProductForm";
import type { ProductIncludedItem } from "../../types/productMedia";
import {
  PRODUCT_CATEGORIES,
  type ProductFormValues,
} from "../../schemas/productSchema";

interface ProductFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  galleryImages: EditableProductImage[];
  hasExistingImages: boolean;
  hasRemovedBundledImages: boolean;
  imageMode: ProductImageMode;
  isProcessingImage: boolean;
  model3DMode: ProductModel3DMode;
  model3DLabel: string;
  model3DUrlInput: string;
  model3DError: string | null;
  hasActiveModel3D: boolean;
  isProcessingModel3D: boolean;
  highlights: string[];
  highlightDraft: string;
  includedItems: ProductIncludedItem[];
  includedItemDraft: string;
  includedItemDraftIncluded: boolean;
  discountEnabled: boolean;
  discountPercentInput: string;
  discountError: string | null;
  register: UseFormRegister<ProductFormValues>;
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  onCategoryChange: (category: string) => void;
  onCodeChange: (code: string) => void;
  onRegenerateSku: () => void;
  onToggleDiscount: () => void;
  onDiscountPercentChange: (value: string) => void;
  onImageModeChange: (mode: ProductImageMode) => void;
  onAddImageFromUrl: () => void;
  onImageFilesSelect: (files: File[]) => Promise<void> | void;
  onRemoveGalleryImage: (image: EditableProductImage) => void;
  onRestoreBundledImages: () => void;
  onModel3DModeChange: (mode: ProductModel3DMode) => void;
  onGlbFileSelect: (file: File | null) => Promise<void> | void;
  onGltfFolderSelect: (files: File[]) => Promise<void> | void;
  onModel3DUrlChange: (url: string) => void;
  onClearModel3D: () => void;
  onHighlightDraftChange: (value: string) => void;
  onAddHighlight: () => void;
  onUpdateHighlight: (index: number, value: string) => void;
  onRemoveHighlight: (index: number) => void;
  onIncludedItemDraftChange: (value: string) => void;
  onIncludedItemDraftIncludedChange: (included: boolean) => void;
  onAddIncludedItem: () => void;
  onUpdateIncludedItemLabel: (index: number, value: string) => void;
  onToggleIncludedItem: (index: number) => void;
  onRemoveIncludedItem: (index: number) => void;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void> | void;
  onClose: () => void;
}

export default function ProductFormModal({
  isOpen,
  isEditing,
  galleryImages,
  hasExistingImages,
  hasRemovedBundledImages,
  imageMode,
  isProcessingImage,
  model3DMode,
  model3DLabel,
  model3DUrlInput,
  model3DError,
  hasActiveModel3D,
  isProcessingModel3D,
  highlights,
  highlightDraft,
  includedItems,
  includedItemDraft,
  includedItemDraftIncluded,
  discountEnabled,
  discountPercentInput,
  discountError,
  register,
  control,
  errors,
  onCategoryChange,
  onCodeChange,
  onRegenerateSku,
  onToggleDiscount,
  onDiscountPercentChange,
  onImageModeChange,
  onAddImageFromUrl,
  onImageFilesSelect,
  onRemoveGalleryImage,
  onRestoreBundledImages,
  onModel3DModeChange,
  onGlbFileSelect,
  onGltfFolderSelect,
  onModel3DUrlChange,
  onClearModel3D,
  onHighlightDraftChange,
  onAddHighlight,
  onUpdateHighlight,
  onRemoveHighlight,
  onIncludedItemDraftChange,
  onIncludedItemDraftIncludedChange,
  onAddIncludedItem,
  onUpdateIncludedItemLabel,
  onToggleIncludedItem,
  onRemoveIncludedItem,
  onSubmit,
  onClose,
}: ProductFormModalProps) {
  const categoryValue = useWatch({ control, name: "category" });
  const priceValue = useWatch({ control, name: "price" });
  const descriptionValue = useWatch({ control, name: "description" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const glbInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    void onImageFilesSelect(files);
    event.target.value = "";
  };

  const handleImageDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingFile(false);
    const files = event.dataTransfer.files
      ? Array.from(event.dataTransfer.files)
      : [];
    void onImageFilesSelect(files);
  };

  const handleGlbChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    void onGlbFileSelect(file);
    event.target.value = "";
  };

  const handleFolderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    void onGltfFolderSelect(files);
    event.target.value = "";
  };

  const isBusy = isProcessingImage || isProcessingModel3D;

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
              <div className="adminCodeInputRow">
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="prod-code"
                      name={field.name}
                      type="text"
                      value={field.value}
                      onChange={(e) => onCodeChange(e.target.value)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="Ej: DT-TEC-010"
                      aria-invalid={Boolean(errors.code)}
                    />
                  )}
                />
                {!isEditing && (
                  <button
                    type="button"
                    className="adminAutoSkuBtn"
                    onClick={onRegenerateSku}
                    title="Generar automáticamente el siguiente SKU único para esta categoría"
                  >
                    Auto
                  </button>
                )}
              </div>
              {errors.code ? (
                <span className="adminFieldError">{errors.code.message}</span>
              ) : (
                <span className="adminFieldHint">
                  {isEditing
                    ? "Código único persistente asociado a este producto."
                    : "Se genera automáticamente según la categoría y queda guardado de forma permanente."}
                </span>
              )}
            </div>

            <div className="adminField">
              <label htmlFor="prod-category">
                Categoría <span className="adminRequired">*</span>
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <select
                    id="prod-category"
                    name={field.name}
                    value={field.value}
                    onChange={(event) => onCategoryChange(event.target.value)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    aria-invalid={Boolean(errors.category)}
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              />
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

          <div className="adminDiscountBox">
            <div className="adminDiscountTop">
              <button
                type="button"
                className={`adminDiscountToggleBtn ${discountEnabled ? "isActive" : ""}`}
                aria-pressed={discountEnabled}
                onClick={onToggleDiscount}
              >
                {discountEnabled
                  ? "✓ Descuento aplicado"
                  : "+ Aplicar descuento (opcional)"}
              </button>

              {discountEnabled && (
                <div className="adminDiscountInputWrap">
                  <label
                    htmlFor="prod-discount-percent"
                    className="adminSrOnly"
                  >
                    Porcentaje de descuento
                  </label>
                  <input
                    id="prod-discount-percent"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    className="adminDiscountSquare"
                    value={discountPercentInput}
                    onChange={(event) =>
                      onDiscountPercentChange(event.target.value)
                    }
                    placeholder="0"
                    aria-invalid={Boolean(discountError)}
                  />
                  <span className="adminDiscountPercentSign">% OFF</span>
                </div>
              )}
            </div>

            {discountEnabled &&
              Number(priceValue) > 0 &&
              Number(discountPercentInput) >= 1 &&
              Number(discountPercentInput) <= 99 && (
                <p className="adminDiscountPreview">
                  Precio final al público:{" "}
                  <strong>
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      maximumFractionDigits: 0,
                    }).format(
                      Math.max(
                        1,
                        Math.round(
                          Number(priceValue) *
                            (1 - Number(discountPercentInput) / 100),
                        ),
                      ),
                    )}
                  </strong>{" "}
                  <span>
                    (antes{" "}
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      maximumFractionDigits: 0,
                    }).format(Number(priceValue))}
                    )
                  </span>
                </p>
              )}

            {discountError && (
              <span className="adminFieldError">{discountError}</span>
            )}
          </div>

          <div className="adminField">
            <div className="adminFieldHeaderRow">
              <label htmlFor={imageMode === "url" ? "prod-image" : "prod-image-file"}>
                Imágenes del producto{" "}
                {hasExistingImages ? (
                  <span className="adminOptionalTag">
                    ({galleryImages.length}{" "}
                    {galleryImages.length === 1 ? "imagen" : "imágenes"})
                  </span>
                ) : (
                  <span className="adminRequired">*</span>
                )}
              </label>
              {hasRemovedBundledImages && (
                <button
                  type="button"
                  className="adminInlineLinkBtn"
                  onClick={onRestoreBundledImages}
                >
                  Restaurar originales
                </button>
              )}
            </div>

            {galleryImages.length > 0 && (
              <div
                className="adminGalleryGrid"
                aria-label="Imágenes actuales del producto"
              >
                {galleryImages.map((img, index) => (
                  <div key={img.url} className="adminGalleryCard">
                    <img
                      src={img.url}
                      alt={`Imagen ${index + 1} del producto`}
                      loading="lazy"
                    />
                    {index === 0 && (
                      <span className="adminGalleryBadge">Portada</span>
                    )}
                    <button
                      type="button"
                      className="adminGalleryRemoveBtn"
                      onClick={() => onRemoveGalleryImage(img)}
                      aria-label={`Quitar imagen ${index + 1}`}
                      title="Quitar imagen"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className="adminImageModeSwitch"
              role="group"
              aria-label="Agregar imagen del producto"
            >
              <button
                type="button"
                className={`adminImageModeBtn ${imageMode === "url" ? "isActive" : ""}`}
                onClick={() => onImageModeChange("url")}
              >
                Agregar por URL
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
              <div className="adminCodeInputRow">
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="prod-image"
                      name={field.name}
                      type="url"
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.value)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      aria-invalid={Boolean(errors.image)}
                    />
                  )}
                />
                <button
                  type="button"
                  className="adminAutoSkuBtn"
                  onClick={onAddImageFromUrl}
                >
                  Agregar
                </button>
              </div>
            ) : (
              <div
                className={`adminFileDropzone ${isDraggingFile ? "isDragging" : ""} ${errors.image ? "isInvalid" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={handleImageDrop}
              >
                <span className="adminFileDropzoneTitle">
                  {isProcessingImage
                    ? "Procesando imágenes..."
                    : "Hacé clic para elegir una o varias imágenes, o arrastralas acá"}
                </span>
                <span className="adminFileDropzoneHint">
                  PNG, JPG, WEBP o GIF (máx. 5 MB por archivo)
                </span>
                <input
                  ref={fileInputRef}
                  id="prod-image-file"
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="adminFileInputHidden"
                  aria-invalid={Boolean(errors.image)}
                  onChange={handleImageFileChange}
                />
              </div>
            )}

            {errors.image && (
              <span className="adminFieldError">{errors.image.message}</span>
            )}
          </div>

          <div className="adminField">
            <div className="adminFieldHeaderRow">
              <label htmlFor="prod-model3d-input">
                Modelo 3D{" "}
                <span className="adminOptionalTag">(opcional · vista 360°)</span>
              </label>
              {hasActiveModel3D && (
                <button
                  type="button"
                  className="adminInlineLinkBtn adminInlineLinkBtnDanger"
                  onClick={onClearModel3D}
                >
                  Quitar modelo 3D
                </button>
              )}
            </div>

            {hasActiveModel3D && (
              <div className="adminModelStatus">
                <span className="adminModelStatusBadge">3D activo</span>
                <span className="adminModelStatusLabel">
                  {model3DLabel || "Modelo 3D configurado"}
                </span>
              </div>
            )}

            <div
              className="adminImageModeSwitch adminModelModeSwitch"
              role="group"
              aria-label="Origen del modelo 3D"
            >
              <button
                type="button"
                className={`adminImageModeBtn ${model3DMode === "glb" ? "isActive" : ""}`}
                onClick={() => onModel3DModeChange("glb")}
              >
                Archivo .glb
              </button>
              <button
                type="button"
                className={`adminImageModeBtn ${model3DMode === "folder" ? "isActive" : ""}`}
                onClick={() => onModel3DModeChange("folder")}
              >
                Carpeta .gltf
              </button>
              <button
                type="button"
                className={`adminImageModeBtn ${model3DMode === "url" ? "isActive" : ""}`}
                onClick={() => onModel3DModeChange("url")}
              >
                URL 3D
              </button>
            </div>

            {model3DMode === "glb" && (
              <div className="adminFileDropzone adminFileDropzoneCompact">
                <span className="adminFileDropzoneTitle">
                  {isProcessingModel3D
                    ? "Procesando modelo 3D..."
                    : "Elegí un archivo .glb (incluye geometría y texturas)"}
                </span>
                <span className="adminFileDropzoneHint">
                  Recomendado · Formato .glb único (máx. 50 MB)
                </span>
                <input
                  ref={glbInputRef}
                  id="prod-model3d-input"
                  type="file"
                  accept=".glb,model/gltf-binary"
                  className="adminFileInputHidden"
                  onChange={handleGlbChange}
                />
              </div>
            )}

            {model3DMode === "folder" && (
              <div className="adminFileDropzone adminFileDropzoneCompact">
                <span className="adminFileDropzoneTitle">
                  {isProcessingModel3D
                    ? "Empaquetando carpeta .gltf y texturas..."
                    : "Elegí la carpeta completa con scene.gltf, .bin y textures/"}
                </span>
                <span className="adminFileDropzoneHint">
                  Se empaqueta automáticamente en tu navegador (máx. 50 MB)
                </span>
                <input
                  ref={folderInputRef}
                  id="prod-model3d-input"
                  type="file"
                  multiple
                  className="adminFileInputHidden"
                  onChange={handleFolderChange}
                  {...({
                    webkitdirectory: "",
                    directory: "",
                  } as Record<string, string>)}
                />
              </div>
            )}

            {model3DMode === "url" && (
              <input
                id="prod-model3d-input"
                type="url"
                value={model3DUrlInput}
                onChange={(event) => onModel3DUrlChange(event.target.value)}
                placeholder="https://ejemplo.com/modelo.glb o /models/carpeta/scene.gltf"
                aria-invalid={Boolean(model3DError)}
              />
            )}

            {model3DError ? (
              <span className="adminFieldError">{model3DError}</span>
            ) : (
              <span className="adminFieldHint">
                Los archivos subidos se guardan en IndexedDB de este navegador y
                funcionan tras recargar sin romper la vista 3D.
              </span>
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

          <div className="adminField">
            <label htmlFor="prod-highlight-draft">
              Lo que tenés que saber de este producto{" "}
              <span className="adminOptionalTag">(opcional)</span>
            </label>

            {highlights.length > 0 && (
              <div className="adminEditableList">
                {highlights.map((item, index) => (
                  <div key={index} className="adminEditableRow">
                    <input
                      type="text"
                      value={item}
                      onChange={(event) =>
                        onUpdateHighlight(index, event.target.value)
                      }
                      aria-label={`Punto destacado ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="adminRowRemoveBtn"
                      onClick={() => onRemoveHighlight(index)}
                      aria-label={`Quitar punto ${index + 1}`}
                      title="Quitar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="adminCodeInputRow">
              <input
                id="prod-highlight-draft"
                type="text"
                value={highlightDraft}
                onChange={(event) => onHighlightDraftChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onAddHighlight();
                  }
                }}
                placeholder="Ej: Pantalla Liquid Retina XDR de 16 pulgadas."
              />
              <button
                type="button"
                className="adminAutoSkuBtn"
                onClick={onAddHighlight}
              >
                Agregar
              </button>
            </div>
            <span className="adminFieldHint">
              Si lo dejás vacío, esta sección no se mostrará en la página del
              producto.
            </span>
          </div>

          <div className="adminField">
            <label htmlFor="prod-included-draft">
              ¿Qué incluye la caja?{" "}
              <span className="adminOptionalTag">(opcional)</span>
            </label>

            {includedItems.length > 0 && (
              <div className="adminEditableList">
                {includedItems.map((item, index) => (
                  <div key={index} className="adminIncludedRow">
                    <label
                      className={`adminIncludedCheck ${
                        item.included ? "isIncluded" : "isExcluded"
                      }`}
                      title={
                        item.included
                          ? "Marcado como incluido"
                          : "Marcado como no incluido"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={item.included}
                        onChange={() => onToggleIncludedItem(index)}
                      />
                      <span>{item.included ? "Incluido" : "No incluido"}</span>
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(event) =>
                        onUpdateIncludedItemLabel(index, event.target.value)
                      }
                      aria-label={`Ítem de caja ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="adminRowRemoveBtn"
                      onClick={() => onRemoveIncludedItem(index)}
                      aria-label={`Quitar ítem ${index + 1}`}
                      title="Quitar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="adminIncludedDraftRow">
              <label
                className={`adminIncludedCheck ${
                  includedItemDraftIncluded ? "isIncluded" : "isExcluded"
                }`}
              >
                <input
                  type="checkbox"
                  checked={includedItemDraftIncluded}
                  onChange={(event) =>
                    onIncludedItemDraftIncludedChange(event.target.checked)
                  }
                />
                <span>
                  {includedItemDraftIncluded ? "Incluido" : "No incluido"}
                </span>
              </label>
              <input
                id="prod-included-draft"
                type="text"
                value={includedItemDraft}
                onChange={(event) =>
                  onIncludedItemDraftChange(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onAddIncludedItem();
                  }
                }}
                placeholder="Ej: Cargador USB-C 96W, cable, manual..."
              />
              <button
                type="button"
                className="adminAutoSkuBtn"
                onClick={onAddIncludedItem}
              >
                Agregar
              </button>
            </div>
            <span className="adminFieldHint">
              Tildá el check para indicar si el accesorio viene incluido o no
              incluido. Si no agregás ninguno, la sección se oculta.
            </span>
          </div>

          <div className="adminModalActions">
            <button
              type="button"
              className="adminBtnGhost"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btnPrimary" disabled={isBusy}>
              {isProcessingModel3D
                ? "Guardando 3D..."
                : isProcessingImage
                  ? "Procesando imágenes..."
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
