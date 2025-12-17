import { RecordingState } from './types.js';

// Speech Recognition types (browser API, not fully standardized)
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

export class VoiceRecorder {
  private recognition: SpeechRecognition | null = null;
  private isRecording: boolean = false;
  private transcript: string = '';
  private startTime: number = 0;
  private maxDuration: number = 30000; // 30 seconds in milliseconds
  private timer: number | null = null;
  
  private onTranscriptUpdate?: (text: string) => void;
  private onStateChange?: (state: RecordingState) => void;
  private onError?: (error: string) => void;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
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

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      this.transcript = finalTranscript + interimTranscript;
      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate(this.transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
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
        } catch (e) {
          // Ignore restart errors
        }
      }
    };
  }

  setOnTranscriptUpdate(callback: (text: string) => void): void {
    this.onTranscriptUpdate = callback;
  }

  setOnStateChange(callback: (state: RecordingState) => void): void {
    this.onStateChange = callback;
  }

  setOnError(callback: (error: string) => void): void {
    this.onError = callback;
  }

  start(): void {
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
    } catch (e) {
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
      } else {
        this.updateState();
      }
    }, 100);
  }

  stop(): void {
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
      } catch (e) {
        // Ignore stop errors
      }
    }

    this.updateState();
  }

  private updateState(): void {
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

  getTranscript(): string {
    return this.transcript;
  }

  getState(): RecordingState {
    return {
      isRecording: this.isRecording,
      transcript: this.transcript,
      duration: this.isRecording ? Date.now() - this.startTime : 0,
      maxDuration: this.maxDuration
    };
  }
}

