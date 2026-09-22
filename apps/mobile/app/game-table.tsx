import { useCallback } from "react";

import { ToastAndroid, View } from "react-native";

import { useGameInitRetry, useLoadGameData } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

import GameTable from "@/components/game-table";
import Header from "@/components/game-table/header";
import { Divider } from "@/components/ui/divider";

import { getApiBaseUrl } from "@/helpers/apiBaseUrl";
import { getFromStorage, setToStorage } from "@/helpers/storageHelpers";

export default function GameTableScreen() {
  const serverOffline = useLocalization("server.offline");
  const handleGameInitError = useCallback(
    () => ToastAndroid.showWithGravity(serverOffline, ToastAndroid.SHORT, ToastAndroid.CENTER),
    [serverOffline],
  );
  useLoadGameData({ getFromStorage, setToStorage });
  useGameInitRetry({
    getFromStorage,
    setToStorage,
    getApiBaseUrl,
    handleCatchError: handleGameInitError,
  });

  return (
    <View className="flex-1 content-center">
      <Header />
      <Divider />
      <GameTable />
    </View>
  );
}
