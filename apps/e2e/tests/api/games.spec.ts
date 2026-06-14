import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("games API", () => {
  test("GET /games returns a paginated list", async ({ request }) => {
    const response = await request.get("/games");

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toMatchObject({
      page: 1,
      limit: 100,
    });
    expect(Array.isArray(body.games)).toBe(true);
    expect(typeof body.total).toBe("number");
  });

  test("POST /games/init creates a game", async ({ request }) => {
    const response = await request.post("/games/init", {
      data: {
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.id).toMatch(/^[a-f0-9]{24}$/);
  });

  test("GET /games/:id returns the created game", async ({ request }) => {
    const createResponse = await request.post("/games/init", {
      data: {
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
      },
    });

    const { id } = await createResponse.json();
    const response = await request.get(`/games/${id}`);

    expect(response.ok()).toBeTruthy();

    const game = await response.json();
    expect(game.id).toBe(id);
    expect(game.players).toHaveLength(2);
  });
});
