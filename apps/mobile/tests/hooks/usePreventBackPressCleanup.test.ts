// @vitest-environment jsdom

import { BackHandler } from "react-native";

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { usePreventBackPress } from "@/hooks/usePreventBackPress";

describe("usePreventBackPress cleanup", () => {
  it("removes back handler on unmount", () => {
    const remove = vi.fn();
    vi.mocked(BackHandler.addEventListener).mockReturnValue({ remove });

    const { unmount } = renderHook(() => usePreventBackPress(vi.fn()));
    unmount();

    expect(remove).toHaveBeenCalled();
  });
});
