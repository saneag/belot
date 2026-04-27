import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import type { Localization, LocalizationKey } from "../types";
import { useI18nextSetup } from "./useI18nextSetup";

export const formatLocalizationString = (localization: string, args: Localization["args"] = []) => {
  return localization.replace(/{(\d+)}/g, (match, index: number) =>
    typeof args[index] !== "undefined" ? args[index].toString() : match,
  );
};

export const useLocalization = (key: LocalizationKey, args: Localization["args"] = []) => {
  useI18nextSetup();
  const { t } = useTranslation();

  return useMemo(() => formatLocalizationString(t(key), args), [args, key, t]);
};

export const useLocalizations = (localizations: Localization[]) => {
  useI18nextSetup();
  const { t } = useTranslation();

  return useMemo(() => {
    const localizedStrings: Record<string, string> = {} as Record<string, string>;

    localizations.forEach(({ key, args }) => {
      const adjustedKey = key
        .split(".")
        .map((keyPart, index) =>
          index === 0 ? keyPart : keyPart.at(0)?.toUpperCase() + keyPart.substring(1),
        )
        .join("");

      localizedStrings[adjustedKey] = formatLocalizationString(t(key), args);
    });

    return localizedStrings;
  }, [localizations, t]);
};
