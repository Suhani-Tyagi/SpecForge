import app from '../api/index.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 SpecForge AI Engine running on http://localhost:${PORT}`);
  console.log(`🔑 Gemini API Key configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
});
