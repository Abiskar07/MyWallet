import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput, useTheme, Snackbar } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const { signIn, session } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      console.log("User already logged in, redirecting to home");
      router.replace('/(app)/home');
    }
  }, [session]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting login for:', email);
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        console.error('Sign in error:', signInError);
        setError(signInError.message);
      } else {
        console.log('Login successful, waiting for session update');
        // Navigation will be handled by the useEffect above when session updates
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to MyWallet
      </Text>
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        disabled={loading}
      />
      
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        disabled={loading}
      />
      
      <Button 
        mode="contained" 
        onPress={handleLogin} 
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Login
      </Button>

      <Button 
        mode="text" 
        onPress={() => router.push('/(auth)/forgot-password')}
        disabled={loading}
        style={styles.forgotButton}
      >
        Forgot Password?
      </Button>
      
      <View style={styles.signupContainer}>
        <Text variant="bodyMedium">Don't have an account? </Text>
        <Link href="/(auth)/register" asChild>
          <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
            Sign up
          </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  forgotButton: {
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
}); 