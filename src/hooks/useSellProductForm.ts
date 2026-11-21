import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { validateSellProduct } from '../schemas/sellProductSchema'
import type {
  SellProductErrors,
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

export function useSellProductForm() {
  const [formData, setFormData] = useState<SellProductFormData>(initialFormData)
  const [errors, setErrors] = useState<SellProductErrors>({})
  const [receipt, setReceipt] = useState<SellProductReceipt | null>(null)

  useEffect(() => {
    return () => {
      if (receipt) URL.revokeObjectURL(receipt.imageUrl)
    }
  }, [receipt])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleImage = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null
    setFormData((prev) => ({ ...prev, image: file }))
    setErrors((prev) => ({ ...prev, image: undefined }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const newErrors = validateSellProduct(formData)
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0 || !formData.image) return

    setReceipt({
      reference: `SP-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('es-AR'),
      productName: formData.productName.trim(),
      category: formData.category,
      condition: formData.condition,
      description: formData.description.trim(),
      price: Number(formData.price),
      email: formData.email.trim(),
      imageUrl: URL.createObjectURL(formData.image),
    })
    setFormData(initialFormData)
  }

  const resetReceipt = (): void => setReceipt(null)

  return { formData, errors, receipt, handleChange, handleImage, handleSubmit, resetReceipt }
}