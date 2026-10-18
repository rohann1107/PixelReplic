import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('PixelSpec End-to-End Workflow Integration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders landing page with headline, inputs, and features', () => {
    render(<App />);
    expect(screen.getByText(/Turn any website into a/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analyze a Website/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/https:\/\/example\.com or any public domain/i)).toBeInTheDocument();
    expect(screen.getByText(/pixelspec\.blueprint → website-blueprint\.zip/i)).toBeInTheDocument();
  });

  it('rejects invalid URL input gracefully with visible validation message', async () => {
    const { container } = render(<App />);
    const input = screen.getByPlaceholderText(/https:\/\/example\.com or any public domain/i);
    const submitBtn = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    // Enter invalid text
    fireEvent.change(input, { target: { value: 'not-a-valid-url' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Invalid domain name/i)).toBeInTheDocument();
    });
  });

  it(
    'executes real analysis workflow with backend inspection data and renders results workspace',
    async () => {
      // Mock successful backend inspection
      vi.spyOn(global, 'fetch').mockImplementation(async (input: RequestInfo | URL) => {
        const urlStr = input.toString();
        if (urlStr.includes('/inspect')) {
          return new Response(
            JSON.stringify({
              success: true,
              url: 'https://stripe.com',
              title: 'Stripe | Financial Infrastructure for the Internet',
              viewport: { width: 1440, height: 900 },
              screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
              dominantBackground: '#0A2540',
              dominantText: '#FFFFFF',
              extractedColors: [
                { hex: '#0A2540', role: 'background', frequency: 60, isExact: true },
                { hex: '#635BFF', role: 'primary', frequency: 25, isExact: true },
                { hex: '#00D4AA', role: 'accent', frequency: 15, isExact: true },
              ],
              extractedFonts: ['sohne-var', 'sans-serif'],
              headings: [
                { level: 1, text: 'Financial infrastructure for the internet', source: 'measured' },
              ],
              components: [
                {
                  id: 'comp-btn-start',
                  type: 'button',
                  name: 'Start now Button',
                  confidence: 0.95,
                  semanticTag: '<button>',
                  accessibleRole: 'button',
                  boundingBox: { x: 100, y: 300, width: 120, height: 44 },
                  styles: { backgroundColor: '#635BFF', color: '#FFFFFF' },
                  variants: ['Primary'],
                  observableStates: ['Default', 'Hover'],
                  responsiveBehavior: 'Responsive',
                  subElements: ['Start now'],
                  implementationNotes: 'CTA button',
                  source: 'measured',
                },
              ],
              sections: [
                {
                  id: 'sec-hero',
                  name: 'Hero Section',
                  order: 1,
                  boundingBox: { width: 1440, height: 600 },
                  backgroundColor: '#0A2540',
                  layoutPattern: 'flex',
                  contentAlignment: 'space-between',
                  componentsContained: ['Start now Button'],
                  description: 'Primary value proposition section',
                  source: 'measured',
                },
              ],
              assets: [],
              interactions: [],
              textSnippets: ['Financial infrastructure for the internet'],
              elementsCount: 42,
              durationMs: 1200,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
        return new Response('Not found', { status: 404 });
      });

      const { container } = render(<App />);
      const input = screen.getByPlaceholderText(/https:\/\/example\.com or any public domain/i);
      const submitBtn = container.querySelector('form button[type="submit"]') as HTMLButtonElement;

      fireEvent.change(input, { target: { value: 'https://stripe.com' } });
      fireEvent.click(submitBtn);

      // Should complete and show Results workspace
      await waitFor(
        () => {
          expect(screen.getByText(/Website Reconstruction Blueprint Package/i)).toBeInTheDocument();
          expect(screen.getByRole('button', { name: /Download Complete ZIP/i })).toBeInTheDocument();
          expect(screen.getAllByText(/DESIGN.md/i).length).toBeGreaterThan(0);
        },
        { timeout: 12000 }
      );
    },
    20000
  );

  it('displays truthful error banner when inspection service fails', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(async () => {
      return new Response(JSON.stringify({ error: 'Navigation timeout of 30000ms exceeded' }), {
        status: 504,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    const { container } = render(<App />);
    const input = screen.getByPlaceholderText(/https:\/\/example\.com or any public domain/i);
    const submitBtn = container.querySelector('form button[type="submit"]') as HTMLButtonElement;

    fireEvent.change(input, { target: { value: 'https://unresponsive-site.com' } });
    fireEvent.click(submitBtn);

    await waitFor(
      () => {
        expect(screen.getByText(/Website Timed Out/i)).toBeInTheDocument();
        expect(screen.getByText(/took too long to load/i)).toBeInTheDocument();
      },
      { timeout: 12000 }
    );
  }, 20000);
});
