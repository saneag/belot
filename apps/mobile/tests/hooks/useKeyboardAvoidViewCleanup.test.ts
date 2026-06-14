// @vitest-environment jsdom

import { Keyboard, type EmitterSubscription } from "react-native";

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useKeyboardAvoidView } from "@/hooks/useKeyboardAvoidView";

describe("useKeyboardAvoidView cleanup", () => {
  it("removes keyboard listeners on unmount", async () => {
    const remove = vi.fn();
    vi.mocked(Keyboard.addListener).mockReturnValue({ remove } as unknown as EmitterSubscription);

    const { unmount } = renderHook(() => useKeyboardAvoidView());
    unmount();

    expect(remove).toHaveBeenCalled();
  });

  it("removes multiple android listeners on unmount", async () => {
    const rn = (await import("react-native")) as unknown as { __platform: { OS: string } };
    rn.__platform.OS = "android";

    const removes = [vi.fn(), vi.fn()];
    let call = 0;
    vi.mocked(Keyboard.addListener).mockImplementation(() => ({
      remove: removes[call++],
    }) as unknown as EmitterSubscription);

    const { unmount } = renderHook(() => useKeyboardAvoidView());
    unmount();

    expect(removes[0]).toHaveBeenCalled();
    expect(removes[1]).toHaveBeenCalled();
  });
});
