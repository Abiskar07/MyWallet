import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, SegmentedButtons, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLoans } from '../../context/LoanContext';
import { CreateLoanDTO } from '../../types/loan';
import { Colors, Spacing } from "../../theme";

interface AddLoanFormProps {
  onClose: () => void;
}

const AddLoanForm: React.FC<AddLoanFormProps> = ({ onClose }) => {
  const { createLoan } = useLoans();
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState<'BORROWED' | 'LENT'>('BORROWED');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!name.trim()) {
      newErrors.name = 'Please enter a valid name';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const dataForSupabase = {
        amount: Number(amount),
        name: name.trim(),
        description: description.trim() || undefined,
        type,
        due_date: dueDate ? dueDate.toISOString() : undefined,
      };
      await createLoan(dataForSupabase);
      onClose();
    } catch (error) {
      console.error('Error creating loan:', error);
      setErrors({ submit: 'Failed to create loan, please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Add New Loan</Text>

          <SegmentedButtons
            value={type}
            onValueChange={(value) => setType(value as 'BORROWED' | 'LENT')}
            buttons={[
              { value: 'BORROWED', label: 'Borrowed' },
              { value: 'LENT', label: 'Lent' },
            ]}
            style={styles.segment}
          />

          <TextInput
            mode="outlined"
            label="Amount (रू)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.amount}
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
          <HelperText type="error" visible={!!errors.amount}>
            {errors.amount}
          </HelperText>

          <TextInput
            mode="outlined"
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            error={!!errors.name}
            left={<TextInput.Icon icon="account" />}
            placeholder="Enter name"
            placeholderTextColor="#a1a1a1"
          />
          <HelperText type="error" visible={!!errors.name}>
            {errors.name}
          </HelperText>

          <TextInput
            mode="outlined"
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
            numberOfLines={3}
            left={<TextInput.Icon icon="note" />}
            placeholder="Enter description"
            placeholderTextColor="#a1a1a1"
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
            icon="calendar"
          >
            Set Due Date
          </Button>
          {dueDate && (
            <Text style={styles.selectedDate}>
              Selected Date: {dueDate.toLocaleDateString()}
            </Text>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDueDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}

          {errors.submit && (
            <Text style={styles.errorText}>{errors.submit}</Text>
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              style={styles.button}
            >
              Save
            </Button>
            <Button mode="text" onPress={onClose} style={styles.button}>
              Cancel
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.medium,
  },
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
  dateButton: {
    marginVertical: Spacing.medium / 2,
  },
  buttonContainer: {
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
  errorText: {
    color: Colors.error,
    marginTop: Spacing.small,
    textAlign: 'center',
  },
  selectedDate: {
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.medium / 2,
    fontSize: 16,
  },
});

export default AddLoanForm; 