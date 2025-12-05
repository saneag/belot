import { useMemo } from 'react';
import { Localization, LocalizationKey } from '@belot/shared';
import { i18nLocale } from './i18nLocale';

export const formatLocalizationString = (
  localization: string,
  args: Localization['args'] = []
) => {
  return localization.replace(/{(\d+)}/g, (match, index) =>
    typeof args[index] !== 'undefined' ? args[index].toString() : match
  );
};

export const useLocalization = (
  key: LocalizationKey,
  args: Localization['args'] = []
) => {
  return useMemo(
    () => formatLocalizationString(i18nLocale.t(key), args),
    [args, key]
  );
};

export const useLocalizations = (localizations: Localization[]) => {
  return useMemo(() => {
    const localizedStrings: Record<string, string> = {} as Record<
      string,
      string
    >;

    localizations.forEach(({ key, args }) => {
      const adjustedKey = key
        .split('.')
        .map((keyPart, index) =>
          index === 0
            ? keyPart
            : keyPart.at(0)?.toUpperCase() + keyPart.substring(1)
        )
        .join('');

      localizedStrings[adjustedKey] = formatLocalizationString(
        i18nLocale.t(key),
        args
      );
    });

    return localizedStrings;
  }, [localizations]);
};
