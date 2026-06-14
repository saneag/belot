// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TimeTracker } from "../src/timeTracker";

const trackerState = vi.hoisted(() => ({
  hours: 1,
  minutes: 2,
  seconds: 3,
  shouldPadSeconds: true,
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: () => "Time",
}));

vi.mock("@belot/hooks", () => ({
  useTimeTracker: () => trackerState,
}));

describe("TimeTracker", () => {
  beforeEach(() => {
    trackerState.hours = 1;
    trackerState.minutes = 2;
    trackerState.seconds = 3;
    trackerState.shouldPadSeconds = true;
  });

  it("renders formatted elapsed time", () => {
    render(
      <TimeTracker
        textWrapper="span"
        getItemFromStorage={vi.fn()}
        setItemsToStorage={vi.fn()}
        isVisible={() => true}
        subscribeToVisibilityChange={() => () => undefined}
      />,
    );

    expect(screen.getByText("Time: 01:02:03")).toBeTruthy();
  });

  it("omits hour padding when hours are zero", () => {
    trackerState.hours = 0;
    trackerState.minutes = 0;
    trackerState.seconds = 7;
    trackerState.shouldPadSeconds = false;

    render(
      <TimeTracker
        textWrapper="span"
        getItemFromStorage={vi.fn()}
        setItemsToStorage={vi.fn()}
        isVisible={() => true}
        subscribeToVisibilityChange={() => () => undefined}
      />,
    );

    expect(screen.getByText("Time: 7")).toBeTruthy();
  });
});
