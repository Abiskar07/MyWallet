import React from 'react';
import { View } from 'react-native';
import { Text, Button, TextInput, useTheme, Snackbar } from 'react-native-paper';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { auth } from '../../src/services/auth';

export default function Verify() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const handleVerify = async () => {
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: verifyError } = await auth.verifyOTP(email, otp);
      if (verifyError) {
        setError(verifyError.message);
      } else {
        router.replace('/(auth)/login');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', backgroundColor: theme.colors.background }}>
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 24, color: theme.colors.primary }}>
        Verify Your Email
      </Text>

      <Text variant="bodyLarge" style={{ textAlign: 'center', marginBottom: 24 }}>
        Please enter the verification code sent to {email}
      </Text>

      <TextInput
        label="Verification Code"
        value={otp}
        onChangeText={setOtp}
        mode="outlined"
        keyboardType="number-pad"
        style={{ marginBottom: 24 }}
        disabled={loading}
      />

      <Button
        mode="contained"
        onPress={handleVerify}
        style={{ marginBottom: 16 }}
        loading={loading}
        disabled={loading}
      >
        Verify Email
      </Button>

      <Button mode="text" onPress={() => router.back()} disabled={loading}>
        Back to Login
      </Button>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        action={{
          label: 'Close',
          onPress: () => setError(''),
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
} 