# AI Car Finder - Voice Search PWA

A Progressive Web App for voice-based car search using OpenAI and Browser Speech API.

## Features

- 🎤 Voice input (Urdu, Roman Urdu, English)
- 📊 Real-time audio visualization
- ⏱️ 30-second maximum recording duration
- 🤖 OpenAI-powered text-to-filter conversion
- 📱 Mobile-first PWA design
- 🎨 Modern Bootstrap UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure OpenAI API:
   - Edit `config.js` and add your OpenAI API key:
     ```javascript
     window.__APP_CONFIG__ = {
       openAIKey: 'sk-your-api-key-here'
     };
     ```

3. Build TypeScript:
```bash
npm run build
```

4. Serve the app:
```bash
npm run serve
```

## Usage

1. Click the floating action button (FAB) to start recording
2. Speak your car search query (e.g., "Toyota Corolla 2016 Rawalpindi")
3. The app will:
   - Show real-time transcription
   - Display audio visualization
   - Convert speech to text
   - Use OpenAI to extract structured filters
   - Display the search filters

## Configuration

### Using .env file (Recommended)

1. Copy `.env.example` to `.env`
2. Add your OpenAI API key:
   ```
   OPENAI_KEY=sk-your-api-key-here
   ```
3. Run `npm run config` to generate `config.js`
4. The config is auto-generated before each build

### Using Browser Console

```javascript
window.app.setOpenAIConfig('sk-your-api-key-here')
```

## Project Structure

```
├── src/
│   ├── app.ts              # Main application
│   ├── voiceRecorder.ts    # Speech recognition
│   ├── audioVisualizer.ts  # Audio waveform
│   ├── openaiService.ts    # OpenAI SDK integration
│   ├── config.ts           # Configuration loader
│   └── types.ts            # TypeScript types
├── scripts/
│   └── generate-config.js  # Generate config.js from .env
├── index.html              # Main HTML
├── styles.css              # Custom styles
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker
├── .env.example            # Environment variables template
└── package.json           # Dependencies
```

## Browser Compatibility

- Chrome/Edge: Full support ✅
- Safari: Limited (Speech Recognition API support varies) ⚠️
- Firefox: Limited ⚠️

## Notes

- Requires HTTPS or localhost for microphone access
- OpenAI API key must be configured in `.env` file
- `.env` file is gitignored for security
- Backend API integration pending (will be added when URL is provided)
