export declare const API_ENDPOINTS: {
    readonly AUTH: {
        readonly LOGIN: "/auth/login";
        readonly REGISTER: "/auth/register";
        readonly LOGOUT: "/auth/logout";
        readonly REFRESH: "/auth/refresh";
        readonly FORGOT_PASSWORD: "/auth/forgot-password";
        readonly RESET_PASSWORD: "/auth/reset-password";
        readonly VERIFY_EMAIL: (token: string) => string;
        readonly SEND_OTP: "/auth/send-otp";
        readonly VERIFY_OTP: "/auth/verify-otp";
        readonly PHONE_LOGIN: "/auth/phone-login";
        readonly OTP_LOGIN: "/auth/otp-login";
        readonly REGISTER_NEW_USER: "/auth/register-new-user";
        readonly GOOGLE: "/auth/google";
        readonly FACEBOOK: "/auth/facebook";
        readonly APPLE: "/auth/apple";
        readonly PROFILE: "/auth/profile";
        readonly CHANGE_PASSWORD: "/auth/change-password";
    };
    readonly USERS: {
        readonly PROFILE: "/users/profile";
        readonly UPDATE_PROFILE: "/users/profile/update";
        readonly CHANGE_PASSWORD: "/users/change-password";
        readonly UPLOAD_AVATAR: "/users/avatar/upload";
        readonly DELETE_AVATAR: "/users/avatar/delete";
        readonly DELETE_ACCOUNT: "/users/account";
        readonly CHECK_PHONE: (phone: string) => string;
    };
    readonly CARS: {
        readonly BASE: "/cars";
        readonly BY_ID: (id: string) => string;
        readonly BY_USER: (userId: string) => string;
        readonly USER_CAR: (id: string) => string;
        readonly SOLD: (id: string) => string;
        readonly FAVORITE: (id: string) => string;
        readonly REPORT: (id: string) => string;
        readonly VIEW: (id: string) => string;
        readonly SIMILAR: (id: string) => string;
        readonly BRANDS: "/cars/brands";
        readonly MODELS_BY_BRAND: (brandId: string) => string;
        readonly FEATURED: "/cars/featured";
        readonly POPULAR: "/cars/popular";
        readonly RECENT: "/cars/recent";
        readonly FILTER_OPTIONS: "/cars/filter-options";
    };
    readonly DEALERS: {
        readonly BASE: "/dealers";
        readonly BY_ID: (id: string) => string;
        readonly BY_USER: (userId: string) => string;
        readonly CARS: (dealerId: string) => string;
        readonly CARS_RECENT: "/dealers/cars/recent";
        readonly CARS_RENTAL: "/dealers/cars/rental";
        readonly REVIEWS: (dealerId: string) => string;
        readonly REVIEW_RESPOND: (reviewId: string) => string;
        readonly REVIEW_REPORT: (reviewId: string) => string;
        readonly STATS: (dealerId: string) => string;
        readonly ANALYTICS: (dealerId: string) => string;
        readonly INQUIRY: (dealerId: string) => string;
        readonly INQUIRIES: (dealerId: string) => string;
        readonly INQUIRY_READ: (inquiryId: string) => string;
        readonly FEATURED: "/dealers/featured";
        readonly PREMIUM: "/dealers/premium";
        readonly NEARBY: "/dealers/nearby";
        readonly FILTER_OPTIONS: "/dealers/filter-options";
    };
    readonly ADMIN: {
        readonly CARS: {
            readonly APPROVE: (id: string) => string;
            readonly REJECT: (id: string) => string;
            readonly FEATURE: (id: string) => string;
        };
        readonly DEALERS: {
            readonly VERIFY: (id: string) => string;
            readonly UNVERIFY: (id: string) => string;
            readonly PREMIUM: (id: string) => string;
            readonly SUSPEND: (id: string) => string;
            readonly ACTIVATE: (id: string) => string;
        };
        readonly USERS: {
            readonly BASE: "/users/admin";
            readonly ALL: "/users/admin/all";
            readonly BY_ID: (id: string) => string;
            readonly UPDATE: (id: string) => string;
            readonly SOFT_DELETE: (id: string) => string;
            readonly HARD_DELETE: (id: string) => string;
            readonly TOGGLE_ACTIVE: (id: string) => string;
            readonly UPDATE_STATUS: (id: string) => string;
            readonly UPDATE_ROLES: (id: string) => string;
            readonly UPDATE_DEALER_STATUS: (id: string) => string;
            readonly STATISTICS: "/users/admin/statistics";
            readonly RECENT: "/users/admin/recent";
            readonly CREATE: "/users/admin/create";
        };
        readonly ANALYTICS: {
            readonly DASHBOARD: "/admin/analytics/dashboard";
            readonly CARS: "/admin/analytics/cars";
            readonly DEALERS: "/admin/analytics/dealers";
            readonly USERS: "/admin/analytics/users";
            readonly REVENUE: "/admin/analytics/revenue";
        };
        readonly CRAWLED_CARS: {
            readonly BASE: "/admin/crawled-cars";
            readonly ALL: "/admin/crawled-cars/all";
            readonly BY_ID: (id: string) => string;
            readonly APPROVE: (id: string) => string;
            readonly REJECT: (id: string) => string;
            readonly DELETE: (id: string) => string;
            readonly BULK_APPROVE: "/admin/crawled-cars/bulk-approve";
            readonly BULK_REJECT: "/admin/crawled-cars/bulk-reject";
            readonly BULK_DELETE: "/admin/crawled-cars/bulk-delete";
            readonly UPLOAD: "/admin/crawled-cars/upload";
            readonly STATISTICS: "/admin/crawled-cars/statistics";
            readonly EXPORT: "/admin/crawled-cars/export";
        };
        readonly SYSTEM: {
            readonly SETTINGS: "/admin/system/settings";
            readonly LOGS: "/admin/system/logs";
            readonly BACKUP: "/admin/system/backup";
            readonly HEALTH: "/admin/system/health";
        };
    };
    readonly USER: {
        readonly PROFILE: "/user/profile";
        readonly CARS: "/user/cars";
        readonly FAVORITES: "/user/favorites";
        readonly SAVED_ADS: "/saved-ads";
        readonly INQUIRIES: "/user/inquiries";
        readonly ALERTS: "/user/alerts";
        readonly SETTINGS: "/user/settings";
        readonly NOTIFICATIONS: "/user/notifications";
        readonly DATA_DELETION_REQUEST: "/user/data-deletion-request";
        readonly DATA_DELETION_REQUESTS: "/user/data-deletion-requests";
        readonly DATA_DELETION_HISTORY: "/user/data-deletion-history";
        readonly DATA_DELETION_INFO: "/user/data-deletion-info";
        readonly EXPORT_DATA: "/user/export-data";
        readonly IMMEDIATE_DELETION: "/user/immediate-deletion";
    };
    readonly PROVINCES: {
        readonly BASE: "/provinces";
        readonly BY_ID: (id: string) => string;
        readonly BY_NAME: (name: string) => string;
        readonly CITIES: (provinceId: string) => string;
        readonly CITY: (provinceId: string, cityName: string) => string;
        readonly AREAS: (provinceId: string, cityName: string) => string;
        readonly AREA: (provinceId: string, cityName: string, areaName: string) => string;
        readonly ADMIN: {
            readonly ALL: "/provinces/admin/all";
            readonly BY_ID: (id: string) => string;
            readonly CREATE: "/provinces/admin";
            readonly UPDATE: (id: string) => string;
            readonly DELETE: (id: string) => string;
            readonly STATISTICS: "/provinces/admin/statistics";
            readonly BULK_IMPORT: "/provinces/admin/bulk-import";
            readonly EXPORT: "/provinces/admin/export";
            readonly ADD_CITY: (provinceId: string) => string;
            readonly UPDATE_CITY: (provinceId: string, cityName: string) => string;
            readonly DELETE_CITY: (provinceId: string, cityName: string) => string;
            readonly ADD_AREA: (provinceId: string, cityName: string) => string;
            readonly UPDATE_AREA: (provinceId: string, cityName: string, areaName: string) => string;
            readonly DELETE_AREA: (provinceId: string, cityName: string, areaName: string) => string;
        };
    };
    readonly BRANDS: {
        readonly BASE: "/brands";
        readonly BY_ID: (id: string) => string;
        readonly BY_SLUG: (slug: string) => string;
        readonly LOGO: (id: string) => string;
    };
    readonly CAR_MODELS: {
        readonly BASE: "/car-models";
        readonly BY_ID: (id: string) => string;
        readonly BY_SLUG: (slug: string) => string;
        readonly BY_BRAND: (brandId: string) => string;
    };
    readonly S3: {
        readonly GENERATE_SIGNED_URLS: "/s3/generate-signed-urls";
    };
    readonly MISC: {
        readonly CONTACT: "/contact";
        readonly FEEDBACK: "/feedback";
        readonly SEND_FEEDBACK: "/feedback/send-feedback";
        readonly NEWSLETTER: "/newsletter";
        readonly UPLOAD: "/upload";
        readonly SEARCH: "/search";
        readonly LOCATIONS: "/locations";
        readonly BRANDS: "/brands";
        readonly MODELS: "/models";
    };
    readonly PAYMENTS: {
        readonly BASE: "/payments";
        readonly INTENTS: "/payments/intents";
        readonly CONFIRM: "/payments/confirm";
        readonly REFUND: "/payments/refund";
        readonly HISTORY: "/payments/history";
        readonly METHODS: "/payments/methods";
    };
    readonly NOTIFICATIONS: {
        readonly BASE: "/notifications";
        readonly MARK_READ: (id: string) => string;
        readonly MARK_ALL_READ: "/notifications/mark-all-read";
        readonly SETTINGS: "/notifications/settings";
        readonly SUBSCRIBE: "/notifications/subscribe";
        readonly UNSUBSCRIBE: "/notifications/unsubscribe";
        readonly TOPICS: {
            readonly BASE: "/notifications/topics";
            readonly SCHEDULE: "/notifications/topics/schedule";
            readonly SEND_IMMEDIATE: "/notifications/topics/send-immediate";
            readonly SEND_DIRECT: "/notifications/topics/send-direct";
            readonly QUEUE_STATS: "/notifications/topics/queue-stats";
            readonly CLEANUP: "/notifications/topics/cleanup";
            readonly PAUSE_QUEUE: "/notifications/topics/pause-queue";
            readonly RESUME_QUEUE: "/notifications/topics/resume-queue";
            readonly TEST: "/notifications/topics/test";
        };
        readonly PUSH: {
            readonly BASE: "/notifications/push";
            readonly SEND_TO_USER: "/notifications/push/send-to-user";
            readonly SEND_TO_TOKENS: "/notifications/push/send-to-tokens";
            readonly SEND_BROADCAST: "/notifications/push/send-broadcast";
            readonly SEND_DIRECT_TO_USER: "/notifications/push/send-direct-to-user";
            readonly STATISTICS: "/notifications/push/statistics";
            readonly CLEANUP_TOKENS: "/notifications/push/cleanup-tokens";
            readonly TEST: "/notifications/push/test";
            readonly REGISTER_TOKEN: "/notifications/push/register-token";
            readonly REGISTER_GUEST_TOKEN: "/notifications/push/register-guest-token";
            readonly UNREGISTER_TOKEN: (token: string) => string;
            readonly GET_TOKENS: "/notifications/push/tokens";
            readonly ANALYTICS: "/notifications/push/analytics";
        };
    };
    readonly ADMIN_CAR_VARIANTS: {
        readonly ALL: "/admin/car-variants";
        readonly BY_ID: (id: string) => string;
        readonly CREATE: "/admin/car-variants";
        readonly CREATE_ENHANCED: "/admin/car-variants/enhanced";
        readonly UPDATE: (id: string) => string;
        readonly DELETE: (id: string) => string;
    };
    readonly ADMIN_CAR_ADS: {
        readonly ALL: "/admin/cars";
        readonly BY_ID: (id: string) => string;
        readonly APPROVE: (id: string) => string;
        readonly REJECT: (id: string) => string;
        readonly UPDATE_STATUS: (id: string) => string;
        readonly MARK_AS_SOLD: (id: string) => string;
        readonly DELETE: (id: string) => string;
    };
    readonly ADMIN_CAR_REPORTS: {
        readonly ALL: "/admin/car-reports";
        readonly BY_ID: (id: string) => string;
        readonly REVIEW: (id: string) => string;
        readonly RESOLVE: (id: string) => string;
        readonly DISMISS: (id: string) => string;
        readonly DELETE: (id: string) => string;
    };
    readonly ADMIN_FEEDBACK: {
        readonly ALL: "/admin/feedback";
        readonly BY_ID: (id: string) => string;
        readonly CREATE: "/admin/feedback";
        readonly UPDATE: (id: string) => string;
        readonly DELETE: (id: string) => string;
        readonly BY_TYPE: (type: string) => string;
        readonly BY_RATING: (rating: number) => string;
    };
    readonly ADMIN_USERS: {
        readonly ALL: "/admin/users";
        readonly BASE: "/admin/users";
        readonly BY_ID: (id: string) => string;
        readonly CREATE: "/admin/users";
        readonly UPDATE: (id: string) => string;
        readonly DELETE: (id: string) => string;
        readonly STATISTICS: "/admin/users/statistics";
        readonly RECENT: "/admin/users/recent";
    };
    readonly BULK_UPLOAD: {
        readonly BASE: "/bulk-upload";
        readonly UPLOAD: "/bulk-upload/upload";
        readonly STATUS: (id: string) => string;
        readonly CANCEL: (id: string) => string;
        readonly RETRY: (id: string) => string;
        readonly ERROR_REPORT: (id: string) => string;
        readonly TEMPLATE: "/bulk-upload/template";
        readonly ACTIVE: "/bulk-upload/active";
        readonly HISTORY: "/bulk-upload/all";
    };
    readonly DEALER_BULK_UPLOAD: {
        readonly BASE: "/dealer-bulk-upload";
        readonly UPLOAD: "/dealer-bulk-upload/upload";
        readonly STATUS: (id: string) => string;
        readonly CANCEL: (id: string) => string;
        readonly RETRY: (id: string) => string;
        readonly ERROR_REPORT: (id: string) => string;
        readonly TEMPLATE: "/dealer-bulk-upload/template";
        readonly ACTIVE: "/dealer-bulk-upload/active";
        readonly HISTORY: "/dealer-bulk-upload/all";
        readonly BULK_DELETE_NON_ORGANIC: "/dealers/admin/bulk-delete/non-organic";
        readonly BULK_DELETE_CAR_DEALERS: "/dealers/admin/bulk-delete/car-dealers";
    };
    readonly SCHEDULED_NOTIFICATIONS: {
        readonly BASE: "/admin/scheduled-notifications";
        readonly BY_ID: (id: string) => string;
        readonly CREATE: "/admin/scheduled-notifications";
        readonly UPDATE: (id: string) => string;
        readonly DELETE: (id: string) => string;
        readonly TOGGLE: (id: string) => string;
        readonly TRIGGER: (id: string) => string;
        readonly STATS: "/admin/scheduled-notifications/stats/overview";
        readonly PREVIEW_NEXT: "/admin/scheduled-notifications/preview/next";
        readonly TEST_DAILY_REMINDER: "/admin/scheduled-notifications/test/daily-reminder";
    };
    readonly CAR_ALERTS: {
        readonly BASE: "/simple-car-alerts";
        readonly SUBSCRIBE: "/simple-car-alerts/subscribe";
        readonly UNSUBSCRIBE: (makeModelLocation: string) => string;
        readonly MY_SUBSCRIPTIONS: "/simple-car-alerts/my-subscriptions";
        readonly CHECK_SUBSCRIPTION: (makeModelLocation: string) => string;
        readonly STATS: "/simple-car-alerts/stats";
    };
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly BAD_GATEWAY: 502;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const STORAGE_KEYS: {
    readonly ACCESS_TOKEN: "drivepk_access_token";
    readonly REFRESH_TOKEN: "drivepk_refresh_token";
    readonly USER: "drivepk_user";
    readonly REDIRECT_URL: "redirectUrl";
    readonly THEME: "drivepk_theme";
    readonly LANGUAGE: "drivepk_language";
    readonly SEARCH_HISTORY: "drivepk_search_history";
    readonly FAVORITES: "drivepk_favorites";
    readonly RECENT_VIEWS: "drivepk_recent_views";
};
export declare const APP_CONSTANTS: {
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
    readonly MAX_FILE_SIZE: number;
    readonly ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
    readonly MAX_IMAGES_PER_POST: 10;
    readonly MIN_PASSWORD_LENGTH: 8;
    readonly MAX_PASSWORD_LENGTH: 128;
    readonly MIN_PHONE_LENGTH: 10;
    readonly MAX_PHONE_LENGTH: 15;
    readonly MAX_CAR_AGE: 50;
    readonly MIN_CAR_YEAR: number;
    readonly MAX_CAR_YEAR: number;
    readonly MAX_MILEAGE: 1000000;
    readonly DEBOUNCE_TIME: 300;
    readonly TOAST_DURATION: 5000;
    readonly LOADING_TIMEOUT: 30000;
    readonly CACHE_DURATION: number;
    readonly MAX_CACHE_SIZE: 100;
    readonly MAX_RETRY_ATTEMPTS: 3;
    readonly RETRY_DELAY: 1000;
};
export declare const CURRENCY_CONFIG: {
    readonly PKR: {
        readonly code: "PKR";
        readonly symbol: "₨";
        readonly locale: "en-PK";
        readonly minimumFractionDigits: 0;
        readonly maximumFractionDigits: 0;
    };
    readonly USD: {
        readonly code: "USD";
        readonly symbol: "$";
        readonly locale: "en-US";
        readonly minimumFractionDigits: 0;
        readonly maximumFractionDigits: 0;
    };
};
export declare const DATE_FORMATS: {
    readonly SHORT: "dd/MM/yyyy";
    readonly LONG: "dd MMMM yyyy";
    readonly WITH_TIME: "dd/MM/yyyy HH:mm";
    readonly TIME_ONLY: "HH:mm";
    readonly ISO: "yyyy-MM-ddTHH:mm:ss.SSSZ";
};
export declare const ERROR_MESSAGES: {
    readonly NETWORK_ERROR: "Network connection error. Please check your internet connection.";
    readonly SERVER_ERROR: "Server error occurred. Please try again later.";
    readonly UNAUTHORIZED: "Your session has expired. Please log in again.";
    readonly FORBIDDEN: "You do not have permission to perform this action.";
    readonly NOT_FOUND: "The requested resource was not found.";
    readonly VALIDATION_ERROR: "Please check your input and try again.";
    readonly GENERIC_ERROR: "Something went wrong. Please try again.";
};
//# sourceMappingURL=api-endpoints.d.ts.map