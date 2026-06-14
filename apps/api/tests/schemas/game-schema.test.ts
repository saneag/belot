import mongoose from "mongoose";
import { describe, expect, it } from "vitest";

import Game from "../../schemas/game-schema";

describe("game schema", () => {
  it("serializes documents with string id and boolean isFinished", () => {
    const id = new mongoose.Types.ObjectId();
    const json = new Game({
      _id: id,
      players: [{ id: 0, name: "Alice" }],
      mode: "classic",
      isFinished: true,
    }).toJSON() as Record<string, unknown>;

    expect(json.id).toBe(id.toString());
    expect(json._id).toBeUndefined();
    expect(json.isFinished).toBe(true);
  });

  it("normalizes false isFinished values", () => {
    const json = new Game({
      players: [{ id: 0, name: "Alice" }],
      mode: "classic",
      isFinished: false,
    }).toJSON() as Record<string, unknown>;

    expect(json.isFinished).toBe(false);
  });
});
