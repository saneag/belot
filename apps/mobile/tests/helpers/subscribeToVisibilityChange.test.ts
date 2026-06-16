import { AppState } from "react-native";

import { subscribeToVisibilityChange } from "@/helpers/subscribeToVisibilityChange";

import { describe, expect, it, vi } from "vitest";

describe("subscribeToVisibilityChange", () => {
  it("calls handler when app becomes active", () => {
    const handler = vi.fn();
    let changeHandler: ((state: string) => void) | undefined;

    vi.mocked(AppState.addEventListener).mockImplementation((_event, cb) => {
      changeHandler = cb as (state: string) => void;
      return { remove: vi.fn() };
    });

    subscribeToVisibilityChange(handler);

    changeHandler?.("background");
    expect(handler).not.toHaveBeenCalled();

    changeHandler?.("active");
    expect(handler).toHaveBeenCalledOnce();
  });

  it("returns unsubscribe that removes listener", () => {
    const remove = vi.fn();
    vi.mocked(AppState.addEventListener).mockReturnValue({ remove });

    const unsubscribe = subscribeToVisibilityChange(vi.fn());
    unsubscribe();

    expect(remove).toHaveBeenCalledOnce();
  });
});
