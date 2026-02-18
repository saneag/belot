import { View } from "react-native";

import GameTable from "@/components/game-table";
import Header from "@/components/game-table/header";
import { Divider } from "@/components/ui/divider";

export default function GameTableScreen() {
  return (
    <View className="flex-1 content-center bg-background-0">
      <Header />
      <Divider />
      <GameTable />
    </View>
  );
}
