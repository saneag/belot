import { type Dispatch, type SetStateAction, useCallback } from "react";

import { useLocalization } from "@belot/localizations";
import { type Player } from "@belot/types";

import { Button } from "@/components/ui/button";

import { Pencil } from "lucide-react";

export interface RoundPlayerDisplayProps {
  roundPlayer: Player | null;
  setRoundPlayer: Dispatch<SetStateAction<Player | null>>;
}

export default function RoundPlayerDisplay({
  roundPlayer,
  setRoundPlayer,
}: RoundPlayerDisplayProps) {
  const roundPlayerMsg = useLocalization("next.round.player.display", [roundPlayer?.name]);

  const handleRoundPlayerEdit = useCallback(() => {
    setRoundPlayer(null);
  }, [setRoundPlayer]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      <span className="text-primary">{roundPlayerMsg}</span>
      {roundPlayer && (
        <Button variant="link" className="h-fit p-0" onClick={handleRoundPlayerEdit}>
          <Pencil className="text-blue-500" size={12} />
        </Button>
      )}
    </div>
  );
}
