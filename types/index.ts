export type User = {
  id: string
  email: string
  name: string
  avatar_url: string
  is_admin: boolean
}

export type Supplier = {
  id: string
  name: string
  trade: string
  phone: string
  description: string
  image_url: string | null
  created_by: string
  created_at: string
}

export type Rating = {
  id: string
  supplier_id: string
  user_id: string
  quality: number | null
  price: number | null
  reliability: number | null
  communication: number | null
  comment: string | null
  created_at: string
}

export type SupplierWithCreator = Supplier & {
  creator: User
  avg_quality: number | null
  avg_price: number | null
  avg_reliability: number | null
  avg_communication: number | null
  rating_count: number
}

export type RatingWithUser = Rating & {
  user: User
}

export const TRADES = [
  'שרברב',
  'חשמלאי',
  'קבלן',
  'מנקה',
  'צבע',
  'נגר',
  'גנן',
  'רצף',
  'פרגולאי',
  'מעצב',
  'אחר',
] as const

export type Trade = typeof TRADES[number]
