// @vitest-environment jsdom

import { StorageKeys } from "@belot/constants";
import { beforeEach, describe, expect, it } from "vitest";

import { setMultipleItemsToStorage } from "@/helpers/storageHelpers";

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
