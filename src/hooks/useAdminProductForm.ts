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

  const schema = useMemo(
    () => createProductFormSchema(products, editingProduct?.id ?? null),
    [products, editingProduct],
  );

  const {
    register,
    control,
    handleSubmit: rhfHandleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_FORM,
  });

  const openCreate = useCallback(() => {
    setEditingProduct(null);
    reset(EMPTY_FORM);
    setIsOpen(true);
  }, [reset]);

  const openEdit = useCallback(
    (product: Product) => {
      setEditingProduct(product);
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
    reset(EMPTY_FORM);
  }, [reset]);

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
    register,
    control,
    errors,
    openCreate,
    openEdit,
    close,
    handleSubmit,
  };
}
