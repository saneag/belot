import { type ReactNode } from "react";

import { TABLE_HEIGHT, TABLE_WIDTH } from "@belot/constants";

interface PlayersTableProps {
  children: ReactNode;
}

export default function PlayersTable({ children }: PlayersTableProps) {
  return (
    <div className="my-3 flex h-70 items-center justify-center">
      <div
        className="relative rounded-full border-[5px] border-[#3f3f3fff] bg-[#3f3f3fff]"
        style={{ width: TABLE_WIDTH, height: TABLE_HEIGHT }}
      >
        {children}
      </div>
    </div>
  );
}
