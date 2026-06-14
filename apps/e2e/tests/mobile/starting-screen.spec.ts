import { expect, test } from "@playwright/test";

test("starting screen renders the app title", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Belot-score")).toBeVisible();
});
