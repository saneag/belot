import { useCallback } from "react";

import { useLocalization } from "@belot/localizations";
import { useGameStore } from "@belot/store";
import type { Player } from "@belot/types";

import { type RoundPlayerDisplayProps } from "@/components/game-table/action-buttons/next-round-button/roundPlayerDisplay";
import { Button } from "@/components/ui/button";

export default function RoundPlayerSelect({
  setRoundPlayer,
}: Pick<RoundPlayerDisplayProps, "setRoundPlayer">) {
  const nextRoundPlayerMsg = useLocalization("next.round.player.select");

  const players = useGameStore((state) => state.players);

  const handleRoundPlayerChange = useCallback(
    (player: Player) => {
      setRoundPlayer(player);
    },
    [setRoundPlayer],
  );

  return (
    <div className="gap-2.5">
      <span>{nextRoundPlayerMsg}</span>
      <div className="flex flex-wrap justify-center gap-2.5">
        {players.map((player) => (
          <Button key={player.id} className="px-4" onClick={() => handleRoundPlayerChange(player)}>
            {player.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
