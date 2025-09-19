---
name: Add-Api-Test
description: Convert raw Playwright API test steps into proper structure using the specialized API testing agent
---

I have collection of Javascript API fetch steps that need to be converted into proper Playwright test structure. Here are the test steps:

{{prompt}}

Please use the playwright-api-engineer agent to analyze these Playwright API test steps and organize them into the existing structure at `playwright-automation/tests/api`. The agent should:

1. **Analyze the provided API test steps** to identify:

   - Which API endpoints are involved in the test
   - What request/response data needs to be handled
   - What authentication is required
   - What assertions are being performed

2. **Create or update API helpers** in `playwright-automation/tests/api/helpers/`:

   - Create new helper classes if needed (following existing naming conventions)
   - Add request builders and response handlers
   - Follow the existing API testing patterns

3. **Create or update test utilities** in `playwright-automation/tests/api/utils/`:

   - Create reusable utility functions
   - Group related API operations into logical utilities
   - Follow existing utility naming conventions

4. **Create the final API test** in `playwright-automation/tests/api/specs/`:
   - Convert raw API test steps into clean, structured test
   - Use proper test structure and assertions
   - Follow existing API test file patterns

The agent will only work within the `playwright-automation/tests/api` folder and must follow the existing API testing architecture and code formatting standards.
