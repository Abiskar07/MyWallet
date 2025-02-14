import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, List, IconButton, Menu, ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import { useLoans } from '../../context/LoanContext';
import { format } from 'date-fns';
import { Loan } from '../../types/loan';

type Props = {
  type: 'BORROWED' | 'LENT';
};

export default function LoanList({ type }: Props) {
  const { loans, isLoading, updateLoanStatus, deleteLoan } = useLoans();
  const [menuVisible, setMenuVisible] = React.useState<string | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);
  const [selectedLoan, setSelectedLoan] = React.useState<Loan | null>(null);

  const filteredLoans = loans.filter(loan => loan.type === type);

  const handleDeletePress = (loan: Loan) => {
    setSelectedLoan(loan);
    setMenuVisible(null);
    setDeleteConfirmVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedLoan) {
      await deleteLoan(selectedLoan.id);
      setDeleteConfirmVisible(false);
      setSelectedLoan(null);
    }
  };

  const formatAmount = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
    
    return formatted.replace('NPR', 'Rs.');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          {type === 'BORROWED' ? 'Borrowed' : 'Lent'} Money
        </Text>

        {filteredLoans.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text>No {type.toLowerCase()} loans found</Text>
            </Card.Content>
          </Card>
        ) : (
          filteredLoans.map(loan => (
            <Card key={loan.id} style={styles.card}>
              <Card.Content>
                <List.Item
                  title={loan.name}
                  description={loan.due_date ? 
                    `Due on: ${format(new Date(loan.due_date), 'PP')}\nStatus: ${loan.status}` :
                    `Status: ${loan.status}`
                  }
                  left={props => <List.Icon {...props} icon="account" />}
                  right={props => (
                    <View style={styles.amountContainer}>
                      <Text 
                        variant="titleMedium"
                        style={[
                          styles.amount,
                          { color: type === 'BORROWED' ? '#FF4444' : '#1DB954' }
                        ]}
                      >
                        {formatAmount(loan.amount)}
                      </Text>
                      <Menu
                        visible={menuVisible === loan.id}
                        onDismiss={() => setMenuVisible(null)}
                        anchor={
                          <IconButton
                            icon="dots-vertical"
                            onPress={() => setMenuVisible(loan.id)}
                          />
                        }
                      >
                        {loan.status !== 'PAID' && (
                          <Menu.Item
                            onPress={() => {
                              updateLoanStatus(loan.id, 'PAID');
                              setMenuVisible(null);
                            }}
                            title="Mark as Paid"
                          />
                        )}
                        <Menu.Item
                          onPress={() => handleDeletePress(loan)}
                          title="Delete"
                          titleStyle={{ color: '#FF4444' }}
                        />
                      </Menu>
                    </View>
                  )}
                />
              </Card.Content>
            </Card>
          ))
        )}
      </View>

      <Portal>
        <Dialog
          visible={deleteConfirmVisible}
          onDismiss={() => setDeleteConfirmVisible(false)}
        >
          <Dialog.Title>Delete Loan</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to delete this loan{selectedLoan ? ` with ${selectedLoan.name}` : ''}? 
              This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <IconButton
              icon="close"
              onPress={() => setDeleteConfirmVisible(false)}
            />
            <IconButton
              icon="check"
              onPress={handleDeleteConfirm}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    color: '#ffffff',
  },
  card: {
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    marginRight: 8,
  },
}); 