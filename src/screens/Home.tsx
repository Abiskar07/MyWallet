import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text, Portal, Modal, FAB, Button, Dialog } from 'react-native-paper';
import { useTransactions } from '../context/TransactionContext';
import { TransactionCard } from '../components/TransactionCard';
import { TransactionForm } from '../components/TransactionForm';
import { Transaction, CreateTransactionDTO, UpdateTransactionDTO } from '../services/transaction';

export default function Home() {
  const { transactions, balance, isLoading, refreshTransactions, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const handleCreateTransaction = async (data: CreateTransactionDTO) => {
    try {
      setIsSubmitting(true);
      await createTransaction(data);
      setIsFormVisible(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Failed to create transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTransaction = async (data: CreateTransactionDTO) => {
    if (!selectedTransaction) return;
    try {
      setIsSubmitting(true);
      const updateData: UpdateTransactionDTO = {
        ...data,
        id: selectedTransaction.id
      };
      await updateTransaction(updateData);
      setIsFormVisible(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Failed to update transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    try {
      await deleteTransaction(transactionToDelete.id);
      setDeleteConfirmVisible(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR'
    }).format(amount);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshTransactions} />
        }
      >
        <View style={{ padding: 16 }}>
          <Text variant="titleLarge">Current Balance</Text>
          <Text variant="displaySmall">{formatBalance(balance)}</Text>

          <View style={{ marginTop: 24 }}>
            <Text variant="titleLarge">Recent Transactions</Text>
            {transactions.length === 0 ? (
              <Text variant="bodyLarge" style={{ marginTop: 8 }}>
                No transactions yet. Add one using the + button below.
              </Text>
            ) : (
              <View style={{ marginTop: 8 }}>
                {transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={() => {
                      setSelectedTransaction(transaction);
                      setIsFormVisible(true);
                    }}
                    onDelete={() => {
                      setTransactionToDelete(transaction);
                      setDeleteConfirmVisible(true);
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={isFormVisible}
          onDismiss={() => {
            setIsFormVisible(false);
            setSelectedTransaction(null);
          }}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 8,
          }}
        >
          <Text variant="titleLarge" style={{ marginBottom: 16 }}>
            {selectedTransaction ? 'Edit' : 'Add'} Transaction
          </Text>
          <TransactionForm
            onSubmit={selectedTransaction ? handleUpdateTransaction : handleCreateTransaction}
            initialData={selectedTransaction || undefined}
            onCancel={() => {
              setIsFormVisible(false);
              setSelectedTransaction(null);
            }}
            isLoading={isSubmitting}
          />
        </Modal>

        <Dialog
          visible={deleteConfirmVisible}
          onDismiss={() => {
            setDeleteConfirmVisible(false);
            setTransactionToDelete(null);
          }}
        >
          <Dialog.Title>Delete Transaction</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setDeleteConfirmVisible(false);
                setTransactionToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button mode="contained" onPress={handleDeleteTransaction}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => setIsFormVisible(true)}
      />
    </View>
  );
} 