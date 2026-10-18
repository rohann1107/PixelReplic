# PixelSpec

<div align="center">
  <img src="public/favicon.svg" alt="PixelSpec Logo" width="64" height="64" />
  <h3>Every pixel has a blueprint.</h3>
  <p><strong>A free, browser-based website design reverse-engineering SaaS tool and AI specification generator for developers.</strong></p>

  <p>
    <a href="#quick-start">Quick Start</a> •
    <a href="#core-promise">Core Promise</a> •
    <a href="#specification-package">Specification Package</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#deployment">Free Deployment</a> •
    <a href="#testing">Tests</a> •
    <a href="#privacy--limitations">Privacy & Limitations</a>
  </p>
</div>

---

## 🌟 Core Promise
> *"Turn any website into a detailed design blueprint your AI coding agent can understand."*

PixelSpec analyzes a publicly accessible website URL or uploaded screenshot to generate a structured reconstruction package containing design tokens, section outlines, computed component CSS, responsive rules, observable states, and actionable directives for AI coding agents (Claude 3.7 Sonnet, Cursor, Devin, v0, Windsurf, Copilot).

---

## 🔒 Non-Negotiable Zero-Cost & Privacy Standards
- **100% Free**: No subscriptions, no payment gateways, no credit cards.
- **Anonymous**: No login, no signup, no account creation, no user databases.
- **Zero Paid AI Dependencies**: Uses a high-fidelity local deterministic analysis engine. Optional free AI inference can be configured as an enhancement, never as a required blocker.
- **Privacy-First**: HTML5 Canvas pixel sampling and ZIP packaging execute completely in the browser. Screenshots stay on your machine.
- **Honest Progress**: Real task-based loading stages. No fake animated percentages or mock data disguised as live analysis.

---

## 📦 What is Inside the Generated Package (`website-blueprint.zip`)?

| File | Purpose |
|:-----|:--------|
| **`DESIGN.md`** | 13-section master visual blueprint (Page geometry, colors, typography, section layout, responsive behavior, fidelity requirements, validation checklist). |
| **`COMPONENTS.md`** | Component catalog detailing navigation headers, heroes, feature cards, buttons, pricing tiers, observable interaction states (hover, focus, active), and computed CSS rules. |
| **`design-tokens.json`** | Normalized machine-readable JSON tokens for color roles, 8pt spacing grid (`--space-xs` to `--space-4xl`), typography scale, corner radii, and container widths. |
| **`assets-manifest.json`** | Catalog of referenced vector marks, logos, icons, and image dimensions with status, alt text, and accessibility metadata. |
| **`AGENT-PROMPT.md`** | Standalone step-by-step directive prompt telling your coding agent how to build the site without visual hallucinations or broken layouts. |
| **`VALIDATION.md`** | Manual QA checklist, viewport dimensions (1440px desktop, 768px tablet, 390px mobile), and visual comparison overlay criteria. |
| **`DESIGN.txt`** | Formatting-free plain text version of the blueprint for lightweight token consumption. |
| **`reference/`** | Directory containing reference screenshots for pixel verification. |

---

## 🏗️ Technology Stack

- **Frontend**: React 18, TypeScript (Strict Mode), Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **Validation**: Zod schema validation for URLs, design tokens, and component structures.
- **Packaging**: JSZip for in-browser archive compilation.
- **Analysis Engine**:
  - *Layer 1*: Client-side Canvas color histogram sampling and rule-based heuristic component classifier.
  - *Layer 2*: Optional serverless headless browser worker (Chromium / Puppeteer).
  - *Layer 3*: Optional AI semantic enricher with automatic deterministic fallback.
- **Testing**: Vitest, React Testing Library, JSDOM.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js `v18.0.0` or higher (tested on Node `v24.x`)
- npm `v9.0.0` or higher

### Installation
```bash
# Clone or navigate to the repository
cd PixelReplic

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🛠️ Development & Build Commands

```bash
# Start local Vite development server
npm run dev

# Run full TypeScript check and production build
npm run build

# Preview production build locally
npm run preview

# Run all unit and integration tests
npm test
```

---

## 🧪 Automated Test Suite

PixelSpec includes 7 test suites covering 22 unit and integration tests:

1. **`src/tests/url-validation.test.ts`**: URL normalization, scheme validation, SSRF/private IP blocking (localhost, 127.0.0.1, 10.x, 192.168.x, 169.254.x).
2. **`src/tests/token-extraction.test.ts`**: Color role assignment, frequency analysis, 8pt spacing scale, typography font stacks, Zod schema validation.
3. **`src/tests/component-detector.test.ts`**: Classification heuristics, semantic tags, confidence scoring, observable states.
4. **`src/tests/markdown-generator.test.ts`**: Verification of all 13 sections of `DESIGN.md`, `COMPONENTS.md`, `AGENT-PROMPT.md`, `VALIDATION.md`, and `DESIGN.txt`.
5. **`src/tests/zip-generator.test.ts`**: JSZip compression, in-memory archive generation, file manifest verification.
6. **`src/tests/errors.test.ts`**: User-facing error formatting, remediation tips, technical details.
7. **`src/tests/integration.test.tsx`**: Full end-to-end user flow: landing page render, URL input validation, analysis pipeline execution, and results workspace rendering.

---

## 🌐 Free Static Deployment

PixelSpec is a static SPA and can be deployed for free with zero server costs:

### Deploying to Cloudflare Pages
1. Push your repository to GitHub or GitLab.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Configure build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**.

### Deploying to GitHub Pages
1. In `vite.config.ts`, ensure base path matches your repository name if needed:
   ```ts
   export default defineConfig({
     base: './',
     plugins: [react()],
   });
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder to your `gh-pages` branch.

### Deploying to Vercel
1. Run `npx vercel` or connect the repo to Vercel.
2. Output directory defaults to `dist`. Free Hobby tier supported.

---

## ⚙️ Environment Variables & Optional Worker

PixelSpec does **not** require any environment variables to run. However, the following optional endpoints can be configured:

| Variable | Description |
|:---------|:------------|
| `window.__PIXELSPEC_WORKER_ENDPOINT__` | (Optional) Public URL of your deployed headless Chromium worker (e.g. `https://pixelspec-worker.yourname.workers.dev`). |
| `window.__PIXELSPEC_AI_ENDPOINT__` | (Optional) Public URL of an authorized free AI inference endpoint. |

See [`worker/README.md`](worker/README.md) for instructions on deploying the optional serverless worker to Cloudflare Workers or Docker.

---

## 🛡️ Privacy & Technical Limitations

- **Cross-Origin Security (CORS)**: Web browsers enforce Same-Origin Policies that prevent client-side JavaScript from reading arbitrary external HTML. When inspecting external sites without a worker proxy, use **Screenshot Mode** to extract exact canvas tokens without hitting CORS limits.
- **Protected Content**: PixelSpec does not bypass paywalls, CAPTCHAs, or authentication gates.
- **Proprietary Fonts**: Licensed commercial web fonts are cataloged and paired with standard system fallbacks.

---

## 📄 License
MIT License. Free for personal, open-source, and commercial developer use.
