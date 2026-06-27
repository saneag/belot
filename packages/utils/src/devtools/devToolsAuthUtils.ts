export const MAX_DEV_TOOLS_FAILED_ATTEMPTS = 5;
export const DEV_TOOLS_BLOCK_DURATION_MS = 5 * 60 * 1000;

export const parseStoredDevToolsNumber = (value: string | null): number => {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export const getDevToolsRemainingBlockMs = (blockedAt: number | null, now: number): number => {
  if (blockedAt === null) {
    return 0;
  }

  return Math.max(blockedAt + DEV_TOOLS_BLOCK_DURATION_MS - now, 0);
};

export const isDevToolsPasswordValid = (password: string, expectedPassword: string): boolean =>
  password === expectedPassword;

export const getNextDevToolsFailedAttemptState = (
  failedAttempts: number,
  now: number,
): {
  failedAttempts: number;
  blockedAt: number | null;
} => {
  const nextFailedAttempts = failedAttempts + 1;

  return {
    failedAttempts: nextFailedAttempts,
    blockedAt: nextFailedAttempts >= MAX_DEV_TOOLS_FAILED_ATTEMPTS ? now : null,
  };
};
