import { useLoadGameData } from "@belot/hooks";

import GameTable from "@/components/game-table";
import Header from "@/components/game-table/header";
import { Separator } from "@/components/ui/separator";
import { getFromStorage, setToStorage } from "@/helpers/storageHelpers";

export default function GameTablePage() {
  useLoadGameData({ getFromStorage, setToStorage });

  return (
    <div className="relative flex h-full flex-col">
      <Header />
      <Separator />
      <GameTable />
    </div>
  );
}
