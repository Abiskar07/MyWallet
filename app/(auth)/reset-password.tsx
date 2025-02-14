import React from 'react';
import { View } from 'react-native';
import { Text, Button, TextInput, useTheme, Snackbar } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '../../src/services/supabase';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        setError(updateError.message);
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
        Set New Password
      </Text>

      <TextInput
        label="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        mode="outlined"
        secureTextEntry
        style={{ marginBottom: 16 }}
        disabled={loading}
      />

      <TextInput
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        secureTextEntry
        style={{ marginBottom: 24 }}
        disabled={loading}
      />

      <Button
        mode="contained"
        onPress={handlePasswordReset}
        style={{ marginBottom: 16 }}
        loading={loading}
        disabled={loading}
      >
        Update Password
      </Button>

      <Button mode="text" onPress={() => router.replace('/(auth)/login')} disabled={loading}>
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