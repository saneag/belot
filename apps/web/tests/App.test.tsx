// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import App from "@/App";

vi.mock("@belot/components", () => ({
  ThemeContextProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@belot/localizations", () => ({
  LocalizationContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/_layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/phoneScreen", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/sonner", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

vi.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/helpers/localization", () => ({
  getDeviceLanguage: () => "en",
}));

vi.mock("@/helpers/themeHelpers", () => ({
  readInitialTheme: () => "light",
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet" />,
  };
});

describe("App", () => {
  it("renders app providers and outlet", () => {
    render(<App />);

    expect(screen.getByTestId("outlet")).toBeTruthy();
    expect(screen.getByTestId("toaster")).toBeTruthy();
  });
});
