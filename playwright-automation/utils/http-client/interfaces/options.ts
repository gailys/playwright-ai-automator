import { Serializable } from "playwright-core/types/structs";
import { ReadStream } from "fs";

export interface Options {
    data?: string | Buffer | Serializable;
    failOnStatusCode?: boolean;
    expectedStatus?: number;
    form?: { [key: string]: string | number | boolean };
    headers?: { [key: string]: string };
    ignoreHTTPSErrors?: boolean;
    maxRedirects?: number;
    multipart?:
        | FormData
        | {
              [key: string]:
                  | string
                  | number
                  | boolean
                  | ReadStream
                  | {
                        name: string;
                        mimeType: string;
                        buffer: Buffer;
                    };
          };
    params?: { [key: string]: string | number | boolean };
    timeout?: number;
}
