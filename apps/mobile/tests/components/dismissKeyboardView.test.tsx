// @vitest-environment jsdom

import { Keyboard } from "react-native";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DismissKeyboardView from "@/components/dismissKeyboardView";

describe("DismissKeyboardView", () => {
  it("dismisses keyboard on press", () => {
    const { getByText } = render(
      <DismissKeyboardView>
        <span>Child</span>
      </DismissKeyboardView>,
    );

    fireEvent.click(getByText("Child"));
    expect(Keyboard.dismiss).toHaveBeenCalled();
  });

  it("wraps array children in a view", () => {
    const { getByText } = render(
      <DismissKeyboardView>
        {[<span key="1">One</span>, <span key="2">Two</span>]}
      </DismissKeyboardView>,
    );

    expect(getByText("One")).toBeTruthy();
    expect(getByText("Two")).toBeTruthy();
  });
});
