import { VoiceRecorder } from './voiceRecorder.js';
import { AudioVisualizer } from './audioVisualizer.js';
import { OpenAIService } from './openaiService.js';
import { CarService, Car, PaginatedResponse } from './services/carService.js';
import { CarSearchFilters, RecordingState } from './types.js';
import { getConfig, saveConfig } from './config.js';

// Handles playing audio files (e.g., ringtone and Reshma's voices)
class AudioManager {
    async playAudio(url: string): Promise<void> {
        const audio = new Audio(url);
        audio.play();
        return new Promise((resolve) => {
            audio.onended = resolve;
        });
    }
}

// Handles Reshma's voice synthesis using voice.php API
class ReshmaVoice {
    async getVoiceUrl(text: string): Promise<string> {
        const response = await fetch('https://meilibeautyco/voice.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                languageCode: 'ur-PK', // Pakistani Urdu for Roman Urdu inputs
                text: text,
            }),
        });

        const data = await response.json();
        return data.audioUrl; // Fetch Reshma's voice response as an audio URL
    }

    async playVoice(text: string): Promise<void> {
        const audioUrl = await this.getVoiceUrl(text);
        const audio = new Audio(audioUrl);
        await audio.play();
    }
}

// Handles car search queries using search.php API
class CarSearchService {
    async searchCars(query: string): Promise<{ results: Car[]; total: number }> {
        const response = await fetch('https://meilibeauty.co.uk/search.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error('Failed to search cars');
        }

        return response.json();
    }
}

export class App {
    private voiceRecorder: VoiceRecorder;
    private audioVisualizer: AudioVisualizer | null = null;
    private openAIService: OpenAIService | null = null;
    private carService: CarService | null = null;

    // State
    private currentFilters: CarSearchFilters | null = null;
    private currentPage: number = 1;
    private currentCars: Car[] = [];
    private isSearchMode: boolean = false;

    // UI Elements
    private recordButton: HTMLButtonElement;
    private transcriptDisplay: HTMLElement;
    private durationDisplay: HTMLElement;
    private canvas: HTMLCanvasElement;
    private filtersDisplay: HTMLElement;
    private loadingIndicator: HTMLElement;
    private errorAlert: HTMLElement;
    private searchInput: HTMLInputElement;
    private searchButton: HTMLButtonElement;
    private carResultsContainer: HTMLElement;
    private loadMoreButton: HTMLButtonElement;
    private resultsTitle: HTMLElement;

    constructor() {
        this.checkSecureContext();

        // Initialize UI elements
        this.recordButton = document.getElementById('recordButton') as HTMLButtonElement;
        this.transcriptDisplay = document.getElementById('transcript') as HTMLElement;
        this.durationDisplay = document.getElementById('duration') as HTMLElement;
        this.canvas = document.getElementById('visualizer') as HTMLCanvasElement;
        this.filtersDisplay = document.getElementById('filters') as HTMLElement;
        this.loadingIndicator = document.getElementById('loading') as HTMLElement;
        this.errorAlert = document.getElementById('errorAlert') as HTMLElement;
        this.searchInput = document.getElementById('searchInput') as HTMLInputElement;
        this.searchButton = document.getElementById('searchButton') as HTMLButtonElement;
        this.carResultsContainer = document.getElementById('carResults') as HTMLElement;
        this.loadMoreButton = document.getElementById('loadMoreButton') as HTMLButtonElement;
        this.resultsTitle = document.getElementById('resultsTitle') as HTMLElement;

        this.voiceRecorder = new VoiceRecorder();
        this.setupVoiceRecorder();

        try {
            this.audioVisualizer = new AudioVisualizer(this.canvas);
        } catch (error) {
            console.error('Failed to initialize audio visualizer:', error);
        }

        if (this.recordButton) {
            this.recordButton.addEventListener('click', () => this.toggleRecording());
        }

        if (this.searchButton && this.searchInput) {
            this.searchButton.addEventListener('click', () => this.handleTextSearch());
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.handleTextSearch();
                }
            });
        } else {
            console.warn('Text search elements not found in DOM');
        }

        if (this.loadMoreButton) {
            this.loadMoreButton.addEventListener('click', () => this.loadMoreCars());
        }

        this.loadConfig();
        this.updateUI();
    }

    private checkSecureContext(): void {
        const isSecure =
            window.isSecureContext ||
            location.protocol === 'https:' ||
            location.hostname === 'localhost' ||
            location.hostname === '127.0.0.1';

        if (!isSecure) {
            console.warn('⚠️ Microphone access requires HTTPS or localhost. Current protocol:', location.protocol);
        }
    }

    private loadConfig(): void {
        const config = getConfig();
        if (config) {
            this.setOpenAIConfig(config.openAIKey, config.customBackendUrl);
            if (config.apiBaseUrl) {
                this.carService = new CarService(config.apiBaseUrl);
                this.loadRecentCars();
            } else {
                console.warn('API Base URL not configured');
            }
            console.log('Config loaded successfully');
        } else {
            console.warn('Config not found. Please configure via config.js or browser console.');
        }
    }

    setOpenAIConfig(apiKey: string, customBackendUrl?: string): void {
        this.openAIService = new OpenAIService(apiKey, customBackendUrl);
        saveConfig({ openAIKey: apiKey, customBackendUrl });
        console.log('OpenAI config updated');
    }

    private setupVoiceRecorder(): void {
        this.voiceRecorder.setOnTranscriptUpdate((text) => {
            this.transcriptDisplay.textContent = text || 'Listening...';
        });

        this.voiceRecorder.setOnStateChange((state) => {
            this.updateUI();
            this.updateDuration(state);
        });

        this.voiceRecorder.setOnError((error) => {
            this.showError(error);
            this.stopRecording();
        });
    }

    private async toggleRecording(): Promise<void> {
        const state = this.voiceRecorder.getState();
        const audioManager = new AudioManager();
        const reshmaVoice = new ReshmaVoice();

        if (state.isRecording) {
            this.stopRecording();
        } else {
            // Play ringtone twice
            const ringtoneUrl = 'https://www.soundjay.com/button/beep-07.wav';
            await audioManager.playAudio(ringtoneUrl);
            await audioManager.playAudio(ringtoneUrl);

            // Reshma greets caller
            const greetingText = 'Asalam o Alaikum! Welcome to DrivePK. Mujhse kiya madad chahiye?';
            await reshmaVoice.playVoice(greetingText);

            await this.startRecording();
        }
    }

    private async processQuery(query: string): Promise<void> {
        const searchService = new CarSearchService();
        const reshmaVoice = new ReshmaVoice();

        try {
            const response = await searchService.searchCars(query);
            const carCount = response.total;

            // Reshma responds with search results
            await reshmaVoice.playVoice(`${carCount} cars mil gay hain aapke search k liay.`);
        } catch (error) {
            this.showError('Car search failed. Please try again.');
        }
    }

    private stopRecording(): void {
        this.voiceRecorder.stop();
        if (this.audioVisualizer) {
            this.audioVisualizer.stop();
        }

        const transcript = this.voiceRecorder.getTranscript();
        if (transcript.trim()) {
            this.processQuery(transcript.trim());
        } else {
            this.transcriptDisplay.textContent = 'No speech detected. Try again.';
        }

        this.updateUI();
    }

    private updateUI(): void {
        const state = this.voiceRecorder.getState();
        if (state.isRecording) {
            this.recordButton.classList.add('recording');
            const icon = this.recordButton.querySelector('.record-button-inner i');
            if (icon) icon.className = 'fas fa-stop';
            this.canvas.parentElement?.classList.add('active');
        } else {
            this.recordButton.classList.remove('recording');
            const icon = this.recordButton.querySelector('.record-button-inner i');
            if (icon) icon.className = 'fas fa-microphone';
            this.canvas.parentElement?.classList.remove('active');
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('Service Worker registered'))
            .catch((err) => console.error('Service Worker registration failed:', err));
    }

    (window as any).app = app;
});
