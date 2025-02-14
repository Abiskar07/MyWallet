import React, { createContext, useContext, useState, useEffect } from 'react';
import { Loan, CreateLoanDTO } from '../types/loan';
import * as loanService from '../services/loans';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

type LoanContextType = {
  loans: Loan[];
  isLoading: boolean;
  error: string | null;
  createLoan: (loan: CreateLoanDTO) => Promise<void>;
  updateLoanStatus: (id: string, status: 'PENDING' | 'PAID' | 'OVERDUE') => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;
  refreshLoans: () => Promise<void>;
};

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export function LoanProvider({ children }: { children: React.ReactNode }) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load persisted loans from local storage on mount
  useEffect(() => {
    (async () => {
      const storedLoans = await loadFromStorage('loans');
      if (storedLoans) {
        setLoans(storedLoans);
      }
    })();
  }, []);

  // Save loans to local storage whenever they change
  useEffect(() => {
    (async () => {
      await saveToStorage('loans', loans);
    })();
  }, [loans]);

  const refreshLoans = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await loanService.getLoans();
      console.log('Fetched loans:', data);
      if (error) throw new Error(error.message);
      setLoans(data || []);
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError('Failed to fetch loans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshLoans();
  }, []);

  const create = async (loan: CreateLoanDTO) => {
    const { error } = await loanService.createLoan(loan);
    if (error) throw new Error(error.message);
    await refreshLoans();
  };

  const updateStatus = async (id: string, status: 'PENDING' | 'PAID' | 'OVERDUE') => {
    const { error } = await loanService.updateLoanStatus(id, status);
    if (error) throw new Error(error.message);
    await refreshLoans();
  };

  const remove = async (id: string) => {
    const { error } = await loanService.deleteLoan(id);
    if (error) throw new Error(error.message);
    await refreshLoans();
  };

  return (
    <LoanContext.Provider
      value={{
        loans,
        isLoading,
        error,
        createLoan: create,
        updateLoanStatus: updateStatus,
        deleteLoan: remove,
        refreshLoans,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
}

export function useLoans() {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error('useLoans must be used within a LoanProvider');
  }
  return context;
} 