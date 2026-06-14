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
