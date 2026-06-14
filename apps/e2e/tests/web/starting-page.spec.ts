import { expect, test } from "@playwright/test";

test("starting page renders the app title", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Belot-score" })).toBeVisible();
});
