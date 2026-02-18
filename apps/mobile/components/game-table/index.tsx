import { useState } from "react";

import { View, useWindowDimensions } from "react-native";

import { Player, Team } from "@belot/types";

import { HStack } from "@/components/ui/hstack";
import { Table } from "@/components/ui/table";

import NextRoundButton from "./action-buttons/next-round-button";
import RedoRoundButton from "./action-buttons/redoRound";
import ResetGameButton from "./action-buttons/resetGame";
import SkipRoundButton from "./action-buttons/skipRound";
import UndoRoundButton from "./action-buttons/undoRound";
import TableBodyWrapper from "./tableBodyWrapper";
import TableHeaderWrapper from "./tableHeaderWrapper";
import WinDialog from "./winDialog";

const CONTAINER_MARGIN_BOTTOM = 20;

export default function GameTable() {
  const { height } = useWindowDimensions();

  const [winner, setWinner] = useState<Player | Team | null>(null);

  return (
    <View
      className="mt-3 flex-1 justify-between gap-2.5 px-2"
      style={{
        marginBottom: CONTAINER_MARGIN_BOTTOM,
      }}
    >
      <View
        className="w-full overflow-hidden rounded-lg border border-primary-500"
        style={{
          maxHeight: height - 165 - CONTAINER_MARGIN_BOTTOM,
        }}
      >
        <Table className="w-full">
          <TableHeaderWrapper />
          <TableBodyWrapper />
        </Table>
      </View>

      {winner ? (
        <ResetGameButton setWinner={setWinner} />
      ) : (
        <HStack className="flex-wrap items-center justify-around gap-[5px]">
          <UndoRoundButton />
          <RedoRoundButton />
          <SkipRoundButton />
          <NextRoundButton setWinner={setWinner} />
        </HStack>
      )}
      <WinDialog winner={winner} setWinner={setWinner} />
    </View>
  );
}
