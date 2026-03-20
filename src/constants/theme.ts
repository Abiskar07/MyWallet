import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1DB954',
    secondary: '#158a3e',
    background: '#f8fafc',
    surface: '#ffffff',
    error: '#FF4444',
    onSurface: '#121212',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#22C55E', // High vibrancy primary
    secondary: '#1DB954',
    background: '#1a1a2e',
    surface: '#16213e',
    surfaceVariant: 'rgba(255, 255, 255, 0.1)', // Increased for better card separation
    onSurface: '#FFFFFF', // Pure white for primary text
    onSurfaceVariant: '#f9fafb', // Near white for labels/titles
    outline: 'rgba(255, 255, 255, 0.2)', // Sharper outlines
    error: '#EF4444', 
    placeholder: 'rgba(255, 255, 255, 0.5)',
  },
  roundness: 16,
};