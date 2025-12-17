export interface AppConfig {
    openAIKey: string;
    customBackendUrl?: string;
    apiBaseUrl?: string;
}
export declare function getConfig(): AppConfig | null;
export declare function saveConfig(config: AppConfig): void;
//# sourceMappingURL=config.d.ts.map