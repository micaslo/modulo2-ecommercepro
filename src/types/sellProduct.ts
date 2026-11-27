export interface SellProductFormData {
  firstName: string
  lastName: string
  email: string
  productName: string
  category: string
  condition: string
  price: string
  image: File | null
  description: string
}

export interface SellProductReceipt {
  reference: string
  date: string
  productName: string
  category: string
  condition: string
  description: string
  price: number
  email: string
  imageUrl: string
}