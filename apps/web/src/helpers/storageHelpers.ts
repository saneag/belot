import type { StorageKeys } from "@belot/constants";

export const getFromStorage = (key: StorageKeys): string | null => localStorage.getItem(key);

export const setToStorage = (key: StorageKeys, value: string): void => {
  localStorage.setItem(key, value);
};

export const setMultipleItemsToStorage = (items: Partial<Record<StorageKeys, string>>) => {
  Object.entries(items).forEach(([key, value]) => {
    if (value !== undefined) {
      localStorage.setItem(key, value);
    }
  });
};

export const removeFromStorage = (key: StorageKeys): void => {
  localStorage.removeItem(key);
};

export const removeItemsFromStorage = (keys: StorageKeys[]): void => {
  keys.forEach((key) => localStorage.removeItem(key));
};
