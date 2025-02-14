-- First drop the existing table (if it exists)
DROP TABLE IF EXISTS loan_payments;
DROP TABLE IF EXISTS loans;

-- Create the loans table with proper structure
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('BORROWED', 'LENT')),
    "name" TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(10) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'OVERDUE')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT loans_user_id_fkey FOREIGN KEY (user_id) 
        REFERENCES auth.users(id) 
        ON DELETE CASCADE
);

-- Add indexes
CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_created_at ON loans(created_at);

-- Enable RLS
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own loans"
    ON loans FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own loans"
    ON loans FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own loans"
    ON loans FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own loans"
    ON loans FOR DELETE
    USING (user_id = auth.uid());

-- Recreate loan_payments table
CREATE TABLE loan_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for loan_payments
CREATE INDEX idx_loan_payments_loan_id ON loan_payments(loan_id);
CREATE INDEX idx_loan_payments_date ON loan_payments(date);

-- Enable RLS for loan_payments
ALTER TABLE loan_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for loan_payments
CREATE POLICY "Users can view their own loan payments"
    ON loan_payments FOR SELECT
    USING (
        loan_id IN (
            SELECT id FROM loans WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own loan payments"
    ON loan_payments FOR INSERT
    WITH CHECK (
        loan_id IN (
            SELECT id FROM loans WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own loan payments"
    ON loan_payments FOR UPDATE
    USING (
        loan_id IN (
            SELECT id FROM loans WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own loan payments"
    ON loan_payments FOR DELETE
    USING (
        loan_id IN (
            SELECT id FROM loans WHERE user_id = auth.uid()
        )
    );