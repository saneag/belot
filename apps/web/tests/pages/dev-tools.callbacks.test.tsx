import { FEATURE_TOGGLES } from "@belot/constants";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const devToolsMocks = vi.hoisted(() => ({
  setPassword: vi.fn(),
}));

vi.mock("@belot/hooks", () => ({
  useDevTools: () => ({
    auth: {
      isAuthenticated: false,
      error: null,
    },
    handleSubmit: vi.fn(),
    isLocked: false,
    messages: {
      devToolsFeatureToggleLabel: "{0} feature toggle",
      devToolsPasswordLabel: "Password",
      devToolsTitle: "Dev tools",
      devToolsTryAgainIn: "Try again",
      devToolsUnlockButton: "Unlock",
    },
    password: "",
    setFeatureToggle: vi.fn(),
    setPassword: devToolsMocks.setPassword,
    toggles: FEATURE_TOGGLES,
  }),
}));

vi.mock("@belot/localizations", () => ({
  formatLocalizationString: (value: string) => value,
}));

vi.mock("@/components/backButton", () => ({
  BackButton: () => null,
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({
    id,
    onChange,
  }: {
    id: string;
    onChange: (event: { target: { value: string } }) => void;
  }) => {
    onChange({ target: { value: "typed" } });
    return <input id={id} aria-label="Password" />;
  },
}));

describe("DevToolsPage callbacks", () => {
  it("forwards password input changes", async () => {
    const { default: DevToolsPage } = await import("@/pages/dev-tools");

    render(<DevToolsPage />);

    expect(devToolsMocks.setPassword).toHaveBeenCalledWith("typed");
  });
});
