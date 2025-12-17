import { CarSearchFilters } from '../types.js';
export interface Car {
    _id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    city: string;
    images: string[];
    color?: string;
    title: string;
    mileage?: number | string;
    province?: string;
    currentLocation?: {
        city?: string;
        province?: string;
        area?: string;
    };
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class CarService {
    private baseUrl;
    constructor(baseUrl: string);
    getRecentCars(page?: number, limit?: number): Promise<PaginatedResponse<Car>>;
    searchCars(filters: CarSearchFilters, page?: number, limit?: number): Promise<PaginatedResponse<Car>>;
}
//# sourceMappingURL=carService.d.ts.map