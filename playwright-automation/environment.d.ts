declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PASSWORD: string;
            USERNAME: string;
        }
    }
}

export {};