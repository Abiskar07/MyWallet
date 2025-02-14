import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

export default function AppLayout() {
  const theme = useTheme();

  // Custom reusable header component
  const CustomHeader = ({ title }: { title: string }) => (
    <View style={[styles.headerContainer, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>{title}</Text>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceDisabled,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null, // This hides the tab
        }}
      />
      
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="loans"
        options={{
          headerShown: true,
          header: () => <CustomHeader title="Loans" />,
          title: 'Loans',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="handshake" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          headerShown: true,
          header: () => <CustomHeader title="Settings" />,
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.15)',
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginLeft: 0,
  },
}); 