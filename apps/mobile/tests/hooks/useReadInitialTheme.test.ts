// @vitest-environment jsdom

import { useColorScheme } from "react-native";

import { StorageKeys, THEMES } from "@belot/constants";

import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/helpers/storageHelpers", () => ({
  getFromStorage: vi.fn(),
}));

import { getFromStorage } from "@/helpers/storageHelpers";
import { useReadInitialTheme } from "@/hooks/useReadInitialTheme";

describe("useReadInitialTheme", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses saved dark theme from storage", async () => {
    vi.mocked(getFromStorage).mockResolvedValue(THEMES.dark);
    vi.mocked(useColorScheme).mockReturnValue("light");

    const { result } = renderHook(() => useReadInitialTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe(THEMES.dark);
    });
  });

  it("uses system dark theme when storage is empty", async () => {
    vi.mocked(getFromStorage).mockResolvedValue(null);
    vi.mocked(useColorScheme).mockReturnValue("dark");

    const { result } = renderHook(() => useReadInitialTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe(THEMES.dark);
    });
  });

  it("defaults to light theme", async () => {
    vi.mocked(getFromStorage).mockResolvedValue(null);
    vi.mocked(useColorScheme).mockReturnValue("light");

    const { result } = renderHook(() => useReadInitialTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe(THEMES.light);
    });
    expect(getFromStorage).toHaveBeenCalledWith(StorageKeys.theme);
  });
});
