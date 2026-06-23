import { type Player } from "@belot/types";

import NextRoundButton from "@/components/game-table/action-buttons/next-round-button";

import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithTooltip } from "../../../../testUtils";

const nextRoundMocks = vi.hoisted(
  (): {
    roundPlayer: Player | null;
    handleDialogOpen: ReturnType<typeof vi.fn>;
  } => ({
    roundPlayer: { id: 0, name: "Alice" },
    handleDialogOpen: vi.fn(),
  }),
);

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    nextRoundTitle: "Next round",
    nextRoundButton: "Next",
  }),
}));

vi.mock("@belot/hooks", () => ({
  useHandleNextRound: () => ({
    handleNextRound: vi.fn(),
    handleCancel: vi.fn(),
    handleDialogOpen: nextRoundMocks.handleDialogOpen,
    roundPlayer: nextRoundMocks.roundPlayer,
    roundScore: { id: 0, playersScores: [], teamsScores: [], totalRoundScore: 0 },
    setRoundPlayer: vi.fn(),
    setRoundScore: vi.fn(),
  }),
}));

vi.mock("@/components/confirmationDialog", () => ({
  default: ({
    renderShowDialog,
    isConfirmationButtonVisible,
    primaryButton,
  }: {
    renderShowDialog: (showDialog: () => void) => React.ReactNode;
    isConfirmationButtonVisible?: boolean;
    primaryButton?: string;
  }) => (
    <div>
      {renderShowDialog(() => undefined)}
      <span data-testid="confirm-visible">{String(isConfirmationButtonVisible)}</span>
      <span data-testid="primary-button">{primaryButton}</span>
    </div>
  ),
}));

vi.mock("@/components/game-table/action-buttons/next-round-button/scoreDialogContent", () => ({
  default: () => <div>Score dialog</div>,
}));

describe("NextRoundButton", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders next round trigger and opens dialog", () => {
    nextRoundMocks.roundPlayer = { id: 0, name: "Alice" };

    renderWithTooltip(<NextRoundButton setWinner={vi.fn()} />);

    screen.getByRole("button").click();

    expect(nextRoundMocks.handleDialogOpen).toHaveBeenCalled();
    expect(screen.getByTestId("confirm-visible").textContent).toBe("true");
    expect(screen.getByTestId("primary-button").textContent).toBe("confirm");
  });

  it("defaults to cancel when no round player is selected", () => {
    nextRoundMocks.roundPlayer = null;

    renderWithTooltip(<NextRoundButton setWinner={vi.fn()} />);

    expect(screen.getByTestId("confirm-visible").textContent).toBe("false");
    expect(screen.getByTestId("primary-button").textContent).toBe("cancel");
  });
});
