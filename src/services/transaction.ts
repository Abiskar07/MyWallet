import { supabase } from './supabase';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  description: string;
  category?: string;
  date: string;
  location?: string;
  created_at: string;
  updated_at: Date;
}

export interface CreateTransactionDTO {
  amount: number;
  type: TransactionType;
  description: string;
  category?: string;
  date: string;
  location?: string;
}

export interface UpdateTransactionDTO extends Partial<CreateTransactionDTO> {
  id: string;
}

export interface TransactionError {
  message: string;
}

export interface TransactionResponse {
  data?: Transaction;
  error?: TransactionError;
}

let transactionCache: {
  userId: string | null;
  data: Transaction[] | null;
  timestamp: number;
} = {
  userId: null,
  data: null,
  timestamp: 0
};

export const transactionService = {
  async createTransaction(data: CreateTransactionDTO) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('User not authenticated');
      }

      console.log('Creating transaction for user:', user.email);
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert([{
          ...data,
          user_id: user.id,
          date: data.date || new Date().toISOString(),
          type: data.type.toUpperCase() as TransactionType,
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Transaction created:', transaction);
      return { data: transaction as Transaction, error: null };
    } catch (error) {
      console.error('Create transaction error:', error);
      return { data: null, error: error as TransactionError };
    }
  },

  async getTransactions() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('User not authenticated');
      }

      // Use cache if available and less than 5 seconds old
      const now = Date.now();
      if (
        transactionCache.userId === user.id &&
        transactionCache.data &&
        now - transactionCache.timestamp < 5000
      ) {
        console.log('Using cached transactions');
        return { data: transactionCache.data, error: null };
      }

      console.log('Fetching fresh transactions for user:', user.email);
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      const formattedTransactions = transactions.map(t => ({
        ...t,
        date: new Date(t.date).toISOString(),
        created_at: new Date(t.created_at).toISOString(),
        updated_at: new Date(t.updated_at),
      })) as Transaction[];

      // Update cache
      transactionCache = {
        userId: user.id,
        data: formattedTransactions,
        timestamp: now
      };

      console.log('Fetched transactions:', transactions.length);
      return { data: formattedTransactions, error: null };
    } catch (error) {
      console.error('Get transactions error:', error);
      return { data: null, error: error as TransactionError };
    }
  },

  async updateTransaction({ id, ...data }: UpdateTransactionDTO) {
    try {
      if (data.type) {
        data.type = data.type.toUpperCase() as TransactionType;
      }

      const { data: transaction, error } = await supabase
        .from('transactions')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: transaction as Transaction, error: null };
    } catch (error) {
      return { data: null, error: error as TransactionError };
    }
  },

  async deleteTransaction(id: string) {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as TransactionError };
    }
  },

  async getBalance() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id);

      if (error) throw error;

      const balance = transactions.reduce((acc, curr) => {
        return acc + (curr.type === 'INCOME' ? curr.amount : -curr.amount);
      }, 0);

      return { data: balance, error: null };
    } catch (error) {
      return { data: null, error: error as TransactionError };
    }
  },
}; 