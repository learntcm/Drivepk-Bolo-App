// Configuration for OpenAI API
// Only API key is needed - OpenAI SDK handles the rest

export interface AppConfig {
  openAIKey: string;
  customBackendUrl?: string; // For OpenAI proxy
  apiBaseUrl?: string;       // For Car API
}

export function getConfig(): AppConfig | null {
  // Try to get from window object (set via script tag or browser console)
  const windowConfig = (window as any).__APP_CONFIG__;
  if (windowConfig?.openAIKey) {
    return {
      openAIKey: windowConfig.openAIKey,
      customBackendUrl: windowConfig.customBackendUrl,
      apiBaseUrl: windowConfig.apiBaseUrl
    };
  }

  // Try to get from environment variables (if using a build tool that injects them)
  const envKey = (window as any).__ENV__?.VITE_OPENAI_KEY ||
    (window as any).process?.env?.OPENAI_KEY;
  const envUrl = (window as any).__ENV__?.VITE_CUSTOM_BACKEND_URL ||
    (window as any).process?.env?.CUSTOM_BACKEND_URL;

  if (envKey) {
    return {
      openAIKey: envKey,
      customBackendUrl: envUrl
    };
  }

  // Try localStorage (for user-set config)
  try {
    const storedKey = localStorage.getItem('openai_key');
    const storedUrl = localStorage.getItem('custom_backend_url');
    if (storedKey) {
      return {
        openAIKey: storedKey,
        customBackendUrl: storedUrl || undefined
      };
    }
  } catch (e) {
    // localStorage not available
  }

  return null;
}

export function saveConfig(config: AppConfig): void {
  try {
    localStorage.setItem('openai_key', config.openAIKey);
    if (config.customBackendUrl) {
      localStorage.setItem('custom_backend_url', config.customBackendUrl);
    } else {
      localStorage.removeItem('custom_backend_url');
    }
  } catch (e) {
    console.warn('Could not save config to localStorage:', e);
  }
}

