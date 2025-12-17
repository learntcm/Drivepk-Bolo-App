# Configuration Guide

## OpenAI API Configuration

Simply edit `config.js` to add your OpenAI API key.

### Setup Steps

1. **Edit `config.js`:**
   ```javascript
   window.__APP_CONFIG__ = {
     openAIKey: 'sk-your-openai-api-key-here'
   };
   ```

2. **Save the file** - the app will automatically load it on startup!

### Alternative: Browser Console

You can also configure via browser console:

```javascript
window.app.setOpenAIConfig('sk-your-api-key-here')
```

This saves to localStorage and persists across page reloads.

### Custom Backend (For Later)

When you have your backend HTTPS URL, add it to `config.js`:

```javascript
window.__APP_CONFIG__ = {
  openAIKey: 'sk-your-api-key-here',
  customBackendUrl: 'https://your-backend.com/api/endpoint'
};
```

## Security Notes

⚠️ **Important Security Considerations:**

- ✅ `config.js` is in `.gitignore` - never commit it with your real API key
- ✅ API keys are only used client-side (OpenAI SDK handles this securely)
- ⚠️ For production, consider using a backend proxy to hide your API key

## Troubleshooting

**Config not loading?**
- Make sure `config.js` exists in the root directory
- Check that `openAIKey` is set correctly in `config.js`
- Verify the file is loaded before `dist/app.js` in `index.html`
- Check browser console for errors

**API errors?**
- Verify your API key is correct (starts with `sk-`)
- Check that you have credits/billing set up on OpenAI
- Ensure CORS is enabled if using a custom backend
- Check browser console for detailed error messages
