import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const PORT = process.env.PORT || 4000;
const PROMPT_MAX_LENGTH = 1500;
const SUPPORTED_MODELS = new Set(['sora-2', 'sora-2-pro']);
const ALLOWED_DURATIONS = [5, 10, 20];
const SUPPORTED_ASPECTS = ['16:9', '9:16', '1:1'];
const SUPPORTED_RESOLUTIONS = ['720p', '1080p'];

const openAiApiKey = process.env.OPENAI_API_KEY;

if (!openAiApiKey) {
  console.warn('[sora-server] OPENAI_API_KEY is not set. Video generation endpoints will return 500.');
}

const openai = new OpenAI({
  apiKey: openAiApiKey
});

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

const mapResolution = (aspectRatio, resolution, model) => {
  const res = resolution === '1080p' ? '1080p' : '720p';
  const aspect = aspectRatio;

  if (res === '720p') {
    if (aspect === '16:9') return '1280x720';
    if (aspect === '9:16') return '720x1280';
    if (aspect === '1:1') return '1024x1024';
  }

  // 1080p-style requests map to the closest value each model supports.
  if (res === '1080p') {
    if (aspect === '16:9') {
      return model === 'sora-2-pro' ? '1792x1024' : '1280x720';
    }
    if (aspect === '9:16') {
      return model === 'sora-2-pro' ? '1024x1792' : '720x1280';
    }
    if (aspect === '1:1') {
      return '1024x1024';
    }
  }

  return null;
};

const normalizePrompt = value => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const handleOpenAIError = (error, res) => {
  const status = error?.status || error?.response?.status || 500;
  const data = error?.response?.data;
  const message =
    data?.error?.message ||
    data?.message ||
    error?.message ||
    'Unexpected error while contacting OpenAI.';

  if (status === 401) {
    return res.status(401).json({ error: 'OpenAI rejected the request (401). Please verify the server API key.' });
  }

  if (status === 429) {
    return res.status(429).json({ error: 'OpenAI rate limit exceeded (429). Please wait and try again.' });
  }

  if (status === 400) {
    return res.status(400).json({ error: message });
  }

  console.error('[sora-server] Unexpected error:', message);
  return res.status(500).json({ error: 'Sora generation failed. Please try again later.' });
};

app.post('/api/sora/generate', async (req, res) => {
  if (!openAiApiKey) {
    return res.status(500).json({ error: 'Server missing OPENAI_API_KEY configuration.' });
  }

  const {
    prompt,
    model = 'sora-2',
    duration = 5,
    aspect_ratio = '16:9',
    resolution = '720p'
  } = req.body || {};

  const normalizedPrompt = normalizePrompt(prompt);
  if (!normalizedPrompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  if (normalizedPrompt.length > PROMPT_MAX_LENGTH) {
    return res.status(400).json({ error: `Prompt is too long (max ${PROMPT_MAX_LENGTH} characters).` });
  }

  const normalizedModel = SUPPORTED_MODELS.has(model) ? model : 'sora-2';
  const durationNumber = Number(duration);
  const clipDuration = ALLOWED_DURATIONS.includes(durationNumber) ? durationNumber : 5;
  const normalizedAspect = SUPPORTED_ASPECTS.includes(aspect_ratio) ? aspect_ratio : '16:9';
  const normalizedResolution = SUPPORTED_RESOLUTIONS.includes(resolution) ? resolution : '720p';
  const outputResolution = mapResolution(normalizedAspect, normalizedResolution, normalizedModel);

  const payload = {
    model: normalizedModel,
    prompt: normalizedPrompt,
    clip_duration_in_seconds: clipDuration
  };

  if (outputResolution) {
    payload.output_resolution = outputResolution;
  }

  try {
    const job = await openai.videos.create(payload);
    return res.json({ id: job.id, status: job.status });
  } catch (error) {
    return handleOpenAIError(error, res);
  }
});

app.get('/api/sora/status/:id', async (req, res) => {
  if (!openAiApiKey) {
    return res.status(500).json({ error: 'Server missing OPENAI_API_KEY configuration.' });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing video job id.' });
  }

  try {
    const job = await openai.videos.retrieve(id);
    const payload = {
      id: job.id,
      status: job.status,
      progress: job.progress ?? null
    };

    if (job.status === 'failed') {
      payload.error = job.error?.message || 'Video generation failed.';
    }

    if (job.status === 'completed') {
      payload.video_url = `/api/sora/video/${job.id}`;
      payload.expires_at = job.expires_at ?? null;
    }

    return res.json(payload);
  } catch (error) {
    return handleOpenAIError(error, res);
  }
});

app.get('/api/sora/video/:id', async (req, res) => {
  if (!openAiApiKey) {
    return res.status(500).json({ error: 'Server missing OPENAI_API_KEY configuration.' });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing video job id.' });
  }

  try {
    const response = await openai.videos.downloadContent(id, { variant: 'video' });
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'no-store');
    return res.send(buffer);
  } catch (error) {
    return handleOpenAIError(error, res);
  }
});

app.get('/api/health', (_req, res) => {
  return res.json({ ok: true, soraConfigured: Boolean(openAiApiKey) });
});

app.listen(PORT, () => {
  console.log(`[sora-server] listening on http://localhost:${PORT}`);
});
