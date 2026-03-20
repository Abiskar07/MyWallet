import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Transaction, CreateTransactionDTO, UpdateTransactionDTO, transactionService } from '../services/transaction';
import { useAuth } from './AuthContext'; // Import auth context to get user info
import { supabase } from '../services/supabase';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';
import { useNetwork } from './NetworkContext';

interface TransactionContextData {
  transactions: Transaction[];
  balance: number;
  isLoading: boolean;
  refreshTransactions: (force?: boolean) => Promise<void>;
  createTransaction: (data: CreateTransactionDTO) => Promise<{ error?: { message: string } }>;
  updateTransaction: (data: UpdateTransactionDTO) => Promise<{ error?: { message: string } }>;
  deleteTransaction: (id: string) => Promise<{ error?: { message: string } }>;
}

const TransactionContext = createContext<TransactionContextData>({} as TransactionContextData);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const { session } = useAuth();
  const { isOnline, addPendingAction, updateLastSyncTimestamp } = useNetwork();

  // Load persisted transactions from local storage on mount
  useEffect(() => {
    (async () => {
      const storedTransactions = await loadFromStorage('transactions');
      if (storedTransactions) {
        setTransactions(storedTransactions);
      }
    })();
  }, []);

  // Save transactions into local storage whenever they change
  useEffect(() => {
    (async () => {
      await saveToStorage('transactions', transactions);
    })();
  }, [transactions]);

  const refreshTransactions = useCallback(async (force = false) => {
    if (!session?.user) {
      console.log("No user session, skipping refresh");
      return;
    }

    // Prevent frequent refreshes unless forced
    const now = Date.now();
    if (!force && now - lastRefresh < 1000) {
      console.log("Skipping refresh - too frequent");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Refreshing transactions for user:", session.user.email);
      const result = await transactionService.getTransactions();
      if (result.data) {
        setTransactions(result.data);
        setLastRefresh(now);
      }
    } catch (error: any) {
      console.error('Failed to refresh transactions:', error);
      // Optional: you could set a global error state here to show a "Network Error" banner
      if (error?.message?.includes('Network') || error?.message?.includes('fetch')) {
        // Handle network specific errors
      }
    } finally {
      setIsLoading(false);
    }
  }, [session, lastRefresh]);

  // Load transactions when session changes
  useEffect(() => {
    if (session?.user) {
      refreshTransactions(true);
    } else {
      setTransactions([]);
    }
  }, [session?.user?.id]); // Only refresh when user ID changes

  // Add auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        refreshTransactions();
      } else if (event === 'SIGNED_OUT') {
        setTransactions([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createTransaction = async (data: CreateTransactionDTO) => {
    try {
      if (!isOnline) {
        // Queue for later sync
        addPendingAction({ type: 'transaction', action: 'create', data });
        // Optimistically add to local state
        const optimisticTransaction = {
          id: `temp-${Date.now()}`,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date(),
          user_id: session?.user?.id || '',
        } as unknown as Transaction;
        setTransactions(prev => [optimisticTransaction, ...prev]);
        return {};
      }

      const result = await transactionService.createTransaction(data);
      if (result.data) {
        setTransactions(prev => [result.data!, ...prev]);
        updateLastSyncTimestamp();
        return {};
      }
      return { error: { message: 'Failed to create transaction' } };
    } catch (error) {
      // Queue for retry if online becomes available
      addPendingAction({ type: 'transaction', action: 'create', data });
      return {};
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      if (!isOnline) {
        addPendingAction({ type: 'transaction', action: 'delete', data: { id } });
        setTransactions(prev => prev.filter(t => t.id !== id));
        return {};
      }

      const result = await transactionService.deleteTransaction(id);
      if (!result.error) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        updateLastSyncTimestamp();
        return {};
      }
      return { error: { message: 'Failed to delete transaction' } };
    } catch (error) {
      addPendingAction({ type: 'transaction', action: 'delete', data: { id } });
      setTransactions(prev => prev.filter(t => t.id !== id));
      return {};
    }
  };

  const updateTransaction = async (data: UpdateTransactionDTO) => {
    try {
      const result = await transactionService.updateTransaction(data);
      if (result.data) {
        setTransactions(prev =>
          prev.map(t => t.id === data.id ? result.data! : t)
        );
        return {};
      }
      return { error: { message: 'Failed to update transaction' } };
    } catch (error) {
      return { error: { message: 'Failed to update transaction' } };
    }
  };

  const balance = transactions.reduce((sum, transaction) => {
    return sum + (transaction.type === 'INCOME' ? transaction.amount : -transaction.amount);
  }, 0);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        balance,
        isLoading,
        refreshTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}; 