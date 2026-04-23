import { useState } from "react";

import type { Player, Team } from "@belot/types";

import NextRoundButton from "@/components/game-table/action-buttons/next-round-button";
import RedoRoundButton from "@/components/game-table/action-buttons/redoRound";
import ResetGameButton from "@/components/game-table/action-buttons/resetGame";
import SkipRoundButton from "@/components/game-table/action-buttons/skipRound";
import UndoRoundButton from "@/components/game-table/action-buttons/undoRound";
import TableBodyWrapper from "@/components/game-table/tableBodyWrapper";
import TableHeaderWrapper from "@/components/game-table/tableHeaderWrapper";
import WinDialog from "@/components/game-table/winDialog";
import { Table } from "@/components/ui/table";

import { isMobile } from "@/helpers/isMobile";

const CONTAINER_MARGIN_BOTTOM = 20;

export default function GameTable() {
  const height = window.innerHeight;
  const [winner, setWinner] = useState<Player | Team | null>(null);

  return (
    <div
      className="mt-3 flex flex-1 flex-col justify-between gap-2.5 px-2"
      style={{
        marginBottom: CONTAINER_MARGIN_BOTTOM,
      }}
    >
      <div
        className="border-primary flex w-full flex-col overflow-hidden rounded-lg border"
        style={{
          maxHeight: height / (isMobile() ? 1.17 : 1.5) - CONTAINER_MARGIN_BOTTOM,
        }}
      >
        <Table className="w-full">
          <TableHeaderWrapper />
          <TableBodyWrapper />
        </Table>
      </div>

      {winner ? (
        <ResetGameButton setWinner={setWinner} />
      ) : (
        <div className="flex flex-wrap items-center justify-around gap-1.25">
          <UndoRoundButton />
          <RedoRoundButton />
          <SkipRoundButton />
          <NextRoundButton setWinner={setWinner} />
        </div>
      )}
      <WinDialog winner={winner} setWinner={setWinner} />
    </div>
  );
}
