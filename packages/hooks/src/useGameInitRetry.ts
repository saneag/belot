import { useEffect } from "react";

import { useGameInit } from "@belot/api-client";
import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";

import { useFeatureToggle } from "./featureToggles/useFeatureToggle";
import { parsePendingGameInit, retryGameInit } from "./gameInitRetry";

interface UseGameInitRetryProps {
  getFromStorage: (key: StorageKeys) => Promise<string | null> | string | null;
  setToStorage: (key: StorageKeys, value: string) => Promise<void> | void;
  getApiBaseUrl: () => string;
  handleCatchError: (error: unknown) => void;
}

export function useGameInitRetry({
  getFromStorage,
  setToStorage,
  getApiBaseUrl,
  handleCatchError,
}: UseGameInitRetryProps) {
  const { mutateAsync } = useGameInit(getApiBaseUrl());
  const setGameId = useGameStore((state) => state.setGameId);
  const isBackendGameInitEnabled = useFeatureToggle("backend-game-init");

  useEffect(() => {
    const controller = new AbortController();

    const initializeGame = async () => {
      if (!isBackendGameInitEnabled) return;

      const pendingInit = parsePendingGameInit(await getFromStorage(StorageKeys.pendingGameInit));
      if (!pendingInit) return;

      await retryGameInit({
        initGame: () => mutateAsync(pendingInit),
        signal: controller.signal,
        onSuccess: (gameId) => {
          setGameId(gameId);
          void setToStorage(StorageKeys.pendingGameInit, "");
        },
        onFailure: handleCatchError,
      });
    };

    void initializeGame();

    return () => controller.abort();
  }, [
    getApiBaseUrl,
    getFromStorage,
    handleCatchError,
    isBackendGameInitEnabled,
    mutateAsync,
    setGameId,
    setToStorage,
  ]);
}
