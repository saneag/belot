import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  t: vi.fn((key: string) => key),
}));

vi.mock("react", () => ({
  useMemo: (factory: () => unknown) => factory(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: mocks.t }),
}));

vi.mock("../src/hooks/useI18nextSetup", () => ({
  useI18nextSetup: () => ({}),
}));

describe("useLocalization hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.t.mockImplementation((key: string) => key);
  });

  it("localizes a single key with arguments", async () => {
    mocks.t.mockReturnValue("Hello {0}");

    const { useLocalization } = await import("../src/hooks/useLocalization");
    const message = useLocalization("time", ["Alice"]);

    expect(message).toBe("Hello Alice");
    expect(mocks.t).toHaveBeenCalledWith("time");
  });

  it("localizes multiple keys into a record", async () => {
    mocks.t.mockImplementation((key: string) => key);

    const { useLocalizations } = await import("../src/hooks/useLocalization");
    const messages = useLocalizations([
      { key: "time" },
      { key: "settings", args: ["A"] },
    ]);

    expect(messages.time).toBe("time");
    expect(messages.settings).toBe("settings");
  });
});
