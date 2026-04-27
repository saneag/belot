import { TABLE_HEIGHT, TABLE_WIDTH } from "@belot/constants";
import { useLocalizations } from "@belot/localizations";
import { useGameStore } from "@belot/store";

import ExtendedTooltip from "@/components/extendedTooltip";
import { Button } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";

import { Shuffle } from "lucide-react-native";

export default function PlayersRandomizer() {
  const messages = useLocalizations([{ key: "shuffle.players" }]);

  const shufflePlayers = useGameStore((state) => state.shufflePlayers);

  return (
    <Center className="absolute" style={{ width: TABLE_WIDTH, height: TABLE_HEIGHT }}>
      <ExtendedTooltip
        tooltipText={messages.shufflePlayers}
        button={
          <Button variant="link" className="me-2.5 px-2" onPress={shufflePlayers}>
            <Icon as={Shuffle} size="sm" />
          </Button>
        }
      />
    </Center>
  );
}
