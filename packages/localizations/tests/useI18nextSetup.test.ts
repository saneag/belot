import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getDeviceLanguage: vi.fn(() => "en"),
  changeLanguage: vi.fn(),
  resolvedLanguage: "en",
}));

vi.mock("react", () => ({
  useEffect: (effect: () => void) => {
    effect();
  },
}));

vi.mock("../src/hooks/useLocalizationContext", () => ({
  useLocalizationContext: () => ({
    getDeviceLanguage: mocks.getDeviceLanguage,
  }),
}));

vi.mock("i18next", () => ({
  default: {
    isInitialized: true,
    get resolvedLanguage() {
      return mocks.resolvedLanguage;
    },
    changeLanguage: mocks.changeLanguage,
    use: vi.fn().mockReturnThis(),
    init: vi.fn(),
  },
}));

describe("useI18nextSetup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDeviceLanguage.mockReturnValue("en");
    mocks.resolvedLanguage = "en";
  });

  it("changes language when device language differs from resolved language", async () => {
    mocks.getDeviceLanguage.mockReturnValue("ro-RO");
    mocks.resolvedLanguage = "en";

    const { useI18nextSetup } = await import("../src/hooks/useI18nextSetup");
    useI18nextSetup();

    expect(mocks.changeLanguage).toHaveBeenCalledWith("ro");
  });

  it("falls back to english for unsupported device languages", async () => {
    mocks.getDeviceLanguage.mockReturnValue("de-DE");
    mocks.resolvedLanguage = "de";

    const { useI18nextSetup } = await import("../src/hooks/useI18nextSetup");
    useI18nextSetup();

    expect(mocks.changeLanguage).toHaveBeenCalledWith("en");
  });

  it("does not change language when already resolved", async () => {
    mocks.getDeviceLanguage.mockReturnValue("en-US");
    mocks.resolvedLanguage = "en";

    const { useI18nextSetup } = await import("../src/hooks/useI18nextSetup");
    useI18nextSetup();

    expect(mocks.changeLanguage).not.toHaveBeenCalled();
  });
});
