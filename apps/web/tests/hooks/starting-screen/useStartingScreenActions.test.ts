import { useStartingScreenActions } from "@/hooks/starting-screen/useStartingScreenActions";

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@belot/hooks", () => ({
  useLoadGameData: () => ({
    gameData: null,
    hasSavedGame: false,
  }),
  useStartingScreenActionsHelper: ({
    navigate,
    removeFromStorage,
  }: {
    navigate: (path: string) => void;
    removeFromStorage: (key: string) => void;
  }) => {
    removeFromStorage("saved");

    return [
      {
        index: 0,
        label: "New Game",
        isActive: true,
        onPress: () => navigate("players-selection"),
      },
      {
        index: 1,
        label: "Continue",
        isActive: false,
        onPress: () => navigate("game-table"),
      },
      {
        index: 2,
        label: "Settings",
        isActive: true,
        onPress: () => navigate("settings"),
      },
      {
        index: 3,
        label: "Custom",
        isActive: true,
        onPress: () => navigate("/custom"),
      },
    ];
  },
}));

describe("useStartingScreenActions", () => {
  it("returns starting screen actions from helper", () => {
    const { result } = renderHook(() => useStartingScreenActions());

    expect(result.current).toHaveLength(4);
    expect(result.current[0]?.label).toBe("New Game");
  });

  it("navigates using mapped routes and storage helpers", () => {
    const removeItemSpy = vi.spyOn(localStorage, "removeItem");

    const { result } = renderHook(() => useStartingScreenActions());

    expect(removeItemSpy).toHaveBeenCalledWith("saved");
    result.current.forEach((action) => action.onPress());
    expect(navigateMock).toHaveBeenCalledWith("/players-selection");
    expect(navigateMock).toHaveBeenCalledWith("/game-table");
    expect(navigateMock).toHaveBeenCalledWith("/settings");
    expect(navigateMock).toHaveBeenCalledWith("/custom");
  });
});
