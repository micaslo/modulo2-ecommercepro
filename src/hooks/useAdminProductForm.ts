import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import type { NewProduct, Product } from "../types/productMedia";
import {
  normalizeProductCode,
  PRODUCT_CATEGORIES,
  validateProductForm,
  type ProductFormErrors,
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
  const [values, setValues] = useState<ProductFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  const openCreate = useCallback(() => {
    setEditingProduct(null);
    setValues(EMPTY_FORM);
    setErrors({});
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setValues({
      code: product.code ?? "",
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
      description: product.description,
    });
    setErrors({});
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setEditingProduct(null);
    setErrors({});
  }, []);

  const handleChange = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const { name, value } = event.target;
      const field = name as keyof ProductFormValues;
      const nextValue = field === "code" ? value.toUpperCase() : value;

      setValues((prev) => ({ ...prev, [field]: nextValue }));
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const nextErrors = validateProductForm(
        values,
        products,
        editingProduct?.id ?? null,
      );
      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) return;

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
        setValues(EMPTY_FORM);
        setErrors({});
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudo guardar el producto.";
        setErrors((prev) => ({ ...prev, code: message }));
      }
    },
    [values, products, editingProduct, onUpdate, onCreate, onSuccess],
  );

  return {
    isOpen,
    isEditing: editingProduct !== null,
    editingProduct,
    values,
    errors,
    openCreate,
    openEdit,
    close,
    handleChange,
    handleSubmit,
  };
}
