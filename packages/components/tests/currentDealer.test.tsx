// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CurrentDealer } from "../src/currentDealer";

const mocks = vi.hoisted(() => ({
  dealer: { id: 0, name: "Alice" },
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: { dealer: typeof mocks.dealer }) => unknown) =>
    selector({ dealer: mocks.dealer }),
}));

vi.mock("@belot/localizations", () => ({
  formatLocalizationString: (message: string, args: string[]) => `${message}:${args[0]}`,
}));

describe("CurrentDealer", () => {
  beforeEach(() => {
    mocks.dealer = { id: 0, name: "Alice" };
  });

  it("renders truncated dealer name when dealer exists", () => {
    render(
      <CurrentDealer
        dealerMessage="Dealer: {0}"
        blockWrapper="div"
        textWrapper="span"
        textWrapperClassName="dealer"
      />,
    );

    expect(screen.getByText("Dealer: {0}:Alice").className).toBe("dealer");
  });

  it("renders empty block wrapper when dealer name is missing", () => {
    mocks.dealer = { id: 0, name: "" };

    const { container } = render(
      <CurrentDealer
        dealerMessage="Dealer: {0}"
        blockWrapper="div"
        textWrapper="span"
      />,
    );

    expect(container.querySelector("div")).toBeTruthy();
    expect(container.querySelector("span")).toBeNull();
  });

  it("handles dealers without a string name", () => {
    mocks.dealer = { id: 0, name: undefined as unknown as string };

    const { container } = render(
      <CurrentDealer
        dealerMessage="Dealer: {0}"
        blockWrapper="div"
        textWrapper="span"
      />,
    );

    expect(container.querySelector("span")).toBeNull();
  });

  it("truncates long dealer names", () => {
    mocks.dealer = { id: 0, name: "VeryLongPlayerName" };

    render(
      <CurrentDealer
        dealerMessage="Dealer: {0}"
        blockWrapper="div"
        textWrapper="span"
      />,
    );

    expect(screen.getByText("Dealer: {0}:VeryLongPl...")).toBeTruthy();
  });
});
