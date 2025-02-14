import React, { useState } from 'react';
import { Appbar, Menu, Avatar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { StyleSheet } from 'react-native';

interface AppHeaderProps {
  title: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { signOut, session } = useAuth();

  const handleSignOut = async () => {
    try {
      setMenuVisible(false);
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (err) {
      console.error('Unexpected sign out error:', err);
    }
  };

  return (
    <Appbar.Header style={styles.header} elevated={false}>
      <Avatar.Text 
        size={40} 
        label={session?.user?.email?.[0].toUpperCase() || 'U'} 
        style={styles.avatar}
      />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action 
            icon="dots-vertical" 
            onPress={() => setMenuVisible(true)}
            color="#ffffff" 
          />
        }
        contentStyle={styles.menu}
      >
        <Menu.Item 
          onPress={handleSignOut}
          title="Sign Out"
          leadingIcon="logout"
          titleStyle={styles.menuText}
        />
      </Menu>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  avatar: {
    backgroundColor: '#1DB954',
  },
  menu: {
    backgroundColor: '#282828',
  },
  menuText: {
    color: '#ffffff',
  },
}); 