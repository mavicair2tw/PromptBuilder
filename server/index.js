import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;
const SORA_DISABLED_MESSAGE = 'OpenAI-based video generation is disabled.';

const app = express();
app.use(express.json({ limit: '1mb' }));

const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',').map(origin => origin.trim()).filter(Boolean);
app.use(
  cors({
    origin: allowedOrigins?.length ? allowedOrigins : true
  })
);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many Sora API requests. Please slow down and try again shortly.'
  }
});

app.use('/api/', limiter);

const respondSoraDisabled = (_req, res) => {
  return res.status(503).json({ error: SORA_DISABLED_MESSAGE });
};

app.post('/api/sora/generate', respondSoraDisabled);

app.get('/api/sora/status/:id', respondSoraDisabled);

app.get('/api/sora/video/:id', respondSoraDisabled);

app.get('/api/health', (_req, res) => {
  return res.json({ ok: true, soraConfigured: false, message: SORA_DISABLED_MESSAGE });
});

app.listen(PORT, () => {
  console.log(`[sora-server] listening on http://localhost:${PORT}`);
});
