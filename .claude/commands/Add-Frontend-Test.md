---
name: Add-Frontend-Test
description: Create comprehensive Playwright TypeScript frontend E2E tests with the specialized frontend testing agent
---

I need to create frontend E2E tests using the Playwright Frontend Engineer agent. Here's what I want to test:

{{prompt}}

Please use the Playwright Frontend Engineer agent to create comprehensive TypeScript frontend tests that include:

## Test Requirements:
1. **Environment Integration**: Use environment variables from `playwright-automation/.env` if available:
   - BASE_URL for the application base URL
   - BASE_API for API endpoint base URL (for network mocking/validation)
   - API_DOCUMENTATION for understanding API interactions

2. **Page Object Model**: Create maintainable test structure with:
   - Page object classes for different application pages
   - Reusable component objects for common UI elements
   - Proper element selectors and locators
   - Action methods and assertion helpers

3. **E2E Testing Coverage**:
   - User journey testing (login, navigation, workflows)
   - Form interactions and validation
   - UI component behavior testing
   - Cross-browser compatibility considerations
   - Responsive design testing
   - Accessibility testing integration

4. **Advanced Testing Features**:
   - Network request interception and mocking
   - File upload/download testing
   - Drag and drop interactions
   - Keyboard and mouse event simulation
   - Cookie and local storage management
   - Screenshot and visual regression testing

5. **TypeScript Implementation**:
   - Strong typing for page objects and test data
   - Interface definitions for test configurations
   - Type-safe element interactions
   - Proper async/await patterns

6. **Test Configuration**:
   - Multi-browser testing setup (Chrome, Firefox, Safari, Edge)
   - Mobile device emulation
   - Parallel test execution
   - Test reporting with screenshots/videos
   - CI/CD integration considerations

7. **Best Practices**:
   - Test data management and cleanup
   - Stable element selection strategies
   - Wait strategies for dynamic content
   - Error handling and retry mechanisms
   - Performance testing integration
   - Maintainable test organization

Please analyze the frontend testing requirements and create a complete E2E testing solution using Playwright TypeScript with specialized frontend testing expertise.