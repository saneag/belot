import { type FeatureToggleName } from "@belot/constants";

import DevToolsPage from "@/pages/dev-tools";

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
vi.mock("@/components/backButton", () => ({
  BackButton: () => <button type="button">Back</button>,
}));

describe("DevToolsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.toggles = {
      "settings-screen": false,
      "backend-game-init": false,
      "points-type": false,
      "max-score-selector": false,
    };
  });
  it("renders feature toggles for an authenticated admin", () => {
    render(<DevToolsPage />);
    expect(screen.getByRole("switch", { name: "settings-screen feature toggle" })).toBeTruthy();
  });
  it("updates a global feature toggle", () => {
    render(<DevToolsPage />);
    fireEvent.click(screen.getAllByRole("switch", { name: "settings-screen feature toggle" })[0]!);
    expect(mocks.setFeatureToggle).toHaveBeenCalledWith("settings-screen", true);
  });
});
