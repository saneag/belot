// @vitest-environment jsdom

import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SkipRoundButton from "@/components/game-table/action-buttons/skipRound";

import { renderWithTooltip } from "../../../testUtils";

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    skipRoundTitle: "Skip round",
    skipRoundContent: "Skip this round?",
  }),
}));

vi.mock("@belot/hooks", () => ({
  useHandleSkipRound: () => vi.fn(),
}));

vi.mock("@/components/confirmationDialog", () => ({
  default: ({
    renderShowDialog,
  }: {
    renderShowDialog: (showDialog: () => void) => React.ReactNode;
  }) => <div>{renderShowDialog(vi.fn())}</div>,
}));

describe("SkipRoundButton", () => {
  it("renders skip round trigger", () => {
    renderWithTooltip(<SkipRoundButton />);

    expect(screen.getByRole("button")).toBeTruthy();
  });
});
