import { Emoji } from "./emoji";

export function testResults(passed: number, failed: number, tags: string, userName: string, status: Emoji, duration: number, runId: number) {
    return {
        blocks: [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "Regression test results",
                    emoji: true,
                },
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Passed:*\n${passed}`,
                    },
                    {
                        type: "mrkdwn",
                        text: `*Failed:*\n${failed}`,
                    },
                ],
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Tags:*\n${tags}`,
                    },
                    {
                        type: "mrkdwn",
                        text: `*Created by:*\n${userName}`,
                    },
                ],
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Status:*\n${status}`,
                    },
                    {
                        type: "mrkdwn",
                        text: `*Duration:*\n${duration / 1000}s`,
                    },
                ],
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Link to CI*\n<https://github.com/Softeta/qa-automation-kakava/actions/runs/${runId}|Detailed info>`,
                    },
                    {
                        type: "mrkdwn",
                        text: "*Link to reports*\n<https://softeta.github.io/qa-automation-kakava|Reports info>",
                    },
                ],
            },
        ],
    };
}
