import * as fs from "fs";
import logger from "../logger/log4js";

(() => {
    clearLogFiles();
})();

function clearLogFiles(): void {
    const logsDir = "./logs/";
    const playwrightReportDir = "./playwright-report/";
    const mergedPlaywrightReportsDir = "./merged-playwright-report/";
    fs.rmSync(logsDir, { recursive: true, force: true });
    fs.rmSync(playwrightReportDir, { recursive: true, force: true });
    fs.rmSync(mergedPlaywrightReportsDir, { recursive: true, force: true });
    logger.info("Logs files were cleared!");
}
