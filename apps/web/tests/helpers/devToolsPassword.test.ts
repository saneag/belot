import { describe, expect, it, vi } from "vitest";

describe("getDevToolsPassword", () => {
  it("reads the Vite dev tools password", async () => {
    vi.stubEnv("VITE_DEV_TOOLS_PASSWORD", "secret-from-env");

    const { getDevToolsPassword } = await import("@/helpers/devToolsPassword");

    expect(getDevToolsPassword()).toBe("secret-from-env");
  });
});
