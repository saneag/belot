import { type ElementType } from "react";

import { PLAYERS_TABLE_COLORS, TABLE_HEIGHT, TABLE_WIDTH } from "@belot/constants";

interface PlayersTableProps {
  children: React.ReactNode;
  blockWrapper: ElementType;
  mainBlockClassName?: string;
  isDarkMode?: boolean;
}

export const PlayersTable = ({
  children,
  blockWrapper: BlockWrapper,
  mainBlockClassName,
  isDarkMode = false,
}: PlayersTableProps) => {
  return (
    <BlockWrapper
      style={{
        alignItems: "center",
        height: 280,
        marginTop: 15,
        marginBottom: 15,
      }}
      className={mainBlockClassName}
    >
      <BlockWrapper
        style={{
          position: "relative",
          width: TABLE_WIDTH,
          height: TABLE_HEIGHT,
          marginTop: 15,
          borderRadius: 1200,
          borderWidth: 5,
          borderColor: isDarkMode
            ? PLAYERS_TABLE_COLORS.borderColorDarkMode
            : PLAYERS_TABLE_COLORS.borderColor,
          backgroundColor: PLAYERS_TABLE_COLORS.backgroundColor,
        }}
      >
        {children}
      </BlockWrapper>
    </BlockWrapper>
  );
};
