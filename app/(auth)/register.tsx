import { View } from 'react-native';
import { Text, Button, TextInput, useTheme, Snackbar } from 'react-native-paper';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setError(signUpError.message);
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
        Create Account
      </Text>
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ marginBottom: 16 }}
        disabled={loading}
      />
      
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={{ marginBottom: 16 }}
        disabled={loading}
      />

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        secureTextEntry
        style={{ marginBottom: 24 }}
        disabled={loading}
      />
      
      <Button 
        mode="contained" 
        onPress={handleRegister}
        style={{ marginBottom: 16 }}
        loading={loading}
        disabled={loading}
      >
        Register
      </Button>
      
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
        <Text variant="bodyMedium">Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>Sign in</Text>
        </Link>
      </View>

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