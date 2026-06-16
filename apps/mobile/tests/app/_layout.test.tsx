// @vitest-environment jsdom
import { THEMES } from "@belot/constants";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useReadInitialTheme", () => ({
  useReadInitialTheme: () => ({ theme: THEMES.light }),
}));

vi.mock("@/helpers/localization", () => ({
  getDeviceLanguage: () => "en",
}));

vi.mock("expo-router", () => ({
  Stack: () => <div>Expo Stack</div>,
}));

vi.mock("@belot/components", () => ({
  ThemeContextProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@belot/localizations", () => ({
  LocalizationContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("RootLayout", () => {
  it("renders expo stack inside providers", async () => {
    const { default: RootLayout } = await import("@/app/_layout");
    render(<RootLayout />);

    expect(screen.getByText("Expo Stack")).toBeTruthy();
  });
});
