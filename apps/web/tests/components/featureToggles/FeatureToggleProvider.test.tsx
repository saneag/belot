import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

type SharedProviderProps = {
  children: React.ReactNode;
  fetchRemoteFeatureToggles: unknown;
  getFromStorage: unknown;
  setToStorage: unknown;
};

const sharedProviderSpy = vi.fn(({ children }: SharedProviderProps) => (
  <div data-testid="shared-feature-toggle-provider">{children}</div>
));
const getFeatureTogglesMock = vi.fn();

vi.mock("@belot/api-client", () => ({
  getFeatureToggles: getFeatureTogglesMock,
}));

vi.mock("@belot/hooks", () => ({
  FeatureToggleProvider: (props: SharedProviderProps) => sharedProviderSpy(props),
}));

describe("FeatureToggleProvider", () => {
  it("passes web storage helpers and remote fetcher to the shared provider", async () => {
    const { getFromStorage, setToStorage } = await import("@/helpers/storageHelpers");
    const { FeatureToggleProvider } =
      await import("@/components/featureToggles/FeatureToggleProvider");

    render(
      <FeatureToggleProvider>
        <span>child</span>
      </FeatureToggleProvider>,
    );

    expect(screen.getByTestId("shared-feature-toggle-provider")).toBeTruthy();
    expect(screen.getByText("child")).toBeTruthy();
    const providerProps = sharedProviderSpy.mock.calls[0]?.[0] as {
      fetchRemoteFeatureToggles: unknown;
      getFromStorage: unknown;
      setToStorage: unknown;
    };

    expect(typeof providerProps.fetchRemoteFeatureToggles).toBe("function");
    expect(providerProps.getFromStorage).toBe(getFromStorage);
    expect(providerProps.setToStorage).toBe(setToStorage);
  });
});
