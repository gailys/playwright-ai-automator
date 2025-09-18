import { Axios } from "../axios-utils/axios-wrapper";
import { Emoji } from "./emoji";
import { testResults } from "./slack-templates";

import dotenv from "dotenv";

dotenv.config({ path: `.env` });

export const Slack = {
    baseUrl: "https://hooks.slack.com/services/",
    secretValue: process.env.SLACK_HOOKS_SECRET,
    header: { "Content-Type": "application/json" },

    async sendMessage(body: {}): Promise<unknown> {
        return await Axios.post(`${this.baseUrl + this.secretValue}`, this.header, body);
    },

    async sendReportResults(runId: number, passed: number, failed: number, tags: string, userName = "Bot", status: Emoji, duration: number): Promise<unknown> {
        return await Axios.post(`${this.baseUrl + this.secretValue}`, this.header, testResults(passed, failed, tags, userName, status, duration, runId));
    },
};
