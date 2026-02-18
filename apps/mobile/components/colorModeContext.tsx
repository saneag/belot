import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext } from "react";

export interface ColorModeContextType {
  colorMode: "light" | "dark";
  setColorMode: Dispatch<SetStateAction<"light" | "dark">>;
}

const ColorModeContext = createContext<ColorModeContextType>({
  colorMode: "light",
  setColorMode: () => {},
});

export const useColorModeContext = () => {
  const context = useContext(ColorModeContext);

  if (context === undefined) {
    throw new Error("useColorModeContext must be used within a ColorModeContextProvider");
  }

  return context;
};

interface ColorModeContextProps extends ColorModeContextType, PropsWithChildren {}

export const ColorModeContextProvider = ({ children, ...rest }: ColorModeContextProps) => {
  return <ColorModeContext.Provider value={rest}>{children}</ColorModeContext.Provider>;
};
