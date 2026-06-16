// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LocalizationContextProvider } from "../src/components/localizationContextProvider";
import { useLocalizationContext } from "../src/hooks/useLocalizationContext";

function LanguageReader() {
  const { getDeviceLanguage } = useLocalizationContext();
  return <span>{getDeviceLanguage()}</span>;
}

describe("LocalizationContextProvider", () => {
  it("provides getDeviceLanguage to descendants", () => {
    render(
      <LocalizationContextProvider getDeviceLanguage={() => "ro"}>
        <LanguageReader />
      </LocalizationContextProvider>,
    );

    expect(screen.getByText("ro")).toBeTruthy();
  });
});
