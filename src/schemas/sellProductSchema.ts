import { z } from 'zod'

export const sellProductCategories: string[] = [
  'Vehículos',
  'Tecnología',
  'Electrodomésticos',
  'Herramientas',
  'Deportes',
]

export const sellProductConditions: string[] = ['Nuevo', 'Usado']

const allowedImageTypes: string[] = ['image/png', 'image/jpeg', 'image/webp']
const maxImageSize: number = 5 * 1024 * 1024

export const sellProductSchema = z.object({
  firstName: z.string().trim().min(2, 'Ingresá tu nombre (mínimo 2 caracteres)'),
  lastName: z.string().trim().min(2, 'Ingresá tu apellido (mínimo 2 caracteres)'),
  email: z
    .string()
    .trim()
    .min(1, 'Ingresá tu email')
    .pipe(z.email('El email no tiene un formato válido')),
  productName: z
    .string()
    .trim()
    .min(3, 'Ingresá el nombre del producto (mínimo 3 caracteres)'),
  category: z.string().min(1, 'Seleccioná una categoría'),
  condition: z.string().min(1, 'Indicá si el producto es nuevo o usado'),
  price: z
    .string()
    .trim()
    .min(1, 'Ingresá el precio')
    .refine((value) => Number(value) > 0, 'El precio tiene que ser un número mayor a 0'),
  image: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, 'Adjuntá una foto del producto')
    .refine(
      (file) => file === null || allowedImageTypes.includes(file.type),
      'La foto tiene que ser PNG, JPG o WEBP',
    )
    .refine(
      (file) => file === null || file.size <= maxImageSize,
      'La foto no puede pesar más de 5MB',
    ),
  description: z
    .string()
    .trim()
    .min(20, 'Describí tu producto (mínimo 20 caracteres)')
    .max(500, 'La descripción no puede superar los 500 caracteres'),
})