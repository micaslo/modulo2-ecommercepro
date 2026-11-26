import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sellProductSchema } from '../schemas/sellProductSchema'
import type {
  SellProductFormData,
  SellProductReceipt,
} from '../types/sellProduct'

const initialFormData: SellProductFormData = {
  firstName: '',
  lastName: '',
  email: '',
  productName: '',
  category: '',
  condition: '',
  price: '',
  image: null,
  description: '',
}

function buildSellReceipt(data: SellProductFormData, imageFile: File): SellProductReceipt {
  return {
    reference: `SP-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString('es-AR'),
    productName: data.productName.trim(),
    category: data.category,
    condition: data.condition,
    description: data.description.trim(),
    price: Number(data.price),
    email: data.email.trim(),
    imageUrl: URL.createObjectURL(imageFile),
  }
}

export function useSellProductForm() {
  const [receipt, setReceipt] = useState<SellProductReceipt | null>(null)

  const {
    register,
    control,
    setValue,
    handleSubmit: rhfHandleSubmit,
    reset,
    formState: { errors },
  } = useForm<SellProductFormData>({
    resolver: zodResolver(sellProductSchema),
    defaultValues: initialFormData,
  })

  const image = useWatch({ control, name: 'image' })
  const description = useWatch({ control, name: 'description' })

  useEffect(() => {
    return () => {
      if (receipt) URL.revokeObjectURL(receipt.imageUrl)
    }
  }, [receipt])

  const handleImage = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null
    setValue('image', file, { shouldValidate: true, shouldDirty: true })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    void rhfHandleSubmit((data) => {
      if (!data.image) return

      setReceipt(buildSellReceipt(data, data.image))
      reset(initialFormData)
    })(e)
  }

  const resetReceipt = (): void => setReceipt(null)

  return {
    register,
    errors,
    image,
    descriptionLength: description.length,
    receipt,
    handleImage,
    handleSubmit,
    resetReceipt,
  }
}
