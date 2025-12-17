import { VoiceRecorder } from './voiceRecorder.js';
import { AudioVisualizer } from './audioVisualizer.js';
import { OpenAIService } from './openaiService.js';
import { CarService } from './services/carService.js';
import { getConfig, saveConfig } from './config.js';
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
        }
        catch (error) {
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
        }
        else {
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
        const isSecure = window.isSecureContext ||
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
            }
            else {
                console.warn('API Base URL not configured');
            }
            console.log('Config loaded successfully');
        }
        else {
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
        if (state.isRecording) {
            this.stopRecording();
        }
        else {
            await this.startRecording();
        }
    }
    async startRecording() {
        try {
            // Request microphone permission first via audio visualizer
            if (this.audioVisualizer) {
                try {
                    await this.audioVisualizer.start();
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    if (errorMessage.includes('denied') || errorMessage.includes('permission')) {
                        this.showError('Microphone permission denied. Please allow microphone access in your browser settings and try again.');
                    }
                    else if (errorMessage.includes('not found') || errorMessage.includes('not available')) {
                        this.showError('Microphone not found. Please connect a microphone and try again.');
                    }
                    else {
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
            }
            catch (error) {
                // Stop audio visualizer if voice recognition fails
                if (this.audioVisualizer) {
                    this.audioVisualizer.stop();
                }
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                if (errorMessage.includes('not supported')) {
                    this.showError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
                }
                else {
                    this.showError(`Speech recognition error: ${errorMessage}`);
                }
                console.error('Voice recognition error:', error);
            }
        }
        catch (error) {
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
        }
        else {
            this.transcriptDisplay.textContent = 'No speech detected. Please try again.';
        }
        this.updateUI();
    }
    async handleTextSearch() {
        const text = this.searchInput.value.trim();
        if (!text) {
            this.showError('Please enter a search query.');
            return;
        }
        // Stop recording if active
        if (this.voiceRecorder.getState().isRecording) {
            this.stopRecording();
        }
        // Use the exact same processing logic as voice
        await this.processTranscript(text);
    }
    async processTranscript(text) {
        if (!this.openAIService) {
            this.showError('OpenAI service not configured. Please set API key.');
            return;
        }
        this.showLoading(true);
        this.hideError();
        try {
            const filters = await this.openAIService.convertTextToFilters(text);
            this.displayFilters(filters);
            // Reset filtering state
            this.currentFilters = filters;
            this.currentPage = 1;
            this.currentCars = []; // Clear previous results
            this.isSearchMode = true;
            if (this.carResultsContainer) {
                this.carResultsContainer.innerHTML = ''; // Clear DOM
            }
            if (this.resultsTitle) {
                this.resultsTitle.textContent = 'Search Results';
            }
            // Fetch cars based on filters
            await this.fetchCars();
        }
        catch (error) {
            this.showError(`Failed to process transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
            console.error('Transcript processing error:', error);
        }
        finally {
            this.showLoading(false);
        }
    }
    async loadRecentCars() {
        if (!this.carService)
            return;
        this.showLoading(true);
        this.isSearchMode = false;
        this.currentPage = 1;
        this.currentCars = [];
        if (this.resultsTitle) {
            this.resultsTitle.textContent = 'Recent Cars';
        }
        try {
            const response = await this.carService.getRecentCars(this.currentPage);
            this.handleCarResponse(response);
        }
        catch (error) {
            console.error('Failed to load recent cars:', error);
            // Fail silently for recent cars, or show small toast
        }
        finally {
            this.showLoading(false);
        }
    }
    async loadMoreCars() {
        this.currentPage++;
        await this.fetchCars();
    }
    async fetchCars() {
        if (!this.carService)
            return;
        this.showLoading(true);
        try {
            let response;
            if (this.isSearchMode && this.currentFilters) {
                response = await this.carService.searchCars(this.currentFilters, this.currentPage);
            }
            else {
                response = await this.carService.getRecentCars(this.currentPage);
            }
            this.handleCarResponse(response);
        }
        catch (error) {
            this.showError(`Failed to fetch cars: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        finally {
            this.showLoading(false);
        }
    }
    handleCarResponse(response) {
        if (this.currentPage === 1) {
            this.currentCars = response.data;
            if (this.carResultsContainer) {
                this.carResultsContainer.innerHTML = '';
            }
        }
        else {
            this.currentCars = [...this.currentCars, ...response.data];
        }
        this.renderCars(response.data);
        this.updateLoadMoreButton(response);
    }
    renderCars(cars) {
        if (!this.carResultsContainer)
            return;
        if (cars.length === 0 && this.currentPage === 1) {
            this.carResultsContainer.innerHTML = '<div class="col-12 text-center py-5 text-muted">No cars found matching your criteria.</div>';
            return;
        }
        const html = cars.map(car => `
      <div class="col-12 p-0">
        <a href="https://drivepk.com/car/${car._id}" target="_blank" class="text-decoration-none">
            <div class="car-card">
              <div class="card-img-wrapper">
                 <img src="${car.images?.[0] || 'https://placehold.co/400x300/e0e0e0/757575?text=No+Image'}" 
                     class="card-img-top" 
                     alt="${car.title}"
                     onerror="this.src='https://placehold.co/400x300/e0e0e0/757575?text=No+Image'">
                 <div class="featured-badge">Featured Pro</div>
              </div>
                  <div class="card-body">
                <div>
                    <h5 class="card-title" title="${car.title}">${car.title}</h5>
                    ${(() => {
            const city = car.currentLocation?.city || car.city;
            const province = car.province || car.currentLocation?.province;
            let locationText = 'Pakistan';
            if (city) {
                locationText = `${city}, ${province || 'Pakistan'}`;
            }
            else if (province) {
                locationText = `${province}, Pakistan`;
            }
            return `<div class="location-text"><i class="fas fa-map-marker-alt"></i>${locationText}</div>`;
        })()}
                    <div class="seller-type">Private</div>
                </div>
                
                <div>
                    <div class="car-specs">
                        ${car.mileage || '0'} km • ${car.year}
                    </div>
                    <div class="car-price">
                        ${this.formatPricePKR(car.price)}
                    </div>
                </div>
              </div>
            </div>
        </a>
      </div>
    `).join('');
        // Append new cars
        this.carResultsContainer.insertAdjacentHTML('beforeend', html);
    }
    formatPricePKR(amount) {
        if (amount >= 10000000) { // 1 Crore
            const crores = amount / 10000000;
            return `PKR ${Number.isInteger(crores) ? crores : crores.toFixed(2)} Crore`;
        }
        if (amount >= 100000) { // 1 Lakh
            const lakhs = amount / 100000;
            return `PKR ${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(2)} Lac`;
        }
        return `PKR ${amount.toLocaleString()}`;
    }
    updateLoadMoreButton(response) {
        if (!this.loadMoreButton)
            return;
        // Fallback if totalPages is missing from API
        const totalPages = response.totalPages || Math.ceil(response.total / response.limit) || 0;
        console.log(`Pagination: Page ${response.page} of ${totalPages} (Total: ${response.total})`);
        if (response.page < totalPages) {
            this.loadMoreButton.classList.remove('d-none');
        }
        else {
            this.loadMoreButton.classList.add('d-none');
        }
    }
    displayFilters(filters) {
        if (!this.filtersDisplay) {
            console.error('Filters display element not found');
            return;
        }
        const filterItems = [];
        if (filters.brand) {
            filterItems.push(`<strong>Brand:</strong> ${filters.brand}`);
        }
        if (filters.model) {
            filterItems.push(`<strong>Model:</strong> ${filters.model}`);
        }
        if (filters.year) {
            filterItems.push(`<strong>Year:</strong> ${filters.year}`);
        }
        if (filters.color) {
            filterItems.push(`<strong>Color:</strong> ${filters.color}`);
        }
        if (filters.city) {
            filterItems.push(`<strong>City:</strong> ${filters.city}`);
        }
        if (filters.price) {
            const priceParts = [];
            if (filters.price.min) {
                priceParts.push(`Min: ${this.formatPrice(filters.price.min)}`);
            }
            if (filters.price.max) {
                priceParts.push(`Max: ${this.formatPrice(filters.price.max)}`);
            }
            if (priceParts.length > 0) {
                filterItems.push(`<strong>Price:</strong> ${priceParts.join(', ')}`);
            }
        }
        if (filterItems.length === 0) {
            this.filtersDisplay.innerHTML = '<p class="text-muted mb-0">No filters extracted. Please try speaking more clearly.</p>';
        }
        else {
            this.filtersDisplay.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="mb-0">Extracted Filters:</h6>
        </div>
        <div class="list-group">
          ${filterItems.map(item => `<div class="list-group-item py-2">${item}</div>`).join('')}
        </div>
        <!-- <pre class="mt-2 p-2 bg-light rounded small mb-0"><code>${JSON.stringify(filters, null, 2)}</code></pre> -->
      `;
        }
    }
    formatPrice(amount) {
        if (amount >= 10000000) { // 1 Crore
            return `Rs. ${(amount / 10000000).toFixed(2)} Crore`;
        }
        if (amount >= 100000) { // 1 Lakh
            return `Rs. ${(amount / 100000).toFixed(2)} Lakh`;
        }
        return `Rs. ${amount.toLocaleString()}`;
    }
    updateDuration(state) {
        const seconds = Math.floor(state.duration / 1000);
        const maxSeconds = Math.floor(state.maxDuration / 1000);
        this.durationDisplay.textContent = `${seconds}s / ${maxSeconds}s`;
        // Update progress bar
        const progress = (state.duration / state.maxDuration) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
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
        }
        else {
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
    showLoading(show) {
        if (show) {
            this.loadingIndicator.classList.remove('d-none');
        }
        else {
            this.loadingIndicator.classList.add('d-none');
        }
    }
    showError(message) {
        if (!this.errorAlert) {
            console.error('Error alert element not found. Message:', message);
            alert(message); // Fallback
            return;
        }
        const errorSpan = this.errorAlert.querySelector('span');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
        else {
            this.errorAlert.textContent = message;
        }
        this.errorAlert.classList.remove('d-none');
        // Scroll to error
        this.errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    hideError() {
        this.errorAlert.classList.add('d-none');
    }
}
// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.error('Service Worker registration failed:', err));
    }
    // Make app available globally for configuration
    window.app = app;
});
//# sourceMappingURL=app.js.map