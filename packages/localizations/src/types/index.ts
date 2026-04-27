import type { Localizations } from "../localizations";

export type LocalizationKey = keyof typeof Localizations.en;

export interface Localization {
  key: LocalizationKey;
  args?: (number | string | undefined)[];
}
