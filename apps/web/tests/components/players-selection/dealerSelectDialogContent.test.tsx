import DealerSelectDialogContent from "@/components/players-selection/dealerSelectDialogContent";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const handleDealerChange = vi.fn();

vi.mock("@belot/hooks", () => ({
  useHandleDealerChange: () => ({
    players: [
      { id: 0, name: "Alice" },
      { id: 1, name: "Bob" },
    ],
    dealer: { id: 0, name: "Alice" },
    handleDealerChange,
  }),
}));

describe("DealerSelectDialogContent", () => {
  it("renders dealer options and handles selection", () => {
    render(<DealerSelectDialogContent />);

    screen.getByRole("button", { name: "Bob" }).click();

    expect(handleDealerChange).toHaveBeenCalledWith({ id: 1, name: "Bob" });
  });
});
