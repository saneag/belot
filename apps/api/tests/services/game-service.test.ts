import { GameMode, type Player } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  countDocuments: vi.fn(),
  find: vi.fn(),
  isValidObjectId: vi.fn(),
}));

vi.mock("../../schemas/game-schema", () => ({
  default: {
    create: mocks.create,
    findById: mocks.findById,
    findByIdAndUpdate: mocks.findByIdAndUpdate,
    countDocuments: mocks.countDocuments,
    find: mocks.find,
  },
}));

vi.mock("mongoose", async (importOriginal) => {
  const actual = await importOriginal<typeof import("mongoose")>();
  return {
    ...actual,
    default: {
      ...actual.default,
      isValidObjectId: mocks.isValidObjectId,
    },
    isValidObjectId: mocks.isValidObjectId,
  };
});

import { GameService } from "../../services/game-service";

const players: Player[] = [
  { id: 0, name: "Alice" },
  { id: 1, name: "Bob" },
];

const doc = {
  toJSON: () => ({ id: "game-id", players, mode: GameMode.classic }),
};

describe("GameService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isValidObjectId.mockReturnValue(true);
  });

  it("initGame creates a game document", async () => {
    mocks.create.mockResolvedValue(doc);

    await expect(
      GameService.initGame({
        players,
        mode: GameMode.classic,
        teams: [],
      }),
    ).resolves.toEqual({ id: "game-id", players, mode: GameMode.classic });

    expect(mocks.create).toHaveBeenCalledWith({
      players,
      mode: GameMode.classic,
      dealer: null,
      teams: [],
    });
  });

  it("getGameById returns null for invalid ids", async () => {
    mocks.isValidObjectId.mockReturnValue(false);

    await expect(GameService.getGameById("bad-id")).resolves.toBeNull();
    expect(mocks.findById).not.toHaveBeenCalled();
  });

  it("getGameById returns serialized game when found", async () => {
    mocks.findById.mockResolvedValue(doc);

    await expect(GameService.getGameById("507f1f77bcf86cd799439011")).resolves.toEqual({
      id: "game-id",
      players,
      mode: GameMode.classic,
    });
  });

  it("getGameById returns null when document is missing", async () => {
    mocks.findById.mockResolvedValue(null);

    await expect(GameService.getGameById("507f1f77bcf86cd799439011")).resolves.toBeNull();
  });

  it("updateGameById returns existing game when patch is empty", async () => {
    mocks.findById.mockResolvedValue(doc);

    await expect(GameService.updateGameById("507f1f77bcf86cd799439011", {})).resolves.toEqual({
      id: "game-id",
      players,
      mode: GameMode.classic,
    });
    expect(mocks.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("updateGameById applies provided fields", async () => {
    mocks.findByIdAndUpdate.mockResolvedValue(doc);

    await GameService.updateGameById("507f1f77bcf86cd799439011", {
      isFinished: true,
      dealer: players[0],
    });

    expect(mocks.findByIdAndUpdate).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
      {
        $set: {
          isFinished: true,
          dealer: players[0],
        },
      },
      { new: true },
    );
  });

  it("updateGameById returns null for invalid ids", async () => {
    mocks.isValidObjectId.mockReturnValue(false);

    await expect(
      GameService.updateGameById("bad-id", { isFinished: true }),
    ).resolves.toBeNull();
  });

  it("updateGameById updates round score fields", async () => {
    mocks.findByIdAndUpdate.mockResolvedValue(doc);

    const roundsScores = [
      {
        id: 0,
        playersScores: [],
        teamsScores: [],
        totalRoundScore: 10,
      },
    ];

    await GameService.updateGameById("507f1f77bcf86cd799439011", {
      roundsScores,
      undoneRoundsScores: roundsScores,
    });

    expect(mocks.findByIdAndUpdate).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
      {
        $set: {
          roundsScores,
          undoneRoundsScores: roundsScores,
        },
      },
      { new: true },
    );
  });

  it("updateGameById returns null when document is missing after update", async () => {
    mocks.findByIdAndUpdate.mockResolvedValue(null);

    await expect(
      GameService.updateGameById("507f1f77bcf86cd799439011", { isFinished: true }),
    ).resolves.toBeNull();
  });

  it("updateGameById returns null when empty patch finds no document", async () => {
    mocks.findById.mockResolvedValue(null);

    await expect(GameService.updateGameById("507f1f77bcf86cd799439011", {})).resolves.toBeNull();
  });

  it("listGames returns paginated games", async () => {
    mocks.countDocuments.mockResolvedValue(2);
    mocks.find.mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([doc, doc]),
    });

    await expect(GameService.listGames(2, 1)).resolves.toEqual({
      games: [
        { id: "game-id", players, mode: GameMode.classic },
        { id: "game-id", players, mode: GameMode.classic },
      ],
      page: 2,
      limit: 1,
      total: 2,
    });
  });
});
