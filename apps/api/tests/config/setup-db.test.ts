import { afterEach, describe, expect, it, vi } from "vitest";

import setupDb from "../../config/setup-db";

const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("../../config/postgres.js", () => ({ pool: { query }, schemaSql: "schema" }));
afterEach(() => vi.unstubAllEnvs());
describe("setupDb", () => {
  it("requires DATABASE_URL", async () => {
    vi.stubEnv("DATABASE_URL", "");
    await expect(setupDb()).rejects.toThrow("DATABASE_URL");
  });
  it("applies the idempotent schema", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://example/db");
    await setupDb();
    expect(query).toHaveBeenCalledWith("schema");
  });
});
