import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  onChange: vi.fn(),
  messages: {
    settingsPointsType: "Points type",
    settingsPointsTypeHint: "Hint",
    settingsPointsTypeMicropoints: "Micropoints",
    settingsPointsTypePoints: "Points",
  },
}));

vi.mock("react", () => ({
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
}));

vi.mock("@belot/localizations", () => ({
  formatLocalizationKey: (localizationKey: string) =>
    localizationKey
      .split(".")
      .map((keyPart, index) =>
        index === 0 ? keyPart : keyPart.at(0)?.toUpperCase() + keyPart.substring(1),
      )
      .join(""),
  useLocalizations: () => mocks.messages,
}));

describe("usePointsTypeSelection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("calls onChange only when value changes", async () => {
    const { usePointsTypeSelection } = await import("../src/usePointsTypeSelection");

    const { handleChange } = usePointsTypeSelection({
      value: "micropoints",
      onChange: mocks.onChange,
    });

    handleChange("micropoints");
    handleChange("points");

    expect(mocks.onChange).toHaveBeenCalledTimes(1);
    expect(mocks.onChange).toHaveBeenCalledWith("points");
  });

  it("returns option labels from localization keys", async () => {
    const { usePointsTypeSelection } = await import("../src/usePointsTypeSelection");

    const { getOptionLabel } = usePointsTypeSelection({
      value: "micropoints",
      onChange: mocks.onChange,
    });

    expect(getOptionLabel("settings.points.type.points")).toBe("Points");
  });

  it("includes settings labels when requested", async () => {
    const { usePointsTypeSelection } = await import("../src/usePointsTypeSelection");

    const { messages } = usePointsTypeSelection({
      value: "micropoints",
      onChange: mocks.onChange,
      includeSettingsLabels: true,
    });

    expect(messages.settingsPointsType).toBe("Points type");
    expect(messages.settingsPointsTypeHint).toBe("Hint");
  });
});
