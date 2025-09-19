import { test, expect } from "@playwright/test";
import { HomePageMethods } from "../methods/home-page.methods";

test.describe("Home Page Tests", () => {
  let homePageMethods: HomePageMethods;

  test.beforeEach(async ({ page }) => {
    homePageMethods = new HomePageMethods(page);
    await homePageMethods.navigateToHomePage();
  });

  test("should load home page successfully @FE", async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");

    // Simple check that page loads and has a title
    await expect(page).toHaveTitle(/.+/);
  });
});
