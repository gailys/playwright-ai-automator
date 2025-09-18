import { APIResponse, expect, request } from "@playwright/test";
import { Options } from "./interfaces/options";
import { CustomResponse } from "./interfaces/response";

export const HttpClient = (baseUrl: string, defaultHeaders: { [key: string]: string }) => ({
    context: async () =>
        await request.newContext({
            baseURL: baseUrl,
            extraHTTPHeaders: defaultHeaders,
        }),

    async request(method: "get" | "post" | "put" | "delete", url: string, options?: Options & { body?: object }): Promise<CustomResponse> {
        let response: APIResponse | undefined;

        try {
            const context = await this.context();

            response = await context[method](url, {
                data: options?.body,
                headers: options?.headers,
                failOnStatusCode: false,
                params: options?.params,
                timeout: 60000,
            });

            const responseObject = await createResponseObject(response);

            if (options?.expectedStatus) {
                expect(responseObject.status, responseObject.text).toBe(options?.expectedStatus);
            }

            return responseObject;
        } catch (error) {
            return await createResponseObject(response, error.message);
        }
    },

    async get(url: string, options?: Options): Promise<CustomResponse> {
        return this.request("get", url, options);
    },

    async post(url: string, body?: object, options?: Options): Promise<CustomResponse> {
        return this.request("post", url, { ...options, body });
    },

    async put(url: string, body?: object, options?: Options): Promise<CustomResponse> {
        return this.request("put", url, { ...options, body });
    },

    async delete(url: string, options?: Options): Promise<CustomResponse> {
        return this.request("delete", url, options);
    },
});

async function createResponseObject(response: APIResponse | undefined, error?: string): Promise<CustomResponse> {
    if (response) {
        return {
            headers: response?.headers(),
            body: await response.json().catch(() => null),
            text: await response?.text(),
            status: response?.status(),
            statusText: response?.statusText(),
        };
    } else {
        return {
            text: error || "Unknown Error",
        };
    }
}
