
export const port = process.env.PORT || 3000
export const host = process.env.BASE_URL || `http://localhost:${port}`
export const apiURL = (typeof window === 'undefined' ? host : '') + '/api'

export const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/maecen'

export const jwt = { secret: process.env.JWT_SECRET || 'React Starter Kit' }

