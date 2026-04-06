import { GameMode, PlayerScore, TeamScore } from "@belot/types";

import { describe, expect, it } from "vitest";

import { basePlayerScore, baseRoundScore, baseTeamScore, mockPlayers } from "../../__mocks__/gameScoreHelpers";

import { handleRoundScoreChange } from "./scoreChangeHelpers";

describe("scoreChangeHelpers", () => {
  describe("handleRoundScoreChange", () => {
    describe("GameMode.classic", () => {
      it("updates the opponent score and recalculates the round player score from the remainder", () => {
        const playersScores: PlayerScore[] = [
          basePlayerScore({ id: 1, playerId: 1, score: 20 }),
          basePlayerScore({ id: 2, playerId: 2, score: 30 }),
          basePlayerScore({ id: 3, playerId: 3, score: 25 }),
          basePlayerScore({ id: 4, playerId: 4, score: 25 }),
        ];
        const prevRoundScore = baseRoundScore({
          id: 1,
          playersScores,
          teamsScores: [],
          totalRoundScore: 100,
        });

        const result = handleRoundScoreChange({
          gameMode: GameMode.classic,
          prevRoundScore,
          newScoreValue: 40,
          opponent: playersScores[1],
          roundPlayer: mockPlayers[0],
        });

        expect(result.playersScores.find((p) => p.playerId === 2)).toMatchObject({ score: 40 });
        expect(result.playersScores.find((p) => p.playerId === 1)).toMatchObject({ score: 10 });
        expect(result.playersScores.find((p) => p.playerId === 3)).toMatchObject({ score: 25 });
        expect(result.playersScores.find((p) => p.playerId === 4)).toMatchObject({ score: 25 });
      });

      it("clamps the new opponent score to zero when the input is negative", () => {
        const playersScores: PlayerScore[] = [
          basePlayerScore({ id: 1, playerId: 1, score: 20 }),
          basePlayerScore({ id: 2, playerId: 2, score: 30 }),
          basePlayerScore({ id: 3, playerId: 3, score: 25 }),
          basePlayerScore({ id: 4, playerId: 4, score: 25 }),
        ];
        const prevRoundScore = baseRoundScore({
          id: 1,
          playersScores,
          teamsScores: [],
          totalRoundScore: 100,
        });

        const result = handleRoundScoreChange({
          gameMode: GameMode.classic,
          prevRoundScore,
          newScoreValue: -5,
          opponent: playersScores[1],
          roundPlayer: mockPlayers[0],
        });

        expect(result.playersScores.find((p) => p.playerId === 2)).toMatchObject({ score: 0 });
        expect(result.playersScores.find((p) => p.playerId === 1)).toMatchObject({ score: 50 });
      });

      it("clamps the new opponent score to the maximum implied by other players and totalRoundScore", () => {
        const playersScores: PlayerScore[] = [
          basePlayerScore({ id: 1, playerId: 1, score: 20 }),
          basePlayerScore({ id: 2, playerId: 2, score: 30 }),
          basePlayerScore({ id: 3, playerId: 3, score: 25 }),
          basePlayerScore({ id: 4, playerId: 4, score: 25 }),
        ];
        const prevRoundScore = baseRoundScore({
          id: 1,
          playersScores,
          teamsScores: [],
          totalRoundScore: 100,
        });

        const result = handleRoundScoreChange({
          gameMode: GameMode.classic,
          prevRoundScore,
          newScoreValue: 60,
          opponent: playersScores[1],
          roundPlayer: mockPlayers[0],
        });

        expect(result.playersScores.find((p) => p.playerId === 2)).toMatchObject({ score: 50 });
        expect(result.playersScores.find((p) => p.playerId === 1)).toMatchObject({ score: 0 });
      });

      it("updates every player row that matches the opponent playerId", () => {
        const playersScores: PlayerScore[] = [
          basePlayerScore({ id: 10, playerId: 1, score: 10 }),
          basePlayerScore({ id: 11, playerId: 1, score: 10 }),
          basePlayerScore({ id: 2, playerId: 2, score: 20 }),
        ];
        const prevRoundScore = baseRoundScore({
          id: 1,
          playersScores,
          teamsScores: [],
          totalRoundScore: 50,
        });

        const result = handleRoundScoreChange({
          gameMode: GameMode.classic,
          prevRoundScore,
          newScoreValue: 5,
          opponent: playersScores[0],
          roundPlayer: mockPlayers[1],
        });

        expect(result.playersScores.filter((p) => p.playerId === 1).every((p) => p.score === 5)).toBe(
          true,
        );
        expect(result.playersScores.find((p) => p.playerId === 2)).toMatchObject({ score: 40 });
      });

      it("does not assign a round player remainder when roundPlayer is null", () => {
        const playersScores: PlayerScore[] = [
          basePlayerScore({ id: 1, playerId: 1, score: 20 }),
          basePlayerScore({ id: 2, playerId: 2, score: 30 }),
          basePlayerScore({ id: 3, playerId: 3, score: 50 }),
        ];
        const prevRoundScore = baseRoundScore({
          id: 1,
          playersScores,
          teamsScores: [],
          totalRoundScore: 100,
        });

        const result = handleRoundScoreChange({
          gameMode: GameMode.classic,
          prevRoundScore,
          newScoreValue: 25,
          opponent: playersScores[1],
          roundPlayer: null,
        });

        expect(result.playersScores.find((p) => p.playerId === 2)).toMatchObject({ score: 25 });
        expect(result.playersScores.find((p) => p.playerId === 1)).toMatchObject({ score: 20 });
        expect(result.playersScores.find((p) => p.playerId === 3)).toMatchObject({ score: 50 });
      });
    });

    describe("GameMode.teams", () => {
      it("sets the opponent team score and assigns the other team the remaining total", () => {
        const teamsScores: TeamScore[] = [
          baseTeamScore({ id: 1, teamId: 1, score: 40 }),
          baseTeamScore({ id: 2, teamId: 2, score: 60 }),
        ];
        const prevRoundScore = baseRoundScore({
          id: 1,
          playersScores: [],
          teamsScores,
          totalRoundScore: 100,
        });

        const result = handleRoundScoreChange({
          gameMode: GameMode.teams,
          prevRoundScore,
          newScoreValue: 75,
          opponent: teamsScores[1],
        });

        expect(result.teamsScores.find((t) => t.teamId === 2)).toMatchObject({ score: 75 });
        expect(result.teamsScores.find((t) => t.teamId === 1)).toMatchObject({ score: 25 });
      });

      it("clamps the team score between zero and totalRoundScore", () => {
        const teamsScores: TeamScore[] = [
          baseTeamScore({ id: 1, teamId: 1, score: 50 }),
          baseTeamScore({ id: 2, teamId: 2, score: 50 }),
        ];
        const prevRoundScore = baseRoundScore({
          id: 1,
          playersScores: [],
          teamsScores,
          totalRoundScore: 100,
        });

        const low = handleRoundScoreChange({
          gameMode: GameMode.teams,
          prevRoundScore,
          newScoreValue: -20,
          opponent: teamsScores[0],
        });
        expect(low.teamsScores.find((t) => t.teamId === 1)).toMatchObject({ score: 0 });
        expect(low.teamsScores.find((t) => t.teamId === 2)).toMatchObject({ score: 100 });

        const high = handleRoundScoreChange({
          gameMode: GameMode.teams,
          prevRoundScore,
          newScoreValue: 200,
          opponent: teamsScores[0],
        });
        expect(high.teamsScores.find((t) => t.teamId === 1)).toMatchObject({ score: 100 });
        expect(high.teamsScores.find((t) => t.teamId === 2)).toMatchObject({ score: 0 });
      });

      it("updates the non-opponent team when the opponent is the first team in the list", () => {
        const teamsScores: TeamScore[] = [
          baseTeamScore({ id: 1, teamId: 1, score: 30 }),
          baseTeamScore({ id: 2, teamId: 2, score: 70 }),
        ];
        const prevRoundScore = baseRoundScore({
          id: 1,
          playersScores: [],
          teamsScores,
          totalRoundScore: 100,
        });

        const result = handleRoundScoreChange({
          gameMode: GameMode.teams,
          prevRoundScore,
          newScoreValue: 10,
          opponent: teamsScores[0],
        });

        expect(result.teamsScores.find((t) => t.teamId === 1)).toMatchObject({ score: 10 });
        expect(result.teamsScores.find((t) => t.teamId === 2)).toMatchObject({ score: 90 });
      });
    });
  });
});
