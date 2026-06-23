import { StorageKeys } from "@belot/constants";

import {
  getFromStorage,
  removeFromStorage,
  setMultipleItemsToStorage,
  setToStorage,
} from "@/helpers/storageHelpers";

import { beforeEach, describe, expect, it } from "vitest";

describe("getFromStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reads values from localStorage", () => {
    localStorage.setItem(StorageKeys.theme, "dark");

    expect(getFromStorage(StorageKeys.theme)).toBe("dark");
  });

  it("returns null when value is missing", () => {
    expect(getFromStorage(StorageKeys.theme)).toBeNull();
  });
});

describe("setToStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("writes values to localStorage", () => {
    setToStorage(StorageKeys.theme, "dark");

    expect(localStorage.getItem(StorageKeys.theme)).toBe("dark");
  });
});

describe("setMultipleItemsToStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores all defined values", () => {
    setMultipleItemsToStorage({
      [StorageKeys.theme]: "dark",
      [StorageKeys.dealer]: "Alice",
    });

    expect(localStorage.getItem(StorageKeys.theme)).toBe("dark");
    expect(localStorage.getItem(StorageKeys.dealer)).toBe("Alice");
  });

  it("skips undefined values", () => {
    setMultipleItemsToStorage({
      [StorageKeys.theme]: undefined,
      [StorageKeys.dealer]: "Bob",
    });

    expect(localStorage.getItem(StorageKeys.theme)).toBeNull();
    expect(localStorage.getItem(StorageKeys.dealer)).toBe("Bob");
  });
});

describe("removeFromStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("removes a stored value", () => {
    localStorage.setItem(StorageKeys.theme, "dark");

    removeFromStorage(StorageKeys.theme);

    expect(localStorage.getItem(StorageKeys.theme)).toBeNull();
  });
});
