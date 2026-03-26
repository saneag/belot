import { useMutation } from "@tanstack/react-query";

import { initGame } from "../services";
import { InitGameInput } from "../types";

export const useGameInit = (baseUrl: string) => {
  return useMutation({
    mutationFn: (input: InitGameInput) => initGame(baseUrl, input),
  });
};
