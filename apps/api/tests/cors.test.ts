import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../index";

describe("CORS", () => {
  it("allows the deployed web origin for preflight requests", async () => {
    const response = await request(app)
      .options("/games/init")
      .set("Origin", "https://belot-web.vercel.app")
      .set("Access-Control-Request-Method", "POST");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe("https://belot-web.vercel.app");
    expect(response.headers["access-control-allow-methods"]).toContain("POST");
    expect(response.headers["access-control-allow-headers"]).toContain("Content-Type");
  });
});
