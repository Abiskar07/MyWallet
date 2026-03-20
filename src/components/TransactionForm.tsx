import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text as RNText } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text, Card, HelperText } from 'react-native-paper';
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setType(initialData.type);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!description.trim()) {
      newErrors.description = 'Please enter a short description';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload: CreateTransactionDTO = {
      amount: parseFloat(amount),
      type,
      description: description.trim(),
      date: initialData?.date || new Date().toISOString(),
    };
    onSubmit(payload);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[
        styles.formContent,
        { borderColor: type === 'EXPENSE' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)' }
      ]}>
        <Text style={[
          styles.title,
          { color: type === 'EXPENSE' ? '#EF4444' : '#22C55E' }
        ]}>
          {type === 'EXPENSE' ? 'New Expense' : 'New Income'}
        </Text>

        <SegmentedButtons
          value={type}
          onValueChange={value => setType(value as TransactionType)}
          buttons={[
            {
              value: 'EXPENSE',
              label: 'Expense',
              style: type === 'EXPENSE' ? styles.activeSegmentExpense : undefined,
            },
            {
              value: 'INCOME',
              label: 'Income',
              style: type === 'INCOME' ? styles.activeSegmentIncome : undefined,
            },
          ]}
          style={styles.segment}
        />

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Amount</Text>
        </View>
        <TextInput
          mode="outlined"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={[styles.input, styles.inputBg]}
          error={!!errors.amount}
          textColor={Colors.text}
          placeholderTextColor={Colors.placeholder}
          outlineColor="rgba(255,255,255,0.15)"
          activeOutlineColor={type === 'EXPENSE' ? '#EF4444' : '#22C55E'}
          theme={{
            colors: {
              background: 'transparent',
              onSurfaceVariant: 'rgba(255,255,255,0.5)'
            }
          }}
          placeholder="0.00"
          outlineStyle={styles.inputOutline}
        />
        <HelperText type="error" visible={!!errors.amount}>
          {errors.amount}
        </HelperText>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Description</Text>
        </View>
        <TextInput
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.inputBg]}
          error={!!errors.description}
          textColor={Colors.text}
          placeholderTextColor={Colors.placeholder}
          outlineColor="rgba(255,255,255,0.15)"
          activeOutlineColor={type === 'EXPENSE' ? '#EF4444' : '#22C55E'}
          theme={{
            colors: {
              background: 'transparent'
            }
          }}
          placeholder="e.g., Grocery, Salary, Rent..."
          outlineStyle={styles.inputOutline}
        />
        <HelperText type="error" visible={!!errors.description}>
          {errors.description}
        </HelperText>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={[styles.button, styles.saveButton]}
            labelStyle={styles.saveButtonLabel}
          >
            {initialData ? 'Update' : 'Save Transaction'}
          </Button>
          <Button
            mode="outlined"
            onPress={onCancel}
            style={[styles.button, styles.cancelButton]}
          >
            Cancel
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12, // Reduced padding to give content more room
  },
  formContent: {
    width: '100%',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  segment: {
    marginBottom: 20,
  },
  activeSegmentExpense: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  activeSegmentIncome: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  input: {
    marginBottom: 16,
    height: 56,
    fontSize: 16,
  },
  inputBg: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  labelContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    marginLeft: 4,
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputOutline: {
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#22C55E', // Use high-vibrancy Green
  },
  saveButtonLabel: {
    fontWeight: '800',
    fontSize: 16,
    color: '#fff',
  },
  cancelButton: {
    borderColor: 'rgba(255,255,255,0.15)',
  },
});