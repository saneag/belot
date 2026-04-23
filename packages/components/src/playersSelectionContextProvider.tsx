import { type PropsWithChildren, useMemo } from "react";

import { useValidations } from "@belot/hooks";
import { PlayersSelectionContext } from "@belot/hooks";

export const PlayersSelectionContextProvider = ({ children }: PropsWithChildren) => {
  const { validations, setValidations, resetValidations } = useValidations();

  const value = useMemo(
    () => ({
      validations,
      setValidations,
      resetValidations,
    }),
    [validations, setValidations, resetValidations],
  );

  return (
    <PlayersSelectionContext.Provider value={value}>{children}</PlayersSelectionContext.Provider>
  );
};
