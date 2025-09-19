import { Page } from '@playwright/test';
import { HomePage } from '../pages/home-page';

export class HomePageMethods {
    private homePage: HomePage;

    constructor(page: Page) {
        this.homePage = new HomePage(page);
    }

    async navigateToHomePage(): Promise<void> {
        await this.homePage.navigate();
        await this.homePage.waitForPageLoad();
    }

    async validatePageLoad(): Promise<{ title: string; hasTitle: boolean }> {
        const title = await this.homePage.getPageTitle();
        return {
            title,
            hasTitle: title.length > 0
        };
    }

    async validateMainContent(): Promise<boolean> {
        return await this.homePage.isBodyVisible();
    }

    async getPageInfo(): Promise<{ title: string; hasMainContent: boolean; hasNavigation: boolean }> {
        const title = await this.homePage.getPageTitle();
        const hasMainContent = await this.homePage.isMainContentVisible() || await this.homePage.isBodyVisible();
        const hasNavigation = await this.homePage.isNavigationVisible();

        return {
            title,
            hasMainContent,
            hasNavigation
        };
    }
}