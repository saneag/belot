import { TABLE_HEIGHT, TABLE_WIDTH } from "@belot/constants";
import { useGameStore } from "@belot/store";

import ExtendedTooltip from "@/components/extendedTooltip";
import { Button } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";

import { useLocalizations } from "@/localizations/useLocalization";

import { RefreshCcw } from "lucide-react-native";

export default function PlayersRandomizer() {
  const messages = useLocalizations([{ key: "shuffle.players" }]);

  const shufflePlayers = useGameStore((state) => state.shufflePlayers);

  return (
    <Center className="absolute" style={{ width: TABLE_WIDTH, height: TABLE_HEIGHT }}>
      <ExtendedTooltip
        tooltipText={messages.shufflePlayers}
        button={
          <Button variant="link" className="me-2.5 px-2" onPress={shufflePlayers}>
            <Icon as={RefreshCcw} size="sm" />
          </Button>
        }
      />
    </Center>
  );
}
