export declare class AudioVisualizer {
    private canvas;
    private ctx;
    private analyser;
    private dataArray;
    private animationFrame;
    private audioContext;
    private microphone;
    private stream;
    constructor(canvas: HTMLCanvasElement);
    private setupCanvas;
    start(): Promise<void>;
    stop(): void;
    private visualize;
}
//# sourceMappingURL=audioVisualizer.d.ts.map