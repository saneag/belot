import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  connect: vi.fn(),
  config: vi.fn(),
}));

vi.mock("mongoose", () => ({
  default: {
    connect: mocks.connect,
  },
}));

vi.mock("dotenv", () => ({
  default: { config: mocks.config },
}));

describe("setupDb", () => {
  beforeEach(() => {
    mocks.connect.mockReset();
    mocks.config.mockReset();
    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/belot");
  });

  it("connects when MONGODB_URI is set", async () => {
    mocks.connect.mockResolvedValue(undefined);

    const setupDb = (await import("../../config/setup-db")).default;
    await setupDb();

    expect(mocks.connect).toHaveBeenCalledWith("mongodb://localhost:27017/belot");
  });

  it("exits when MONGODB_URI is missing", async () => {
    vi.stubEnv("MONGODB_URI", "");
    delete process.env.MONGODB_URI;
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit");
    });

    const setupDb = (await import("../../config/setup-db")).default;

    await expect(setupDb()).rejects.toThrow("process.exit");
    expect(mocks.connect).not.toHaveBeenCalled();
    exitSpy.mockRestore();
  });
});
