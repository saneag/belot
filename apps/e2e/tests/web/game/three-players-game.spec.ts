import { expect, test } from "@playwright/test";

test("Three players game", async ({ page }) => {
  await page.goto("/");

  // Click new game button
  await page.getByTestId("starting-page-button-1").click();

  // Click 3 players button
  await page.getByTestId("players-count-button-3").click();

  // Fill players names
  await page.getByTestId("players-names-input-0").fill("Alice");
  await page.getByTestId("players-names-input-1").fill("Bob");
  await page.getByTestId("players-names-input-2").fill("Charlie");

  // Submit opens the dealer selection dialog
  await page.getByTestId("players-submit-button").click();

  // Select dealer and confirm
  const dealerDialog = page.getByRole("dialog", { name: "Select the dealer" });
  await dealerDialog.getByTestId("dealer-select-dialog-button-0").click();
  await page.getByTestId("confirmation-dialog-confirm-button").click();

  await expect(page).toHaveURL(/\/game-table/);
  await expect(page.getByTestId("current-dealer")).toHaveText("Dealer: Alice");
  await expect(page.getByTestId("game-table-header-player-Alice")).toHaveClass(/bg-success/);

  // Click next round button
  await page.getByTestId("next-round-button").click();

  // Select round player
  await page.getByTestId("round-player-select-0").click();
  await expect(page.getByTestId("round-player-display")).toHaveText("Alice played this round");

  // Should add 2 points to round's score
  await page.getByTestId("round-score-select-button-+20").click();
  await expect(page.getByTestId("round-score-display")).toHaveText("Round's score: 18");

  // Should fill the score input for the opponent player and confirm the round score
  await page.getByTestId("round-score-player-input-1").fill("35");
  await page.getByTestId("round-score-player-input-2").fill("45");
  await page.getByTestId("confirmation-dialog-confirm-button").click();

  // Should update the dealer to the next player
  await expect(page.getByTestId("current-dealer")).toHaveText("Dealer: Bob");

  // Should display the round score for each player
  const roundScoreRow = page.getByTestId("game-table-round-0");
  await expect(roundScoreRow.getByTestId("round-score-0")).toHaveText("11");
  await expect(roundScoreRow.getByTestId("round-score-1")).toHaveText("3");
  await expect(roundScoreRow.getByTestId("round-score-2")).toHaveText("4");
  await expect(roundScoreRow.getByTestId("total-round-score-0")).toHaveText("18");

  // Should display the current round score for each player
  await expect(roundScoreRow.getByTestId("current-round-score-0")).toHaveText("+11");
  await expect(roundScoreRow.getByTestId("current-round-score-1")).toHaveText("+3");
  await expect(roundScoreRow.getByTestId("current-round-score-2")).toHaveText("+4");

  // Should add next round and update the dealer to the next player
  await page.getByTestId("next-round-button").click();
  await page.getByTestId("round-player-select-1").click();
  await page.getByTestId("round-score-select-button-+200").click();
  await page.getByTestId("round-score-player-input-0").fill("57");
  await page.getByTestId("round-score-player-input-2").fill("113");
  await page.getByTestId("confirmation-dialog-confirm-button").click();
  await expect(page.getByTestId("current-dealer")).toHaveText("Dealer: Charlie");

  // Should display the round score for each player
  const roundScoreRow2 = page.getByTestId("game-table-round-1");
  await expect(roundScoreRow2.getByTestId("round-score-0")).toHaveText("17");
  await expect(roundScoreRow2.getByTestId("round-score-1")).toHaveText("22");
  await expect(roundScoreRow2.getByTestId("round-score-2")).toHaveText("15");
  await expect(roundScoreRow2.getByTestId("total-round-score-1")).toHaveText("36");

  // Should display the current round score for each player
  await expect(roundScoreRow2.getByTestId("current-round-score-0")).toHaveText("+6");
  await expect(roundScoreRow2.getByTestId("current-round-score-1")).toHaveText("+19");
  await expect(roundScoreRow2.getByTestId("current-round-score-2")).toHaveText("+11");

  // Should skip round and update the dealer to the next player
  await page.getByTestId("skip-round-button").click();
  await page.getByTestId("confirmation-dialog-confirm-button").click();
  await expect(page.getByTestId("current-dealer")).toHaveText("Dealer: Alice");

  // Should display the round score for each player
  const roundScoreRow3 = page.getByTestId("game-table-round-2");
  await expect(roundScoreRow3.getByTestId("round-score-0")).toHaveText("17");
  await expect(roundScoreRow3.getByTestId("round-score-1")).toHaveText("22");
  await expect(roundScoreRow3.getByTestId("round-score-2")).toHaveText("15");
  await expect(roundScoreRow3.getByTestId("total-round-score-2")).toHaveText("36");
});
