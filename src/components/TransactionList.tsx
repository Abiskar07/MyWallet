import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Transaction } from '../services/transaction';
import { TransactionCard } from './TransactionCard';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const [menuVisible, setMenuVisible] = React.useState<string | null>(null);

  const formatAmount = (amount: number, type: 'INCOME' | 'EXPENSE') => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(type === 'EXPENSE' ? -amount : amount);
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <Card.Content>
          <Text variant="bodyMedium">No transactions yet. Add one using the + button below.</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    color: '#ffffff',
    marginBottom: 4,
  },
  metadata: {
    color: '#ffffff',
    opacity: 0.7,
    fontSize: 12,
  },
  amount: {
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#1DB954',
  },
  expenseAmount: {
    color: '#FF4444',
  },
}); 