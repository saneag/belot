import { StorageKeys } from "@belot/constants";

import { expect, test } from "@playwright/test";

import { mockFeatureToggles } from "../../mocks/featureTogglesMocks";
import { mockRoundsScores, mockTeamsPlayers } from "../../mocks/gameMocks";
import { mockSettings } from "../../mocks/settingsMocks";

test("starting page renders the app title", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Belot-score" })).toBeVisible();
});

test.describe("starting page buttons", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      (storageData) => {
        for (const [key, value] of Object.entries(storageData)) {
          localStorage.setItem(key, value);
        }
      },
      {
        [StorageKeys.players]: JSON.stringify(mockTeamsPlayers),
        [StorageKeys.dealer]: JSON.stringify(mockTeamsPlayers[0]),
        [StorageKeys.roundsScores]: JSON.stringify(mockRoundsScores),
        [StorageKeys.timerStartTime]: "1718539200000",
        [StorageKeys.settings]: JSON.stringify(mockSettings),
        [StorageKeys.featureToggles]: JSON.stringify(mockFeatureToggles),
      },
    );

    await page.goto("/");
  });

  test("continue last game button navigates to game-table", async ({ page }) => {
    await page.getByTestId("starting-page-button-0").click();
    await expect(page).toHaveURL("/game-table");
  });

  test("new game button navigates to players-selection", async ({ page }) => {
    await page.getByTestId("starting-page-button-1").click();
    await expect(page).toHaveURL("/players-selection");
  });

  test("settings button navigates to settings", async ({ page }) => {
    await page.getByTestId("starting-page-button-2").click();
    await expect(page).toHaveURL("/settings");
  });
});
