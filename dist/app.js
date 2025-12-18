import { VoiceRecorder } from './voiceRecorder.js';
import { AudioVisualizer } from './audioVisualizer.js';
import { OpenAIService } from './openaiService.js';
import { CarService } from './services/carService.js';
import { getConfig, saveConfig } from './config.js';

class AudioManager {
    async playAudio(url: string): Promise<void> {
        const audio = new Audio(url); // Load the audio file
        audio.play(); // Play the audio
        return new Promise((resolve) => {
            audio.onended = resolve; // Resolve after the audio finishes
        });
    }
}

export class App {
    constructor() {
        this.audioVisualizer = null;
        this.openAIService = null;
        this.carService = null;

        // State
        this.currentFilters = null;
        this.currentPage = 1;
        this.currentCars = [];
        this.isSearchMode = false;

        // Check if running on HTTPS or localhost (required for microphone)
        this.checkSecureContext();

        // Initialize UI elements
        this.recordButton = document.getElementById('recordButton');
        this.transcriptDisplay = document.getElementById('transcript');
        this.durationDisplay = document.getElementById('duration');
        this.canvas = document.getElementById('visualizer');
        this.filtersDisplay = document.getElementById('filters');
        this.loadingIndicator = document.getElementById('loading');
        this.errorAlert = document.getElementById('errorAlert');
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.carResultsContainer = document.getElementById('carResults');
        this.loadMoreButton = document.getElementById('loadMoreButton');
        this.resultsTitle = document.getElementById('resultsTitle');

        // Initialize voice recorder
        this.voiceRecorder = new VoiceRecorder();
        this.setupVoiceRecorder();

        // Initialize audio visualizer
        try {
            this.audioVisualizer = new AudioVisualizer(this.canvas);
        } catch (error) {
            console.error('Failed to initialize audio visualizer:', error);
        }

        // Setup record button
        if (this.recordButton) {
            this.recordButton.addEventListener('click', () => this.toggleRecording());
        }

        // Setup text search
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

        // Setup load more
        if (this.loadMoreButton) {
            this.loadMoreButton.addEventListener('click', () => this.loadMoreCars());
        }

        // Try to load OpenAI config automatically
        this.loadConfig();
        this.updateUI();
    }

    checkSecureContext() {
        const isSecure =
            window.isSecureContext ||
            location.protocol === 'https:' ||
            location.hostname === 'localhost' ||
            location.hostname === '127.0.0.1';
        if (!isSecure) {
            console.warn('⚠️ Microphone access requires HTTPS or localhost. Current protocol:', location.protocol);
        }
    }

    loadConfig() {
        const config = getConfig();
        if (config) {
            this.setOpenAIConfig(config.openAIKey, config.customBackendUrl);
            if (config.apiBaseUrl) {
                this.carService = new CarService(config.apiBaseUrl);
                // Load recent cars on startup
                this.loadRecentCars();
            } else {
                console.warn('API Base URL not configured');
            }
            console.log('Config loaded successfully');
        } else {
            console.warn('Config not found. Please configure via config.js or browser console.');
        }
    }

    setOpenAIConfig(apiKey, customBackendUrl) {
        this.openAIService = new OpenAIService(apiKey, customBackendUrl);
        // Save to localStorage for persistence
        saveConfig({ openAIKey: apiKey, customBackendUrl });
        console.log('OpenAI config updated');
    }

    setupVoiceRecorder() {
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

    async toggleRecording() {
        const state = this.voiceRecorder.getState();
        const audioManager = new AudioManager();

        if (state.isRecording) {
            this.stopRecording();
        } else {
            // Step 1: Play ringtone twice
            const ringtoneUrl = 'https://www.soundjay.com/button/beep-07.wav'; // Public ringtone URL
            await audioManager.playAudio(ringtoneUrl);
            await audioManager.playAudio(ringtoneUrl);

            // Step 2: Play Reshma's greeting
            const greetingText = 'Asalam o Alaikum! Welcome to DrivePK. Mujhse kiya madad chahiye?';
            console.log(greetingText); // Roman Urdu text (you can replace with Text-to-Speech later)
            this.hideError();

            // Step 3: Continue with recording logic
            await this.startRecording();
        }
    }

    async startRecording() {
        try {
            // Request microphone permission first via audio visualizer
            if (this.audioVisualizer) {
                try {
                    await this.audioVisualizer.start();
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    if (errorMessage.includes('denied') || errorMessage.includes('permission')) {
                        this.showError(
                            'Microphone permission denied. Please allow microphone access in your browser settings and try again.'
                        );
                    } else if (errorMessage.includes('not found') || errorMessage.includes('not available')) {
                        this.showError(
                            'Microphone not found. Please connect a microphone and try again.'
                        );
                    } else {
                        this.showError(`Microphone error: ${errorMessage}`);
                    }
                    console.error('Microphone access error:', error);
                    return; // Don't start voice recognition if mic access fails
                }
            }

            // Start voice recognition
            try {
                this.voiceRecorder.start();
                this.hideError();
                this.updateUI();
            } catch (error) {
                // Stop audio visualizer if voice recognition fails
                if (this.audioVisualizer) {
                    this.audioVisualizer.stop();
                }
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                if (errorMessage.includes('not supported')) {
                    this.showError(
                        'Speech recognition is not supported in this browser. Please use Chrome or Edge.'
                    );
                } else {
                    this.showError(`Speech recognition error: ${errorMessage}`);
                }
                console.error('Voice recognition error:', error);
            }
        } catch (error) {
            this.showError(error instanceof Error ? error.message : 'Failed to start recording');
            console.error('Recording start error:', error);
        }
    }

    stopRecording() {
        this.voiceRecorder.stop();
        if (this.audioVisualizer) {
            this.audioVisualizer.stop();
        }
        const transcript = this.voiceRecorder.getTranscript();
        if (transcript.trim()) {
            this.processTranscript(transcript);
        } else {
            this.transcriptDisplay.textContent = 'No speech detected. Please try again.';
        }
        this.updateUI();
    }

    updateUI() {
        const state = this.voiceRecorder.getState();
        if (state.isRecording) {
            this.recordButton.classList.add('recording');
            const buttonInner = this.recordButton.querySelector('.record-button-inner');
            if (buttonInner) {
                const icon = buttonInner.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-stop';
                }
            }
            const label = this.recordButton.querySelector('.record-button-label');
            if (label) {
                label.textContent = 'Stop Recording';
            }
            this.canvas.parentElement?.classList.add('active');
        } else {
            this.recordButton.classList.remove('recording');
            const buttonInner = this.recordButton.querySelector('.record-button-inner');
            if (buttonInner) {
                const icon = buttonInner.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-microphone';
                }
            }
            const label = this.recordButton.querySelector('.record-button-label');
            if (label) {
                label.textContent = 'Tap to Record';
            }
            this.canvas.parentElement?.classList.remove('active');
            if (!state.transcript) {
                this.transcriptDisplay.textContent = 'Tap the button above to start recording...';
            }
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then(() => console.log('Service Worker registered'))
            .catch((err) => console.error('Service Worker registration failed:', err));
    }

    // Make app available globally for configuration
    window.app = app;
});
