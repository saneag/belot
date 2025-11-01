import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../constants/storageKeys';

export const setToStorage = async <T>(
  key: StorageKeys,
  value: T
): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getFromStorage = async (
  key: StorageKeys
): Promise<string | null> => {
  return await AsyncStorage.getItem(key);
};

export const convertToObject = <T>(value: string): T => {
  return JSON.parse(value);
};

export const removeFromStorage = async (key: StorageKeys): Promise<void> => {
  await AsyncStorage.removeItem(key);
};
