import { CarSearchFilters } from './types.js';
import OpenAI from 'openai';

export class OpenAIService {
  private apiKey: string;
  private openai: OpenAI | null = null;
  private customBackendUrl: string | null = null;

  constructor(apiKey: string, customBackendUrl?: string) {
    this.apiKey = apiKey;

    if (customBackendUrl) {
      // Custom backend endpoint (for later)
      this.customBackendUrl = customBackendUrl;
    } else {
      // Use OpenAI SDK directly - no URL needed
      this.openai = new OpenAI({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true // Required for browser usage
      });
    }
  }

  async convertTextToFilters(text: string): Promise<CarSearchFilters> {
    const prompt = `Convert the following car search query into structured JSON format. Extract brand, model, year, color, city, and price range if mentioned. Return only valid JSON without any explanation.

IMPORTANT: When year is spoken in Urdu/Roman Urdu, convert it to numeric format:
- "do hazar bees" / "2 hazar bees" = 2020
- "do hazar solah" / "2 hazar 16" = 2016
- "do hazar atharah" / "2 hazar 18" = 2018
- Any Urdu number words should be converted to digits

Query: "${text}"

Return JSON in this format:
{
  "brand": "string or null",
  "model": "string or null", 
  "year": number or null,
  "color": "string or null",
  "city": "string or null",
  "price": {
    "min": number or null,
    "max": number or null
  }
}

Examples:
- "Toyota Corolla 2016 Rawalpindi" → {"brand":"Toyota","model":"Corolla","year":2016,"color":null,"city":"Rawalpindi","price":null}
- "White Honda Civic under 50 lakhs Karachi" → {"brand":"Honda","model":"Civic","year":null,"color":"White","city":"Karachi","price":{"max":5000000}}
- "2018 Toyota Black" → {"brand":"Toyota","model":null,"year":2018,"color":"Black","city":null,"price":null}
- "Mein Toyota Corolla chahta hoon 2016 ka Rawalpindi mein" → {"brand":"Toyota","model":"Corolla","year":2016,"color":null,"city":"Rawalpindi","price":null}
- "Toyota Corolla do hazar bees ka" → {"brand":"Toyota","model":"Corolla","year":2020,"color":null,"city":null,"price":null}
- "Honda Civic 2 hazar solah Lahore" → {"brand":"Honda","model":"Civic","year":2016,"color":null,"city":"Lahore","price":null}
- "Suzuki Alto do hazar atharah Islamabad mein" → {"brand":"Suzuki","model":"Alto","year":2018,"color":null,"city":"Islamabad","price":null}`;

    try {
      // Use OpenAI SDK if available, otherwise use custom backend
      if (this.openai) {
        return await this.convertWithOpenAISDK(prompt);
      } else if (this.customBackendUrl) {
        return await this.convertWithCustomEndpoint(text, prompt);
      } else {
        throw new Error('OpenAI service not properly configured');
      }
    } catch (error) {
      console.error('OpenAI conversion error:', error);

      // Handle OpenAI SDK errors
      if (error instanceof Error) {
        // Check if it's an OpenAI API error
        if ((error as any).status || (error as any).code) {
          throw new Error(`OpenAI API error: ${error.message}`);
        }
        throw error;
      }

      throw new Error(`Failed to convert text to filters: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async convertWithOpenAISDK(prompt: string): Promise<CarSearchFilters> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that converts car search queries into structured JSON. Always return valid JSON only. Do not include any explanations or markdown formatting. Return only the JSON object.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      "model": "gpt-4.1-nano",
      "max_completion_tokens": 100,
      "response_format": { "type": "json_object" }
    });

    const content = completion.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('No response content from OpenAI API');
    }

    // Parse JSON response
    try {
      const filters: CarSearchFilters = JSON.parse(content);
      return this.sanitizeFilters(filters);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error(`Invalid JSON response from OpenAI: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  }

  private async convertWithCustomEndpoint(text: string, prompt: string): Promise<CarSearchFilters> {
    if (!this.customBackendUrl) {
      throw new Error('Custom backend URL not configured');
    }

    // Fallback to fetch for custom backend endpoints
    const requestBody = {
      text: text,
      prompt: prompt
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey
    };

    const response = await fetch(this.customBackendUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || response.statusText;
      throw new Error(`API error (${response.status}): ${errorMessage}`);
    }

    const data = await response.json();

    // Handle custom endpoint response formats
    let filters: CarSearchFilters;

    if (data.filters) {
      filters = data.filters;
    } else if (data.data) {
      filters = data.data;
    } else if (data.brand || data.model || data.year || data.city || data.price) {
      filters = data;
    } else {
      throw new Error('Unexpected response format from API');
    }

    return this.sanitizeFilters(filters);
  }

  private sanitizeFilters(filters: CarSearchFilters): CarSearchFilters {
    const sanitized: CarSearchFilters = {};

    if (filters.brand && typeof filters.brand === 'string') {
      sanitized.brand = filters.brand.trim();
    }

    if (filters.model && typeof filters.model === 'string') {
      sanitized.model = filters.model.trim();
    }

    if (filters.year && typeof filters.year === 'number' && filters.year > 1900 && filters.year < 2100) {
      sanitized.year = filters.year;
    }

    if (filters.color && typeof filters.color === 'string') {
      sanitized.color = filters.color.trim();
    }

    if (filters.city && typeof filters.city === 'string') {
      sanitized.city = filters.city.trim();
    }

    if (filters.price) {
      sanitized.price = {};
      if (filters.price.min && typeof filters.price.min === 'number' && filters.price.min > 0) {
        sanitized.price.min = filters.price.min;
      }
      if (filters.price.max && typeof filters.price.max === 'number' && filters.price.max > 0) {
        sanitized.price.max = filters.price.max;
      }
      if (Object.keys(sanitized.price).length === 0) {
        delete sanitized.price;
      }
    }

    return sanitized;
  }
}
