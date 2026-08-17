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
 * Accepts x-api-key header ONLY (query parameter authentication is strictly rejected).
 */
export const apiKeyAuth = (req, res, next) => {
  const expectedKey = process.env.APP_API_KEY;

  // If no API key is configured in backend environment, permit with next()
  if (!expectedKey) {
    return next();
  }

  const clientKey = req.headers['x-api-key'];

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
 * Uses strict explicit allowlist for production origins and localhost.
 */
export const getCorsOptions = () => {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  const defaultAllowlist = [
    'http://localhost:5173',
    'http://localhost:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3001',
    'https://spec-forge-chi.vercel.app'
  ];

  const allowlist = [...new Set([...defaultAllowlist, ...allowedOrigins])];

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl, same-origin)
      if (!origin || allowlist.includes(origin)) {
        callback(null, true);
      } else {
        const corsErr = new Error(`CORS policy violation: Origin '${origin}' is not allowed.`);
        corsErr.statusCode = 403;
        corsErr.status = 403;
        callback(corsErr);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-request-id']
  };
};

