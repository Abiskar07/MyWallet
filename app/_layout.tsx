import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from '../src/constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { TransactionProvider } from '../src/context/TransactionContext';
import { LoanProvider } from '../src/context/LoanContext';
import { NetworkProvider, useNetwork } from '../src/context/NetworkContext';
import { useAuth } from '../src/context/AuthContext';
import { View, ActivityIndicator, Text, Platform, TouchableOpacity, Animated } from 'react-native';
import { PreferencesProvider, usePreferences } from '../src/context/PreferencesContext';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might cause this error. */
});

function AppContent() {
  const { session, isLoading: authLoading } = useAuth();
  const { theme } = usePreferences();
  const [appIsReady, setAppIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!authLoading) {
      setAppIsReady(true);
    }
  }, [authLoading]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [appIsReady]);

  useEffect(() => {
    if (!appIsReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (session?.user) {
      if (inAuthGroup || (!inAuthGroup && !inAppGroup)) {
        router.replace('/(app)/home');
      }
    } else {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    }
  }, [session?.user?.id, appIsReady, segments[0]]);

  // Use Network context for connectivity
  const { isOnline, pendingActions, lastSyncTimestamp, syncPendingActions } = useNetwork();
  const [showLastSync, setShowLastSync] = useState(false);

  // Show last sync indicator briefly after sync, then hide after 5 seconds
  useEffect(() => {
    if (lastSyncTimestamp && pendingActions.length === 0 && isOnline) {
      setShowLastSync(true);
      const timer = setTimeout(() => {
        setShowLastSync(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowLastSync(false);
    }
  }, [lastSyncTimestamp, pendingActions.length, isOnline]);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <View style={{ flex: 1 }}>
        {/* Offline Indicator Banner */}
        {!isOnline && (
          <View style={{ backgroundColor: '#FF4444', padding: 6, alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999 }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
              ⚠️ You're offline. {pendingActions.length > 0 ? `${pendingActions.length} pending changes` : 'Changes will sync when online'}
            </Text>
          </View>
        )}

        {/* Pending Actions Indicator (when online but has pending) */}
        {isOnline && pendingActions.length > 0 && (
          <TouchableOpacity
            style={{ backgroundColor: '#F59E0B', padding: 6, alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999 }}
            onPress={syncPendingActions}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
              🔄 {pendingActions.length} pending changes - Tap to sync
            </Text>
          </TouchableOpacity>
        )}

        {/* Last Sync Timestamp - Shows briefly after sync, disappears after 5 seconds */}
        {showLastSync && isOnline && lastSyncTimestamp && pendingActions.length === 0 && (
          <Animated.View
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              padding: 4,
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9998
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>
              ✓ Last synced: {new Date(lastSyncTimestamp).toLocaleTimeString()}
            </Text>
          </Animated.View>
        )}

        <Slot />
      </View>
    </PaperProvider>
  );
}

function RootLayout() {
  return (
    <PreferencesProvider>
      <NetworkProvider>
        <AuthProvider>
          <TransactionProvider>
            <LoanProvider>
              <SafeAreaProvider>
                <AppContent />
              </SafeAreaProvider>
            </LoanProvider>
          </TransactionProvider>
        </AuthProvider>
      </NetworkProvider>
    </PreferencesProvider>
  );
}

export default RootLayout;