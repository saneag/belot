// @vitest-environment jsdom
import { useRouter } from "expo-router";

import { BackButton } from "@/components/backButton";

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("BackButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls router.back on press", () => {
    const back = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
      back,
    } as unknown as ReturnType<typeof useRouter>);

    render(<BackButton />);

    fireEvent.click(screen.getByRole("button"));
    expect(back).toHaveBeenCalledOnce();
  });
});
