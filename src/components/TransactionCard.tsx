import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, IconButton, Menu } from 'react-native-paper';
import { Transaction } from '../services/transaction';
import { format } from 'date-fns';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const formatAmount = (amount: number, type: 'INCOME' | 'EXPENSE') => {
    const formatted = new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(type === 'EXPENSE' ? -amount : amount);
    
    return formatted.replace('NPR', 'Rs.');
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.leftContent}>
          <Text variant="titleMedium" style={styles.description}>
            {transaction.description}
          </Text>
          <Text variant="bodySmall" style={styles.metadata}>
            {format(new Date(transaction.date), 'PPp')}
          </Text>
        </View>

        <View style={styles.rightContent}>
          <Text
            variant="titleMedium"
            style={[
              styles.amount,
              transaction.type === 'INCOME' ? styles.incomeAmount : styles.expenseAmount,
            ]}
          >
            {formatAmount(transaction.amount, transaction.type)}
          </Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                onEdit(transaction);
                setMenuVisible(false);
              }}
              title="Edit"
            />
            <Menu.Item
              onPress={() => {
                onDelete(transaction);
                setMenuVisible(false);
              }}
              title="Delete"
              titleStyle={{ color: '#FF4444' }}
            />
          </Menu>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    color: '#ffffff',
  },
  metadata: {
    color: '#ffffff',
    opacity: 0.7,
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