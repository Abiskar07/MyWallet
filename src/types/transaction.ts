export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: TransactionType
  description?: string
  category?: string
  date: string
  location?: string
  created_at: string
  updated_at: string
}

export type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'; 