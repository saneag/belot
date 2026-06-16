// @vitest-environment jsdom
import { type EmitterSubscription, Keyboard } from "react-native";

import { useKeyboardAvoidView } from "@/hooks/useKeyboardAvoidView";

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

async function setPlatformOS(os: string) {
  const rn = (await import("react-native")) as unknown as { __platform: { OS: string } };
  rn.__platform.OS = os;
}

describe("useKeyboardAvoidView", () => {
  beforeEach(async () => {
    await setPlatformOS("ios");
  });

  it("updates bottom offset on ios keyboard show", async () => {
    await setPlatformOS("ios");
    const listeners: Record<string, ((e: unknown) => void)[]> = {};

    vi.mocked(Keyboard.addListener).mockImplementation((event, handler) => {
      listeners[event] = listeners[event] ?? [];
      listeners[event].push(handler as (e: unknown) => void);
      return { remove: vi.fn() } as unknown as EmitterSubscription;
    });

    const { result } = renderHook(() => useKeyboardAvoidView());

    act(() => {
      listeners.keyboardWillChangeFrame?.[0]?.({
        startCoordinates: { screenY: 400 },
        endCoordinates: { screenY: 200, height: 100 },
      });
    });

    expect(result.current).toBe(50);
  });

  it("resets bottom on ios keyboard hide", async () => {
    await setPlatformOS("ios");
    const listeners: Record<string, ((e: unknown) => void)[]> = {};

    vi.mocked(Keyboard.addListener).mockImplementation((event, handler) => {
      listeners[event] = listeners[event] ?? [];
      listeners[event].push(handler as (e: unknown) => void);
      return { remove: vi.fn() } as unknown as EmitterSubscription;
    });

    const { result } = renderHook(() => useKeyboardAvoidView());

    act(() => {
      listeners.keyboardWillChangeFrame?.[0]?.({
        startCoordinates: { screenY: 200 },
        endCoordinates: { screenY: 400, height: 0 },
      });
    });

    expect(result.current).toBe(0);
  });

  it("handles android keyboard events", async () => {
    await setPlatformOS("android");
    const listeners: Record<string, ((e: unknown) => void)[]> = {};

    vi.mocked(Keyboard.addListener).mockImplementation((event, handler) => {
      listeners[event] = listeners[event] ?? [];
      listeners[event].push(handler as (e: unknown) => void);
      return { remove: vi.fn() } as unknown as EmitterSubscription;
    });

    const { result } = renderHook(() => useKeyboardAvoidView());

    act(() => {
      listeners.keyboardDidShow?.[0]?.({ endCoordinates: { height: 80 } });
    });
    expect(result.current).toBe(40);

    act(() => {
      listeners.keyboardDidHide?.[0]?.({});
    });
    expect(result.current).toBe(0);
  });
});
