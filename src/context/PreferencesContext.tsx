import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

type PreferencesContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const PreferencesContext = createContext<PreferencesContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    (async () => {
      const storedTheme = await loadFromStorage('appTheme');
      if (storedTheme) {
        setTheme(storedTheme);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await saveToStorage('appTheme', newTheme);
  };

  return (
    <PreferencesContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext); 