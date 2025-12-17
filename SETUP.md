# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build TypeScript**
   ```bash
   npm run build
   ```

3. **Create PWA Icons**
   - Create `icon-192.png` (192x192 pixels)
   - Create `icon-512.png` (512x512 pixels)
   - You can use any image editor or online tool to create these
   - Place them in the root directory

4. **Configure OpenAI API**
   
   Open the browser console after loading the app and run:
   ```javascript
   window.app.setOpenAIConfig('YOUR_API_URL', 'YOUR_API_KEY')
   ```
   
   Examples:
   - **OpenAI Direct API:**
     ```javascript
     window.app.setOpenAIConfig('https://api.openai.com/v1/chat/completions', 'sk-...')
     ```
   
   - **Custom Backend Endpoint:**
     ```javascript
     window.app.setOpenAIConfig('https://your-backend.com/api/openai/chat', 'your-key')
     ```

5. **Serve the App**
   ```bash
   npm run serve
   ```
   
   Or use any static file server. The app will be available at `http://localhost:8080`

## Development

Watch for TypeScript changes:
```bash
npm run dev
```

## Browser Requirements

- **Chrome/Edge**: Full support ✅
- **Safari**: Limited (Speech Recognition API support varies) ⚠️
- **Firefox**: Limited ⚠️

## HTTPS Requirement

The app requires HTTPS (or localhost) for:
- Microphone access
- Service Worker
- PWA installation

For production, deploy to a server with HTTPS enabled.

## Testing

1. Open the app in Chrome/Edge
2. Click the FAB button to start recording
3. Speak: "Toyota Corolla 2016 Rawalpindi"
4. Wait for AI processing
5. View extracted filters

## Troubleshooting

### Microphone not working
- Ensure HTTPS or localhost
- Check browser permissions
- Try a different browser

### OpenAI API errors
- Verify API URL and key are correct
- Check browser console for detailed errors
- Ensure CORS is enabled on your API endpoint

### Service Worker not registering
- Must be served over HTTPS or localhost
- Check browser console for errors

