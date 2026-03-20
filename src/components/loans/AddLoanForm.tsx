import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, Text as RNText } from 'react-native';
import { TextInput, Button, Text, Card, SegmentedButtons, HelperText, IconButton } from 'react-native-paper';
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

  // Cross-platform date picker handling
  const handleDateChange = () => {
    if (Platform.OS === 'web') {
      // Use native HTML date input on web
      const input = document.createElement('input');
      input.type = 'date';
      input.min = new Date().toISOString().split('T')[0];
      if (dueDate) {
        input.value = dueDate.toISOString().split('T')[0];
      }
      input.onchange = (e: any) => {
        const selectedDate = new Date(e.target.value + 'T00:00:00');
        if (!isNaN(selectedDate.getTime())) {
          setDueDate(selectedDate);
        }
      };
      input.click();
    } else {
      setShowDatePicker(true);
    }
  };

  const renderNativeDatePicker = () => {
    if (Platform.OS === 'web' || !showDatePicker) return null;

    // Dynamic import for native only
    const DateTimePicker = require('@react-native-community/datetimepicker').default;
    return (
      <DateTimePicker
        value={dueDate || new Date()}
        mode="date"
        display="default"
        onChange={(event: any, selectedDate?: Date) => {
          setShowDatePicker(false);
          if (selectedDate) {
            setDueDate(selectedDate);
          }
        }}
        minimumDate={new Date()}
      />
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[
        styles.formContent,
        { borderColor: type === 'BORROWED' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)' }
      ]}>
        <Text style={[
          styles.title,
          { color: type === 'BORROWED' ? '#EF4444' : '#22C55E' }
        ]}>
          {type === 'BORROWED' ? 'I Borrowed' : 'I Lent'}
        </Text>

        <SegmentedButtons
          value={type}
          onValueChange={(value) => setType(value as 'BORROWED' | 'LENT')}
          buttons={[
            {
              value: 'BORROWED',
              label: 'Borrowed',
              style: type === 'BORROWED' ? styles.activeSegmentBorrowed : undefined,
            },
            {
              value: 'LENT',
              label: 'Lent',
              style: type === 'LENT' ? styles.activeSegmentLent : undefined,
            },
          ]}
          style={styles.segment}
        />

        <View style={styles.labelContainer}>
          <RNText style={styles.label}>Amount</RNText>
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
          activeOutlineColor={type === 'BORROWED' ? '#EF4444' : '#22C55E'}
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
          <RNText style={styles.label}>Name</RNText>
        </View>
        <TextInput
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={[styles.input, styles.inputBg]}
          error={!!errors.name}
          textColor={Colors.text}
          placeholderTextColor={Colors.placeholder}
          outlineColor="rgba(255,255,255,0.15)"
          activeOutlineColor={type === 'BORROWED' ? '#EF4444' : '#22C55E'}
          theme={{ colors: { background: 'transparent' } }}
          placeholder="Enter person name"
          outlineStyle={styles.inputOutline}
        />
        <HelperText type="error" visible={!!errors.name}>
          {errors.name}
        </HelperText>

        <View style={styles.labelContainer}>
          <RNText style={styles.label}>Description <RNText style={styles.labelOptional}>(Optional)</RNText></RNText>
        </View>
        <TextInput
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.inputBg]}
          multiline
          numberOfLines={2}
          textColor={Colors.text}
          placeholderTextColor={Colors.placeholder}
          outlineColor="rgba(255,255,255,0.15)"
          activeOutlineColor={type === 'BORROWED' ? '#EF4444' : '#22C55E'}
          theme={{ colors: { background: 'transparent' } }}
          placeholder="Reason for loan..."
          outlineStyle={styles.inputOutline}
        />

        {/* Due Date Section */}
        <View style={styles.dateSection}>
          <Button
            mode={dueDate ? 'contained' : 'outlined'}
            onPress={handleDateChange}
            style={[styles.dateButton, dueDate && styles.dateButtonActive]}
            labelStyle={dueDate ? styles.dateButtonLabelActive : undefined}
            contentStyle={styles.dateButtonContent}
          >
            {dueDate ? formatDate(dueDate) : 'Set Due Date'}
          </Button>
          {dueDate && (
            <IconButton
              icon="close-circle"
              size={20}
              onPress={() => setDueDate(null)}
              iconColor="#FF4444"
              style={styles.clearDateButton}
            />
          )}
        </View>

        {renderNativeDatePicker()}

        {errors.submit && (
          <Text style={styles.errorText}>{errors.submit}</Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={[styles.button, styles.saveButton]}
            labelStyle={styles.saveButtonLabel}
          >
            Save Loan
          </Button>
          <Button
            mode="outlined"
            onPress={onClose}
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
    padding: 12,
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
  activeSegmentBorrowed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  activeSegmentLent: {
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
  labelOptional: {
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '400',
    textTransform: 'none',
  },
  inputOutline: {
    borderRadius: 12,
    borderWidth: 1,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dateButton: {
    flex: 1,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
  },
  dateButtonActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E',
  },
  dateButtonContent: {
    paddingVertical: 4,
  },
  dateButtonLabelActive: {
    color: '#22C55E',
    fontWeight: '700',
  },
  clearDateButton: {
    marginLeft: 4,
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
    backgroundColor: '#22C55E',
  },
  saveButtonLabel: {
    fontWeight: '800',
    fontSize: 16,
    color: '#fff',
  },
  cancelButton: {
    borderColor: 'rgba(255,255,255,0.15)',
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddLoanForm;