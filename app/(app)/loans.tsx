import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { Text, FAB, Card, useTheme, Portal, Modal, Snackbar, ActivityIndicator, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AddLoanForm from '../../src/components/loans/AddLoanForm';
import LoanList from '../../src/components/loans/LoanList';
import { useLoans } from '../../src/context/LoanContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoansScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const theme = useTheme();
  const { loans, isLoading, refreshLoans } = useLoans();

  useEffect(() => {
    refreshLoans();
  }, []);

  const formatAmount = (amount: number, showSign: boolean = false) => {
    const formatted = new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
    
    const sign = showSign ? (amount >= 0 ? '+ ' : '- ') : '';
    return sign + formatted.replace('NPR', 'Rs.');
  };

  const totalBorrowed = loans
    .filter(loan => loan.type === 'BORROWED' && loan.status !== 'PAID')
    .reduce((sum, loan) => sum + loan.amount, 0);

  const totalLent = loans
    .filter(loan => loan.type === 'LENT' && loan.status !== 'PAID')
    .reduce((sum, loan) => sum + loan.amount, 0);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={isLoading} 
                onRefresh={refreshLoans}
                tintColor="#1DB954"
              />
            }
          >
            <Text style={styles.headerTitle}>Lend & Borrow</Text>
            
            <View style={styles.summaryGrid}>
              <Surface style={styles.summaryCard} elevation={0}>
                <View style={[styles.iconBadge, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <MaterialCommunityIcons name="hand-pointing-right" size={24} color="#EF4444" />
                </View>
                <Text style={styles.summaryLabel}>Owed to others</Text>
                <Text style={[styles.summaryAmount, { color: '#EF4444' }]}>
                  {formatAmount(totalBorrowed)}
                </Text>
              </Surface>

              <Surface style={styles.summaryCard} elevation={0}>
                <View style={[styles.iconBadge, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                  <MaterialCommunityIcons name="hand-pointing-left" size={24} color="#22C55E" />
                </View>
                <Text style={styles.summaryLabel}>Owed to you</Text>
                <Text style={[styles.summaryAmount, { color: '#22C55E' }]}>
                  {formatAmount(totalLent)}
                </Text>
              </Surface>
            </View>

            <View style={styles.listSection}>
              <LoanList type="BORROWED" />
              <View style={{ height: 24 }} />
              <LoanList type="LENT" />
            </View>
            
            <View style={{ height: 100 }} />
          </ScrollView>

          <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => setModalVisible(true)}
            color="#fff"
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
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gradient: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 24,
    marginTop: 12,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 24,
    padding: 20,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '800',
  },
  listSection: {
    marginTop: 24,
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: Platform.OS === 'ios' ? 88 : 80, 
    backgroundColor: '#1DB954',
    borderRadius: 16,
    elevation: 8,
  },
  modalContainer: {
    backgroundColor: '#16213e',
    padding: 12,
    margin: 12,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '95%',
    alignSelf: 'center',
    maxWidth: 500,
  },
});