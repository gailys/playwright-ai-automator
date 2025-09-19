---
name: Prepare-new-environment
description: Set up a new development environment with comprehensive Playwright testing infrastructure
---

I need to prepare a new development environment for Playwright testing, Codex must confirm that only files I asked was created. Please set up the complete testing infrastructure:

{{prompt}}

## ENVIRONMENT VARIABLE DETECTION:

First, check what variables are available in `playwright-automation/.env` file and create tasks based on available variables:

```bash
# Check which environment variables exist (ignore comments and blank lines)
echo "Available environment variables:"
awk -F= '/^(BASE_PAGE|BASE_API)=/{print $1 ": " $2}' playwright-automation/.env 2>/dev/null || echo "No .env file found or no matching variables"
echo ""
echo "Variables to configure tasks for:"
awk -F= '/^(BASE_PAGE|BASE_API)=/{print $1}' playwright-automation/.env 2>/dev/null | sort -u || echo "None found"
```

## DYNAMIC TASK CREATION:

Wait for `playwright-automation/.env` to be available, then based on which environment variables are found in .env file, create the appropriate tasks. Only create tasks for the variable that exists, not always it's going to be both!

**If BASE_PAGE exists:** Include frontend testing tasks:

- Set up frontend testing infrastructure for BASE_PAGE
- Create E2E tests for user interface testing
- Set up Page Object Model (POM) architecture with base classes
- Create page object classes following inheritance patterns
- Configure visual regression testing
- Set up accessibility testing
- Set up browsers projects in playwright.config.js as described in allowed changes

**If BASE_API exists:** Include API testing tasks:

- Set up API testing infrastructure for BASE_API
- Create API endpoint validation tests
- Set up request/response testing utilities
- Configure API load testing
- Set up API authentication testing
- Set up api project in playwright.config.js as described in allowed changes

## MANDATORY NEW ENVIRONMENT ACTIONS:

**When "New Environment" is selected, ALWAYS perform these actions in order:**

1. **Analyze Environment Variables**:

   - Read existing `playwright-automation/.env` file
   - Identify which variables (BASE_PAGE, BASE_API) are present
   - Create appropriate task sections based on available variables

2. **Remove Existing Tests**: TASK FOR CLAUDE:

   - **AUTOMATICALLY DELETE WITHOUT CONFIRMATION**: Proceed with deletion immediately
   - **PRESERVE global-setup.ts**: Do NOT modify or delete the existing `playwright-automation/tests/global-setup.ts` file
   - **ONLY WORK IN**: `playwright-automation/tests` directory - NO changes outside this directory
   - Delete ONLY the `api/` and `frontend/` folders in `playwright-automation/tests` directory
   - Ensure completely fresh testing environment for API and Frontend folders only
   - File: `playwright.config.ts` cannot be modified!

3. **Create Variable-Specific Validation Tests**: TASK FOR CLAUDE:
   - If BASE_PAGE exists: Create basic page responsiveness test
   - If BASE_API exists: Create basic API responsiveness test
   - Tests should verify endpoints/pages respond correctly (status 200)
   - Use environment variables from existing `.env` file

Please create a comprehensive development environment setup that includes:

## Environment Setup Requirements:

1. **Project Structure**: Create organized directory structure following the established pattern:

   ```
   tests/
   ├── global-setup.ts              # PRESERVE EXISTING - Do NOT modify this file
   ├── frontend/                    # WORK ONLY IN THIS FOLDER - layered architecture
   │   ├── pages/                   # Page Object Model classes
   │   │   ├── base-page.ts         # Abstract base page class
   │   │   └── *.page.ts            # Specific page object classes
   │   ├── methods/                 # Higher-level frontend business logic
   │   │   └── *.methods.ts         # Page interaction methods
   │   └── specs/                   # Frontend test specifications (@FE tagged)
   │       └── *.spec.ts
   ├── api/                         # WORK ONLY IN THIS FOLDER - layered architecture
   │   ├── base-api.ts             # Base class for API modules
   │   ├── interfaces/             # TypeScript DTOs for requests/responses
   │   │   └── *.interfaces.ts
   │   ├── endpoints/              # Raw HTTP calls using axios
   │   │   └── *.api.ts
   │   ├── methods/                # Higher-level domain methods
   │   │   └── *.methods.ts
   │   └── specs/                  # API test specifications (@API tagged)
   │       └── *.spec.ts
   ```

   **IMPORTANT RESTRICTIONS:**

   - **ONLY WORK** IMPORTANT! within `playwright-automation/tests/` folder
   - **NO CHANGES OUTSIDE** IMPORTANT! `playwright-automation/tests` folder
   - **DO NOT** modify or delete `tests/global-setup.ts`, except project part.
   - **IDENTICAL STRUCTURE** must be maintained as shown in examples
   - **EXACT FILE NAMES structure** must match the structure, example - must be treated as a page or feature, like login, cart, account: base-page.ts, example-page.ts, base-api.ts, example.interfaces.ts, example-api.ts, example.methods.ts, example-page.methods.ts, example-page.spec.ts, example.spec.ts

2. **Playwright Configuration**: Set up `playwright.config.ts` with:

   - Multi-browser testing (Chrome, Firefox, Safari, Edge)
   - Mobile device emulation configs
   - Parallel execution settings
   - Test reporting configuration
   - Screenshot and video capture settings
   - Base URL and timeout configurations
   - Environment-specific settings

3. **Environment Variables**: Use existing `.env` file variables:

   - Use BASE_PAGE if available for frontend testing
   - Use BASE_API if available for API testing
   - Test user credentials (if needed)
   - Environment-specific configurations

4. **TypeScript Configuration**: Set up proper TypeScript support:

   - `tsconfig.json` for test files
   - Type definitions for Playwright
   - Strong typing for test utilities
   - Interface definitions for test data

5. **Package Dependencies**: Install and configure:

   - Latest Playwright packages
   - TypeScript and related dependencies
   - Testing utilities and assertion libraries
   - Reporting and debugging tools
   - CI/CD integration packages

6. **Utility Infrastructure**: Create foundational utilities:

   - Base page object class
   - Common test helpers and assertions
   - Data generation utilities
   - Environment configuration loader
   - Logging and debugging helpers

7. **Validation Tests** (MANDATORY for new environments - MINIMAL SETUP):

   - If BASE_PAGE exists: Create ONE basic page responsiveness test and ONE simple element validation test
   - If BASE_API exists: Create ONE basic API responsiveness test and ONE simple endpoint validation test
   - Keep tests simple and minimal for initial setup validation only

8. **Minimal Initial Templates** (Create simple validation tests only):

   **Allowed Project Setup Changes In `playwright-automation/playwright.config.ts`**

Changes allowed only in projects:[] end only could be used examples provided below:

**For Frontend Tests**

```typescript
{
  name: "chromium",
  use: {
    ...devices["Desktop Chrome"],
    headless: process.env.CI ? true : false,
    launchOptions: {
      args: process.env.CI
        ? [
            "--no-sandbox",
            "--headless",
            "--disable-gpu",
            "--disable-dev-shm-usage",
          ]
        : [],
    },
  },
},

{
  name: "firefox",
  use: {
    ...devices["Desktop Firefox"],
    headless: process.env.CI ? true : false,
    launchOptions: {
      args: process.env.CI
        ? ["--no-sandbox", "--headless", "--disable-gpu"]
        : [],
    },
  },
},

{
  name: "webkit",
  use: {
    ...devices["Desktop Safari"],
    headless: process.env.CI ? true : false,
    launchOptions: {
      args: process.env.CI
        ? ["--no-sandbox", "--headless", "--disable-gpu"]
        : [],
    },
  },
},
```

**For API Tests**

```typescript
{
  name: "API",
  use: {
    baseURL: environment.apiUrl,
  },
},
```

**Frontend Test Structure with Page Object Model** (`tests/frontend/`) - MINIMAL:

**Base Page Class** (`playwright-automation/tests/frontend/pages/base-page.ts`):

```typescript
import { Page, Locator } from "@playwright/test";

export abstract class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = "") {
    this.page = page;
    this.url = url;
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) || "";
  }

  async waitForElement(locator: Locator): Promise<void> {
    await locator.waitFor();
  }
}
```

**Example Page Object** (`playwright-automation/tests/frontend/pages/home-page.ts`):

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

export class HomePage extends BasePage {
  private readonly headerTitle: Locator;
  private readonly mainContent: Locator;
  private readonly navigationMenu: Locator;
  private readonly body: Locator;

  constructor(page: Page) {
    super(page, "/");
    this.headerTitle = page.locator('h1, [role="heading"]').first();
    this.mainContent = page.locator("main, .main-content, #main");
    this.navigationMenu = page.locator('nav, [role="navigation"]');
    this.body = page.locator("body");
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
```

**Frontend Methods Layer** (`playwright-automation/tests/frontend/methods/home-page.methods.ts`):

```typescript
import { Page } from "@playwright/test";
import { HomePage } from "../pages/home-page";

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
      hasTitle: title.length > 0,
    };
  }

  async validateMainContent(): Promise<boolean> {
    return await this.homePage.isBodyVisible();
  }
}
```

**Frontend Test Spec** (`playwright-automation/tests/frontend/specs/home-page.spec.ts`):

```typescript
import { test, expect } from "@playwright/test";
import { HomePageMethods } from "../methods/home-page.methods";

test.describe("Basic Page Validation", () => {
  let homePageMethods: HomePageMethods;

  test.beforeEach(async ({ page }) => {
    homePageMethods = new HomePageMethods(page);
    await homePageMethods.navigateToHomePage();
  });

  test("should load page successfully @FE", async () => {
    const pageInfo = await homePageMethods.validatePageLoad();
    expect(pageInfo.hasTitle).toBe(true);
    expect(pageInfo.title.length).toBeGreaterThan(0);
  });

  test("should verify main element exists @FE", async () => {
    const hasMainContent = await homePageMethods.validateMainContent();
    expect(hasMainContent).toBe(true);
  });
});
```

**Page Object Model Best Practices:**

- **Inheritance**: All page objects extend `BasePage` for common functionality
- **Encapsulation**: Locators are private, actions are public methods
- **Readability**: Method names clearly describe user actions
- **Maintainability**: Changes to UI elements only require updates in page objects
- **Reusability**: Page objects can be used across multiple test files

**Additional POM Example (Generic Form):**

**Generic Form Page Object** (`playwright-automation/tests/frontend/pages/generic-form.page.ts`):

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

export class GenericFormPage extends BasePage {
  private readonly formRoot: Locator;
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly submitButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page, ""); // use current page
    this.formRoot = page.locator("form").first();
    this.nameInput = this.formRoot
      .locator('input[name*="name" i], input[id*="name" i], input[type="text"]')
      .first();
    this.emailInput = this.formRoot
      .locator(
        'input[type="email"], input[name*="email" i], input[id*="email" i]'
      )
      .first();
    this.submitButton = this.formRoot
      .locator('button[type="submit"], [role="button"], input[type="submit"]')
      .first();
    this.errorMessage = this.formRoot
      .locator('[role="alert"], .error, .validation-error')
      .first();
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) || "";
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
```

**API Testing Architecture** - MINIMAL layered approach:

**Interfaces** (`playwright-automation/tests/api/interfaces/`) - MINIMAL:

```typescript
// account.interfaces.ts
export interface ApiResponse<T = any> {
  [key: string]: any;
}
```

**Base API Class** (`playwright-automation/tests/api/base-api.ts`):

```typescript
import { EndpointType, getHeader } from "../../utils/axios-utils/axios-wrapper";
import environment from "../../environment";

export abstract class BaseAPI {
  protected baseURL: string;
  protected endpoint: string;

  constructor(baseURL?: string, endpoint: string = "") {
    this.baseURL = baseURL ?? environment.apiUrl;
    this.endpoint = endpoint;

    if (!this.baseURL) {
      throw new Error(
        "API base URL not configured. Check environment.apiUrl setting."
      );
    }
  }

  protected getFullUrl(path: string = ""): string {
    try {
      return new URL(path || this.endpoint, this.baseURL).toString();
    } catch (error) {
      throw new Error(
        `Invalid URL construction: base="${this.baseURL}", path="${
          path || this.endpoint
        }". ${error}`
      );
    }
  }

  protected getHeaders(endpointType: EndpointType): any {
    return getHeader(endpointType);
  }
}
```

**Endpoints** (`playwright-automation/tests/api/endpoints/`) - MINIMAL:

```typescript
// account-api.ts
import axios from "axios";
import {
  EndpointType,
  getHeader,
} from "../../../utils/axios-utils/axios-wrapper";
import environment from "../../../environment";
import { ApiResponse } from "../interfaces/account.interfaces";

// Single basic endpoint for validation (works with any BASE_API)
export const getAccountEndpoint = async (
  path: string = ""
): Promise<ApiResponse> => {
  try {
    const url = new URL(path, environment.apiUrl).toString();
    const response = await axios.get(url, {
      headers: getHeader(EndpointType.NotAuthorisedCustomer),
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};
```

**Methods** (`playwright-automation/tests/api/methods/`) - MINIMAL:

```typescript
// account.methods.ts
import { ApiResponse } from "../interfaces/account.interfaces";
import * as AccountEndpoints from "../endpoints/account-api";

export class AccountMethods {
  /**
   * Basic API connectivity test
   */
  async testBasicConnectivity(path: string = ""): Promise<ApiResponse> {
    return await AccountEndpoints.getAccountEndpoint(path);
  }
}
```

**API Test Specs** (`playwright-automation/tests/api/specs/`) - MINIMAL:

```typescript
// account.spec.ts
import { test, expect } from "@playwright/test";
import { AccountMethods } from "../methods/account.methods";

test.describe("Basic API Validation", () => {
  let accountMethods: AccountMethods;

  test.beforeEach(() => {
    accountMethods = new AccountMethods();
  });

  test("should verify API is accessible @API", async () => {
    // Basic connectivity test
    const response = await accountMethods.testBasicConnectivity();

    // Simple validation that we got some response
    expect(response).toBeDefined();
  });
});
```

**IMPORTANT - Global Setup File Handling:**

- **DO NOT CREATE** a new `playwright-automation/tests/global-setup.ts` file
- **DO NOT MODIFY** the existing `playwright-automation/tests/global-setup.ts` file
- **PRESERVE EXISTING** global-setup.ts file as-is
- The existing global setup file will handle environment validation

9. **CI/CD Integration**: Set up configuration for:

   - GitHub Actions workflow (if applicable)
   - Docker configuration for testing
   - Test result reporting
   - Artifact collection (screenshots, videos)

10. **Documentation**: Create essential documentation:

- README with setup instructions
- Testing best practices guide
- Environment configuration guide
- Troubleshooting guide

11. **Quality Assurance Setup**:
    - ESLint configuration for test files
    - Prettier formatting setup
    - Pre-commit hooks for code quality
    - Test coverage reporting

Please analyze the current directory structure and create a MINIMAL Playwright testing environment with basic validation tests only.

**IMPORTANT - MINIMAL SETUP REQUIREMENTS:**

- Create only ONE test file per folder (frontend/specs/ and api/specs/)
- Each test file should contain exactly 2 simple validation tests
- For frontend: Create `pages/`, `methods/`, and `specs/` directories following layered architecture
- Keep all code examples minimal and focused on basic connectivity/validation
- Do NOT create comprehensive test suites - this is for initial environment validation only
- Follow the established layered architecture but with minimal content
- Use Page Object Model pattern for frontend tests (inheritance-based approach)

Ensure the setup follows current best practices but keeps everything minimal for initial validation.
