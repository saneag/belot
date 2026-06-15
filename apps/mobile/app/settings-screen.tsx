import { useCallback } from "react";

import { useFocusEffect } from "expo-router";

import { useSettings, useIsPointsTypeEnabled } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

import { BackButton } from "@/components/backButton";
import { PageHeader } from "@/components/pageHeader";
import { PointsTypeRadioButton } from "@/components/settings/pointsTypeRadioButton";
import { VStack } from "@/components/ui/vstack";

import { getFromStorage, setToStorage } from "@/helpers/storageHelpers";

export default function SettingsScreen() {
  const settingsMsg = useLocalization("settings");
  const isPointsTypeEnabled = useIsPointsTypeEnabled();

  const { settings, setSettings, getSettingsFromLocalStorage } = useSettings({
    getFromStorage,
    setToStorage,
  });

  useFocusEffect(
    useCallback(() => {
      void getSettingsFromLocalStorage();
    }, [getSettingsFromLocalStorage]),
  );

  return (
    <VStack className="relative w-full flex-1">
      <BackButton />
      <PageHeader title={settingsMsg} />
      <VStack className="flex-1 items-center justify-center gap-4">
        {isPointsTypeEnabled ? (
          <PointsTypeRadioButton value={settings.pointsType} onChange={setSettings} />
        ) : null}
      </VStack>
    </VStack>
  );
}
