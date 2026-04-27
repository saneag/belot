import { useMemo } from "react";

import { useLocalization } from "@belot/localizations";
import { useGameStore } from "@belot/store";

const MAX_NAME_LENGTH = 10;

export default function CurrentDealer() {
  const dealer = useGameStore((state) => state.dealer);

  const truncatedName = useMemo(() => {
    if (!dealer) return "";

    return dealer.name.length > MAX_NAME_LENGTH
      ? dealer.name.substring(0, MAX_NAME_LENGTH) + "..."
      : dealer.name;
  }, [dealer]);

  const dealerMsg = useLocalization("dealer", [truncatedName]);

  return truncatedName ? (
    <span className="justify-self-center text-center">{dealerMsg}</span>
  ) : (
    <div></div>
  );
}
