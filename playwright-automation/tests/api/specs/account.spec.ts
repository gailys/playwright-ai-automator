import { test, expect } from '@playwright/test';
import { AccountMethods } from '../methods/account.methods';
import { LoginRequest } from '../interfaces/account.interfaces';

test.describe('Account API Tests', () => {
    let accountMethods: AccountMethods;

    test.beforeEach(() => {
        accountMethods = new AccountMethods();
    });

    test('should return empty response when login with invalid credentials @API', async () => {
        // Arrange
        const invalidCredentials: LoginRequest = {
            userName: 'invaliduser',
            password: 'wrongpassword'
        };

        // Act
        const response = await accountMethods.loginWithInvalidCredentials(invalidCredentials);

        // Assert
        expect(response).toBe('');
    });
});