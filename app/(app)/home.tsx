import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, StatusBar, Image } from 'react-native';
import { Text, FAB, useTheme, Card, Portal, Modal, Snackbar, Button, Dialog, SegmentedButtons, Surface, Appbar } from 'react-native-paper';
import { useTransactions } from '../../src/context/TransactionContext';
import { TransactionList } from '../../src/components/TransactionList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionForm } from '../../src/components/TransactionForm';
import { CreateTransactionDTO, Transaction, TransactionType } from '../../src/services/transaction';
import { useAuth } from '../../src/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

// Add a custom Logo component
const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Text style={styles.logoText}>MW</Text>
    </View>
  );
};

function Home() {
  const theme = useTheme();
  const { 
    transactions, 
    balance, 
    isLoading, 
    refreshTransactions, 
    createTransaction, 
    deleteTransaction,
    updateTransaction 
  } = useTransactions();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { session } = useAuth();
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>('ALL');

  useEffect(() => {
    if (session?.user && transactions.length === 0) {
      console.log("No transactions, initial load");
      refreshTransactions(true);
    }
  }, []);

  const formatBalance = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
    
    return formatted.replace('NPR', 'Rs.');
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsFormVisible(true);
  };

  const handleSubmitTransaction = async (data: CreateTransactionDTO) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (selectedTransaction) {
        // Update existing transaction
        result = await updateTransaction({
          id: selectedTransaction.id,
          ...data,
        });
      } else {
        // Create new transaction
        result = await createTransaction(data);
      }

      if (result.error) {
        setError(result.error.message);
        return;
      }
      setIsFormVisible(false);
      setSelectedTransaction(null);
    } catch (err) {
      setError(`Failed to ${selectedTransaction ? 'update' : 'create'} transaction`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteConfirmVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;
    
    try {
      setError(null);
      const result = await deleteTransaction(transactionToDelete.id);
      if (result.error) {
        setError(result.error.message);
        return;
      }
      setDeleteConfirmVisible(false);
      setTransactionToDelete(null);
    } catch (error) {
      setError('Failed to delete transaction');
    }
  };

  // Filter transactions based on type
  const filteredTransactions = transactions.filter(t => 
    typeFilter === 'ALL' ? true : t.type === typeFilter
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#282828', '#191414']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.2 }}
      >
        <Appbar.Header style={styles.appBar}>
          <Logo />
          <Appbar.Content title="MyWallet" titleStyle={styles.appbarTitle} />
        </Appbar.Header>
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl 
              refreshing={isLoading} 
              onRefresh={refreshTransactions}
              tintColor="#ffffff" 
            />
          }
        >
          <Surface style={styles.balanceContainer} elevation={0}>
            <Text variant="titleMedium" style={styles.balanceLabel}>Current Balance</Text>
            <Text variant="displaySmall" style={[
              styles.balanceAmount,
              { color: balance >= 0 ? '#1DB954' : '#FF4444' }
            ]}>
              {formatBalance(balance)}
            </Text>
          </Surface>

          <View style={styles.quickActions}>
            <Surface style={[styles.quickActionCard, styles.incomeCard]} elevation={0}>
              <Text variant="titleMedium" style={styles.cardLabel}>Income</Text>
              <Text variant="headlineSmall" style={styles.incomeAmount}>
                {formatBalance(transactions.reduce((sum, t) => sum + (t.type === 'INCOME' ? t.amount : 0), 0))}
              </Text>
            </Surface>

            <Surface style={[styles.quickActionCard, styles.expenseCard]} elevation={0}>
              <Text variant="titleMedium" style={styles.cardLabel}>Expenses</Text>
              <Text variant="headlineSmall" style={styles.expenseAmount}>
                {formatBalance(transactions.reduce((sum, t) => sum + (t.type === 'EXPENSE' ? t.amount : 0), 0))}
              </Text>
            </Surface>
          </View>

          <SegmentedButtons
            value={typeFilter}
            onValueChange={value => setTypeFilter(value as TransactionType | 'ALL')}
            buttons={[
              { value: 'ALL', label: 'All' },
              { value: 'INCOME', label: 'Income' },
              { value: 'EXPENSE', label: 'Expense' },
            ]}
            style={styles.filterButtons}
          />

          <Text variant="titleLarge" style={styles.sectionTitle}>
            {filteredTransactions.length ? 'Transactions' : 'No transactions yet'}
          </Text>

          <TransactionList 
            transactions={filteredTransactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </ScrollView>

        <Portal>
          <Modal
            visible={isFormVisible}
            onDismiss={() => {
              setIsFormVisible(false);
              setSelectedTransaction(null);
              setError(null);
            }}
            contentContainerStyle={styles.modalContent}
          >
            <TransactionForm
              onSubmit={handleSubmitTransaction}
              onCancel={() => {
                setIsFormVisible(false);
                setSelectedTransaction(null);
                setError(null);
              }}
              isLoading={isSubmitting}
              initialData={selectedTransaction || undefined}
            />
          </Modal>

          <Dialog visible={deleteConfirmVisible} onDismiss={() => setDeleteConfirmVisible(false)}>
            <Dialog.Title>Delete Transaction</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Are you sure you want to delete this transaction?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button 
                onPress={() => {
                  setDeleteConfirmVisible(false);
                  setTransactionToDelete(null);
                  setError(null);
                }}
              >
                Cancel
              </Button>
              <Button mode="contained" onPress={handleDeleteConfirm}>
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>

          <Snackbar
            visible={!!error}
            onDismiss={() => setError(null)}
            action={{
              label: 'Close',
              onPress: () => setError(null),
            }}
          >
            {error}
          </Snackbar>
        </Portal>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => {
            setIsFormVisible(true);
            setSelectedTransaction(null);
            setError(null);
          }}
          color="#ffffff"
          customSize={56}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  balanceContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    marginTop: 8,
  },
  balanceLabel: {
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 8,
  },
  balanceAmount: {
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  incomeCard: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)', // Spotify green with opacity
  },
  expenseCard: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)', // Red with opacity
  },
  cardLabel: {
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 8,
  },
  incomeAmount: {
    color: '#1DB954', // Spotify green
    fontWeight: 'bold',
  },
  expenseAmount: {
    color: '#FF4444', // Red
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#ffffff',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  filterButtons: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1DB954', // Spotify green
  },
  modalContent: {
    backgroundColor: '#282828', // Spotify dark gray
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    elevation: 0,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DB954', // Use a brand color (e.g., Spotify green)
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginLeft: 16,
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appbarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Home; 