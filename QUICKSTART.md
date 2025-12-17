# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install & Build
```bash
npm install
npm run build
```

### 2. Create PWA Icons (Required)
Create two icon files in the root directory:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

You can use any image editor or online tool like:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/

### 3. Configure OpenAI API

**Option A: Edit config.js (Recommended)**
1. Edit `config.js` and add your API key:
   ```javascript
   window.__APP_CONFIG__ = {
     openAIKey: 'sk-your-openai-api-key-here'
   };
   ```

**Option B: Via Browser Console**
1. Open the app in your browser
2. Open Developer Console (F12)
3. Run:
```javascript
window.app.setOpenAIConfig('sk-your-api-key-here')
```

### 4. Run the App
```bash
npm run serve
```

Then open: `http://localhost:8080`

## 📱 How to Use

1. **Click the FAB button** (floating blue button) to start recording
2. **Speak your car search query** in Urdu, Roman Urdu, or English
   - Example: "Toyota Corolla 2016 Rawalpindi"
   - Example: "Honda Civic under 50 lakhs Karachi"
3. **Wait for processing** - The AI will extract filters automatically
4. **View results** - See the structured search filters displayed

## 🔧 Features

✅ Voice input (30-second max)  
✅ Real-time audio visualization  
✅ Live transcription  
✅ AI-powered filter extraction  
✅ Mobile-first PWA design  
✅ Works offline (after first load)  

## ⚠️ Requirements

- **HTTPS or localhost** (required for microphone access)
- **Chrome/Edge browser** (best support)
- **Microphone permissions** (grant when prompted)

## 🐛 Troubleshooting

**Microphone not working?**
- Ensure you're on HTTPS or localhost
- Check browser permissions
- Try Chrome/Edge browser

**OpenAI errors?**
- Verify API URL and key are correct
- Check browser console for details
- Ensure CORS is enabled on your API

**Service Worker issues?**
- Must be served over HTTPS or localhost
- Clear browser cache and reload

## 📝 Next Steps

Once you have the OpenAI API URL, configure it and the app will be ready to use!

