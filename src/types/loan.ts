/**
 * Represents a Loan object.
 *
 * The application follows a dark theme with moody accents similar to Spotify.
 * Typically, a borrowed loan is highlighted using an accent color of #FF4444,
 * while a lent loan uses Spotify green (#1DB954).
 */
export type Loan = {
  id: string;
  userId: string;
  amount: number;
  type: 'BORROWED' | 'LENT';
  name: string;
  description?: string;
  dueDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  payment_history?: PaymentRecord[];
};

/**
 * Represents a payment record for a loan.
 *
 * Payment records can be used to build a payment history view,
 * which may also be themed with accent colors.
 */
export type PaymentRecord = {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  notes?: string;
};

/**
 * Data required for creating a new loan.
 *
 * For a "Borrowed" loan, the UI may render a red (#FF4444) accent,
 * whereas a "Lent" loan is styled with Spotify green (#1DB954).
 */
export interface CreateLoanDTO {
  amount: number;
  name: string;
  description?: string;
  dueDate?: string;
  type: 'BORROWED' | 'LENT';
  borrower?: string;
}

/**
 * LoanStatus represents the possible status values for a loan.
 */
export type LoanStatus = 'PENDING' | 'PAID' | 'OVERDUE'; 