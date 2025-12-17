export class AudioVisualizer {
    constructor(canvas) {
        this.analyser = null;
        this.dataArray = null;
        this.animationFrame = null;
        this.audioContext = null;
        this.microphone = null;
        this.stream = null;
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context from canvas');
        }
        this.ctx = context;
        this.setupCanvas();
    }
    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    async start() {
        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Microphone API not supported in this browser');
        }
        try {
            // Request microphone permission - this will show browser permission dialog
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            // Check if stream was actually granted
            if (!this.stream || this.stream.getAudioTracks().length === 0) {
                throw new Error('Microphone access was denied');
            }
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.microphone = this.audioContext.createMediaStreamSource(this.stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;
            this.microphone.connect(this.analyser);
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            this.visualize();
        }
        catch (error) {
            console.error('Error accessing microphone:', error);
            // Provide specific error messages
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                throw new Error('Microphone permission denied. Please allow microphone access and try again.');
            }
            else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                throw new Error('No microphone found. Please connect a microphone and try again.');
            }
            else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                throw new Error('Microphone is already in use by another application.');
            }
            else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
                throw new Error('Microphone constraints could not be satisfied.');
            }
            else {
                throw new Error(`Microphone access error: ${error.message || 'Unknown error'}`);
            }
        }
    }
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.microphone = null;
        this.analyser = null;
        this.dataArray = null;
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    visualize() {
        if (!this.analyser || !this.dataArray) {
            return;
        }
        const buffer = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(buffer);
        // Use buffer for visualization
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, width, height);
        const barWidth = width / buffer.length * 2.5;
        let barHeight;
        let x = 0;
        for (let i = 0; i < buffer.length; i++) {
            barHeight = (buffer[i] / 255) * height * 0.8;
            const gradient = this.ctx.createLinearGradient(0, height - barHeight, 0, height);
            gradient.addColorStop(0, '#007bff');
            gradient.addColorStop(0.5, '#0056b3');
            gradient.addColorStop(1, '#004085');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
        this.animationFrame = requestAnimationFrame(() => this.visualize());
    }
}
//# sourceMappingURL=audioVisualizer.js.map