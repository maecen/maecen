
export const isBrowser = typeof window !== 'undefined'
export const env = process.env.NODE_ENV || 'development'
export const port = process.env.PORT || 3000
export const host = process.env.BASE_URL || `http://localhost:${port}`
export const apiURL = (typeof window === 'undefined' ? host : '') + '/api'

export const jwt = { secret: process.env.JWT_SECRET || 'React Starter Kit' }
