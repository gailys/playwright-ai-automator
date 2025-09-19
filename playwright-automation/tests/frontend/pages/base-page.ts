import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
    protected page: Page;
    protected url: string;

    constructor(page: Page, url: string = '') {
        this.page = page;
        this.url = url;
    }

    async navigate(): Promise<void> {
        await this.page.goto(this.url);
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async isVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }

    async getText(locator: Locator): Promise<string> {
        return await locator.textContent() || '';
    }

    async waitForElement(locator: Locator): Promise<void> {
        await locator.waitFor();
    }
}