import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { PreferencesProvider } from '../../src/context/PreferencesContext';
import { AuthProvider } from '../../src/context/AuthContext';
import { TransactionProvider } from '../../src/context/TransactionContext';
import { LoanProvider } from '../../src/context/LoanContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { darkTheme, lightTheme } from '../../src/constants/theme';
import RootLayoutNav from '../../src/components/layouts/RootLayoutNav';
import React from 'react';

function AuthLayout() {
  const colorScheme = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  // Delay rendering until after the component mounts.
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Optionally, render a loader here.

  return (
    <PreferencesProvider>
      <AuthProvider>
        <TransactionProvider>
          <LoanProvider>
            <SafeAreaProvider>
              <PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                />
              </PaperProvider>
            </SafeAreaProvider>
          </LoanProvider>
        </TransactionProvider>
      </AuthProvider>
    </PreferencesProvider>
  );
}

export default AuthLayout; 