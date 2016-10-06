
export const isBrowser = typeof window !== 'undefined'
export const isSmallDevice = isBrowser && window.screen.width < 800
export const env = process.env.NODE_ENV || 'development'
export const port = process.env.PORT || 3000
export const host = process.env.BASE_URL || `http://localhost:${port}`
export const apiURL = (!isBrowser ? host : '') + '/api'
export const localesURL = (!isBrowser ? host : '') + '/locales'

export const jwt = { secret: process.env.JWT_SECRET || 'React Starter Kit' }

// How many supporters does a maecenate need before it's public
export const PUBLIC_SUPPORTER_THRESHOLD = Number(process.env.PUBLIC_SUPPORTER_THRESHOLD) || 5
