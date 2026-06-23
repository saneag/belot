import { useCallback, useEffect, useMemo, useState } from "react";

import { StorageKeys } from "@belot/constants";
import { useLocalizations } from "@belot/localizations";
import {
  DEV_TOOLS_BLOCK_DURATION_MS,
  getDevToolsRemainingBlockMs,
  getNextDevToolsFailedAttemptState,
  isDevToolsPasswordValid,
  parseStoredDevToolsNumber,
} from "@belot/utils";

import type { FeatureToggleStorage } from "./featureToggles/types";

type DevToolsAuthStatus = "locked" | "unlocked";

export interface UseDevToolsAuthResult {
  status: DevToolsAuthStatus;
  isAuthenticated: boolean;
  failedAttempts: number;
  blockedUntil: number | null;
  remainingBlockMs: number;
  error: string | null;
  submitPassword: (password: string) => Promise<void>;
}

export const useDevToolsAuth = ({
  getFromStorage,
  setToStorage,
}: FeatureToggleStorage): UseDevToolsAuthResult => {
  const messages = useLocalizations([
    { key: "dev.tools.locked.error" },
    { key: "dev.tools.too.many.attempts.error" },
    { key: "dev.tools.incorrect.password.error" },
  ]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [blockedAt, setBlockedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);

  const blockedUntil = blockedAt === null ? null : blockedAt + DEV_TOOLS_BLOCK_DURATION_MS;
  const remainingBlockMs = getDevToolsRemainingBlockMs(blockedAt, now);
  const status: DevToolsAuthStatus = remainingBlockMs > 0 ? "locked" : "unlocked";

  useEffect(() => {
    let isCancelled = false;

    const initializeAuthState = async () => {
      const [storedFailedAttempts, storedBlockedAt] = await Promise.all([
        getFromStorage(StorageKeys.devToolsFailedAttempts),
        getFromStorage(StorageKeys.devToolsBlockedAt),
      ]);

      if (isCancelled) {
        return;
      }

      const nextFailedAttempts = parseStoredDevToolsNumber(storedFailedAttempts);
      const nextBlockedAt = parseStoredDevToolsNumber(storedBlockedAt);
      const nextNow = Date.now();

      if (nextBlockedAt && nextNow - nextBlockedAt < DEV_TOOLS_BLOCK_DURATION_MS) {
        setFailedAttempts(nextFailedAttempts);
        setBlockedAt(nextBlockedAt);
        setNow(nextNow);
        return;
      }

      setFailedAttempts(nextBlockedAt ? 0 : nextFailedAttempts);
      setBlockedAt(null);
      setNow(nextNow);

      if (nextBlockedAt) {
        await Promise.all([
          setToStorage(StorageKeys.devToolsFailedAttempts, "0"),
          setToStorage(StorageKeys.devToolsBlockedAt, "0"),
        ]);
      }
    };

    void initializeAuthState();

    return () => {
      isCancelled = true;
    };
  }, [getFromStorage, setToStorage]);

  useEffect(() => {
    if (status !== "locked") {
      return;
    }

    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const submitPassword = useCallback(
    async (password: string) => {
      const nextNow = Date.now();
      setNow(nextNow);

      if (blockedAt !== null && nextNow - blockedAt < DEV_TOOLS_BLOCK_DURATION_MS) {
        setError(messages.devToolsLockedError);
        return;
      }

      if (isDevToolsPasswordValid(password)) {
        setIsAuthenticated(true);
        setFailedAttempts(0);
        setBlockedAt(null);
        setError(null);
        await Promise.all([
          setToStorage(StorageKeys.devToolsFailedAttempts, "0"),
          setToStorage(StorageKeys.devToolsBlockedAt, "0"),
        ]);
        return;
      }

      const failedAttemptState = getNextDevToolsFailedAttemptState(failedAttempts, nextNow);
      setFailedAttempts(failedAttemptState.failedAttempts);

      if (failedAttemptState.blockedAt !== null) {
        setBlockedAt(failedAttemptState.blockedAt);
        setError(messages.devToolsTooManyAttemptsError);
        await Promise.all([
          setToStorage(
            StorageKeys.devToolsFailedAttempts,
            String(failedAttemptState.failedAttempts),
          ),
          setToStorage(StorageKeys.devToolsBlockedAt, String(failedAttemptState.blockedAt)),
        ]);
        return;
      }

      setError(messages.devToolsIncorrectPasswordError);
      await setToStorage(
        StorageKeys.devToolsFailedAttempts,
        String(failedAttemptState.failedAttempts),
      );
    },
    [
      blockedAt,
      failedAttempts,
      messages.devToolsIncorrectPasswordError,
      messages.devToolsLockedError,
      messages.devToolsTooManyAttemptsError,
      setToStorage,
    ],
  );

  return useMemo(
    () => ({
      status,
      isAuthenticated,
      failedAttempts,
      blockedUntil,
      remainingBlockMs,
      error,
      submitPassword,
    }),
    [
      blockedUntil,
      error,
      failedAttempts,
      isAuthenticated,
      remainingBlockMs,
      status,
      submitPassword,
    ],
  );
};
