import { View } from "react-native";

import { useLoadGameData } from "@belot/hooks";

import GameTable from "@/components/game-table";
import Header from "@/components/game-table/header";
import { Divider } from "@/components/ui/divider";

import { getFromStorage, setToStorage } from "@/helpers/storageHelpers";

export default function GameTableScreen() {
  useLoadGameData({ getFromStorage, setToStorage });

  return (
    <View className="flex-1 content-center">
      <Header />
      <Divider />
      <GameTable />
    </View>
  );
}
