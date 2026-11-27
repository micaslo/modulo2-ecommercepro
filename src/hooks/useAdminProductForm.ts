import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProductDetails } from "../data/productDetails";
import {
  getBundledProductImages,
  getEditableProductImages,
  getProductMedia,
  type EditableProductImage,
} from "../data/productMedia";
import type {
  NewProduct,
  Product,
  ProductIncludedItem,
} from "../types/productMedia";
import {
  createProductFormSchema,
  isValidProductImageValue,
  normalizeProductCode,
  PRODUCT_CATEGORIES,
  type ProductFormValues,
} from "../schemas/productSchema";
import {
  deleteModelBlobFromIdb,
  isStoredModelRef,
  packGltfFolderUpload,
  prepareGlbUpload,
  saveModelBlobToIdb,
} from "../utils/model3dStorage";
import { suggestNextSku } from "../utils/skuGenerator";

export type ProductImageMode = "url" | "file";
export type ProductModel3DMode = "glb" | "folder" | "url";

const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 900;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("No se pudo leer la imagen seleccionada."));
      }
    };
    reader.onerror = () => {
      reject(new Error("No se pudo leer la imagen seleccionada."));
    };
    reader.readAsDataURL(file);
  });
}

async function optimizeImageToDataUrl(file: File): Promise<string> {
  const rawDataUrl = await readFileAsDataUrl(file);
  if (file.type === "image/gif") {
    return rawDataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(
          1,
          MAX_IMAGE_DIMENSION / Math.max(img.width, img.height, 1),
        );
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const webpDataUrl = canvas.toDataURL("image/webp", 0.84);
        if (
          webpDataUrl.startsWith("data:image/webp") &&
          webpDataUrl.length < rawDataUrl.length
        ) {
          resolve(webpDataUrl);
          return;
        }
        resolve(rawDataUrl);
      } catch {
        resolve(rawDataUrl);
      }
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });
}

function formatModelLabel(src?: string): string {
  if (!src) return "";
  if (isStoredModelRef(src)) return "Modelo 3D guardado localmente";
  const parts = src.split("/").filter(Boolean);
  return parts.slice(-2).join("/") || src;
}

const EMPTY_FORM: ProductFormValues = {
  code: "",
  name: "",
  category: PRODUCT_CATEGORIES[0],
  price: "",
  stock: "",
  image: "",
  description: "",
};

interface UseAdminProductFormOptions {
  products: Product[];
  onCreate: (data: NewProduct) => Product;
  onUpdate: (id: string, data: NewProduct) => void;
  onSuccess?: (message: string) => void;
}

export function useAdminProductForm({
  products,
  onCreate,
  onUpdate,
  onSuccess,
}: UseAdminProductFormOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageMode, setImageMode] = useState<ProductImageMode>("url");
  const [galleryImages, setGalleryImages] = useState<EditableProductImage[]>(
    [],
  );
  const [removedBundledImages, setRemovedBundledImages] = useState<string[]>(
    [],
  );
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const [model3DMode, setModel3DMode] = useState<ProductModel3DMode>("glb");
  const [model3DValue, setModel3DValue] = useState<string | undefined>(
    undefined,
  );
  const [model3DLabel, setModel3DLabel] = useState("");
  const [model3DUrlInput, setModel3DUrlInput] = useState("");
  const [pendingModelBlob, setPendingModelBlob] = useState<{
    blob: Blob;
    label: string;
  } | null>(null);
  const [model3DError, setModel3DError] = useState<string | null>(null);
  const [isProcessingModel3D, setIsProcessingModel3D] = useState(false);

  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightDraft, setHighlightDraft] = useState("");
  const [includedItems, setIncludedItems] = useState<ProductIncludedItem[]>([]);
  const [includedItemDraft, setIncludedItemDraft] = useState("");
  const [includedItemDraftIncluded, setIncludedItemDraftIncluded] =
    useState(true);

  const isSkuAutoManagedRef = useRef(true);

  const editingBundledModel3D = useMemo(
    () =>
      editingProduct
        ? getProductMedia({ ...editingProduct, model3D: undefined }).model3D
        : undefined,
    [editingProduct],
  );

  const hasExistingImages = galleryImages.length > 0;
  const hasRemovedBundledImages = removedBundledImages.length > 0;
  const hasActiveModel3D = Boolean(
    pendingModelBlob ||
      (model3DMode === "url" && model3DUrlInput.trim()) ||
      (model3DValue !== undefined
        ? model3DValue.trim()
        : editingBundledModel3D),
  );

  const schema = useMemo(
    () =>
      createProductFormSchema(
        products,
        editingProduct?.id ?? null,
        hasExistingImages,
      ),
    [products, editingProduct, hasExistingImages],
  );

  const {
    register,
    control,
    handleSubmit: rhfHandleSubmit,
    reset,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_FORM,
  });

  const resetModel3DState = useCallback(() => {
    setModel3DMode("glb");
    setModel3DValue(undefined);
    setModel3DLabel("");
    setModel3DUrlInput("");
    setPendingModelBlob(null);
    setModel3DError(null);
    setIsProcessingModel3D(false);
  }, []);

  const resetDetailsState = useCallback(() => {
    setHighlights([]);
    setHighlightDraft("");
    setIncludedItems([]);
    setIncludedItemDraft("");
    setIncludedItemDraftIncluded(true);
  }, []);

  const openCreate = useCallback(() => {
    const initialCategory = PRODUCT_CATEGORIES[0];
    const autoCode = suggestNextSku(initialCategory, products);
    isSkuAutoManagedRef.current = true;
    setEditingProduct(null);
    setImageMode("url");
    setGalleryImages([]);
    setRemovedBundledImages([]);
    setIsProcessingImage(false);
    resetModel3DState();
    resetDetailsState();
    reset({
      ...EMPTY_FORM,
      category: initialCategory,
      code: autoCode,
    });
    setIsOpen(true);
  }, [products, reset, resetDetailsState, resetModel3DState]);

  const openEdit = useCallback(
    (product: Product) => {
      isSkuAutoManagedRef.current = false;
      setEditingProduct(product);
      setImageMode("url");
      setGalleryImages(getEditableProductImages(product));
      setRemovedBundledImages(product.removedImages ?? []);
      setIsProcessingImage(false);

      const resolvedDetails = getProductDetails(product);
      setHighlights(resolvedDetails.highlights);
      setHighlightDraft("");
      setIncludedItems(resolvedDetails.includedItems);
      setIncludedItemDraft("");
      setIncludedItemDraftIncluded(true);

      const resolvedMedia = getProductMedia(product);
      const currentModel = resolvedMedia.model3D;
      setPendingModelBlob(null);
      setModel3DError(null);
      setIsProcessingModel3D(false);
      setModel3DValue(product.model3D);
      setModel3DLabel(formatModelLabel(currentModel));
      if (
        product.model3D &&
        !isStoredModelRef(product.model3D) &&
        (product.model3D.startsWith("http://") ||
          product.model3D.startsWith("https://") ||
          product.model3D.startsWith("/"))
      ) {
        setModel3DMode("url");
        setModel3DUrlInput(product.model3D);
      } else {
        setModel3DMode("glb");
        setModel3DUrlInput("");
      }

      reset({
        code: product.code ?? "",
        name: product.name,
        category: product.category,
        price: String(product.price),
        stock: String(product.stock),
        image: "",
        description: product.description,
      });
      setIsOpen(true);
    },
    [reset],
  );

  const close = useCallback(() => {
    isSkuAutoManagedRef.current = true;
    setIsOpen(false);
    setEditingProduct(null);
    setImageMode("url");
    setGalleryImages([]);
    setRemovedBundledImages([]);
    setIsProcessingImage(false);
    resetModel3DState();
    resetDetailsState();
    reset(EMPTY_FORM);
  }, [reset, resetDetailsState, resetModel3DState]);

  const handleCategoryChange = useCallback(
    (nextCategory: string) => {
      setValue("category", nextCategory, {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (!editingProduct && isSkuAutoManagedRef.current) {
        const nextCode = suggestNextSku(nextCategory, products);
        setValue("code", nextCode, { shouldValidate: true });
      }
    },
    [editingProduct, products, setValue],
  );

  const handleCodeManualChange = useCallback(
    (rawValue: string) => {
      isSkuAutoManagedRef.current = false;
      setValue("code", rawValue.toUpperCase(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  const regenerateSku = useCallback(() => {
    const currentCategory = getValues("category") || PRODUCT_CATEGORIES[0];
    const nextCode = suggestNextSku(
      currentCategory,
      products,
      editingProduct?.id ?? null,
    );
    if (!editingProduct) {
      isSkuAutoManagedRef.current = true;
    }
    clearErrors("code");
    setValue("code", nextCode, { shouldValidate: true, shouldDirty: true });
  }, [clearErrors, editingProduct, getValues, products, setValue]);

  const addImageFromUrl = useCallback(() => {
    const candidate = getValues("image").trim();
    if (!candidate) {
      setError("image", {
        type: "manual",
        message: "Pegá una URL de imagen antes de agregarla.",
      });
      return;
    }

    if (!isValidProductImageValue(candidate)) {
      setError("image", {
        type: "manual",
        message:
          "La imagen debe ser una URL válida (http://, https://) o un archivo cargado desde tu PC.",
      });
      return;
    }

    setGalleryImages((prev) => {
      if (prev.some((item) => item.url === candidate)) return prev;
      return [...prev, { url: candidate, source: "custom" }];
    });
    setRemovedBundledImages((prev) => prev.filter((url) => url !== candidate));
    clearErrors("image");
    setValue("image", "", { shouldDirty: true });
  }, [clearErrors, getValues, setError, setValue]);

  const handleImageFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      for (const file of files) {
        if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
          setError("image", {
            type: "manual",
            message: `Formato no permitido en "${file.name}". Usá PNG, JPG, WEBP o GIF.`,
          });
          return;
        }
        if (file.size > MAX_IMAGE_FILE_SIZE) {
          setError("image", {
            type: "manual",
            message: `"${file.name}" supera el límite de 5 MB.`,
          });
          return;
        }
      }

      setIsProcessingImage(true);
      try {
        const encodedUrls = await Promise.all(
          files.map((file) => optimizeImageToDataUrl(file)),
        );
        setGalleryImages((prev) => {
          const next = [...prev];
          for (const url of encodedUrls) {
            if (!next.some((item) => item.url === url)) {
              next.push({ url, source: "custom" });
            }
          }
          return next;
        });
        clearErrors("image");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudieron procesar las imágenes seleccionadas.";
        setError("image", { type: "manual", message });
      } finally {
        setIsProcessingImage(false);
      }
    },
    [clearErrors, setError],
  );

  const removeGalleryImage = useCallback((target: EditableProductImage) => {
    setGalleryImages((prev) => prev.filter((item) => item.url !== target.url));
    if (target.source === "bundled") {
      setRemovedBundledImages((prev) =>
        prev.includes(target.url) ? prev : [...prev, target.url],
      );
    }
  }, []);

  const restoreBundledImages = useCallback(() => {
    if (!editingProduct) return;
    const bundled = getBundledProductImages(editingProduct);
    setRemovedBundledImages([]);
    setGalleryImages((prev) => {
      const customOnly = prev.filter((item) => item.source === "custom");
      const restored: EditableProductImage[] = bundled.map((url) => ({
        url,
        source: "bundled",
      }));
      for (const item of customOnly) {
        if (!restored.some((existing) => existing.url === item.url)) {
          restored.push(item);
        }
      }
      return restored;
    });
    clearErrors("image");
  }, [clearErrors, editingProduct]);

  const handleGlbFileSelect = useCallback(async (file: File | null) => {
    if (!file) return;
    setIsProcessingModel3D(true);
    setModel3DError(null);
    try {
      const prepared = await prepareGlbUpload(file);
      setPendingModelBlob(prepared);
      setModel3DLabel(prepared.label);
      setModel3DUrlInput("");
    } catch (error) {
      setModel3DError(
        error instanceof Error
          ? error.message
          : "No se pudo procesar el archivo .glb.",
      );
    } finally {
      setIsProcessingModel3D(false);
    }
  }, []);

  const handleGltfFolderSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsProcessingModel3D(true);
    setModel3DError(null);
    try {
      const packed = await packGltfFolderUpload(files);
      setPendingModelBlob(packed);
      setModel3DLabel(packed.label);
      setModel3DUrlInput("");
    } catch (error) {
      setModel3DError(
        error instanceof Error
          ? error.message
          : "No se pudo empaquetar la carpeta 3D.",
      );
    } finally {
      setIsProcessingModel3D(false);
    }
  }, []);

  const handleModel3DUrlChange = useCallback((nextUrl: string) => {
    setModel3DUrlInput(nextUrl);
    setPendingModelBlob(null);
    setModel3DError(null);
    if (nextUrl.trim()) {
      setModel3DLabel(formatModelLabel(nextUrl.trim()));
    }
  }, []);

  const clearModel3D = useCallback(() => {
    setPendingModelBlob(null);
    setModel3DUrlInput("");
    setModel3DLabel("");
    setModel3DError(null);
    setModel3DValue("");
  }, []);

  const addHighlight = useCallback(() => {
    const trimmed = highlightDraft.trim();
    if (!trimmed) return;
    setHighlights((prev) => [...prev, trimmed]);
    setHighlightDraft("");
  }, [highlightDraft]);

  const updateHighlight = useCallback((index: number, nextValue: string) => {
    setHighlights((prev) =>
      prev.map((item, idx) => (idx === index ? nextValue : item)),
    );
  }, []);

  const removeHighlight = useCallback((index: number) => {
    setHighlights((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const addIncludedItem = useCallback(() => {
    const trimmed = includedItemDraft.trim();
    if (!trimmed) return;
    setIncludedItems((prev) => [
      ...prev,
      { label: trimmed, included: includedItemDraftIncluded },
    ]);
    setIncludedItemDraft("");
    setIncludedItemDraftIncluded(true);
  }, [includedItemDraft, includedItemDraftIncluded]);

  const updateIncludedItemLabel = useCallback(
    (index: number, nextLabel: string) => {
      setIncludedItems((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, label: nextLabel } : item,
        ),
      );
    },
    [],
  );

  const toggleIncludedItem = useCallback((index: number) => {
    setIncludedItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, included: !item.included } : item,
      ),
    );
  }, []);

  const removeIncludedItem = useCallback((index: number) => {
    setIncludedItems((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const handleSubmit = rhfHandleSubmit(async (values) => {
    const pendingUrl = values.image.trim();
    const customImages = galleryImages
      .filter((item) => item.source === "custom")
      .map((item) => item.url);

    if (pendingUrl && !customImages.includes(pendingUrl)) {
      customImages.push(pendingUrl);
    }

    const totalVisibleImages =
      galleryImages.filter((item) => item.source === "bundled").length +
      customImages.length;

    if (totalVisibleImages === 0) {
      setError("image", {
        type: "manual",
        message: "Ingresá una URL de imagen o cargá una desde tu PC.",
      });
      return;
    }

    let finalModel3D = model3DValue;
    if (pendingModelBlob) {
      setIsProcessingModel3D(true);
      try {
        finalModel3D = await saveModelBlobToIdb(
          pendingModelBlob.blob,
          pendingModelBlob.label,
        );
      } catch (error) {
        setModel3DError(
          error instanceof Error
            ? error.message
            : "No se pudo guardar el modelo 3D en el navegador.",
        );
        setIsProcessingModel3D(false);
        return;
      } finally {
        setIsProcessingModel3D(false);
      }
    } else if (model3DMode === "url" && model3DUrlInput.trim()) {
      const cleanedUrl = model3DUrlInput.trim();
      const validUrl =
        cleanedUrl.startsWith("http://") ||
        cleanedUrl.startsWith("https://") ||
        cleanedUrl.startsWith("/");
      if (!validUrl) {
        setModel3DError(
          "La URL del modelo 3D debe comenzar con http://, https:// o /models/.",
        );
        return;
      }
      finalModel3D = cleanedUrl;
    }

    const finalHighlights = [
      ...highlights,
      ...(highlightDraft.trim() ? [highlightDraft.trim()] : []),
    ]
      .map((item) => item.trim())
      .filter(Boolean);

    const finalIncludedItems = [
      ...includedItems,
      ...(includedItemDraft.trim()
        ? [
            {
              label: includedItemDraft.trim(),
              included: includedItemDraftIncluded,
            },
          ]
        : []),
    ]
      .map((item) => ({
        label: item.label.trim(),
        included: item.included,
      }))
      .filter((item) => Boolean(item.label));

    const payload: NewProduct = {
      code: normalizeProductCode(values.code),
      name: values.name.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
      image: customImages[0] ?? "",
      images: customImages.length > 0 ? customImages : undefined,
      removedImages:
        removedBundledImages.length > 0 ? removedBundledImages : undefined,
      model3D: finalModel3D,
      highlights: finalHighlights,
      includedItems: finalIncludedItems,
      description: values.description.trim(),
    };

    try {
      const previousModelRef = editingProduct?.model3D;

      if (editingProduct) {
        onUpdate(editingProduct.id, payload);
        onSuccess?.(`Producto "${payload.name}" actualizado correctamente.`);
      } else {
        onCreate(payload);
        onSuccess?.(`Producto "${payload.name}" agregado al inventario.`);
      }

      if (
        previousModelRef &&
        isStoredModelRef(previousModelRef) &&
        previousModelRef !== finalModel3D
      ) {
        void deleteModelBlobFromIdb(previousModelRef);
      }

      setIsOpen(false);
      setEditingProduct(null);
      setImageMode("url");
      setGalleryImages([]);
      setRemovedBundledImages([]);
      resetModel3DState();
      resetDetailsState();
      reset(EMPTY_FORM);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar el producto.";
      setError("code", { type: "manual", message });
    }
  });

  return {
    isOpen,
    isEditing: editingProduct !== null,
    editingProduct,
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
    register,
    control,
    errors,
    setImageMode,
    setModel3DMode,
    setHighlightDraft,
    setIncludedItemDraft,
    setIncludedItemDraftIncluded,
    handleCategoryChange,
    handleCodeManualChange,
    regenerateSku,
    addImageFromUrl,
    handleImageFiles,
    removeGalleryImage,
    restoreBundledImages,
    handleGlbFileSelect,
    handleGltfFolderSelect,
    handleModel3DUrlChange,
    clearModel3D,
    addHighlight,
    updateHighlight,
    removeHighlight,
    addIncludedItem,
    updateIncludedItemLabel,
    toggleIncludedItem,
    removeIncludedItem,
    openCreate,
    openEdit,
    close,
    handleSubmit,
  };
}
