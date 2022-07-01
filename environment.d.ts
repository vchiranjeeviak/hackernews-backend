declare global {
    namespace nodeJS {
        interface processEnv {
            GITHUB_AUTH_TOKEN: string;
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            PWD: string;
        }
    }
}

export {}