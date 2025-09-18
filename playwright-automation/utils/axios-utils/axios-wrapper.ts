import axios, { AxiosResponse } from "axios";
import { Options, ResponseObj } from "./axios-interfaces";
import { verifyResponse, writeLogsToFiles } from "./axios-helpers";
import environment from "../../environment";

export const Axios = {
    post: async (url: string, headers: any, payload?: object, options: Options = { params: {}, statusCode: 200 }) => {
        try {
            const response = await axios({
                method: "post",
                url,
                data: payload,
                headers,
            }).then((res: AxiosResponse) => verifyResponse(res, options.statusCode));
            return response.data;
        } catch (error) {
            throw new Error(`Axios.post function failed! ${error}\nURL: ${url}.\nResponse error: ${JSON.stringify(error?.response?.data)}`);
        }
    },
    get: async (url: string, headers: any, options: Options = { params: {}, statusCode: 200 }) => {
        try {
            const response: AxiosResponse = await axios({
                method: "get",
                url,
                headers,
                params: options.params,
            }).then((res: AxiosResponse) => verifyResponse(res, options.statusCode));
            return response.data;
        } catch (error) {
            throw new Error(`Axios.get function failed! ${error}\nURL: ${url}.\nResponse error: ${JSON.stringify(error?.response?.data)}`);
        }
    },
    put: async (url: string, header: any, payload: object, options: Options = { params: {}, statusCode: 200 }) => {
        try {
            const response = await axios({
                method: "put",
                url,
                headers: header,
                data: payload,
                params: options.params,
            }).then((res: AxiosResponse) => verifyResponse(res, options.statusCode));
            return response.data;
        } catch (error) {
            throw new Error(`Axios.put function failed! ${error}\nURL: ${url}.\nResponse error: ${JSON.stringify(error?.response?.data)}`);
        }
    },
    delete: async (url: string, header: any, payload: object, options: Options = { params: {}, statusCode: 200 }) => {
        try {
            const response = await axios({
                method: "delete",
                url,
                headers: header,
                data: payload,
            }).then((res: AxiosResponse) => verifyResponse(res, options.statusCode));
            return response.data;
        } catch (error) {
            throw new Error(`Axios.delete function failed! ${error}\nURL: ${url}.\nResponse error: ${JSON.stringify(error?.response?.data)}`);
        }
    },
};

export enum EndpointType {
    NotAuthorisedCustomer = "notAuthorisedCustomer",
}

export function getHeader(endpointType: EndpointType) {
    switch (endpointType) {
        case "notAuthorisedCustomer":
            return {
                "Session-Id": environment.sessionId,
                "Accept-Language": "lt",
            };
        default:
            throw new Error(`Endpoint type "${endpointType}" does not exist!`);
    }
}

axios.interceptors.response.use((response) => {
    const responseObj: ResponseObj = {
        request_method: response.config.method?.toUpperCase(),
        request_url: response.config.url,
        request_header: response.config.headers,
        request_data: response.config.data,
        response_data: response.data,
    };
    if (response.config.url?.includes(environment.apiUrl)) {
        writeLogsToFiles(responseObj);
    }
    return response;
});
