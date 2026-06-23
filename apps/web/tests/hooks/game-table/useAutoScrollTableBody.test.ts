import { createRef } from "react";

import useAutoScrollTableBody from "@/hooks/game-table/useAutoScrollTableBody";

import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("useAutoScrollTableBody", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not scroll when row count stays the same", () => {
    const scrollContainerRef = createRef<HTMLDivElement>();
    const scrollContainer = document.createElement("div");
    Object.defineProperty(scrollContainer, "scrollHeight", { value: 200, configurable: true });
    scrollContainer.scrollTop = 0;
    scrollContainerRef.current = scrollContainer;

    const { rerender } = renderHook(
      ({ rowsCount }) => useAutoScrollTableBody({ rowsCount, scrollContainerRef }),
      { initialProps: { rowsCount: 1 } },
    );

    scrollContainer.scrollTop = 50;
    rerender({ rowsCount: 1 });

    expect(scrollContainer.scrollTop).toBe(50);
  });

  it("returns early when there are no rows", () => {
    const scrollContainerRef = createRef<HTMLDivElement>();
    const scrollContainer = document.createElement("div");
    scrollContainerRef.current = scrollContainer;

    renderHook(() => useAutoScrollTableBody({ rowsCount: 0, scrollContainerRef }));

    expect(scrollContainer.scrollTop).toBe(0);
  });

  it("handles a missing scroll container", () => {
    const scrollContainerRef = createRef<HTMLDivElement>();

    renderHook(() => useAutoScrollTableBody({ rowsCount: 2, scrollContainerRef }));

    expect(scrollContainerRef.current).toBeNull();
  });

  it("scrolls to bottom when row count increases", () => {
    const scrollContainerRef = createRef<HTMLDivElement>();
    const scrollContainer = document.createElement("div");
    Object.defineProperty(scrollContainer, "scrollHeight", { value: 300, configurable: true });
    scrollContainer.scrollTop = 0;
    scrollContainerRef.current = scrollContainer;

    const { rerender } = renderHook(
      ({ rowsCount }) => useAutoScrollTableBody({ rowsCount, scrollContainerRef }),
      { initialProps: { rowsCount: 1 } },
    );

    rerender({ rowsCount: 3 });

    expect(scrollContainer.scrollTop).toBe(300);
  });
});
