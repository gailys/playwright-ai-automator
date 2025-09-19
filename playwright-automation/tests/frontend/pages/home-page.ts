import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
    private readonly headerTitle: Locator;
    private readonly mainContent: Locator;
    private readonly navigationMenu: Locator;
    private readonly body: Locator;

    constructor(page: Page) {
        super(page, '/');
        this.headerTitle = page.locator('h1, [role="heading"]').first();
        this.mainContent = page.locator('main, .main-content, #main');
        this.navigationMenu = page.locator('nav, [role="navigation"]');
        this.body = page.locator('body');
    }

    async getHeaderText(): Promise<string> {
        await this.waitForElement(this.headerTitle);
        return await this.getText(this.headerTitle);
    }

    async isMainContentVisible(): Promise<boolean> {
        return await this.isVisible(this.mainContent);
    }

    async isNavigationVisible(): Promise<boolean> {
        return await this.isVisible(this.navigationMenu);
    }

    async isBodyVisible(): Promise<boolean> {
        return await this.isVisible(this.body);
    }

    async getPageTitle(): Promise<string> {
        return await this.getTitle();
    }
}