// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const sharedProviderSpy = vi.fn(({ children }: { children: React.ReactNode }) => (
  <div data-testid="shared-feature-toggle-provider">{children}</div>
));

vi.mock("@belot/hooks", () => ({
  FeatureToggleProvider: (props: {
    children: React.ReactNode;
    getFromStorage: unknown;
    setToStorage: unknown;
  }) => sharedProviderSpy(props),
}));

describe("FeatureToggleProvider", () => {
  it("passes mobile storage helpers to the shared provider", async () => {
    const { getFromStorage, setToStorage } = await import("@/helpers/storageHelpers");
    const { FeatureToggleProvider } = await import(
      "@/components/featureToggles/FeatureToggleProvider"
    );

    render(
      <FeatureToggleProvider>
        <span>child</span>
      </FeatureToggleProvider>,
    );

    expect(screen.getByTestId("shared-feature-toggle-provider")).toBeTruthy();
    expect(screen.getByText("child")).toBeTruthy();
    expect(sharedProviderSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        getFromStorage,
        setToStorage,
      }),
    );
  });
});
