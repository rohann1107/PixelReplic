import express, { Request, Response } from 'express';
import cors from 'cors';
import { inspectWebsiteWithHeadlessBrowser } from './browser-inspection';
import { validateUrlForSsrf } from './url-safety';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '15mb' }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PixelSpec Headless Browser Inspection Service',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/inspect', async (req: Request, res: Response): Promise<void> => {
  const { url, viewport, timeoutMs } = req.body;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ success: false, error: 'A valid website target URL is required.' });
    return;
  }

  // 1. SSRF Safety Verification
  const safety = await validateUrlForSsrf(url);
  if (!safety.isSafe) {
    res.status(403).json({
      success: false,
      error: safety.error || 'Blocked by SSRF security restriction (private/local network destination).',
    });
    return;
  }

  // 2. Perform Real Headless Browser Inspection
  try {
    const evidence = await inspectWebsiteWithHeadlessBrowser(url, {
      viewport: viewport || { width: 1440, height: 900 },
      timeoutMs: timeoutMs || 25000,
    });

    res.json(evidence);
  } catch (err: any) {
    console.error(`[Inspection Error] Target: ${url} —`, err?.message || err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to inspect website using headless browser.',
      details: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
    });
  }
});

// Start server if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[PixelSpec Server] Real inspection backend running on http://localhost:${PORT}`);
  });
}

export default app;
