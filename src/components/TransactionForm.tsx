import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text, Card } from 'react-native-paper';
import { CreateTransactionDTO, Transaction, TransactionType } from '../services/transaction';
import { Colors, Spacing } from "../theme";

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionDTO) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  initialData?: Transaction;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  initialData
}) => {
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [type, setType] = useState<TransactionType>(initialData?.type || 'EXPENSE');
  const [description, setDescription] = useState(initialData?.description || '');

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setType(initialData.type);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const payload: CreateTransactionDTO = {
      amount: numAmount,
      type,
      description,
      date: initialData?.date || new Date().toISOString(),
    };
    onSubmit(payload);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          {initialData ? 'Edit Transaction' : 'New Transaction'}
        </Text>

        <SegmentedButtons
          value={type}
          onValueChange={value => setType(value as TransactionType)}
          buttons={[
            { value: 'EXPENSE', label: 'Expense' },
            { value: 'INCOME', label: 'Income' },
          ]}
          style={styles.segment}
        />

        <TextInput
          mode="outlined"
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          left={
            <TextInput.Icon
              icon={() => (
                <Text style={{ color: '#a1a1a1', fontSize: 20 }}>रू</Text>
              )}
            />
          }
          placeholder="Enter amount"
          placeholderTextColor="#a1a1a1"
        />

        <TextInput
          mode="outlined"
          label="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          left={<TextInput.Icon icon="text" />}
          placeholder="Enter description"
          placeholderTextColor="#a1a1a1"
        />

        <View style={styles.buttons}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={!amount || !description || isLoading}
            style={styles.button}
          >
            {initialData ? 'Update' : 'Save'}
          </Button>
          <Button
            mode="text"
            onPress={onCancel}
            style={styles.button}
          >
            Cancel
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: Spacing.medium,
    borderRadius: 20,
    padding: Spacing.large + 4,
    backgroundColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    width: '95%',
    alignSelf: 'center',
  },
  title: {
    marginBottom: Spacing.medium,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  segment: {
    marginBottom: Spacing.medium,
  },
  input: {
    marginBottom: Spacing.medium,
    backgroundColor: Colors.input,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 55,
    color: Colors.text,
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.medium,
    width: '100%',
  },
  button: {
    marginTop: 12,
    flex: 0.48,
    paddingVertical: 6,
  },
}); 