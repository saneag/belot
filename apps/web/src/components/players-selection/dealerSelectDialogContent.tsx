import { useHandleDealerChange } from "@belot/hooks";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export default function DealerSelectDialogContent() {
  const { players, dealer, handleDealerChange } = useHandleDealerChange();

  return (
    <div className="flex justify-center gap-2.5">
      {players.map((player) => (
        <Button
          key={player.id}
          onClick={() => handleDealerChange(player)}
          variant="outline"
          className={cn(
            dealer?.id === player.id ? "bg-green-500! text-black hover:text-black" : "",
            "w-fit px-4",
          )}
          type="button"
        >
          {player.name}
        </Button>
      ))}
    </div>
  );
}
