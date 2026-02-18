import { LocalizationKey } from "@belot/localizations";

export interface Localization {
  key: LocalizationKey;
  args?: (number | string | undefined)[];
}
