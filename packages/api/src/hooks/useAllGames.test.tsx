/** @vitest-environment jsdom */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { getAllGames } from "../services";
import { useAllGames } from "./useAllGames";

vi.mock("../services", () => ({
  getAllGames: vi.fn(),
}));

const getAllGamesMock = vi.mocked(getAllGames);

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, Wrapper };
}

describe("useAllGames", () => {
  it("does not fetch when baseUrl is empty", () => {
    getAllGamesMock.mockReset();
    const { Wrapper } = createWrapper();

    renderHook(() => useAllGames(""), { wrapper: Wrapper });

    expect(getAllGamesMock).not.toHaveBeenCalled();
  });

  it("fetches games when baseUrl is set", async () => {
    getAllGamesMock.mockReset();
    const data = { games: [], page: 1, limit: 10, total: 0 };
    getAllGamesMock.mockResolvedValue(data);

    const { Wrapper } = createWrapper();
    const { result } = renderHook(
      () => useAllGames("https://api.example", { page: 2, limit: 5 }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(getAllGamesMock).toHaveBeenCalledWith("https://api.example", { page: 2, limit: 5 });
  });

  it("merges extra query options", async () => {
    getAllGamesMock.mockReset();
    getAllGamesMock.mockResolvedValue({ games: [], page: 1, limit: 10, total: 0 });

    const { Wrapper, client } = createWrapper();
    const { result } = renderHook(
      () =>
        useAllGames("https://api.example", undefined, {
          staleTime: 60_000,
        }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const entry = client.getQueryCache().find({ queryKey: ["games", "list", undefined] });
    expect((entry?.options as { staleTime?: number }).staleTime).toBe(60_000);
  });
});
