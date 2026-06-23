import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PlayersTable } from "../src/playersTable";

describe("PlayersTable", () => {
  it("renders children with default table colors", () => {
    const { container } = render(
      <PlayersTable blockWrapper="div">
        <span>table-content</span>
      </PlayersTable>,
    );

    const inner = container.querySelectorAll("div")[1];
    expect(inner?.style.borderColor).toBe("rgb(145, 142, 142)");
    expect(inner?.style.backgroundColor).toBe("rgb(66, 104, 207)");
    expect(container.textContent).toBe("table-content");
  });

  it("uses dark mode colors when requested", () => {
    const { container } = render(
      <PlayersTable blockWrapper="div" isDarkMode>
        <span>table-content</span>
      </PlayersTable>,
    );

    const inner = container.querySelectorAll("div")[1];
    expect(inner?.style.borderColor).toBe("rgb(145, 142, 142)");
    expect(inner?.style.backgroundColor).toBe("rgb(42, 71, 150)");
  });
});
