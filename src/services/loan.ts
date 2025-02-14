import { supabase } from './supabase';

export type LoanType = 'BORROWED' | 'LENT';
export type LoanStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export interface Loan {
  id: string;
  user_id: string;
  amount: number;
  type: LoanType;
  keeper_name: string;
  keeper_contact?: string;
  due_date?: string;
  status: LoanStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLoanDTO {
  amount: number;
  type: LoanType;
  keeper_name: string;
  keeper_contact?: string;
  due_date?: string;
  notes?: string;
}

export const loanService = {
  async createLoan(data: CreateLoanDTO) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: loan, error } = await supabase
        .from('loans')
        .insert([{
          ...data,
          user_id: user.id,
          status: 'PENDING'
        }])
        .select()
        .single();

      if (error) throw error;
      return { data: loan as Loan, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getLoans() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: loans, error } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return { data: loans as Loan[], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};