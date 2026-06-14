// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { BackButton } from "@/components/backButton";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("BackButton", () => {
  it("navigates back when clicked", () => {
    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>,
    );

    screen.getByRole("button").click();

    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
