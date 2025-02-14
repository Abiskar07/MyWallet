import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
import { 
  List, 
  Switch, 
  Text, 
  Button, 
  Divider, 
  Portal, 
  Dialog, 
  TextInput 
} from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import * as Linking from 'expo-linking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { usePreferences } from '../../src/context/PreferencesContext';

export const unstable_settings = {
  headerShown: false,
};

export default function SettingsScreen() {
  const [username, setUsername] = useState('User');
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const theme = useTheme();
  const { signOut } = useAuth();
  const { theme: appTheme, toggleTheme } = usePreferences();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUsernameChange = () => {
    setUsername(newUsername);
    setEditingUsername(false);
    // Add your username update logic here
    // Example: updateUsernameInBackend(newUsername);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#282828', '#191414']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <List.Section>
            <List.Item
              title="Username"
              description={username}
              left={props => <List.Icon {...props} icon="account" />}
              right={props => <List.Icon {...props} icon="pencil" />}
              onPress={() => setEditingUsername(true)}
            />
            <List.Item
              title="Dark Theme"
              left={props => (
                <List.Icon
                  {...props}
                  icon={appTheme === 'dark' ? 'weather-night' : 'white-balance-sunny'}
                />
              )}
              right={() => (
                <Switch
                  value={appTheme === 'dark'}
                  onValueChange={toggleTheme}
                />
              )}
            />
            <List.Item
              title="Log Out"
              left={props => <List.Icon {...props} icon="logout" />}
              onPress={handleLogout}
            />
          </List.Section>

          <View style={styles.creditsContainer}>
            <Text style={styles.creditsText}>
              Developed by Hatsumei
            </Text>
          </View>
        </ScrollView>

        <Portal>
          <Dialog
            visible={editingUsername}
            onDismiss={() => setEditingUsername(false)}
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>
              Edit Username
            </Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="New Username"
                value={newUsername}
                onChangeText={setNewUsername}
                style={styles.input}
                autoFocus
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setEditingUsername(false)}>
                Cancel
              </Button>
              <Button onPress={handleUsernameChange}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    minHeight: '100%',
  },
  container: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  editIcon: {
    marginLeft: 10,
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: '#FF4444',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  creditsLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  creditsText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  dialog: {
    backgroundColor: '#fff',
  },
  dialogTitle: {
    color: '#000',
  },
  input: {
    backgroundColor: 'white',
  },
  hatsumeiLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  hatsumeiLogoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 