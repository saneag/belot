import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const validations = { emptyNames: [], repeatingNames: [] };
  const setValidations = vi.fn();

  return { validations, setValidations };
});

vi.mock("react", () => ({
  useState: () => [mocks.validations, mocks.setValidations],
  useCallback: (callback: () => void) => callback,
}));

describe("useValidations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.validations.emptyNames = [];
    mocks.validations.repeatingNames = [];
  });

  it("returns validations state and reset helper", async () => {
    const { useValidations } = await import("../src/useValidations");
    const result = useValidations();

    expect(result.validations).toBe(mocks.validations);
    expect(result.setValidations).toBe(mocks.setValidations);

    result.resetValidations();
    expect(mocks.setValidations).toHaveBeenCalledWith({
      emptyNames: [],
      repeatingNames: [],
    });
  });
});
