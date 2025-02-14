import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563EB',
    secondary: '#3B82F6',
    accent: '#60A5FA',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    error: '#EF4444',
    text: '#1F2937',
    disabled: '#9CA3AF',
    placeholder: '#6B7280',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#93C5FD',
    background: '#1F2937',
    surface: '#374151',
    error: '#EF4444',
    text: '#F9FAFB',
    disabled: '#6B7280',
    placeholder: '#9CA3AF',
    backdrop: 'rgba(0, 0, 0, 0.7)',
  },
}; 