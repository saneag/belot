import { expect, test } from "@playwright/test";

test("Team game", async ({ page }) => {
  await page.goto("/");

  // Click new game button
  await page.getByTestId("starting-page-button-1").click();

  // Click 4 players button
  await page.getByTestId("players-count-button-4").click();

  // Fill players names
  await page.getByTestId("players-names-input-0").fill("Alice");
  await page.getByTestId("players-names-input-1").fill("Bob");
  await page.getByTestId("players-names-input-2").fill("Charlie");
  await page.getByTestId("players-names-input-3").fill("David");

  // Submit opens the dealer selection dialog
  await page.getByTestId("players-submit-button").click();

  // Select dealer and confirm
  const dealerDialog = page.getByRole("dialog", { name: "Select the dealer" });
  await dealerDialog.getByTestId("dealer-select-dialog-button-0").click();
  await page.getByTestId("confirmation-dialog-confirm-button").click();

  await expect(page).toHaveURL(/\/game-table/);
  await expect(page.getByTestId("current-dealer")).toHaveText("Dealer: Alice");
  await expect(page.getByTestId("game-table-header-player-N")).toHaveClass(/bg-success/);

  // Click next round button
  await page.getByTestId("next-round-button").click();

  // Select round player
  await page.getByTestId("round-player-select-0").click();
  await expect(page.getByTestId("round-player-display")).toHaveText("Alice played this round");

  // Should add 2 points to round's score
  await page.getByTestId("round-score-select-button-+20").click();
  await expect(page.getByTestId("round-score-display")).toHaveText("Round's score: 18");

  // Should fill the score input for the opponent team and confirm the round score
  await page.getByTestId("round-score-player-input-1").fill("45");
  await page.getByTestId("confirmation-dialog-confirm-button").click();

  // Should update the dealer to the next player
  await expect(page.getByTestId("current-dealer")).toHaveText("Dealer: Bob");

  // Should display the round score for each team
  const roundScoreRow = page.getByTestId("game-table-round-0");
  await expect(roundScoreRow.getByTestId("round-score-0")).toHaveText("14");
  await expect(roundScoreRow.getByTestId("round-score-1")).toHaveText("4");
  await expect(roundScoreRow.getByTestId("total-round-score-0")).toHaveText("18");

  // Should display the current round score for each team
  await expect(roundScoreRow.getByTestId("current-round-score-0")).toHaveText("+14");
  await expect(roundScoreRow.getByTestId("current-round-score-1")).toHaveText("+4");

  // Should add next round and update the dealer to the next player
  await page.getByTestId("next-round-button").click();
  await page.getByTestId("round-player-select-1").click();
  await page.getByTestId("round-score-select-button-+200").click();
  await page.getByTestId("round-score-player-input-0").fill("57");
  await page.getByTestId("confirmation-dialog-confirm-button").click();
  await expect(page.getByTestId("current-dealer")).toHaveText("Dealer: Charlie");

  // Should display the round score for each player
  const roundScoreRow2 = page.getByTestId("game-table-round-1");
  await expect(roundScoreRow2.getByTestId("round-score-0")).toHaveText("20");
  await expect(roundScoreRow2.getByTestId("round-score-1")).toHaveText("34");
  await expect(roundScoreRow2.getByTestId("total-round-score-1")).toHaveText("36");

  // Should display the current round score for each teams
  await expect(roundScoreRow2.getByTestId("current-round-score-0")).toHaveText("+6");
  await expect(roundScoreRow2.getByTestId("current-round-score-1")).toHaveText("+30");

  // Should skip round and update the dealer to the next player
  await page.getByTestId("skip-round-button").click();
  await page.getByTestId("confirmation-dialog-confirm-button").click();
  await expect(page.getByTestId("current-dealer")).toHaveText("Dealer: David");

  // Should display the round score for each team
  const roundScoreRow3 = page.getByTestId("game-table-round-2");
  await expect(roundScoreRow3.getByTestId("round-score-0")).toHaveText("20");
  await expect(roundScoreRow3.getByTestId("round-score-1")).toHaveText("34");
  await expect(roundScoreRow3.getByTestId("total-round-score-2")).toHaveText("36");
});
