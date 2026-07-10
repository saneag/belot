import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";

import { corsMiddleware } from "../config/cors-middleware";
import { app } from "../index";

const originalCorsOrigin = process.env.CORS_ORIGIN;

function createCorsApp() {
  const testApp = express();
  testApp.use(corsMiddleware);
  testApp.get("/test", (_req, res) => res.status(200).json({ ok: true }));
  testApp.options("/test", (_req, res) => res.status(200).json({ ok: true }));
  return testApp;
}

describe("CORS", () => {
  afterEach(() => {
    if (originalCorsOrigin === undefined) {
      delete process.env.CORS_ORIGIN;
      return;
    }

    process.env.CORS_ORIGIN = originalCorsOrigin;
  });

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

  it("allows configured origins after trimming blank entries", async () => {
    process.env.CORS_ORIGIN = " https://custom.example, , ";

    const response = await request(createCorsApp())
      .options("/test")
      .set("Origin", "https://custom.example")
      .set("Access-Control-Request-Method", "GET");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe("https://custom.example");
  });

  it("continues non-preflight requests without allowing unknown origins", async () => {
    process.env.CORS_ORIGIN = "https://custom.example";

    const response = await request(createCorsApp()).get("/test").set("Origin", "https://bad.test");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
