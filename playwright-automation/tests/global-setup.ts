import { chromium } from "@playwright/test";

async function globalSetup() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    /*
        Global setup before all test should be done here
    */
    await browser.close();
}

export default globalSetup;
