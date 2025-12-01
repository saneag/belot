import { Player } from '@/types/game';
import { PlayersNamesValidation } from '@/types/validations';
import { getPlayersCount, getPlayersNames } from './playerNamesHelpers';

export const validatePlayersNames = (
  players: Player[]
): PlayersNamesValidation => {
  const emptyNames: string[] = [];
  const repeatingNames: string[] = [];

  const seenNames = new Set<string>();

  const playersNames = getPlayersNames(players);
  const playersCount = getPlayersCount(players);

  for (let [key, value] of Object.entries(playersNames)) {
    if (Number(key) >= playersCount) {
      continue;
    }

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      emptyNames.push(key);
      continue;
    }

    if (seenNames.has(trimmedValue.toLowerCase())) {
      repeatingNames.push(key);
    } else {
      seenNames.add(trimmedValue.toLowerCase());
    }
  }

  return {
    emptyNames,
    repeatingNames,
  };
};

export const isPlayersNamesEmpty = (
  validations: PlayersNamesValidation,
  index: number
) => {
  return validations.emptyNames.includes(index.toString());
};

export const isPlayersNamesRepeating = (
  validations: PlayersNamesValidation,
  index: number
) => {
  return validations.repeatingNames.includes(index.toString());
};

export const isPlayerNameValid = (
  validations: PlayersNamesValidation,
  index?: number
) => {
  if (index === undefined) {
    return Object.values(validations).every(
      (validation) => validation.length === 0
    );
  }

  return !(
    isPlayersNamesEmpty(validations, index) ||
    isPlayersNamesRepeating(validations, index)
  );
};

export const excludeChangedValue = (value: string, validation: string[]) => {
  return validation.filter((item) => item !== value);
};
