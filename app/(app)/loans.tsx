import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, FAB, Card, useTheme, Portal, Modal, Snackbar, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AddLoanForm from '../../src/components/loans/AddLoanForm';
import LoanList from '../../src/components/loans/LoanList';
import { useLoans } from '../../src/context/LoanContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoansScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();
  const { loans, isLoading, refreshLoans } = useLoans();

  useEffect(() => {
    refreshLoans();
  }, []);

  const formatAmount = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
    
    return formatted.replace('NPR', 'Rs.');
  };

  const totalBorrowed = loans
    .filter(loan => loan.type === 'BORROWED' && loan.status === 'PENDING')
    .reduce((sum, loan) => sum + loan.amount, 0);

  const totalLent = loans
    .filter(loan => loan.type === 'LENT' && loan.status === 'PENDING')
    .reduce((sum, loan) => sum + loan.amount, 0);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#282828', '#191414']}
        style={styles.gradient}
      >
        <ScrollView style={styles.content}>
          <View style={styles.summaryContainer}>
            <Card style={styles.summaryCard}>
              <Card.Content>
                <Text style={styles.summaryLabel}>Total Borrowed</Text>
                <Text style={[styles.summaryAmount, { color: '#FF4444' }]}>
                  {formatAmount(totalBorrowed)}
                </Text>
              </Card.Content>
            </Card>
            <Card style={styles.summaryCard}>
              <Card.Content>
                <Text style={styles.summaryLabel}>Total Lent</Text>
                <Text style={[styles.summaryAmount, { color: '#1DB954' }]}>
                  {formatAmount(totalLent)}
                </Text>
              </Card.Content>
            </Card>
          </View>

          <LoanList type="BORROWED" />
          <LoanList type="LENT" />
        </ScrollView>

        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => setModalVisible(true)}
        />
        
        <Portal>
          <Modal
            visible={isModalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <AddLoanForm onClose={() => setModalVisible(false)} />
          </Modal>
        </Portal>
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
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    elevation: 3,
    marginHorizontal: 4,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  summaryLabel: {
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#282828',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
}); 