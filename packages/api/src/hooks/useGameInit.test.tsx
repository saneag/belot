import type { ReactNode } from "react";

import { GameMode, type Player, type Team } from "@belot/types";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { initGame } from "../services";
import { useGameInit } from "./useGameInit";

vi.mock("../services", () => ({
  initGame: vi.fn(),
}));

const initGameMock = vi.mocked(initGame);

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { Wrapper };
}

describe("useGameInit", () => {
  it("calls initGame with baseUrl and input", async () => {
    initGameMock.mockReset();
    initGameMock.mockResolvedValue({ id: "new-game" });

    const { Wrapper } = createWrapper();
    const players: Player[] = [{ id: 0, name: "A" }];
    const teams: Team[] = [{ id: 0, name: "T1", playersIds: [0] }];
    const input = { players, mode: GameMode.classic, teams };

    const { result } = renderHook(() => useGameInit("https://api.example"), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(initGameMock).toHaveBeenCalledWith("https://api.example", input);
    expect(result.current.data).toEqual({ id: "new-game" });
  });
});
