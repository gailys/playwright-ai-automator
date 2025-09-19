import { LoginRequest, ApiResponse } from "../interfaces/account.interfaces";
import * as AccountEndpoints from "../endpoints/account-api";

export class AccountMethods {
  /**
   * Attempt to login with invalid credentials (negative test)
   */
  async loginWithInvalidCredentials(
    credentials: LoginRequest
  ): Promise<ApiResponse> {
    return await AccountEndpoints.loginWithInvalidCredentials(credentials);
  }
}
