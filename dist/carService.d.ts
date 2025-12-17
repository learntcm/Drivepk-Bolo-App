import { Car, PaginatedResponse, CarSearchFilters } from './types.js';
export declare class CarService {
    private apiBaseUrl;
    constructor();
    private getUrl;
    getRecentCars(page?: number, limit?: number): Promise<PaginatedResponse<Car>>;
    searchCars(filters: CarSearchFilters, page?: number, limit?: number): Promise<PaginatedResponse<Car>>;
}
//# sourceMappingURL=carService.d.ts.map