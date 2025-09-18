import axios from 'axios';
import { EndpointType, getHeader } from '../../../utils/axios-utils/axios-wrapper';
import environment from '../../../environment';
import { LoginRequest, ApiResponse } from '../interfaces/account.interfaces';

// Individual endpoint declaration
export const loginWithInvalidCredentials = async (credentials: LoginRequest): Promise<ApiResponse> => {
    try {
        const response = await axios.post(
            `${environment.apiUrl}Account/v1/Login`,
            credentials,
            { headers: getHeader(EndpointType.NotAuthorisedCustomer) }
        );
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        throw error;
    }
};