// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { subscribeToVisibilityChange } from "@/helpers/subscribeToVisibilityChange";

describe("subscribeToVisibilityChange", () => {
  it("subscribes and unsubscribes from visibilitychange", () => {
    const handler = vi.fn();
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const unsubscribe = subscribeToVisibilityChange(handler);

    expect(addSpy).toHaveBeenCalledWith("visibilitychange", handler);

    unsubscribe();

    expect(removeSpy).toHaveBeenCalledWith("visibilitychange", handler);
  });
});
