import { useCallback } from "react";

import { formatLocalizationKey, useLocalizations } from "@belot/localizations";

const POINTS_TYPE_OPTION_KEYS = [
  { key: "settings.points.type.micropoints" },
  { key: "settings.points.type.points" },
] as const;

const SETTINGS_LABEL_KEYS = [
  { key: "settings.points.type" },
  { key: "settings.points.type.hint" },
] as const;

interface UsePointsTypeSelectionParams {
  value: string;
  onChange: (pointsType: string) => void | Promise<void>;
  includeSettingsLabels?: boolean;
}

export const usePointsTypeSelection = ({
  value,
  onChange,
  includeSettingsLabels = false,
}: UsePointsTypeSelectionParams) => {
  const messages = useLocalizations(
    includeSettingsLabels ? [...SETTINGS_LABEL_KEYS, ...POINTS_TYPE_OPTION_KEYS] : [...POINTS_TYPE_OPTION_KEYS],
  );

  const handleChange = useCallback(
    (newValue: string) => {
      if (newValue === value) {
        return;
      }

      void onChange(newValue);
    },
    [onChange, value],
  );

  const getOptionLabel = useCallback(
    (localizationKey: string) => messages[formatLocalizationKey(localizationKey)],
    [messages],
  );

  return {
    messages,
    handleChange,
    getOptionLabel,
  };
};
