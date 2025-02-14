import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Transaction } from '../services/transaction';
import { Colors, Spacing } from "../theme";

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Display amount & description */}
        <Text style={styles.amount}>रु {transaction.amount}</Text>
        <Text style={styles.description}>{transaction.description}</Text>
        
        <View style={styles.dateContainer}>
          <Text style={styles.date}>
            {new Date(transaction.date).toLocaleDateString()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.small,
    marginHorizontal: Spacing.medium,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    elevation: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginVertical: Spacing.small,
    color: '#444',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  dateContainer: {
    marginTop: Spacing.small,
  },
});

export default TransactionItem; 