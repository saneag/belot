import { MemoryRouter } from "react-router-dom";

import Header from "@/components/game-table/header";

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const handleReset = vi.fn();
const setShowDialog = vi.fn();
const blockerReset = vi.fn();
const headerMocks = vi.hoisted(() => ({
  showDialog: false,
  blockerState: "unblocked",
  gameResetProps: null as null | { navigateFunction: () => void },
  timeTrackerProps: null as null | { isVisible: () => boolean },
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("@belot/components", () => ({
  CurrentDealer: () => <div>Current dealer</div>,
  TimeTracker: (props: { isVisible: () => boolean }) => {
    headerMocks.timeTrackerProps = props;
    return <div>Time tracker</div>;
  },
}));

vi.mock("@belot/hooks", () => ({
  useHandleGameReset: (props: { navigateFunction: () => void }) => {
    headerMocks.gameResetProps = props;
    return {
      showDialog: headerMocks.showDialog,
      setShowDialog,
      handleReset,
    };
  },
}));

vi.mock("@belot/localizations", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@belot/localizations")>();
  return {
    ...actual,
    useLocalizations: () => ({
      gameResetTitle: "Reset game",
      gameResetContent: "Are you sure?",
      dealer: "Dealer",
    }),
  };
});

vi.mock("@/hooks/usePreventBackPress", () => ({
  usePreventBackPress: (callback: () => void) => {
    callback();
    return {
      state: headerMocks.blockerState,
      reset: blockerReset,
      proceed: vi.fn(),
      location: undefined,
    };
  },
}));

vi.mock("@/components/confirmationDialog", () => ({
  default: ({
    renderShowDialog,
    confirmationCallback,
  }: {
    renderShowDialog: (showDialog: () => void) => React.ReactNode;
    confirmationCallback: () => void;
  }) => (
    <div>
      {renderShowDialog(vi.fn())}
      <button type="button" onClick={confirmationCallback}>
        Confirm reset
      </button>
    </div>
  ),
}));

describe("Header", () => {
  afterEach(() => {
    headerMocks.showDialog = false;
    headerMocks.blockerState = "unblocked";
    vi.clearAllMocks();
  });

  it("renders dealer, timer, reset dialog, and opens dialog from back button", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText("Current dealer")).toBeTruthy();
    expect(screen.getByText("Time tracker")).toBeTruthy();
    expect(setShowDialog).toHaveBeenCalledWith(true);

    screen.getAllByRole("button")[0]?.click();
    screen.getByRole("button", { name: "Confirm reset" }).click();

    expect(handleReset).toHaveBeenCalled();
  });

  it("passes navigation and visibility callbacks", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    headerMocks.gameResetProps?.navigateFunction();
    expect(headerMocks.timeTrackerProps?.isVisible()).toBe(true);
  });

  it("resets the router blocker after a blocked back action is dismissed", () => {
    headerMocks.showDialog = false;
    headerMocks.blockerState = "blocked";

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(blockerReset).toHaveBeenCalled();
  });
});
