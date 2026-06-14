import { describe, expect, it } from "vitest";

import { SUPPORTED_LANGUAGES } from "../src/constants";
import { errors } from "../src/errors";
import { Localizations } from "../src/localizations";

describe("localizations data", () => {
  it("exports supported languages", () => {
    expect(SUPPORTED_LANGUAGES).toEqual(["en", "ro", "ru"]);
  });

  it("merges base and error translations for each locale", () => {
    expect(Localizations.en.time).toBeDefined();
    expect(Localizations.ro.time).toBeDefined();
    expect(Localizations.ru.time).toBeDefined();
    expect(errors.en).toBeDefined();
    expect(errors.ro).toBeDefined();
    expect(errors.ru).toBeDefined();
  });
});
