export interface LoginRequest {
    userName: string;
    password: string;
}

export interface ApiResponse<T = any> {
    code: string;
    message: string;
    data?: T;
}