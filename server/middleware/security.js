import rateLimit from 'express-rate-limit';

/**
 * Rate Limiter for standard single-product pipeline routes
 * Max 20 requests per minute per IP
 */
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded: Too many pipeline processing requests. Please wait a minute before trying again.',
      requestId: req.headers['x-request-id'] || `req_${Date.now()}`
    });
  }
});

/**
 * Stricter Rate Limiter for Batch pipeline route
 * Max 5 batch requests per minute per IP
 */
export const batchRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Batch rate limit exceeded: Maximum 5 batch requests allowed per minute.',
      requestId: req.headers['x-request-id'] || `req_${Date.now()}`
    });
  }
});

/**
 * API Key Authentication Middleware
 * Checks `x-api-key` header against `process.env.APP_API_KEY`.
 * Bypassed in dev mode if APP_API_KEY is not configured.
 */
export const apiKeyAuth = (req, res, next) => {
  const expectedKey = process.env.APP_API_KEY;

  // If no API key is configured in backend environment, permit with log warning
  if (!expectedKey) {
    return next();
  }

  const clientKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!clientKey || clientKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing API key (x-api-key header required).',
      requestId: req.headers['x-request-id'] || `req_${Date.now()}`
    });
  }

  next();
};

/**
 * Dynamic CORS Origin Allowlist Configuration
 */
export const getCorsOptions = () => {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  const defaultAllowlist = ['http://localhost:5173', 'http://localhost:3001'];
  const allowlist = [...new Set([...defaultAllowlist, ...allowedOrigins])];

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowlist.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy violation: Origin '${origin}' is not allowed.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-request-id']
  };
};
