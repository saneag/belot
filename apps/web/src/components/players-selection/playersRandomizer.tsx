import { useGameStore } from "@belot/store";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { useLocalizations } from "@/localizations/useLocalization";

import { Shuffle } from "lucide-react";

export default function PlayersRandomizer() {
  const messages = useLocalizations([{ key: "shuffle.players" }]);

  const shufflePlayers = useGameStore((state) => state.shufflePlayers);

  return (
    <div className="absolute flex h-full w-full items-center justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="px-2 hover:bg-transparent" onClick={shufflePlayers}>
            <Shuffle size={16} color="white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>{messages.shufflePlayers}</span>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
