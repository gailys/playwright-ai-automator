---
name: Prepare-new-environment
description: Set up a new development environment with comprehensive Playwright testing infrastructure
---

I need to prepare a new development environment for Playwright testing. Please set up the complete testing infrastructure:

{{prompt}}

## ENVIRONMENT VARIABLE DETECTION:

First, check what variables are available in `playwright-automation/.env` file and create tasks based on available variables:

```bash
# Check which environment variables exist (ignore comments and blank lines)
echo "Available environment variables:"
awk -F= '/^(BASE_URL|BASE_API|API_DOCUMENTATION)=/{print $1 ": " $2}' playwright-automation/.env 2>/dev/null || echo "No .env file found or no matching variables"
echo ""
echo "Variables to configure tasks for:"
awk -F= '/^(BASE_URL|BASE_API|API_DOCUMENTATION)=/{print $1}' playwright-automation/.env 2>/dev/null | sort -u || echo "None found"
```

## DYNAMIC TASK CREATION:

Based on which environment variables are found, create the appropriate tasks:

**If BASE_URL exists:** Include frontend testing tasks:
- Set up frontend testing infrastructure for BASE_URL
- Create E2E tests for user interface testing
- Set up page object models for frontend components
- Configure visual regression testing
- Set up accessibility testing

**If BASE_API exists:** Include API testing tasks:
- Set up API testing infrastructure for BASE_API
- Create API endpoint validation tests
- Set up request/response testing utilities
- Configure API load testing
- Set up API authentication testing

**If API_DOCUMENTATION exists:** Include API documentation tasks:
- Parse and analyze API documentation at API_DOCUMENTATION
- Generate API test cases based on documentation
- Create API contract testing
- Set up OpenAPI/Swagger validation tests
- Generate API mocking utilities

## MANDATORY NEW ENVIRONMENT ACTIONS:

**When "New Environment" is selected, ALWAYS perform these actions in order:**

1. **Analyze Environment Variables**:
   - Read existing `playwright-automation/.env` file
   - Identify which variables (BASE_URL, BASE_API, API_DOCUMENTATION) are present
   - Create appropriate task sections based on available variables

2. **Remove Existing Tests**: TASK FOR CLAUDE:
   - **IMPORTANT**: Ask for confirmation before deletion
   - Delete all existing test files in `playwright-automation/tests` directory
   - Remove any old test configurations in `playwright-automation/`
   - Clean up previous test artifacts and reports in `playwright-automation/`
   - Ensure completely fresh testing environment

3. **Create Variable-Specific Validation Tests**: TASK FOR CLAUDE:
   - If BASE_URL exists: Create basic page responsiveness test
   - If BASE_API exists: Create basic API responsiveness test
   - If API_DOCUMENTATION exists: Create documentation accessibility test
   - Tests should verify endpoints/pages respond correctly (status 200)
   - Use environment variables from existing `.env` file

Please create a comprehensive development environment setup that includes:

## Environment Setup Requirements:

1. **Project Structure**: Create organized directory structure:
   - `/tests` - Main test directory
   - `/tests/api` - API test files
   - `/tests/e2e` - End-to-end test files
   - `/tests/utils` - Shared utilities and helpers
   - `/tests/fixtures` - Test data and fixtures
   - `/tests/pages` - Page Object Model classes
   - `/tests/config` - Test configuration files

2. **Playwright Configuration**: Set up `playwright.config.ts` with:
   - Multi-browser testing (Chrome, Firefox, Safari, Edge)
   - Mobile device emulation configs
   - Parallel execution settings
   - Test reporting configuration
   - Screenshot and video capture settings
   - Base URL and timeout configurations
   - Environment-specific settings

3. **Environment Variables**: Use existing `.env` file variables:
   - Use BASE_URL if available for frontend testing
   - Use BASE_API if available for API testing
   - Use API_DOCUMENTATION if available for documentation-based testing
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

7. **Validation Tests** (MANDATORY for new environments):
   - If BASE_URL exists: Basic page responsiveness test
   - If BASE_API exists: Basic API responsiveness test
   - If API_DOCUMENTATION exists: Documentation accessibility test
   - Simple connectivity verification tests for available endpoints

8. **Example Test Templates**: Provide additional starter templates:
   - Advanced E2E test examples
   - Complex API test examples
   - Page object model examples
   - Test data fixture examples
   - Configuration examples

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

Please analyze the current directory structure and create a complete, production-ready Playwright testing environment with all necessary configurations, utilities, and examples. Ensure the setup follows current best practices and is ready for immediate use.