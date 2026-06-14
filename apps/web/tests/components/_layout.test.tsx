// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Layout } from "@/components/_layout";

describe("Layout", () => {
  it("centers children in the viewport", () => {
    const { container } = render(
      <Layout>
        <span>centered</span>
      </Layout>,
    );

    expect(container.textContent).toBe("centered");
    expect(container.firstElementChild?.className).toContain("items-center");
  });
});
