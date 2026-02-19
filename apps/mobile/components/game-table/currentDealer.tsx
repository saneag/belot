import { useGameStore } from "@belot/store";

import { Text } from "@/components/ui/text";

import { useLocalization } from "@/localizations/useLocalization";

export default function CurrentDealer() {
  const dealer = useGameStore((state) => state.dealer);

  const dealerMsg = useLocalization("dealer", [dealer?.name]);

  return <Text className="absolute inset-x-0 top-2 text-center">{dealerMsg}</Text>;
}
