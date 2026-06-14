// @vitest-environment jsdom

import { BackHandler } from "react-native";

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePreventBackPress } from "@/hooks/usePreventBackPress";

describe("usePreventBackPress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers back handler and invokes callback", () => {
    const callback = vi.fn();
    let backHandler: (() => boolean) | undefined;

    vi.mocked(BackHandler.addEventListener).mockImplementation((_event, handler) => {
      backHandler = () => handler() ?? true;
      return { remove: vi.fn() };
    });

    renderHook(() => usePreventBackPress(callback));

    expect(backHandler).toBeDefined();
    const result = backHandler?.();
    expect(callback).toHaveBeenCalledOnce();
    expect(result).toBe(true);
  });
});
