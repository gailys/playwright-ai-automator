import { test, expect } from '@playwright/test';

test.describe('Home Page Tests', () => {
    test('should load home page successfully @FE', async ({ page }) => {
        // Navigate to the home page
        await page.goto('/');

        // Simple check that page loads and has a title
        await expect(page).toHaveTitle(/.+/);
    });
});
