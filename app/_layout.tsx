import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../src/constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { TransactionProvider } from '../src/context/TransactionContext';
import { LoanProvider } from '../src/context/LoanContext';
import { useAuth } from '../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { PreferencesProvider } from '../src/context/PreferencesContext';

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [initialNavigationDone, setInitialNavigationDone] = useState(false);

  useEffect(() => {
    const handleNavigation = async () => {
      if (isLoading || initialNavigationDone) return;

      try {
        if (session?.user) {
          console.log("Initial navigation to home, user:", session.user.email);
          await router.replace('/(app)/home');
        } else {
          console.log("No active session, redirecting to login");
          await router.replace('/(auth)/login');
        }
        setInitialNavigationDone(true);
      } catch (error) {
        console.error("Navigation error:", error);
      }
    };

    handleNavigation();
  }, [session?.user?.id, isLoading]);

  // Protect app routes
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!isLoading) {
      if (!session?.user && inAppGroup) {
        // Redirect to login if trying to access app routes without auth
        console.log('Unauthorized access attempt, redirecting to login');
        router.replace('/(auth)/login');
      } else if (session?.user && inAuthGroup) {
        // Redirect to home if trying to access auth routes while logged in
        console.log('Authenticated user accessing auth route, redirecting to home');
        router.replace('/(app)/home');
      }
    }
  }, [session?.user, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PreferencesProvider>
      <AuthProvider>
        <TransactionProvider>
          <LoanProvider>
            <SafeAreaProvider>
              <PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
                <RootLayoutNav />
              </PaperProvider>
            </SafeAreaProvider>
          </LoanProvider>
        </TransactionProvider>
      </AuthProvider>
    </PreferencesProvider>
  );
}

export default RootLayout; 