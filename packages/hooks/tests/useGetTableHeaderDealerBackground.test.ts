import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  dealer: { id: 1, name: "B" },
}));

vi.mock("react", () => ({
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) => selector({ dealer: mocks.dealer }),
}));

describe("useGetTableHeaderDealerBackground", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.dealer = { id: 1, name: "B" };
  });

  it("returns dealer color for matching column index", async () => {
    const { useGetTableHeaderDealerBackground } = await import(
      "../src/useGetTableHeaderDealerBackground"
    );
    const { getDealerBackground } = useGetTableHeaderDealerBackground({
      columnsCount: 2,
      color: "red",
    });

    expect(getDealerBackground(1)).toBe("red");
    expect(getDealerBackground(0)).toBe("");
  });

  it("uses dealer id 0 when dealer is null", async () => {
    mocks.dealer = null as unknown as { id: number; name: string };

    const { useGetTableHeaderDealerBackground } = await import(
      "../src/useGetTableHeaderDealerBackground"
    );
    const { getDealerBackground } = useGetTableHeaderDealerBackground({
      columnsCount: 3,
      color: "blue",
    });

    expect(getDealerBackground(0)).toBe("blue");
  });
});
