import { type PropsWithChildren } from "react";

import {
  PlayersSelectionContext,
  type PlayersSelectionContextType,
} from "@/hooks/players-selection/usePlayersSelectionContext";

interface PlayersSelectionContextProps extends PlayersSelectionContextType, PropsWithChildren {}

export const PlayersSelectionContextProvider = ({
  children,
  ...rest
}: PlayersSelectionContextProps) => {
  return (
    <PlayersSelectionContext.Provider value={rest}>{children}</PlayersSelectionContext.Provider>
  );
};
