# OpenAI API Setup Guide

## Quick Setup

### 1. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy your API key (starts with `sk-`)

### 2. Configure the App

**Method 1: Edit config.js (Recommended)**

1. Edit `config.js` and add your API key:
   ```javascript
   window.__APP_CONFIG__ = {
     openAIKey: 'sk-your-actual-api-key-here'
   };
   ```

2. Save the file - the app will automatically load it!

**Method 2: Via Browser Console**

1. Open the app in your browser
2. Open Developer Console (F12)
3. Run:
   ```javascript
   window.app.setOpenAIConfig('sk-your-api-key-here')
   ```

### 3. Test It

1. Click the record button
2. Say: "Toyota Corolla 2016 Rawalpindi"
3. Wait for AI processing
4. You should see extracted filters!

## API Details

The app uses:
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Model**: `gpt-3.5-turbo` (cost-effective and fast)
- **Format**: JSON mode (ensures structured responses)
- **Max Tokens**: 200 (sufficient for filter extraction)

## Cost Considerations

- GPT-3.5-turbo is very affordable (~$0.0015 per 1K tokens)
- Each query uses ~100-150 tokens
- Estimated cost: ~$0.0002 per search query

## Security Best Practices

⚠️ **Important:**
- Never commit your API key to version control
- `config.js` is already in `.gitignore`
- For production, consider using a backend proxy to hide your API key
- Monitor your API usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)

## Troubleshooting

**"Invalid API Key" error?**
- Verify your API key starts with `sk-`
- Check that you copied it correctly (no extra spaces)
- Ensure your OpenAI account has credits/billing set up

**"Rate limit exceeded" error?**
- You've hit OpenAI's rate limits
- Wait a moment and try again
- Consider upgrading your OpenAI plan

**"Insufficient quota" error?**
- Your OpenAI account needs billing set up
- Add a payment method at [OpenAI Billing](https://platform.openai.com/account/billing)

**CORS errors?**
- OpenAI API supports CORS from browsers
- If you see CORS errors, check your browser console
- Make sure you're using the correct endpoint URL

## Backend Integration (For Later)

When you have your backend HTTPS URL, you can switch to it:

```javascript
window.__APP_CONFIG__ = {
  openAIUrl: 'https://your-backend.com/api/openai/chat',
  openAIKey: 'your-backend-api-key'
};
```

The app automatically detects if it's an OpenAI endpoint or custom backend and formats requests accordingly.

## References

- [OpenAI API Quickstart](https://platform.openai.com/docs/quickstart)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Chat Completions Guide](https://platform.openai.com/docs/guides/text-generation)

