export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const DEFAULT_API_TIMEOUT_MS = 5_000;

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, DEFAULT_API_TIMEOUT_MS);

  const abortFromCaller = () => {
    controller.abort();
  };

  if (init?.signal) {
    if (init.signal.aborted) {
      controller.abort();
    } else {
      init.signal.addEventListener("abort", abortFromCaller, { once: true });
    }
  }

  let didTimeout = false;

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      const message =
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message: unknown }).message)
          : res.statusText;
      throw new ApiError(res.status, message, data);
    }

    return data as T;
  } catch (error) {
    didTimeout = controller.signal.aborted && !init?.signal?.aborted;

    if (didTimeout) {
      throw new ApiError(408, `Request timed out after ${DEFAULT_API_TIMEOUT_MS}ms`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
    init?.signal?.removeEventListener("abort", abortFromCaller);
  }
}
