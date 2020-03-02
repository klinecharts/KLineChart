const env = process.env

export const VERSION = env.K_LINE_VERSION

export const DEV = env.NODE_ENV === 'development'
