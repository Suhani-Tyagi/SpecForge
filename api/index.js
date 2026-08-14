import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pipelineRoutes from '../server/routes/pipeline.js';

dotenv.config();

const app = express();

app.use(cors());
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

export default app;
