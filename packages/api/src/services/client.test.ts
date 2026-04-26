import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, apiFetch, DEFAULT_API_TIMEOUT_MS } from "./client";

describe("ApiError", () => {
  it("sets name, status, message, and optional body", () => {
    const err = new ApiError(404, "missing", { detail: "x" });
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("ApiError");
    expect(err.status).toBe(404);
    expect(err.message).toBe("missing");
    expect(err.body).toEqual({ detail: "x" });
  });
});

describe("apiFetch", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("parses JSON and returns data when response is ok", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: () => Promise.resolve('{"a":1}'),
    });

    await expect(apiFetch<{ a: number }>("https://api.example/x")).resolves.toEqual({ a: 1 });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example/x",
      expect.objectContaining({
        headers: { Accept: "application/json" },
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("merges init headers with Accept", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: () => Promise.resolve("{}"),
    });

    await apiFetch("https://api.example/x", {
      method: "POST",
      headers: { "X-Custom": "1" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example/x",
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Custom": "1",
        },
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("returns null when body is empty", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 204,
      statusText: "No Content",
      text: () => Promise.resolve(""),
    });

    await expect(apiFetch<null>("https://api.example/x")).resolves.toBeNull();
  });

  it("uses raw text when JSON parse fails", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: () => Promise.resolve("not-json"),
    });

    await expect(apiFetch<string>("https://api.example/x")).resolves.toBe("not-json");
  });

  it("throws ApiError with message from JSON body when not ok", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: () => Promise.resolve(JSON.stringify({ message: "bad input" })),
    });

    await expect(apiFetch("https://api.example/x")).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      message: "bad input",
    });
  });

  it("throws ApiError with statusText when not ok and body has no message", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
      text: () => Promise.resolve(JSON.stringify({})),
    });

    await expect(apiFetch("https://api.example/x")).rejects.toMatchObject({
      name: "ApiError",
      status: 502,
      message: "Bad Gateway",
    });
  });

  it("throws ApiError with statusText when error body is not an object", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
      text: () => Promise.resolve('"plain"'),
    });

    await expect(apiFetch("https://api.example/x")).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      message: "Server Error",
    });
  });

  it("throws a timeout ApiError when fetch does not resolve in time", async () => {
    vi.useFakeTimers();

    fetchMock.mockImplementation((_url, init) => {
      const signal = (init as RequestInit).signal;

      return new Promise((_resolve, reject) => {
        signal?.addEventListener("abort", () => {
          const abortError = new Error("The operation was aborted.");
          abortError.name = "AbortError";
          reject(abortError);
        });
      });
    });

    const request = apiFetch("https://api.example/x");
    const requestExpectation = expect(request).rejects.toMatchObject({
      name: "ApiError",
      status: 408,
      message: `Request timed out after ${DEFAULT_API_TIMEOUT_MS}ms`,
    });

    await vi.advanceTimersByTimeAsync(DEFAULT_API_TIMEOUT_MS);
    await requestExpectation;
  });
});
