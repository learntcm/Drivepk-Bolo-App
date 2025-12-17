export interface CarSearchFilters {
    brand?: string;
    model?: string;
    year?: number;
    city?: string;
    price?: {
        min?: number;
        max?: number;
    };
    color?: string;
}
export interface RecordingState {
    isRecording: boolean;
    transcript: string;
    duration: number;
    maxDuration: number;
}
//# sourceMappingURL=types.d.ts.map