---
name: Add-Frontend-Test
description: Convert raw Playwright test steps into proper POM structure using the specialized frontend testing agent
---

I have Playwright test steps that need to be converted into proper Page Object Model structure. Here are the test steps:

{{prompt}}

Please use the playwright-frontend-engineer agent to analyze these Playwright test steps and organize them into the existing POM structure at `playwright-automation/tests/frontend`. The agent should:

1. **Analyze the provided test steps** to identify:
   - Which pages are involved in the test
   - What elements need to be interacted with
   - What actions are being performed

2. **Create or update page objects** in `playwright-automation/tests/frontend/pages/`:
   - Create new page classes if needed (following existing naming conventions)
   - Add element locators for all interacted elements
   - Follow the existing BasePage pattern

3. **Create or update methods** in `playwright-automation/tests/frontend/methods/`:
   - Create reusable interaction methods
   - Group related actions into logical methods
   - Follow existing method naming conventions

4. **Create the final test** in `playwright-automation/tests/frontend/specs/`:
   - Convert raw Playwright steps into clean POM-based test
   - Use proper test structure and assertions
   - Follow existing test file patterns

The agent will only work within the `playwright-automation/tests/frontend` folder and must follow the existing POM architecture and code formatting standards.