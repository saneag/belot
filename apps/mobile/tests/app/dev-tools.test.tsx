import { type FeatureToggleName } from "@belot/constants";

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  toggles: {
    "settings-screen": false,
    "backend-game-init": false,
    "points-type": false,
    "max-score-selector": false,
  } as Record<FeatureToggleName, boolean>,
  setFeatureToggle: vi.fn(),
}));
vi.mock("@/auth/authContext", () => ({
  useAuth: () => ({
    user: { id: "admin", username: "admin", email: "admin@example.com", role: "admin" },
    loading: false,
  }),
}));
vi.mock("@belot/hooks", () => ({ useFeatureToggles: () => mocks }));

describe("DevToolsScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.toggles = {
      "settings-screen": false,
      "backend-game-init": false,
      "points-type": false,
      "max-score-selector": false,
    };
  });
  it("renders toggles for an authenticated admin", async () => {
    const { default: DevToolsScreen } = await import("@/app/dev-tools");
    render(<DevToolsScreen />);
    expect(screen.getByRole("switch", { name: "settings-screen feature toggle" })).toBeTruthy();
  });
  it("updates a global feature toggle", async () => {
    const { default: DevToolsScreen } = await import("@/app/dev-tools");
    render(<DevToolsScreen />);
    fireEvent.click(screen.getAllByRole("switch", { name: "settings-screen feature toggle" })[0]!);
    expect(mocks.setFeatureToggle).toHaveBeenCalledWith("settings-screen", true);
  });
});
