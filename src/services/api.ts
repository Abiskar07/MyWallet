import { supabase } from './supabase'
import { Transaction, TransactionType } from '../types/transaction'

export const TransactionService = {
  getTransactions: async (userId: string): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    return data || []
  },

  addTransaction: async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()

    return data?.[0]
  },

  deleteTransaction: async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    return !error
  },

  getBalance: async (userId: string): Promise<number> => {
    const { data } = await supabase
      .rpc('get_balance', { user_id: userId })

    return data || 0
  }
} 