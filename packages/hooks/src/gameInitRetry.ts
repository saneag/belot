import type { InitGameInput } from "@belot/api-client";

export const GAME_INIT_RETRY_TIMEOUT_MS = 5 * 60 * 1000;
export const GAME_INIT_RETRY_INTERVAL_MS = 20 * 1000;

interface RetryGameInitOptions {
  initGame: () => Promise<{ id: string }>;
  onSuccess: (gameId: string) => void;
  onFailure: (error: unknown) => void;
  signal: AbortSignal;
  now?: () => number;
  wait?: (milliseconds: number, signal: AbortSignal) => Promise<void>;
}

const waitForRetry = (milliseconds: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timeoutId = setTimeout(resolve, milliseconds);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timeoutId);
        resolve();
      },
      { once: true },
    );
  });

export async function retryGameInit({
  initGame,
  onSuccess,
  onFailure,
  signal,
  now = Date.now,
  wait = waitForRetry,
}: RetryGameInitOptions) {
  const startedAt = now();

  while (!signal.aborted) {
    try {
      const response = await initGame();
      if (!signal.aborted) onSuccess(response.id);
      return;
    } catch (error) {
      const remaining = GAME_INIT_RETRY_TIMEOUT_MS - (now() - startedAt);
      if (remaining <= 0) {
        if (!signal.aborted) onFailure(error);
        return;
      }

      await wait(Math.min(GAME_INIT_RETRY_INTERVAL_MS, remaining), signal);
    }
  }
}

export function parsePendingGameInit(value: string | null): InitGameInput | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as InitGameInput;
  } catch {
    return null;
  }
}
