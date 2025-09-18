import dotenv from "dotenv";
import logger from "./utils/logger/log4js";

dotenv.config({ path: `.env` });

interface Environment {
    [key: string]: EnvironmentValues;
}

interface EnvironmentValues {
    baseUrl: string;
    apiUrl: string;
    sessionId?: string;
}

const environment: Environment = {
    test: {
        baseUrl: process.env.BASE_PAGE!,
        apiUrl: process.env.BASE_API!,
    },
};

if (!process.env.ENV || !["test"].includes(process.env.ENV.toLowerCase())) {
    logger.info('Please provide a correct environment like "npx cross-env ENV=test"');
    process.exit();
}

logger.info(`Test will be run against ${process.env.ENV} environment`);

const currentEnv = environment[process.env.ENV];

// Validate environment URLs
try {
    new URL(currentEnv.baseUrl);
    new URL(currentEnv.apiUrl);
} catch (error) {
    logger.error('Invalid URL configuration in environment:', error);
    process.exit(1);
}

export default currentEnv;
