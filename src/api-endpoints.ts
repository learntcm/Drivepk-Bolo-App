// API Endpoints Constants
export const API_ENDPOINTS = {
    // Authentication Endpoints
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: (token: string) => `/auth/verify-email/${token}`,
        SEND_OTP: '/auth/send-otp',
        VERIFY_OTP: '/auth/verify-otp',
        PHONE_LOGIN: '/auth/phone-login',
        OTP_LOGIN: '/auth/otp-login',
        REGISTER_NEW_USER: '/auth/register-new-user',
        GOOGLE: '/auth/google',
        FACEBOOK: '/auth/facebook',
        APPLE: '/auth/apple',
        PROFILE: '/auth/profile',
        CHANGE_PASSWORD: '/auth/change-password'
    },

    USERS: {
        PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile/update',
        CHANGE_PASSWORD: '/users/change-password',
        UPLOAD_AVATAR: '/users/avatar/upload',
        DELETE_AVATAR: '/users/avatar/delete',
        DELETE_ACCOUNT: '/users/account',
        CHECK_PHONE: (phone: string) => `/users/check-phone/${phone}`
    },

    // Car Posts Endpoints
    CARS: {
        BASE: '/cars',
        BY_ID: (id: string) => `/cars/${id}`,
        BY_USER: (userId: string) => `/cars/user/${userId}`,
        USER_CAR: (id: string) => `/cars/user/car/${id}`,
        SOLD: (id: string) => `/cars/${id}/mark-sold`,
        FAVORITE: (id: string) => `/cars/${id}/favorite`,
        REPORT: (id: string) => `/cars/${id}/report`,
        VIEW: (id: string) => `/cars/${id}`,
        SIMILAR: (id: string) => `/cars/${id}/similar`,
        BRANDS: '/cars/brands',
        MODELS_BY_BRAND: (brandId: string) => `/cars/brands/${brandId}/models`,
        FEATURED: '/cars/featured',
        POPULAR: '/cars/popular',
        RECENT: '/cars/recent',
        FILTER_OPTIONS: '/cars/filter-options'
    },

    // Dealer Endpoints
    DEALERS: {
        BASE: '/dealers',
        BY_ID: (id: string) => `/dealers/${id}`,
        BY_USER: (userId: string) => `/dealers/user/${userId}`,
        CARS: (dealerId: string) => `/dealers/${dealerId}/cars`,
        CARS_RECENT: '/dealers/cars/recent',
        CARS_RENTAL: '/dealers/cars/rental',
        REVIEWS: (dealerId: string) => `/dealers/${dealerId}/reviews`,
        REVIEW_RESPOND: (reviewId: string) => `/dealers/reviews/${reviewId}/respond`,
        REVIEW_REPORT: (reviewId: string) => `/dealers/reviews/${reviewId}/report`,
        STATS: (dealerId: string) => `/dealers/${dealerId}/stats`,
        ANALYTICS: (dealerId: string) => `/dealers/${dealerId}/analytics`,
        INQUIRY: (dealerId: string) => `/dealers/${dealerId}/inquiry`,
        INQUIRIES: (dealerId: string) => `/dealers/${dealerId}/inquiries`,
        INQUIRY_READ: (inquiryId: string) => `/dealers/inquiries/${inquiryId}/read`,
        FEATURED: '/dealers/featured',
        PREMIUM: '/dealers/premium',
        NEARBY: '/dealers/nearby',
        FILTER_OPTIONS: '/dealers/filter-options'
    },

    // Admin Endpoints
    ADMIN: {
        // Car Management
        CARS: {
            APPROVE: (id: string) => `/admin/cars/${id}/approve`,
            REJECT: (id: string) => `/admin/cars/${id}/reject`,
            FEATURE: (id: string) => `/admin/cars/${id}/feature`
        },

        // Dealer Management
        DEALERS: {
            VERIFY: (id: string) => `/admin/dealers/${id}/verify`,
            UNVERIFY: (id: string) => `/admin/dealers/${id}/unverify`,
            PREMIUM: (id: string) => `/admin/dealers/${id}/premium`,
            SUSPEND: (id: string) => `/admin/dealers/${id}/suspend`,
            ACTIVATE: (id: string) => `/admin/dealers/${id}/activate`
        },

        // User Management
        USERS: {
            BASE: '/users/admin',
            ALL: '/users/admin/all',
            BY_ID: (id: string) => `/users/admin/${id}`,
            UPDATE: (id: string) => `/users/admin/${id}`,
            SOFT_DELETE: (id: string) => `/users/admin/${id}/soft`,
            HARD_DELETE: (id: string) => `/users/admin/${id}/hard`,
            TOGGLE_ACTIVE: (id: string) => `/users/admin/${id}/toggle-active`,
            UPDATE_STATUS: (id: string) => `/users/admin/${id}/status`,
            UPDATE_ROLES: (id: string) => `/users/admin/${id}/roles`,
            UPDATE_DEALER_STATUS: (id: string) => `/users/admin/${id}/dealer-status`,
            STATISTICS: '/users/admin/statistics',
            RECENT: '/users/admin/recent',
            CREATE: '/users/admin/create'
        },

        // Analytics & Reports
        ANALYTICS: {
            DASHBOARD: '/admin/analytics/dashboard',
            CARS: '/admin/analytics/cars',
            DEALERS: '/admin/analytics/dealers',
            USERS: '/admin/analytics/users',
            REVENUE: '/admin/analytics/revenue'
        },

        // Crawled Cars Management
        CRAWLED_CARS: {
            BASE: '/admin/crawled-cars',
            ALL: '/admin/crawled-cars/all',
            BY_ID: (id: string) => `/admin/crawled-cars/${id}`,
            APPROVE: (id: string) => `/admin/crawled-cars/${id}/approve`,
            REJECT: (id: string) => `/admin/crawled-cars/${id}/reject`,
            DELETE: (id: string) => `/admin/crawled-cars/${id}`,
            BULK_APPROVE: '/admin/crawled-cars/bulk-approve',
            BULK_REJECT: '/admin/crawled-cars/bulk-reject',
            BULK_DELETE: '/admin/crawled-cars/bulk-delete',
            UPLOAD: '/admin/crawled-cars/upload',
            STATISTICS: '/admin/crawled-cars/statistics',
            EXPORT: '/admin/crawled-cars/export'
        },

        // System
        SYSTEM: {
            SETTINGS: '/admin/system/settings',
            LOGS: '/admin/system/logs',
            BACKUP: '/admin/system/backup',
            HEALTH: '/admin/system/health'
        }
    },

    // User Profile Endpoints
    USER: {
        PROFILE: '/user/profile',
        CARS: '/user/cars',
        FAVORITES: '/user/favorites',
        SAVED_ADS: '/saved-ads',
        INQUIRIES: '/user/inquiries',
        ALERTS: '/user/alerts',
        SETTINGS: '/user/settings',
        NOTIFICATIONS: '/user/notifications',
        // Data Deletion Endpoints
        DATA_DELETION_REQUEST: '/user/data-deletion-request',
        DATA_DELETION_REQUESTS: '/user/data-deletion-requests',
        DATA_DELETION_HISTORY: '/user/data-deletion-history',
        DATA_DELETION_INFO: '/user/data-deletion-info',
        EXPORT_DATA: '/user/export-data',
        IMMEDIATE_DELETION: '/user/immediate-deletion'
    },

    // Province Management Endpoints
    PROVINCES: {
        BASE: '/provinces',
        BY_ID: (id: string) => `/provinces/${id}`,
        BY_NAME: (name: string) => `/provinces/name/${name}`,
        CITIES: (provinceId: string) => `/provinces/${provinceId}/cities`,
        CITY: (provinceId: string, cityName: string) => `/provinces/${provinceId}/cities/${cityName}`,
        AREAS: (provinceId: string, cityName: string) => `/provinces/${provinceId}/cities/${cityName}/areas`,
        AREA: (provinceId: string, cityName: string, areaName: string) => `/provinces/${provinceId}/cities/${cityName}/areas/${areaName}`,
        ADMIN: {
            ALL: '/provinces/admin/all',
            BY_ID: (id: string) => `/provinces/admin/${id}`,
            CREATE: '/provinces/admin',
            UPDATE: (id: string) => `/provinces/admin/${id}`,
            DELETE: (id: string) => `/provinces/admin/${id}`,
            STATISTICS: '/provinces/admin/statistics',
            BULK_IMPORT: '/provinces/admin/bulk-import',
            EXPORT: '/provinces/admin/export',
            ADD_CITY: (provinceId: string) => `/provinces/admin/${provinceId}/cities`,
            UPDATE_CITY: (provinceId: string, cityName: string) => `/provinces/admin/${provinceId}/cities/${cityName}`,
            DELETE_CITY: (provinceId: string, cityName: string) => `/provinces/admin/${provinceId}/cities/${cityName}`,
            ADD_AREA: (provinceId: string, cityName: string) => `/provinces/admin/${provinceId}/cities/${cityName}/areas`,
            UPDATE_AREA: (provinceId: string, cityName: string, areaName: string) => `/provinces/admin/${provinceId}/cities/${cityName}/areas/${areaName}`,
            DELETE_AREA: (provinceId: string, cityName: string, areaName: string) => `/provinces/admin/${provinceId}/cities/${cityName}/areas/${areaName}`
        }
    },

    // Brand Management Endpoints
    BRANDS: {
        BASE: '/brands',
        BY_ID: (id: string) => `/brands/${id}`,
        BY_SLUG: (slug: string) => `/brands/slug/${slug}`,
        LOGO: (id: string) => `/brands/${id}/logo`
    },

    // Car Model Management Endpoints
    CAR_MODELS: {
        BASE: '/car-models',
        BY_ID: (id: string) => `/car-models/${id}`,
        BY_SLUG: (slug: string) => `/car-models/slug/${slug}`,
        BY_BRAND: (brandId: string) => `/car-models?brand=${brandId}`
    },

    // S3 Upload Endpoints
    S3: {
        GENERATE_SIGNED_URLS: '/s3/generate-signed-urls'
    },

    // Miscellaneous Endpoints
    MISC: {
        CONTACT: '/contact',
        FEEDBACK: '/feedback',
        SEND_FEEDBACK: '/feedback/send-feedback',
        NEWSLETTER: '/newsletter',
        UPLOAD: '/upload',
        SEARCH: '/search',
        LOCATIONS: '/locations',
        BRANDS: '/brands',
        MODELS: '/models'
    },

    // Payment Endpoints
    PAYMENTS: {
        BASE: '/payments',
        INTENTS: '/payments/intents',
        CONFIRM: '/payments/confirm',
        REFUND: '/payments/refund',
        HISTORY: '/payments/history',
        METHODS: '/payments/methods'
    },

    // Notification Endpoints
    NOTIFICATIONS: {
        BASE: '/notifications',
        MARK_READ: (id: string) => `/notifications/${id}/read`,
        MARK_ALL_READ: '/notifications/mark-all-read',
        SETTINGS: '/notifications/settings',
        SUBSCRIBE: '/notifications/subscribe',
        UNSUBSCRIBE: '/notifications/unsubscribe',

        // Topic Notifications
        TOPICS: {
            BASE: '/notifications/topics',
            SCHEDULE: '/notifications/topics/schedule',
            SEND_IMMEDIATE: '/notifications/topics/send-immediate',
            SEND_DIRECT: '/notifications/topics/send-direct',
            QUEUE_STATS: '/notifications/topics/queue-stats',
            CLEANUP: '/notifications/topics/cleanup',
            PAUSE_QUEUE: '/notifications/topics/pause-queue',
            RESUME_QUEUE: '/notifications/topics/resume-queue',
            TEST: '/notifications/topics/test'
        },

        // Push Notifications
        PUSH: {
            BASE: '/notifications/push',
            SEND_TO_USER: '/notifications/push/send-to-user',
            SEND_TO_TOKENS: '/notifications/push/send-to-tokens',
            SEND_BROADCAST: '/notifications/push/send-broadcast',
            SEND_DIRECT_TO_USER: '/notifications/push/send-direct-to-user',
            STATISTICS: '/notifications/push/statistics',
            CLEANUP_TOKENS: '/notifications/push/cleanup-tokens',
            TEST: '/notifications/push/test',
            REGISTER_TOKEN: '/notifications/push/register-token',
            REGISTER_GUEST_TOKEN: '/notifications/push/register-guest-token',
            UNREGISTER_TOKEN: (token: string) => `/notifications/push/tokens/${token}`,
            GET_TOKENS: '/notifications/push/tokens',
            ANALYTICS: '/notifications/push/analytics'
        }
    },

    // Admin Car Variants
    ADMIN_CAR_VARIANTS: {
        ALL: '/admin/car-variants',
        BY_ID: (id: string) => `/admin/car-variants/${id}`,
        CREATE: '/admin/car-variants',
        CREATE_ENHANCED: '/admin/car-variants/enhanced',
        UPDATE: (id: string) => `/admin/car-variants/${id}`,
        DELETE: (id: string) => `/admin/car-variants/${id}`
    },

    // Admin Car Ads
    ADMIN_CAR_ADS: {
        ALL: '/admin/cars',
        BY_ID: (id: string) => `/admin/cars/${id}`,
        APPROVE: (id: string) => `/admin/cars/${id}/approve`,
        REJECT: (id: string) => `/admin/cars/${id}/reject`,
        UPDATE_STATUS: (id: string) => `/admin/cars/${id}/status`,
        MARK_AS_SOLD: (id: string) => `/admin/cars/${id}/mark-sold`,
        DELETE: (id: string) => `/admin/cars/${id}`
    },

    // Admin Car Reports
    ADMIN_CAR_REPORTS: {
        ALL: '/admin/car-reports',
        BY_ID: (id: string) => `/admin/car-reports/${id}`,
        REVIEW: (id: string) => `/admin/car-reports/${id}/review`,
        RESOLVE: (id: string) => `/admin/car-reports/${id}/resolve`,
        DISMISS: (id: string) => `/admin/car-reports/${id}/dismiss`,
        DELETE: (id: string) => `/admin/car-reports/${id}`
    },

    // Admin Feedback
    ADMIN_FEEDBACK: {
        ALL: '/admin/feedback',
        BY_ID: (id: string) => `/admin/feedback/${id}`,
        CREATE: '/admin/feedback',
        UPDATE: (id: string) => `/admin/feedback/${id}`,
        DELETE: (id: string) => `/admin/feedback/${id}`,
        BY_TYPE: (type: string) => `/admin/feedback/type/${type}`,
        BY_RATING: (rating: number) => `/admin/feedback/rating/${rating}`
    },

    // Admin Users
    ADMIN_USERS: {
        ALL: '/admin/users',
        BASE: '/admin/users',
        BY_ID: (id: string) => `/admin/users/${id}`,
        CREATE: '/admin/users',
        UPDATE: (id: string) => `/admin/users/${id}`,
        DELETE: (id: string) => `/admin/users/${id}`,
        STATISTICS: '/admin/users/statistics',
        RECENT: '/admin/users/recent'
    },

    // Bulk Upload Endpoints
    BULK_UPLOAD: {
        BASE: '/bulk-upload',
        UPLOAD: '/bulk-upload/upload',
        STATUS: (id: string) => `/bulk-upload/status/${id}`,
        CANCEL: (id: string) => `/bulk-upload/cancel/${id}`,
        RETRY: (id: string) => `/bulk-upload/retry/${id}`,
        ERROR_REPORT: (id: string) => `/bulk-upload/error-report/${id}`,
        TEMPLATE: '/bulk-upload/template',
        ACTIVE: '/bulk-upload/active',
        HISTORY: '/bulk-upload/all'
    },

    // Dealer Bulk Upload Endpoints
    DEALER_BULK_UPLOAD: {
        BASE: '/dealer-bulk-upload',
        UPLOAD: '/dealer-bulk-upload/upload',
        STATUS: (id: string) => `/dealer-bulk-upload/status/${id}`,
        CANCEL: (id: string) => `/dealer-bulk-upload/cancel/${id}`,
        RETRY: (id: string) => `/dealer-bulk-upload/retry/${id}`,
        ERROR_REPORT: (id: string) => `/dealer-bulk-upload/error-report/${id}`,
        TEMPLATE: '/dealer-bulk-upload/template',
        ACTIVE: '/dealer-bulk-upload/active',
        HISTORY: '/dealer-bulk-upload/all',
        BULK_DELETE_NON_ORGANIC: '/dealers/admin/bulk-delete/non-organic',
        BULK_DELETE_CAR_DEALERS: '/dealers/admin/bulk-delete/car-dealers'
    },

    // Scheduled Notifications Endpoints
    SCHEDULED_NOTIFICATIONS: {
        BASE: '/admin/scheduled-notifications',
        BY_ID: (id: string) => `/admin/scheduled-notifications/${id}`,
        CREATE: '/admin/scheduled-notifications',
        UPDATE: (id: string) => `/admin/scheduled-notifications/${id}`,
        DELETE: (id: string) => `/admin/scheduled-notifications/${id}`,
        TOGGLE: (id: string) => `/admin/scheduled-notifications/${id}/toggle`,
        TRIGGER: (id: string) => `/admin/scheduled-notifications/${id}/trigger`,
        STATS: '/admin/scheduled-notifications/stats/overview',
        PREVIEW_NEXT: '/admin/scheduled-notifications/preview/next',
        TEST_DAILY_REMINDER: '/admin/scheduled-notifications/test/daily-reminder'
    },

    // Car Alerts Endpoints
    CAR_ALERTS: {
        BASE: '/simple-car-alerts',
        SUBSCRIBE: '/simple-car-alerts/subscribe',
        UNSUBSCRIBE: (makeModelLocation: string) => `/simple-car-alerts/unsubscribe/${makeModelLocation}`,
        MY_SUBSCRIPTIONS: '/simple-car-alerts/my-subscriptions',
        CHECK_SUBSCRIPTION: (makeModelLocation: string) => `/simple-car-alerts/check-subscription/${makeModelLocation}`,
        STATS: '/simple-car-alerts/stats'
    }
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'drivepk_access_token',
    REFRESH_TOKEN: 'drivepk_refresh_token',
    USER: 'drivepk_user',
    REDIRECT_URL: 'redirectUrl',
    THEME: 'drivepk_theme',
    LANGUAGE: 'drivepk_language',
    SEARCH_HISTORY: 'drivepk_search_history',
    FAVORITES: 'drivepk_favorites',
    RECENT_VIEWS: 'drivepk_recent_views'
} as const;

// Application Constants
export const APP_CONSTANTS = {
    // Pagination
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,

    // File Upload
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_IMAGES_PER_POST: 10,

    // Validation
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    MIN_PHONE_LENGTH: 10,
    MAX_PHONE_LENGTH: 15,

    // Business Rules
    MAX_CAR_AGE: 50,
    MIN_CAR_YEAR: new Date().getFullYear() - 50,
    MAX_CAR_YEAR: new Date().getFullYear() + 1,
    MAX_MILEAGE: 1000000,

    // UI
    DEBOUNCE_TIME: 300,
    TOAST_DURATION: 5000,
    LOADING_TIMEOUT: 30000,

    // Cache
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    MAX_CACHE_SIZE: 100,

    // Retry
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
} as const;

// Currency Formats
export const CURRENCY_CONFIG = {
    PKR: {
        code: 'PKR',
        symbol: '₨',
        locale: 'en-PK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    },
    USD: {
        code: 'USD',
        symbol: '$',
        locale: 'en-US',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }
} as const;

// Date Formats
export const DATE_FORMATS = {
    SHORT: 'dd/MM/yyyy',
    LONG: 'dd MMMM yyyy',
    WITH_TIME: 'dd/MM/yyyy HH:mm',
    TIME_ONLY: 'HH:mm',
    ISO: 'yyyy-MM-ddTHH:mm:ss.SSSZ'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    UNAUTHORIZED: 'Your session has expired. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    GENERIC_ERROR: 'Something went wrong. Please try again.'
} as const;
