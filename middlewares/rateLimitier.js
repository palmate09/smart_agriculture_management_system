import rateLimiter from 'express-rate-limit'

export const LoginLimiter = rateLimiter({
    windowMs: 15*60*1000,
    limit: 5, 
    message: 'Too many login attempts for the login , try again after 15 min',
    statusCode: 429,
    headers: true
})
 