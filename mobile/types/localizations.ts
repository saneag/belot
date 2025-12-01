import en from '@/localizations/en.json';

export type LocalizationKey = keyof typeof en;

export interface Localization {
  key: LocalizationKey;
  args?: (number | string | undefined)[];
}
