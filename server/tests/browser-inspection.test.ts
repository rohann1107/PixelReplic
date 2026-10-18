import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { inspectWebsiteWithHeadlessBrowser } from '../browser-inspection';

describe('Real Playwright Headless Browser Inspection Integration', () => {
  let server: http.Server;
  let serverPort: number;

  beforeAll(async () => {
    // Start local HTTP fixture server on random available port
    server = http.createServer((req, res) => {
      const url = req.url || '/';
      let filePath = '';
      if (url.includes('dark-copper')) {
        filePath = path.join(__dirname, '../fixtures/dark-copper-site.html');
      } else if (url.includes('light-indigo')) {
        filePath = path.join(__dirname, '../fixtures/light-indigo-site.html');
      } else if (url.includes('js-rendered')) {
        filePath = path.join(__dirname, '../fixtures/js-rendered-site.html');
      }

      if (filePath && fs.existsSync(filePath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(filePath));
      } else {
        res.writeHead(404);
        res.end('Fixture not found');
      }
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address() as any;
        serverPort = addr.port;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it(
    'inspects dark copper fixture accurately (detecting serif headings, dark tone, copper accents, and lever/button controls)',
    async () => {
      const targetUrl = `http://127.0.0.1:${serverPort}/dark-copper`;
      const result = await inspectWebsiteWithHeadlessBrowser(targetUrl, {
        bypassSsrfForTesting: true,
        timeoutMs: 15000,
      });

      expect(result.success).toBe(true);
      expect(result.title).toBe('Ripplier — Creative Idea Engine');

      // Screenshot verification
      expect(result.screenshot).toMatch(/^data:image\/png;base64,/);

      // DOM Headings & Typography
      expect(result.headings.length).toBeGreaterThan(0);
      const h1 = result.headings.find((h) => h.level === 1);
      expect(h1).toBeDefined();
      expect(h1?.text).toBe('Ripplier Editorial Experience');
      expect(h1?.fontFamily.toLowerCase()).toContain('playfair display');

      // Dark background detection
      expect(result.dominantBackground.toLowerCase()).toBe('#0d0d11');

      // Extracted Colors: should contain copper/orange accent (#E0693B)
      const orangeColor = result.extractedColors.find((c) => c.hex.toLowerCase() === '#e0693b');
      expect(orangeColor).toBeDefined();
      expect(orangeColor?.source).toBe('measured');

      // Extracted Components: SPIN SEED! and START TIMER buttons
      const spinBtn = result.components.find((c) => c.name.includes('SPIN SEED!'));
      expect(spinBtn).toBeDefined();
      expect(spinBtn?.styles.backgroundColor.toLowerCase()).toBe('#e0693b');

      const timerBtn = result.components.find((c) => c.name.includes('START TIMER'));
      expect(timerBtn).toBeDefined();

      // Switch / Lever control detection
      const leverControl = result.components.find(
        (c) => c.name.toLowerCase().includes('lever') || c.accessibleRole === 'switch'
      );
      expect(leverControl).toBeDefined();
    },
    25000
  );

  it(
    'inspects light indigo fixture accurately (detecting sans-serif, light background, indigo CTA, and pricing card)',
    async () => {
      const targetUrl = `http://127.0.0.1:${serverPort}/light-indigo`;
      const result = await inspectWebsiteWithHeadlessBrowser(targetUrl, {
        bypassSsrfForTesting: true,
        timeoutMs: 15000,
      });

      expect(result.success).toBe(true);
      expect(result.title).toBe('SaaSify — Modern Cloud Platform');

      // Light background detection
      expect(result.dominantBackground.toLowerCase()).toBe('#ffffff');

      // Headings
      const h1 = result.headings.find((h) => h.level === 1);
      expect(h1).toBeDefined();
      expect(h1?.text).toBe('Build software faster than ever');
      expect(h1?.fontFamily.toLowerCase()).toContain('sans-serif');

      // Indigo primary color
      const indigoColor = result.extractedColors.find((c) => c.hex.toLowerCase() === '#4f46e5');
      expect(indigoColor).toBeDefined();

      // CTA button
      const ctaBtn = result.components.find((c) => c.name.includes('Sign In') || c.name.includes('Get Started'));
      expect(ctaBtn).toBeDefined();
    },
    25000
  );

  it(
    'executes and inspects client-side JavaScript rendered content after hydration',
    async () => {
      const targetUrl = `http://127.0.0.1:${serverPort}/js-rendered`;
      const result = await inspectWebsiteWithHeadlessBrowser(targetUrl, {
        bypassSsrfForTesting: true,
        timeoutMs: 15000,
      });

      expect(result.success).toBe(true);
      expect(result.title).toBe('CyberTerminal — Client Hydrated');

      // Hydrated DOM elements
      expect(result.textSnippets.some((t) => t.includes('Real-time metrics'))).toBe(true);

      const execBtn = result.components.find((c) => c.name.includes('EXECUTE SCRIPT'));
      expect(execBtn).toBeDefined();
    },
    25000
  );

  it(
    'handles navigation errors gracefully when destination cannot be reached',
    async () => {
      const invalidPortUrl = 'http://127.0.0.1:59999/does-not-exist';
      await expect(
        inspectWebsiteWithHeadlessBrowser(invalidPortUrl, {
          bypassSsrfForTesting: true,
          timeoutMs: 4000,
        })
      ).rejects.toThrow();
    },
    10000
  );
});
