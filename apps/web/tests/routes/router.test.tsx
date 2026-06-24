import { type ReactElement, Suspense } from "react";

import { RouterProvider } from "react-router-dom";

import { router } from "@/routes/router";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/App", () => ({ default: () => null }));
vi.mock("@/pages/dev-tools", () => ({ default: () => null }));
vi.mock("@/pages/game-table", () => ({ default: () => null }));
vi.mock("@/pages/players-selection", () => ({ default: () => null }));
vi.mock("@/pages/settings", () => ({ default: () => null }));
vi.mock("@/pages/starting-page", () => ({ default: () => null }));

describe("router", () => {
  it("defines the app shell and page routes", () => {
    expect(router.routes).toHaveLength(1);

    const rootRoute = router.routes[0];
    expect(rootRoute?.path).toBe("/");
    expect(rootRoute?.children).toHaveLength(5);

    const paths = rootRoute?.children?.map((route) => route.path ?? "index");
    expect(paths).toEqual([
      "index",
      "/players-selection",
      "/game-table",
      "/settings",
      "/dev-tools",
    ]);
  });

  it("creates a browser router instance", () => {
    render(
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>,
    );

    expect(router.state.location.pathname).toBe("/");
  });

  it("preloads lazy route components", async () => {
    const lazyElements = router.routes[0]?.children
      ?.map((route) => route.element)
      .filter((element): element is ReactElement => Boolean(element));

    await Promise.all(
      lazyElements?.map(async (element) => {
        const lazyType = element.type as unknown as {
          _init: (payload: unknown) => Promise<unknown>;
          _payload: unknown;
        };

        try {
          return await lazyType._init(lazyType._payload);
        } catch (thrown) {
          if (thrown instanceof Promise) {
            return await (thrown as Promise<unknown>);
          }

          throw thrown;
        }
      }) ?? [],
    );

    expect(lazyElements).toHaveLength(5);
  });
});
