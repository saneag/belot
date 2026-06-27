import { describe, expect, it } from "vitest";

import {
  DEV_TOOLS_BLOCK_DURATION_MS,
  getDevToolsRemainingBlockMs,
  getNextDevToolsFailedAttemptState,
  isDevToolsPasswordValid,
  parseStoredDevToolsNumber,
} from "../../src/devtools/devToolsAuthUtils";

describe("devToolsAuthUtils", () => {
  it("parses positive stored numbers", () => {
    expect(parseStoredDevToolsNumber("123")).toBe(123);
    expect(parseStoredDevToolsNumber(null)).toBe(0);
    expect(parseStoredDevToolsNumber("invalid")).toBe(0);
    expect(parseStoredDevToolsNumber("-1")).toBe(0);
  });

  it("validates the dev tools password", () => {
    expect(isDevToolsPasswordValid("123321", "123321")).toBe(true);
    expect(isDevToolsPasswordValid("wrong", "123321")).toBe(false);
  });

  it("calculates remaining lock time", () => {
    const blockedAt = 1_000;

    expect(getDevToolsRemainingBlockMs(blockedAt, 31_000)).toBe(
      DEV_TOOLS_BLOCK_DURATION_MS - 30_000,
    );
    expect(getDevToolsRemainingBlockMs(blockedAt, blockedAt + DEV_TOOLS_BLOCK_DURATION_MS)).toBe(0);
    expect(getDevToolsRemainingBlockMs(null, 1_000)).toBe(0);
  });

  it("locks after the fifth failed attempt", () => {
    expect(getNextDevToolsFailedAttemptState(3, 10_000)).toEqual({
      failedAttempts: 4,
      blockedAt: null,
    });
    expect(getNextDevToolsFailedAttemptState(4, 10_000)).toEqual({
      failedAttempts: 5,
      blockedAt: 10_000,
    });
  });
});
