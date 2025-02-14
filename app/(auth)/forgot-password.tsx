import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, TextInput, useTheme, Snackbar, Card } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';
import { auth } from '../../src/services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const theme = useTheme();

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: resetError } = await auth.resetPassword(email);
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
        <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 24, color: theme.colors.primary }}>
          Reset Password
        </Text>

        {success ? (
          <Card style={{ padding: 16 }}>
            <Text variant="bodyLarge" style={{ textAlign: 'center', marginBottom: 16 }}>
              Password reset instructions have been sent to your email.
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 24, color: theme.colors.secondary }}>
              1. Check your email for the reset link{'\n'}
              2. Click the link in your email{'\n'}
              3. Enter your new password{'\n'}
              4. Return to login and sign in with your new password
            </Text>
            <Button mode="outlined" onPress={() => router.replace('/(auth)/login')}>
              Return to Login
            </Button>
          </Card>
        ) : (
          <>
            <Text variant="bodyLarge" style={{ textAlign: 'center', marginBottom: 24 }}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ marginBottom: 24 }}
              disabled={loading}
            />

            <Button
              mode="contained"
              onPress={handleResetPassword}
              style={{ marginBottom: 16 }}
              loading={loading}
              disabled={loading}
            >
              Reset Password
            </Button>

            <Button mode="text" onPress={() => router.back()} disabled={loading}>
              Back to Login
            </Button>
          </>
        )}

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
    </ScrollView>
  );
} 