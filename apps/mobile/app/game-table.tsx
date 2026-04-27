import { View } from "react-native";

import { useLoadGameData } from "@belot/hooks";

import GameTable from "@/components/game-table";
import Header from "@/components/game-table/header";
import { Divider } from "@/components/ui/divider";

import { getFromStorage } from "@/helpers/storageHelpers";

export default function GameTableScreen() {
  useLoadGameData({ getFromStorage });

  return (
    <View className="flex-1 content-center bg-background-0">
      <Header />
      <Divider />
      <GameTable />
    </View>
  );
}
