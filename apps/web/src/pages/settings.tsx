import { useCallback, useLayoutEffect } from "react";

import { useSettings } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

import { PointsTypeRadioButton } from "@/components/settings/pointsTypeRadioButton";

export default function SettingsPage() {
  const settingsMsg = useLocalization("settings");
  const getFromStorage = useCallback((key: string) => localStorage.getItem(key), []);
  const setToStorage = useCallback((key: string, value: string) => localStorage.setItem(key, value), []);

  const { settings, setSettings, getSettingsFromLocalStorage } = useSettings({
    getFromStorage,
    setToStorage,
  });

  useLayoutEffect(() => {
    void getSettingsFromLocalStorage();
  }, [getSettingsFromLocalStorage]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="absolute top-1/6 text-4xl font-normal">{settingsMsg}</h1>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <PointsTypeRadioButton value={settings.pointsType} onChange={setSettings} />
      </div>
    </div>
  );
}
