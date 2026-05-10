import { useCallback } from "react";

import { useGameStore } from "@belot/store";

interface UseGetTableHeaderDealerBackgroundProps {
  columnsCount: number;
  color: string;
}

export const useGetTableHeaderDealerBackground = ({
  columnsCount,
  color,
}: UseGetTableHeaderDealerBackgroundProps) => {
  const dealer = useGameStore((state) => state.dealer);

  const getDealerBackground = useCallback(
    (index: number) => {
      if (index === (dealer?.id || 0) % columnsCount) {
        return color;
      }

      return "";
    },
    [dealer, columnsCount, color],
  );

  return {
    getDealerBackground,
  };
};
