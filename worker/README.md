# PixelSpec Remote Inspection Worker (Optional)

This directory contains the independently deployable serverless browser worker for **PixelSpec**.

> **Note**: PixelSpec is engineered to work completely client-side in the browser using the deterministic analysis engine and Screenshot Mode. You do **not** need to deploy this worker to use PixelSpec.

---

## Capabilities
- Headless Chromium page rendering using Cloudflare Browser Rendering or Puppeteer.
- Full computed DOM styles, CSS properties, and layout bounding boxes.
- Viewport captures across desktop (1440×900), tablet (768×1024), and mobile (390×844).
- Automatic private network and SSRF protection (blocks localhost, 127.0.0.1, 10.x, 192.168.x, 169.254.x).

---

## Free-Tier Deployment Options

### 1. Cloudflare Workers + Browser Rendering (Free Tier)
Cloudflare provides a free tier for Workers with Browser Rendering API support.

1. Install Wrangler:
   ```bash
   npm install -g wrangler
   ```
2. Authenticate:
   ```bash
   wrangler login
   ```
3. Deploy:
   ```bash
   wrangler deploy
   ```
4. Copy your worker endpoint URL (e.g., `https://pixelspec-worker.yourname.workers.dev`) and enter it in the PixelSpec frontend Analyzer Settings dialog, or define `window.__PIXELSPEC_WORKER_ENDPOINT__`.

---

## API Endpoints

- `GET /health`  
  Health check endpoint confirming worker connectivity. Returns `{ status: 'ok', worker: 'PixelSpec Remote Inspector' }`.

- `POST /inspect`  
  Accepts:
  ```json
  {
    "url": "https://example.com",
    "viewport": "desktop"
  }
  ```
  Returns:
  ```json
  {
    "success": true,
    "url": "https://example.com",
    "title": "Example Domain",
    "viewport": { "width": 1440, "height": 900 },
    "headings": [{ "level": 1, "text": "Example Domain" }],
    "extractedColors": [{ "hex": "#0F172A", "role": "text", "count": 120 }]
  }
  ```
