export interface Options {
    params?: object;
    statusCode?: number | string;
}

export interface ResponseObj {
    request_method?: string;
    request_url?: string;
    request_header?: Partial<any>;
    request_data: string;
    response_data: string;
}
