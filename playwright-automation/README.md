# Playwright Automation Framework

A comprehensive TypeScript-based testing framework built on Playwright that supports both frontend (UI) and API testing with advanced reporting, CI integration, and Slack notifications.

## 🚀 Overview

This framework provides a robust testing solution that:
- Runs frontend and API tests in parallel or separately
- Generates separate reports by test type with merged HTML output
- Integrates with CI/CD pipelines
- Sends automated Slack notifications with test results
- Supports multiple environments and browsers
- Implements layered API testing architecture
- Provides comprehensive logging and debugging capabilities

## 📁 Project Structure

```
playwright-automation/
├── tests/                          # Main test directory
│   ├── frontend/
│   │   └── specs/                  # UI test specifications (tagged @FE)
│   ├── api/                        # API testing module
│   │   ├── interfaces/             # TypeScript DTOs for requests/responses
│   │   ├── endpoints/              # Raw HTTP calls using axios
│   │   ├── methods/                # Higher-level domain methods
│   │   └── base-api.ts            # Base class for API modules
│   └── global-setup.ts            # Global test setup configuration
├── utils/                          # Shared utilities and helpers
│   ├── axios-utils/               # Axios wrapper with logging
│   ├── http-client/               # Playwright request wrapper (alternative)
│   ├── logger/                    # log4js configuration
│   ├── reports/                   # Report merging and parsing utilities
│   ├── runner-actions/            # Pre-test cleanup scripts
│   └── slack/                     # Slack integration for notifications
├── logs/                          # Test execution logs (generated)
├── playwright-report/             # HTML and JSON reports (generated)
├── test-results/                  # Playwright test artifacts (generated)
├── playwright.config.ts           # Main Playwright configuration
├── environment.ts                 # Environment configuration and validation
└── package.json                   # Dependencies and scripts
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (16 or above)
- npm (8 or above)
- TypeScript and ts-node (installed globally recommended)

### Installation
```bash
npm install
```

### Environment Configuration
Create a `.env` file in the project root with the following required variables:

```env
ENV=test
BASE_PAGE=https://your-frontend-url.com
BASE_API=https://your-api-url.com
```

Optional environment variables:
```env
USERNAME=your-username
PASSWORD=your-password
```

The framework validates that `BASE_PAGE` and `BASE_API` are properly formatted URLs and enforces `ENV=test` for safety.

## 🎯 Running Tests

### Available Scripts

#### Frontend Tests
```bash
npm run test:fe
```
- Runs UI tests tagged with `@FE`
- Uses Chromium browser in headed mode (local) or headless (CI)
- Tests run against `BASE_PAGE` environment variable

#### API Tests
```bash
npm run test:api
```
- Runs API tests using the dedicated API project configuration
- Tests run against `BASE_API` environment variable
- Uses axios for HTTP calls with comprehensive logging

#### Report Management
```bash
# Merge HTML reports from frontend and API tests
npm run merge-html-report

# Parse JSON reports and send Slack notifications (CI only)
npm run parse-json-report
```

## 🏗️ Test Architecture

### Frontend Testing Pattern
- Tests are located in `tests/frontend/specs/`
- All tests must be tagged with `@FE` for proper filtering
- Uses Playwright's page object model approach
- Supports multiple browsers (Chromium, Firefox, WebKit)

Example structure:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name @FE', () => {
  test('should perform expected behavior', async ({ page }) => {
    await page.goto('/');
    // Test implementation
  });
});
```

### API Testing Pattern
The framework implements a layered architecture for API testing:

1. **Interfaces** (`api/interfaces/`): TypeScript definitions for request/response objects
2. **Endpoints** (`api/endpoints/`): Raw HTTP calls using axios
3. **Methods** (`api/methods/`): Higher-level domain methods that compose endpoints
4. **Base API** (`api/base-api.ts`): Common functionality and URL helpers

Example API test structure:
```typescript
// In endpoints file
export const getUserById = async (id: string) => {
  return await Axios.get(`/users/${id}`);
};

// In methods file
export class UserMethods {
  async createAndVerifyUser(userData: UserData) {
    const response = await createUser(userData);
    expect(response.status).toBe(201);
    return response.data;
  }
}

// In test spec
test.describe('User Management @API', () => {
  const userMethods = new UserMethods();

  test('should create user successfully', async () => {
    const result = await userMethods.createAndVerifyUser(testData);
    expect(result.id).toBeDefined();
  });
});
```

## 🛠️ Utilities & Features

### HTTP Client Options
The framework provides two HTTP client approaches:

1. **Axios Utils** (`utils/axios-utils/`):
   - Request/response interceptors with logging
   - Automatic header management
   - Status code verification
   - File-based request/response logging

2. **HTTP Client Wrapper** (`utils/http-client/`):
   - Playwright request context wrapper
   - Better parallelism and context reuse
   - Normalized response handling

### Logging
- Comprehensive logging using log4js
- Separate log files for different test types
- Request/response logging for API calls
- Console and file output support

### Reporting
- **HTML Reports**: Separate reports for FE and API tests
- **JSON Reports**: Machine-readable format for CI integration
- **Merged Reports**: Combined HTML report for unified view
- **Slack Integration**: Automated notifications with test summaries

### CI/CD Integration
- Environment-aware configuration (local vs CI)
- GitHub Actions integration with run metadata
- Automatic Slack notifications on CI completion
- Configurable timeouts, retries, and workers for CI

## ⚙️ Configuration

### Playwright Configuration
The `playwright.config.ts` file provides:
- Environment-specific settings (local vs CI)
- Multiple browser support with launch options
- Flexible timeout and retry configuration
- Output directory management
- Reporter configuration by test type

### Environment Management
The `environment.ts` file:
- Loads and validates environment variables
- Provides type-safe access to configuration
- Enforces URL format validation
- Supports multiple environment configurations

## 📊 Reporting & Notifications

### HTML Reports
- Generated in `playwright-report/${TEST_TYPE}/`
- Separate reports for frontend and API tests
- Merged report available via `npm run merge-html-report`

### JSON Reports
- Machine-readable format for automation
- Used for Slack notification generation
- Contains detailed test results and metadata

### Slack Integration
- Automated notifications on CI completion
- Includes test summary with pass/fail counts
- Links to GitHub Actions run
- Customizable message templates

## 🔍 Development Guidelines

### Code Quality
- ESLint and Prettier configuration included
- TypeScript strict mode enabled
- Import path resolution configured for relative imports
- Consistent code formatting and linting

### Testing Conventions
- Use descriptive test names and grouping with `test.describe`
- Tag tests appropriately (`@FE` for frontend, `@API` for API)
- Implement proper assertions and error handling
- Follow the layered architecture for API tests

### Best Practices
- Environment variable validation and URL safety
- Separation of concerns in API testing layers
- Comprehensive logging for debugging
- Clean test data and state management
- Proper timeout and retry configuration

## 🚦 Getting Started

1. **Clone and Install**:
   ```bash
   git clone [repository]
   cd playwright-automation
   npm install
   ```

2. **Configure Environment**:
   Create `.env` file with required variables

3. **Run Tests**:
   ```bash
   # Run all frontend tests
   npm run test:fe

   # Run all API tests
   npm run test:api
   ```

4. **View Reports**:
   ```bash
   # Generate merged HTML report
   npm run merge-html-report
   ```

5. **CI Integration**:
   Configure environment variables in your CI system and run the parse report script for Slack notifications

## 🤝 Contributing

- Follow the established patterns for test organization
- Use the provided utilities and helpers
- Maintain the layered architecture for API tests
- Add appropriate logging and error handling
- Update documentation for new features or patterns
