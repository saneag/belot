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
    const dealerName = typeof dealer?.name === "string" ? dealer.name : "";

    if (!dealerName) return "";

    const formattedDealerName =
      dealerName.length > MAX_NAME_LENGTH
        ? dealerName.substring(0, MAX_NAME_LENGTH) + "..."
        : dealerName;

    return formatLocalizationString(dealerMessage, [formattedDealerName]);
  }, [dealer, dealerMessage]);

  if (!truncatedName) {
    return <BlockWrapper />;
  }

  return (
    <TextWrapper className={textWrapperClassName} data-testid="current-dealer">
      {truncatedName}
    </TextWrapper>
  );
};
