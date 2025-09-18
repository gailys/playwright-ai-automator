import { ResponseObj } from "./axios-interfaces";
import * as fs from "fs";
import logger from "../logger/log4js";
import { AxiosResponse } from "axios";

interface ReturnFileNames {
    fileName: string;
    cutFileName: string;
}

interface ErrorMessage {
    endpoint: string;
    "query parameters": unknown;
    duration: string;
    "response code": unknown;
    "response data": unknown;
}

export function returnFileNameFromRequestUrl(responseObj: ResponseObj, testName: string): ReturnFileNames {
    const testFileName = process.env.TEST_FILE_NAME || "";
    const fileName = `logs/${testFileName}/${testName.replace(/[():]/g, "")}/${responseObj.request_url
        ?.substring(responseObj.request_url?.search("api/v1/"), responseObj.request_url.length)
        .replace(/[():]/g, "")}.log`;
    const cutFileName = fileName.substring(0, fileName.lastIndexOf("/"));
    return { fileName, cutFileName };
}

function createErrorMessage(response: any): ErrorMessage {
    return {
        endpoint: `[${response.config?.method?.toUpperCase()}] ${response.config?.url}`,
        "query parameters": response.config?.params,
        duration: `${Date.now() - response.config.meta.startTime} ms`,
        "response code": response.status,
        "response data": response.data,
    };
}

export function verifyResponse(response: AxiosResponse, status: number | string = 200): AxiosResponse<unknown, unknown> {
    if (status !== "skip" && response.status !== status) {
        throw new Error(`Request failed! \n ${JSON.stringify(createErrorMessage(response), null, 4)}`);
    } else {
        return response;
    }
}

export function writeLogsToFiles(responseObj: ResponseObj): void {
    const testName = process.env.TEST_TITLE?.replace(/\s/g, "") || "";
    const { fileName, cutFileName } = returnFileNameFromRequestUrl(responseObj, testName);
    try {
        if (!fs.existsSync(cutFileName)) {
            fs.mkdirSync(cutFileName, { recursive: true });
        }
        fs.writeFileSync(fileName, JSON.stringify(responseObj, null, 2));
    } catch (err) {
        logger.info("Failed to write logs to files! ", err);
    }
}
