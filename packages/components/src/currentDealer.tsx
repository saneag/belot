import { type ElementType, useMemo } from "react";

import { formatLocalizationString } from "@belot/localizations";
import { useGameStore } from "@belot/store";

interface CurrentDealerProps {
  dealerMessage: string;
  blockWrapper: ElementType;
  textWrapper: ElementType;
  textWrapperClassName?: string;
}

const MAX_NAME_LENGTH = 10;

export const CurrentDealer = ({
  dealerMessage,
  blockWrapper: BlockWrapper,
  textWrapper: TextWrapper,
  textWrapperClassName = "",
}: CurrentDealerProps) => {
  const dealer = useGameStore((state) => state.dealer);

  const truncatedName = useMemo(() => {
    if (!dealer) return "";

    const dealerName =
      dealer.name.length > MAX_NAME_LENGTH
        ? dealer.name.substring(0, MAX_NAME_LENGTH) + "..."
        : dealer.name;

    return formatLocalizationString(dealerMessage, [dealerName]);
  }, [dealer, dealerMessage]);

  if (!truncatedName) {
    return <BlockWrapper />;
  }

  return <TextWrapper className={textWrapperClassName}>{truncatedName}</TextWrapper>;
};
