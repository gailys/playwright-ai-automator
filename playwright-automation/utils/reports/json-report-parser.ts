import fs from 'fs';
import { Emoji } from '../slack/emoji';
import { Slack } from '../slack/slack';
import dotenv from "dotenv";

dotenv.config({ path: `.env` });


void (async () => {
    if (process.env.CI && process.env.GITHUB_RUN_ID) {
        const runId = +process.env.GITHUB_RUN_ID;
        const apiJson: ReportResponse = JSON.parse(fs.readFileSync('./playwright-report/json/api.json', 'utf-8'));
        const feJson: ReportResponse = JSON.parse(fs.readFileSync('./playwright-report/json/fe.json', 'utf-8'));
        const {passedTests, failedTests, duration, tags} = getTestInfoForSlackReport(parseJsonResult([apiJson, feJson]));
        const status = failedTests === 0 ? Emoji.PASSED : Emoji.FAILED;

        await Slack.sendReportResults(runId, passedTests, failedTests, [...tags].toString(), process.env.GITHUB_TRIGGERING_ACTOR, status, duration);
    }
})();

function parseJsonResult(responses: ReportResponse[]): TestInfo[] {
    const allTests: TestInfo[] = [];
    const allTags = new Set<string>();

    const flattenedResults = responses.flatMap((json) => json.suites.flatMap((suites) => suites.suites.flatMap((suite) => suite)));
    flattenedResults.forEach((suite) => {
        suite.specs.forEach((spec) => {
            spec.tests.forEach((test) => {
                spec.tags.forEach((tags) => {
                    allTags.add(tags);
                });
                const testObject = {} as TestInfo;
                let steps: Step[] = [];
                test.results.forEach((result) => {
                    testObject.tags = allTags;
                    testObject.file = suite.file;
                    testObject.suiteTitle = suite.title;
                    testObject.id = spec.id;
                    testObject.status = result.status;
                    testObject.duration = result.duration;
                    if(result.steps) {
                        result.steps.forEach((step) => {
                            steps.push(step);
                        });
                        testObject.steps = steps;
                    }
                });
                steps = [];
                allTests.push(testObject);
            });
        });
    });
    return allTests;
}

function getTestInfoForSlackReport(jsonResults: TestInfo[]): TestResult {
    let passedTests = 0;
    let failedTests = 0;
    let duration = 0;
    let tags = new Set<string>();
    for(const result of jsonResults) {
        if(result.status === 'passed') {
            passedTests++;
        }
        else if(result.status === 'failed') {
            failedTests++;
        }
        else if(result.status === "timedOut") {
            failedTests++;
        }
        duration += result.duration;
        tags = result.tags;
    }
    return { passedTests, failedTests, duration, tags};
}

interface TestResult {
    passedTests: number;
    failedTests: number;
    unknownTests?: number;
    duration: number;
    tags: Set<string>;
}

type TestInfo = {
    file: string;
    suiteTitle: string;
    testTitle: string;
    status: string;
    duration: number;
    steps: Step[];
    id: string;
    tags: Set<string>;
};

interface ReportResponse {
    config: Config,
    suites: Suite[],
    errors: Error[]
}

interface Config {
    forbidOnly: boolean,
    fullyParallel: boolean,
    globalSetup: any,
    globalTeardown: any,
    globalTimeout: number,
    grep: {},
    grepInvert: any,
    maxFailures: number,
    metadata: {},
    preserveOutput: string,
    projects: Project[],
    reporter: any[],
    reportSlowTests: { max: number, threshold: number},
    configFile: string,
    rootDir: string,
    quiet: boolean,
    shard: any,
    updateSnapshots: string,
    version: string,
    workers: number,
    webServer: any
}

interface Project {
    outputDir: string,
    repeatEach: number,
    retries: number,
    id: string,
    name: string,
    testDir: string,
    testIgnore: object[],
    testMatch: string[],
    timeout: number
}

interface Suite {
    title: string,
    file: string,
    column: number,
    line: number,
    specs: any[],
    suites: InternalSuite[]
}

interface InternalSuite {
    title: string,
    file: string,
    line: number,
    column: number,
    specs: Spec[]
}

interface Spec {
    title: string,
    ok: boolean,
    tags: string[],
    tests: Test[]
    id: string,
    file: string,
    line: number,
    column: number
}
interface Test {
    timeout: number,
    annotations: string[],
    expectedStatus: string,
    projectId: string,
    projectName: string,
    results: Result[],
    status: string,
}

interface Result {
    workerIndex: number,
    status: string,
    duration: number,
    errors: any[],
    stdout: any[],
    stderr: any[],
    retry: number,
    steps: Step[],
    startTime: string,
    attachments: any[]
}

interface Step {
    title: string,
    duration: number
}
