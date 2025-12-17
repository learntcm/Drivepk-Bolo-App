import { API_ENDPOINTS } from '../api-endpoints.js';
export class CarService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    }
    async getRecentCars(page = 1, limit = 20) {
        try {
            // Use BASE endpoint as RECENT is returning 404
            const url = `${this.baseUrl}${API_ENDPOINTS.CARS.BASE}?page=${page}&limit=${limit}`;
            console.log('Fetching URL:', url);
            const response = await fetch(url);
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to fetch recent cars: ${response.statusText}`);
            }
            const rawData = await response.json();
            console.log('Response data:', rawData);
            // Map API response to PaginatedResponse interface
            return {
                data: rawData.data,
                total: rawData.pagination?.total || 0,
                page: rawData.pagination?.page || page,
                limit: rawData.pagination?.limit || limit,
                totalPages: rawData.pagination?.totalPages || 0
            };
        }
        catch (error) {
            console.error('Error fetching recent cars:', error);
            throw error;
        }
    }
    async searchCars(filters, page = 1, limit = 20) {
        try {
            // Construct query params from filters
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (filters.brand)
                params.append('make', filters.brand);
            if (filters.model)
                params.append('model', filters.model);
            if (filters.year)
                params.append('year', filters.year.toString());
            if (filters.city)
                params.append('city', filters.city);
            if (filters.color)
                params.append('color', filters.color);
            if (filters.price) {
                if (filters.price.min)
                    params.append('minPrice', filters.price.min.toString());
                if (filters.price.max)
                    params.append('maxPrice', filters.price.max.toString());
            }
            // Use CARS.BASE endpoint for filtering
            const url = `${this.baseUrl}${API_ENDPOINTS.CARS.BASE}?${params.toString()}`;
            console.log('Searching URL:', url);
            const response = await fetch(url);
            console.log('Search Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to search cars: ${response.statusText}`);
            }
            const rawData = await response.json();
            console.log('Search Response data:', rawData);
            return {
                data: rawData.data,
                total: rawData.pagination?.total || 0,
                page: rawData.pagination?.page || page,
                limit: rawData.pagination?.limit || limit,
                totalPages: rawData.pagination?.totalPages || 0
            };
        }
        catch (error) {
            console.error('Error searching cars:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=carService.js.map