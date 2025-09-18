/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import path from "path";
import environment from "./environment";
const ENV = process.env.ENV;
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
    // Global Setup to run before all tests
    globalSetup: path.join(__dirname, `./tests/global-setup.ts`),
    //
    // //Global Teardown to run after all tests
    // globalTeardown: `./global-teardown`,

    testDir: "./tests",
    /* Maximum time one test can run for. */
    timeout: process.env.CI ? 360 * 1000 : 280 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 30000,
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters open: 'always', 'never' and 'on-failure' (default) */
    reporter: [
        [
            "html",
            {
                open: "never",
                outputFolder: `playwright-report/${process.env.TEST_TYPE}/`,
            },
        ],
        [
            "json",
            {
                outputFile: `playwright-report/json/${process.env.TEST_TYPE}.json`,
            },
        ],
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 30000,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: environment.baseUrl,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: process.env.CI ? "off" : "retain-on-failure",
        /* Headless mode only in CI environment */
        headless: process.env.CI ? true : false,
        /* Viewport resolution of FE tests */
        viewport: { width: 1280, height: 720 },
        /* Take screenshots when tests are failing */
        screenshot: "only-on-failure",
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                headless: process.env.CI ? true : false,
                launchOptions: {
                    args: process.env.CI ? ["--no-sandbox", "--headless", "--disable-gpu", "--disable-dev-shm-usage"] : [],
                },
            },
        },

        {
            name: "firefox",
            use: {
                ...devices["Desktop Firefox"],
                headless: process.env.CI ? true : false,
                launchOptions: {
                    args: process.env.CI ? ["--no-sandbox", "--headless", "--disable-gpu"] : [],
                },
            },
        },

        {
            name: "webkit",
            use: {
                ...devices["Desktop Safari"],
                headless: process.env.CI ? true : false,
                launchOptions: {
                    args: process.env.CI ? ["--no-sandbox", "--headless", "--disable-gpu"] : [],
                },
            },
        },
        {
            name: "API",
            use: {
                baseURL: environment.apiUrl,
            },
        },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: {
        //     ...devices['Pixel 5'],
        //   },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: {
        //     ...devices['iPhone 12'],
        //   },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: {
        //     channel: 'msedge',
        //   },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: {
        //     channel: 'chrome',
        //   },
        // },
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    outputDir: "test-results/",

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   port: 3000,
    // },
};

export default config;
