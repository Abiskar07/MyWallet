import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text as RNText } from 'react-native';
import { Text, Button, TextInput, useTheme, Snackbar, Surface, Divider } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const { signIn, signInWithGoogle, session } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
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
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.headerSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>MW</Text>
          </View>
          <Text style={styles.appName}>MyWallet</Text>
          <Text style={styles.tagline}>Track your finances with ease</Text>
        </View>

        <Surface style={styles.formCard} elevation={5}>
          <Text style={styles.welcomeText}>Welcome Back</Text>

          <View style={styles.labelContainer}>
            <RNText style={styles.label}>Email</RNText>
          </View>
          <TextInput
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, styles.inputBg]}
            disabled={loading}
            outlineStyle={styles.inputOutline}
            outlineColor="rgba(255,255,255,0.15)"
            activeOutlineColor="#1DB954"
            textColor="#fff"
            placeholderTextColor="rgba(255,255,255,0.4)"
            theme={{ colors: { background: 'transparent' } }}
            placeholder="Enter your email"
          />

          <View style={styles.labelContainer}>
            <RNText style={styles.label}>Password</RNText>
          </View>
          <TextInput
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={[styles.input, styles.inputBg]}
            disabled={loading}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            outlineStyle={styles.inputOutline}
            outlineColor="rgba(255,255,255,0.15)"
            activeOutlineColor="#1DB954"
            textColor="#fff"
            placeholderTextColor="rgba(255,255,255,0.4)"
            theme={{ colors: { background: 'transparent' } }}
            placeholder="Enter your password"
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.loginButton}
            labelStyle={styles.loginButtonLabel}
            loading={loading}
            disabled={loading}
            icon="login"
          >
            Sign In
          </Button>

          <Button
            mode="text"
            onPress={() => router.push('/(auth)/forgot-password')}
            disabled={loading}
            style={styles.forgotButton}
            labelStyle={styles.forgotButtonLabel}
          >
            Forgot Password?
          </Button>

          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <Divider style={styles.divider} />
          </View>

          <Button
            mode="outlined"
            icon="google"
            onPress={signInWithGoogle}
            style={styles.googleButton}
            labelStyle={styles.googleButtonLabel}
            disabled={loading}
            contentStyle={styles.googleButtonContent}
          >
            Continue with Google
          </Button>
        </Surface>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Text style={styles.signupLink}>Sign up</Text>
          </Link>
        </View>

        <Snackbar
          visible={!!error}
          onDismiss={() => setError('')}
          duration={3000}
          style={styles.snackbar}
          action={{
            label: 'Close',
            onPress: () => setError(''),
          }}
        >
          {error}
        </Snackbar>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    // Add a glow effect
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 12,
  },
  logoText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#16213e',
    borderRadius: 32,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    elevation: 0,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    height: 56,
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
    borderRadius: 14,
  },
  loginButton: {
    marginTop: 8,
    backgroundColor: '#1DB954',
    borderRadius: 14,
    paddingVertical: 4,
  },
  loginButtonLabel: {
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
  },
  forgotButton: {
    marginTop: 8,
  },
  forgotButtonLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    height: 1,
  },
  dividerText: {
    color: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  googleButton: {
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    borderWidth: 1,
  },
  googleButtonLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  googleButtonContent: {
    paddingVertical: 4,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  signupLink: {
    color: '#1DB954',
    fontSize: 14,
    fontWeight: '700',
  },
  snackbar: {
    backgroundColor: '#FF4444',
  },
});