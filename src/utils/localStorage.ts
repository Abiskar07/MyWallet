import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Saves the given value to local storage under the specified key.
 * The value is stringified as JSON.
 */
export const saveToStorage = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
  }
};

/**
 * Loads and parses the value stored under the specified key.
 * Returns null if no value exists.
 */
export const loadFromStorage = async (key: string): Promise<any | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error loading data for key "${key}":`, error);
    return null;
  }
};

/**
 * Removes the data stored under the specified key.
 */
export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
  }
}; 