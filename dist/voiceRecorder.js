export class VoiceRecorder {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.transcript = '';
        this.startTime = 0;
        this.maxDuration = 30000; // 30 seconds in milliseconds
        this.timer = null;
        this.initializeRecognition();
    }
    initializeRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            throw new Error('Speech Recognition API not supported in this browser');
        }
        this.recognition = new SpeechRecognition();
        if (!this.recognition) {
            throw new Error('Failed to create SpeechRecognition instance');
        }
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US,ur-PK'; // English and Urdu
        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                }
                else {
                    interimTranscript += transcript;
                }
            }
            this.transcript = finalTranscript + interimTranscript;
            if (this.onTranscriptUpdate) {
                this.onTranscriptUpdate(this.transcript);
            }
        };
        this.recognition.onerror = (event) => {
            const error = event.error;
            if (this.onError) {
                this.onError(`Speech recognition error: ${error}`);
            }
            this.stop();
        };
        this.recognition.onend = () => {
            if (this.isRecording && this.recognition) {
                // Restart if still recording (browser sometimes stops automatically)
                try {
                    this.recognition.start();
                }
                catch (e) {
                    // Ignore restart errors
                }
            }
        };
    }
    setOnTranscriptUpdate(callback) {
        this.onTranscriptUpdate = callback;
    }
    setOnStateChange(callback) {
        this.onStateChange = callback;
    }
    setOnError(callback) {
        this.onError = callback;
    }
    start() {
        if (!this.recognition) {
            throw new Error('Speech Recognition not initialized');
        }
        if (this.isRecording) {
            return;
        }
        this.isRecording = true;
        this.transcript = '';
        this.startTime = Date.now();
        try {
            this.recognition.start();
        }
        catch (e) {
            this.isRecording = false;
            if (this.onError) {
                this.onError('Failed to start recording');
            }
            return;
        }
        // Update state
        this.updateState();
        // Start timer to check duration
        this.timer = window.setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            if (elapsed >= this.maxDuration) {
                this.stop();
            }
            else {
                this.updateState();
            }
        }, 100);
    }
    stop() {
        if (!this.isRecording) {
            return;
        }
        this.isRecording = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.recognition) {
            try {
                this.recognition.stop();
            }
            catch (e) {
                // Ignore stop errors
            }
        }
        this.updateState();
    }
    updateState() {
        const duration = this.isRecording ? Date.now() - this.startTime : 0;
        if (this.onStateChange) {
            this.onStateChange({
                isRecording: this.isRecording,
                transcript: this.transcript,
                duration: duration,
                maxDuration: this.maxDuration
            });
        }
    }
    getTranscript() {
        return this.transcript;
    }
    getState() {
        return {
            isRecording: this.isRecording,
            transcript: this.transcript,
            duration: this.isRecording ? Date.now() - this.startTime : 0,
            maxDuration: this.maxDuration
        };
    }
}
//# sourceMappingURL=voiceRecorder.js.map