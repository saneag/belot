// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { usePreventBackPress } from "@/hooks/usePreventBackPress";

describe("usePreventBackPress", () => {
  it("registers and removes popstate listener", () => {
    const callback = vi.fn();
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => usePreventBackPress(callback));

    expect(addSpy).toHaveBeenCalledWith("popstate", callback);

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("popstate", callback);
  });
});
