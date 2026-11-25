export interface Installments {
  count: number
  amount: number
  provider: string
}

export type ShippingType = 'tomorrow' | 'free'

export interface Product {
  id: string | number
  title: string
  image: string
  price: number
  originalPrice?: number
  sold?: string
  installments?: Installments
  shipping?: ShippingType
  full?: boolean
  href: string
}

export interface BestSellersCategory {
  id: string
  name: string
  products: Product[]
}