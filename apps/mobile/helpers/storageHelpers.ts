import { StorageKeys } from "@belot/constants";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const setToStorage = async <T>(key: StorageKeys, value: T): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const setMultipleItemsToStorage = async (
  items: Record<string, number | string | boolean | unknown[]>,
): Promise<void> => {
  const arrayItems: [string, string][] = Object.entries(items).map(([key, value]) => [
    key,
    JSON.stringify(value),
  ]);

  await AsyncStorage.multiSet(arrayItems);
};

export const getFromStorage = async (key: StorageKeys): Promise<string | null> => {
  return await AsyncStorage.getItem(key);
};

export const convertToObject = <T>(value: string): T => {
  return JSON.parse(value);
};

export const removeFromStorage = async (key: StorageKeys): Promise<void> => {
  await AsyncStorage.removeItem(key);
};
