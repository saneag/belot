import { type BlockerFunction, NavigationType } from "react-router-dom";

import { usePreventBackPress } from "@/hooks/usePreventBackPress";

import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const reset = vi.fn();
const blockerMocks = vi.hoisted(() => ({
  state: "blocked",
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useBlocker: vi.fn(() => ({
      state: blockerMocks.state,
      reset,
      proceed: vi.fn(),
      location: undefined,
    })),
  };
});

describe("usePreventBackPress", () => {
  afterEach(() => {
    blockerMocks.state = "blocked";
    vi.clearAllMocks();
  });

  it("blocks browser back navigation and invokes callback", async () => {
    const callback = vi.fn();
    const { useBlocker } = await import("react-router-dom");

    renderHook(() => usePreventBackPress(callback));

    expect(useBlocker).toHaveBeenCalledOnce();
    const shouldBlock = vi.mocked(useBlocker).mock.calls[0]?.[0];
    expect(typeof shouldBlock).toBe("function");
    if (typeof shouldBlock !== "function") {
      throw new Error("Expected useBlocker to be called with a function");
    }
    const popNavigation = { historyAction: NavigationType.Pop } as Parameters<BlockerFunction>[0];
    const pushNavigation = { historyAction: NavigationType.Push } as Parameters<BlockerFunction>[0];
    expect(shouldBlock(popNavigation)).toBe(true);
    expect(shouldBlock(pushNavigation)).toBe(false);
    expect(callback).toHaveBeenCalledOnce();
  });

  it("does not invoke callback when navigation is not blocked", () => {
    blockerMocks.state = "unblocked";
    const callback = vi.fn();

    renderHook(() => usePreventBackPress(callback));

    expect(callback).not.toHaveBeenCalled();
  });
});
