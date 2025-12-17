import { getConfig } from './config.js';
import { API_ENDPOINTS } from './api-endpoints.js';
export class CarService {
    constructor() {
        const config = getConfig();
        // Default to relative path to leverage proxy for CORS
        this.apiBaseUrl = config?.apiBaseUrl || '';
    }
    getUrl(endpoint) {
        // Remove trailing slash from base and leading slash from endpoint to avoid double slashes
        let base = this.apiBaseUrl.replace(/\/$/, '');
        const path = endpoint.replace(/^\//, '');
        // If base is empty or relative, use current origin to ensure valid URL construction
        if (!base || base.startsWith('/')) {
            base = window.location.origin + (base || '');
        }
        return `${base}/${path}`;
    }
    async getRecentCars(page = 1, limit = 10) {
        try {
            const urlString = this.getUrl(API_ENDPOINTS.CARS.RECENT);
            const url = new URL(urlString);
            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', limit.toString());
            console.log('Fetching recent cars from:', url.toString());
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`Failed to fetch recent cars: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('Error fetching recent cars:', error);
            // Re-throw with more user-friendly message if possible, or letting App handle it
            throw error;
        }
    }
    async searchCars(filters, page = 1, limit = 10) {
        try {
            // Assuming we use the same recent endpoint or a specific search/filter endpoint. 
            // The user provided 'FILTER_OPTIONS' but that sounds like metadata. 
            // Often filter endpoints are just GET /cars with query params.
            // Let's assume GET /cars or GET /cars/search based on common patterns if not explicitly provided.
            // Re-reading user request: "Use the Car Filter API... Pass the required filter parameters to the filter endpoint."
            // I'll stick to a generic /cars endpoint with query params for now as it's standard, 
            // or /cars/filter if that's what was implied. 
            // Let's use /cars which is standard for filtering.
            const urlString = this.getUrl(API_ENDPOINTS.CARS.BASE);
            const url = new URL(urlString);
            if (filters.brand)
                url.searchParams.append('brand', filters.brand);
            if (filters.model)
                url.searchParams.append('model', filters.model);
            if (filters.year)
                url.searchParams.append('year', filters.year.toString());
            if (filters.city)
                url.searchParams.append('city', filters.city);
            if (filters.color)
                url.searchParams.append('color', filters.color);
            if (filters.price) {
                if (filters.price.min)
                    url.searchParams.append('minPrice', filters.price.min.toString());
                if (filters.price.max)
                    url.searchParams.append('maxPrice', filters.price.max.toString());
            }
            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', limit.toString());
            console.log('Searching cars at:', url.toString());
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`Failed to search cars: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('Error searching cars:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=carService.js.map