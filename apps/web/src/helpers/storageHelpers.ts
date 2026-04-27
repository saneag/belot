import type { StorageKeys } from "@belot/constants";

export const setMultipleItemsToStorage = (items: Partial<Record<StorageKeys, string>>) => {
  Object.entries(items).forEach(([key, value]) => {
    if (value !== undefined) {
      localStorage.setItem(key, value);
    }
  });
};
