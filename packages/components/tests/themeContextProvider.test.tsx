// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { THEMES } from "@belot/constants";
import { useThemeContext } from "@belot/hooks";

import { ThemeContextProvider } from "../src/themeContextProvider";

function ThemeReader() {
  const { theme, initialTheme } = useThemeContext();
  return <span>{`${initialTheme}:${theme}`}</span>;
}

describe("ThemeContextProvider", () => {
  it("provides theme state to descendants", () => {
    render(
      <ThemeContextProvider initialTheme={THEMES.dark}>
        <ThemeReader />
      </ThemeContextProvider>,
    );

    expect(screen.getByText("dark:dark")).toBeTruthy();
  });
});
