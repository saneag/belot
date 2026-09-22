import { FEATURE_TOGGLES } from "@belot/constants";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth/authContext", () => ({
  useAuth: () => ({
    user: { id: "admin", username: "admin", email: "admin@example.com", role: "admin" },
    loading: false,
  }),
}));
vi.mock("@belot/hooks", () => ({
  useFeatureToggles: () => ({ toggles: FEATURE_TOGGLES, setFeatureToggle: vi.fn() }),
}));
vi.mock("@/components/backButton", () => ({ BackButton: () => null }));

describe("DevToolsPage callbacks", () => {
  it("renders the global toggle controls", async () => {
    const { default: DevToolsPage } = await import("@/pages/dev-tools");
    render(<DevToolsPage />);
    expect(screen.getByRole("switch", { name: "settings-screen feature toggle" })).toBeTruthy();
  });
});
