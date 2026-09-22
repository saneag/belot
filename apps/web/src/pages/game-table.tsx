import { useCallback } from "react";

import { useGameInitRetry, useLoadGameData } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

import GameTable from "@/components/game-table";
import Header from "@/components/game-table/header";
import { Separator } from "@/components/ui/separator";

import { getApiBaseUrl } from "@/helpers/apiBaseUrl";
import { getFromStorage, setToStorage } from "@/helpers/storageHelpers";

import { toast } from "sonner";

export default function GameTablePage() {
  const serverOffline = useLocalization("server.offline");
  const handleGameInitError = useCallback(() => toast.error(serverOffline), [serverOffline]);
  useLoadGameData({ getFromStorage, setToStorage });
  useGameInitRetry({
    getFromStorage,
    setToStorage,
    getApiBaseUrl,
    handleCatchError: handleGameInitError,
  });

  return (
    <div className="relative flex h-full flex-col">
      <Header />
      <Separator />
      <GameTable />
    </div>
  );
}
