import mongoose from "mongoose";
import { describe, expect, it } from "vitest";

import Game from "../../schemas/game-schema";

type TransformRet = Record<string, unknown> & { _id?: string };

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

  it("serializes non-object _id values in the toJSON transform", () => {
    const transform = Game.schema.get("toJSON")?.transform;
    const ret: TransformRet = {
      _id: "raw-id",
      isFinished: undefined,
    };

    expect(typeof transform).toBe("function");
    if (typeof transform === "function") {
      const transformRecord = transform as unknown as (
        doc: unknown,
        ret: TransformRet,
        options: Record<string, never>,
      ) => void;

      transformRecord(new Game(), ret, {});
    }

    expect(ret.id).toBe("raw-id");
    expect(ret._id).toBeUndefined();
    expect(ret.isFinished).toBe(false);
  });
});
