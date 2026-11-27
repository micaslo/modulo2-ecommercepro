import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NewProduct, Product } from "../types/productMedia";
import {
  createProductFormSchema,
  normalizeProductCode,
  PRODUCT_CATEGORIES,
  type ProductFormValues,
} from "../schemas/productSchema";

export type ProductImageMode = "url" | "file";

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
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const schema = useMemo(
    () => createProductFormSchema(products, editingProduct?.id ?? null),
    [products, editingProduct],
  );

  const {
    register,
    control,
    handleSubmit: rhfHandleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_FORM,
  });

  const openCreate = useCallback(() => {
    setEditingProduct(null);
    setImageMode("url");
    setUploadedFileName("");
    setIsProcessingImage(false);
    reset(EMPTY_FORM);
    setIsOpen(true);
  }, [reset]);

  const openEdit = useCallback(
    (product: Product) => {
      setEditingProduct(product);
      setImageMode(product.image.startsWith("data:image/") ? "file" : "url");
      setUploadedFileName("");
      setIsProcessingImage(false);
      reset({
        code: product.code ?? "",
        name: product.name,
        category: product.category,
        price: String(product.price),
        stock: String(product.stock),
        image: product.image,
        description: product.description,
      });
      setIsOpen(true);
    },
    [reset],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setEditingProduct(null);
    setImageMode("url");
    setUploadedFileName("");
    setIsProcessingImage(false);
    reset(EMPTY_FORM);
  }, [reset]);

  const handleImageFile = useCallback(
    async (file: File | null) => {
      if (!file) return;

      if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
        setError("image", {
          type: "manual",
          message: "Formato no permitido. Usá PNG, JPG, WEBP o GIF.",
        });
        return;
      }

      if (file.size > MAX_IMAGE_FILE_SIZE) {
        setError("image", {
          type: "manual",
          message: "La imagen no puede superar los 5 MB.",
        });
        return;
      }

      setIsProcessingImage(true);
      try {
        const dataUrl = await optimizeImageToDataUrl(file);
        setUploadedFileName(file.name);
        clearErrors("image");
        setValue("image", dataUrl, { shouldValidate: true, shouldDirty: true });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudo procesar la imagen seleccionada.";
        setError("image", { type: "manual", message });
      } finally {
        setIsProcessingImage(false);
      }
    },
    [clearErrors, setError, setValue],
  );

  const clearImage = useCallback(() => {
    setUploadedFileName("");
    setValue("image", "", { shouldValidate: true, shouldDirty: true });
  }, [setValue]);

  const handleSubmit = rhfHandleSubmit((values) => {
    const payload: NewProduct = {
      code: normalizeProductCode(values.code),
      name: values.name.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
      image: values.image.trim(),
      description: values.description.trim(),
    };

    try {
      if (editingProduct) {
        onUpdate(editingProduct.id, payload);
        onSuccess?.(`Producto "${payload.name}" actualizado correctamente.`);
      } else {
        onCreate(payload);
        onSuccess?.(`Producto "${payload.name}" agregado al inventario.`);
      }
      setIsOpen(false);
      setEditingProduct(null);
      setImageMode("url");
      setUploadedFileName("");
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
    imageMode,
    uploadedFileName,
    isProcessingImage,
    register,
    control,
    errors,
    setImageMode,
    handleImageFile,
    clearImage,
    openCreate,
    openEdit,
    close,
    handleSubmit,
  };
}
