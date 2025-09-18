import { mergeHTMLReports } from "playwright-merge-html-reports";

(() => {
    mergeHtmlReport();
})();

function mergeHtmlReport(): void {
    const inputReportPaths = [
        process.cwd() + "/playwright-report/fe",
        process.cwd() + "/playwright-report/api"
      ];

    const config = {
    outputFolderName: "merged-playwright-report",
    outputBasePath: process.cwd()
    };

    void mergeHTMLReports(inputReportPaths, config);
}
