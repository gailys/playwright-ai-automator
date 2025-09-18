---
name: Add-Api-Test
description: Create comprehensive Playwright TypeScript API tests with the specialized API testing agent
---

I need to create API tests using the Playwright API Engineer agent. Here's what I want to test:

{{prompt}}

Please use the Playwright API Engineer agent to create comprehensive TypeScript API tests that include:

## Test Requirements:
1. **Environment Integration**: Use environment variables from `playwright-automation/.env` if available:
   - BASE_URL for the application base URL
   - BASE_API for API endpoint base URL
   - API_DOCUMENTATION for reference documentation

2. **Test Structure**: Create well-organized test files with:
   - Proper imports and setup
   - Page Object Model patterns for API endpoints
   - Reusable utility functions
   - Clear test descriptions and organization

3. **API Testing Coverage**:
   - Request/response validation
   - Status code verification
   - Response schema validation
   - Error handling and edge cases
   - Authentication flows (if applicable)
   - Data-driven test scenarios

4. **TypeScript Implementation**:
   - Strong typing for API responses
   - Interface definitions for request/response data
   - Type-safe test utilities
   - Proper async/await handling

5. **Test Configuration**:
   - Playwright configuration for API testing
   - Environment-specific settings
   - Test data management
   - Reporting and debugging setup

6. **Best Practices**:
   - Test isolation and cleanup
   - Proper assertions and validations
   - Performance considerations
   - Maintainable and scalable code structure

Please analyze the test requirements and create a complete API testing solution using Playwright TypeScript with the specialized API testing expertise.