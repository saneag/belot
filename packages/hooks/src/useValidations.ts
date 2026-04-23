import { useCallback, useState } from "react";

import type { PlayersNamesValidation } from "@belot/types";

export const useValidations = () => {
  const [validations, setValidations] = useState<PlayersNamesValidation>({
    emptyNames: [],
    repeatingNames: [],
  });

  const resetValidations = useCallback(() => {
    setValidations({
      emptyNames: [],
      repeatingNames: [],
    });
  }, [setValidations]);

  return {
    validations,
    setValidations,
    resetValidations,
  };
};
