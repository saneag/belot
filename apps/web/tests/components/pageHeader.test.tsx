// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageHeader } from "@/components/pageHeader";

describe("PageHeader", () => {
  it("renders the title", () => {
    render(<PageHeader title="Settings" />);

    expect(screen.getByRole("heading", { name: "Settings" })).toBeTruthy();
  });
});
