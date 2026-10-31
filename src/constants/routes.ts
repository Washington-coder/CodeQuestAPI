export const ROUTES = {
  ROOT: '/',
  HEALTH: '/health',
  USERS: {
    CREATE: '/users',
    ME: '/users/me',
    PREFERENCES: '/users/me/preferences',
  },
  AUTH: {
    LOGIN: '/auth/login',
    GOOGLE_CALLBACK: '/auth/google/callback',
  },
} as const
