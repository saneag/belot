import { useCallback } from "react";

import { useFocusEffect } from "expo-router";

import { useSettings } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

import { PointsTypeRadioButton } from "@/components/settings/pointsTypeRadioButton";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";

import { getFromStorage, setToStorage } from "@/helpers/storageHelpers";

export default function SettingsScreen() {
  const settingsMsg = useLocalization("settings");

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
    <VStack className="flex-1 items-center justify-center">
      <Heading size="4xl" className="absolute top-10 pb-2 font-normal">
        {settingsMsg}
      </Heading>
      <VStack className="flex-1 items-center justify-center gap-4">
        <PointsTypeRadioButton value={settings.pointsType} onChange={setSettings} />
      </VStack>
    </VStack>
  );
}
