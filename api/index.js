import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pipelineRoutes from '../server/routes/pipeline.js';
import { getCorsOptions } from '../server/middleware/security.js';

dotenv.config();

const app = express();

// Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP in dev to allow Vite inline scripts
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
app.use(cors(getCorsOptions()));

// Body Parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'SpecForge AI Product Intelligence',
    version: '1.0.0',
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Pipeline routes
app.use('/api', pipelineRoutes);

// Centralized Error Sanitizer Middleware
app.use((err, req, res, next) => {
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}`;
  console.error(`[SpecForge API Error] [${requestId}]:`, err);

  const isProd = process.env.NODE_ENV === 'production';
  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    error: isProd ? 'An internal server error occurred processing your request.' : err.message,
    requestId,
    ...(isProd ? {} : { stack: err.stack })
  });
});

export default app;
