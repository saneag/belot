import { StorageKeys } from "@belot/constants";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  convertToObject,
  getFromStorage,
  removeFromStorage,
  setMultipleItemsToStorage,
  setToStorage,
} from "@/helpers/storageHelpers";

describe("storageHelpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("setToStorage calls AsyncStorage.setItem", async () => {
    await setToStorage(StorageKeys.theme, "dark");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(StorageKeys.theme, "dark");
  });

  it("setMultipleItemsToStorage filters undefined values", async () => {
    await setMultipleItemsToStorage({
      [StorageKeys.theme]: "dark",
      [StorageKeys.dealer]: undefined,
    });
    expect(AsyncStorage.multiSet).toHaveBeenCalledWith([[StorageKeys.theme, "dark"]]);
  });

  it("getFromStorage returns AsyncStorage value", async () => {
    vi.mocked(AsyncStorage.getItem).mockResolvedValue("value");
    await expect(getFromStorage(StorageKeys.theme)).resolves.toBe("value");
  });

  it("convertToObject parses JSON", () => {
    expect(convertToObject<{ a: number }>('{"a":1}')).toEqual({ a: 1 });
  });

  it("removeFromStorage calls AsyncStorage.removeItem", async () => {
    await removeFromStorage(StorageKeys.theme);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(StorageKeys.theme);
  });
});
