// @vitest-environment jsdom
import { PLAYERS_COUNT } from "@belot/constants";

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  playersCount: 3,
  handlePlayersCountChange: vi.fn(),
  handleReset: vi.fn(),
  handleOpenDialog: vi.fn(),
  handleSubmit: vi.fn(),
  storagePlayers: null as unknown,
  fetchPreviousPlayers: vi.fn(),
  loadPlayersNamesFromStorage: vi.fn(),
  players: [
    { id: 0, name: "" },
    { id: 1, name: "" },
  ],
  dealer: null,
  validations: {},
  theme: "light",
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: (key: string, args?: number[]) => (args ? `${key}:${args[0]}` : key),
  useLocalizations: () => ({
    playersReset: "Reset",
    playersSubmitDialogTitle: "Submit title",
    playersSubmitDialogButton: "Submit",
    serverOffline: "Offline",
    shufflePlayers: "Shuffle",
    loadPreviousGameButton: "Load previous",
    emptyError: "Empty",
    duplicatedName: "Duplicate",
  }),
  formatLocalizationKey: (key: string) => key.replace(/\./g, ""),
}));

vi.mock("@belot/hooks", () => ({
  usePlayersCount: () => ({
    playersCount: mocks.playersCount,
    handlePlayersCountChange: mocks.handlePlayersCountChange,
  }),
  useHandlePlayersSelectionResetButton: () => mocks.handleReset,
  usePlayersSubmit: () => ({
    handleOpenDialog: mocks.handleOpenDialog,
    handleSubmit: mocks.handleSubmit,
  }),
  useHandlePlayersNames: () => ({
    isInvalid: false,
    handlePlayerNameChange: vi.fn(),
  }),
  useHandleDealerChange: () => ({
    players: mocks.players,
    dealer: mocks.dealer,
    handleDealerChange: vi.fn(),
  }),
  useLoadPreviousPlayers: () => ({
    storagePlayers: mocks.storagePlayers,
    fetchPreviousPlayers: mocks.fetchPreviousPlayers,
    loadPlayersNamesFromStorage: mocks.loadPlayersNamesFromStorage,
  }),
  useThemeContext: () => ({ theme: mocks.theme }),
  usePlayersSelectionContext: () => ({ validations: mocks.validations }),
  useHandleConfirmationDialog: ({
    confirmationCallback,
    visible,
    setVisible,
  }: {
    confirmationCallback?: () => void;
    visible?: boolean;
    setVisible?: (v: boolean) => void;
  }) => ({
    isVisible: visible ?? false,
    messages: {
      confirmationDialogConfirmButton: "Confirm",
      confirmationDialogCancelButton: "Cancel",
    },
    showDialog: (cb?: () => void) => {
      cb?.();
      setVisible?.(true);
    },
    hideDialog: () => setVisible?.(false),
    handleDialogCancel: () => setVisible?.(false),
    handleDialogConfirmation: () => {
      confirmationCallback?.();
      setVisible?.(false);
    },
  }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (
    selector: (state: { players: typeof mocks.players; shufflePlayers: () => void }) => unknown,
  ) => selector({ players: mocks.players, shufflePlayers: vi.fn() }),
}));

vi.mock("@belot/components", () => ({
  PlayersNamesInputWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PlayersTable: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PlayersSelectionContextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@belot/utils", () => ({
  getPlayersCount: (players: unknown[]) => players.length,
  isPlayerNameValid: () => true,
  isPlayersNamesEmpty: () => false,
  isPlayersNamesRepeating: () => false,
}));

describe("players-selection components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.storagePlayers = null;
    mocks.playersCount = 3;
  });

  it("PlayersCount renders count buttons", async () => {
    const { default: PlayersCount } = await import("@/components/players-selection/playersCount");
    render(<PlayersCount />);

    PLAYERS_COUNT.forEach((count) => {
      expect(screen.getByText(String(count))).toBeTruthy();
    });

    fireEvent.click(screen.getByText("4"));
    expect(mocks.handlePlayersCountChange).toHaveBeenCalledWith(4);
  });

  it("ActionButtons reset calls handler", async () => {
    const { default: ActionButtons } = await import("@/components/players-selection/actionButtons");
    render(<ActionButtons />);

    fireEvent.click(screen.getByText("players.reset"));
    expect(mocks.handleReset).toHaveBeenCalled();
  });

  it("LoadPreviousGameButton hidden without storage players", async () => {
    const { default: LoadPreviousGameButton } =
      await import("@/components/players-selection/loadPreviousGameButton");
    const { container } = render(<LoadPreviousGameButton />);
    expect(container.textContent).toBe("");
  });

  it("LoadPreviousGameButton shown with storage players", async () => {
    mocks.storagePlayers = [{ id: 0, name: "A" }];
    const { default: LoadPreviousGameButton } =
      await import("@/components/players-selection/loadPreviousGameButton");
    render(<LoadPreviousGameButton />);
    expect(screen.getByText("load.previous.game.button")).toBeTruthy();
  });

  it("PlayersRandomizer renders shuffle button", async () => {
    const { default: PlayersRandomizer } =
      await import("@/components/players-selection/playersRandomizer");
    render(<PlayersRandomizer />);
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("DealerSelectDialogContent renders player buttons", async () => {
    const { default: DealerSelectDialogContent } =
      await import("@/components/players-selection/dealerSelectDialogContent");
    render(<DealerSelectDialogContent />);
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(2);
  });
});
