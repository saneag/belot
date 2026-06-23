import { useLayoutEffect } from "react";

import { useIsPointsTypeEnabled, useSettings } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

import { BackButton } from "@/components/backButton";
import { PageHeader } from "@/components/pageHeader";
import { PointsTypeRadioButton } from "@/components/settings/pointsTypeRadioButton";

import { getFromStorage, setToStorage } from "@/helpers/storageHelpers";

export default function SettingsPage() {
  const settingsMsg = useLocalization("settings");
  const isPointsTypeEnabled = useIsPointsTypeEnabled();

  const { settings, setSettings, getSettingsFromLocalStorage } = useSettings({
    getFromStorage,
    setToStorage,
  });

  useLayoutEffect(() => {
    void getSettingsFromLocalStorage();
  }, [getSettingsFromLocalStorage]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <BackButton />
      <PageHeader title={settingsMsg} />

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {isPointsTypeEnabled ? (
          <PointsTypeRadioButton value={settings.pointsType} onChange={setSettings} />
        ) : null}
      </div>
    </div>
  );
}
