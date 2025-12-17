import { RecordingState } from './types.js';
export declare class VoiceRecorder {
    private recognition;
    private isRecording;
    private transcript;
    private startTime;
    private maxDuration;
    private timer;
    private onTranscriptUpdate?;
    private onStateChange?;
    private onError?;
    constructor();
    private initializeRecognition;
    setOnTranscriptUpdate(callback: (text: string) => void): void;
    setOnStateChange(callback: (state: RecordingState) => void): void;
    setOnError(callback: (error: string) => void): void;
    start(): void;
    stop(): void;
    private updateState;
    getTranscript(): string;
    getState(): RecordingState;
}
//# sourceMappingURL=voiceRecorder.d.ts.map