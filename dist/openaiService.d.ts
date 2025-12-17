import { CarSearchFilters } from './types.js';
export declare class OpenAIService {
    private apiKey;
    private openai;
    private customBackendUrl;
    constructor(apiKey: string, customBackendUrl?: string);
    convertTextToFilters(text: string): Promise<CarSearchFilters>;
    private convertWithOpenAISDK;
    private convertWithCustomEndpoint;
    private sanitizeFilters;
}
//# sourceMappingURL=openaiService.d.ts.map