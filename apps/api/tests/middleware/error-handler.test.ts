import type { NextFunction, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "../../errors/api-error";
import { errorHandler, notFoundHandler, sendApiError } from "../../middleware/error-handler";

function createResponse(headersSent = false): {
  json: ReturnType<typeof vi.fn>;
  response: Response;
  status: ReturnType<typeof vi.fn>;
} {
  const status = vi.fn();
  const json = vi.fn();
  const response = {
    headersSent,
    json,
    status,
  } as unknown as Response;

  status.mockReturnValue(response);

  return { json, response, status };
}

describe("error-handler middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("does nothing when headers have already been sent", () => {
    const { json, response, status } = createResponse(true);

    sendApiError(new Error("late error"), response);

    expect(status).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();
  });

  it("returns ApiError status and message", () => {
    const { json, response, status } = createResponse();

    sendApiError(new ApiError(418, "Short and stout"), response);

    expect(status).toHaveBeenCalledWith(418);
    expect(json).toHaveBeenCalledWith({ message: "Short and stout" });
  });

  it("returns client error statusCode and message", () => {
    const { json, response, status } = createResponse();

    sendApiError({ statusCode: 413, message: "Payload too large" }, response);

    expect(status).toHaveBeenCalledWith(413);
    expect(json).toHaveBeenCalledWith({ message: "Payload too large" });
  });

  it("returns client error status and message", () => {
    const { json, response, status } = createResponse();

    sendApiError({ status: 400, message: "Invalid JSON" }, response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: "Invalid JSON" });
  });

  it("returns a generic 500 for non-client errors", () => {
    const { json, response, status } = createResponse();

    sendApiError("boom", response);

    expect(console.error).toHaveBeenCalledWith("boom");
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it("returns 404 from the not found handler", () => {
    const { json, response, status } = createResponse();

    notFoundHandler({} as Parameters<typeof notFoundHandler>[0], response, vi.fn());

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: "Not found" });
  });

  it("delegates when the error handler receives an error after headers were sent", () => {
    const error = new Error("late error");
    const { response, status } = createResponse(true);
    const next = vi.fn() as NextFunction;

    errorHandler(error, {} as Parameters<typeof errorHandler>[1], response, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(status).not.toHaveBeenCalled();
  });

  it("sends errors when headers have not been sent", () => {
    const { json, response, status } = createResponse();
    const next = vi.fn() as NextFunction;

    errorHandler(
      new ApiError(400, "Bad request"),
      {} as Parameters<typeof errorHandler>[1],
      response,
      next,
    );

    expect(next).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: "Bad request" });
  });
});
