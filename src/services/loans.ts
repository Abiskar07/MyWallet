import { supabase } from './supabase';
import { CreateLoanDTO, Loan, LoanStatus, PaymentRecord } from '../types/loan';

export async function createLoan(loan: CreateLoanDTO): Promise<{ data?: Loan; error?: { message: string } }> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) return { error: { message: userError.message } };
  if (!user) return { error: { message: 'User not authenticated' } };

  const { data, error } = await supabase
    .from('loans')
    .insert([{
      ...loan,
      user_id: user.id,
      status: 'PENDING',
    }])
    .select()
    .single();

  if (error) return { error: { message: error.message } };
  return { data };
}

export async function getLoans(): Promise<{ data?: Loan[]; error?: { message: string } }> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) return { error: { message: userError.message } };
  if (!user) return { error: { message: 'User not authenticated' } };

  const { data: loans, error: loansError } = await supabase
    .from('loans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (loansError) return { error: { message: loansError.message } };
  return { data: loans || [] };
}

export async function updateLoanStatus(
  id: string, 
  status: LoanStatus,
  notes?: string
): Promise<{ data?: Loan; error?: { message: string } }> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) return { error: { message: userError.message } };
  if (!user) return { error: { message: 'User not authenticated' } };

  const { data, error } = await supabase
    .from('loans')
    .update({ 
      status,
      notes: notes || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return { error: { message: error.message } };
  return { data };
}

// export async function addPayment(
//   payment: Omit<PaymentRecord, 'id'>
// ): Promise<{ data?: PaymentRecord; error?: { message: string } }> {
//   // First verify the loan belongs to the user
//   const { data: loan, error: loanError } = await supabase
//     .from('loans')
//     .select('id')
//     .eq('id', payment.loan_id)
//     .single();

//   if (loanError || !loan) {
//     return { error: { message: 'Invalid loan or unauthorized' } };
//   }

//   const { data, error } = await supabase
//     .from('loan_payments')
//     .insert([{
//       ...payment,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     }])
//     .select()
//     .single();

//   if (error) return { error: { message: error.message } };
//   return { data };
// }

export async function deleteLoan(id: string): Promise<{ error?: { message: string } }> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) return { error: { message: userError.message } };
  if (!user) return { error: { message: 'User not authenticated' } };

  const { error } = await supabase
    .from('loans')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: { message: error.message } };
  return {};
}

export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select('count')
      .single();
    
    console.log('Connection test result:', { data, error });
    return !error;
  } catch (err) {
    console.error('Connection test failed:', err);
    return false;
  }
}

testConnection().then(isConnected => {
  console.log('Database connection:', isConnected ? 'OK' : 'Failed');
}); 