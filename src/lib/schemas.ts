import { z } from 'zod';

export const UrlInputSchema = z
  .string()
  .trim()
  .min(1, 'Please enter a website URL')
  .refine(
    (val) => {
      try {
        const url = new URL(val);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'Must be a valid HTTP or HTTPS URL (e.g., https://example.com)' }
  );

export const ColorTokenSchema = z.object({
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/i),
  rgb: z.string().optional(),
  name: z.string().optional(),
  role: z.enum(['primary', 'secondary', 'background', 'surface', 'text', 'border', 'accent', 'neutral']),
  frequency: z.number().nonnegative(),
  isExact: z.boolean(),
});

export const TypographyTokenSchema = z.object({
  name: z.string(),
  fontFamily: z.string(),
  fontSize: z.string(),
  fontWeight: z.string(),
  lineHeight: z.string(),
  letterSpacing: z.string().optional(),
  color: z.string().optional(),
  isExact: z.boolean(),
});

export const ExtractedTokensSchema = z.object({
  colors: z.object({
    primary: z.array(ColorTokenSchema),
    background: z.array(ColorTokenSchema),
    surface: z.array(ColorTokenSchema),
    text: z.array(ColorTokenSchema),
    border: z.array(ColorTokenSchema),
    accent: z.array(ColorTokenSchema),
    all: z.array(ColorTokenSchema),
  }),
  typography: z.object({
    fontFamilies: z.object({
      heading: z.string(),
      body: z.string(),
      mono: z.string(),
    }),
    scale: z.array(TypographyTokenSchema),
  }),
  spacing: z.object({
    scale: z.array(
      z.object({
        key: z.string(),
        value: z.string(),
        px: z.number(),
      })
    ),
  }),
  radii: z.record(z.string()),
  shadows: z.record(z.string()),
  containers: z.record(z.string()),
  breakpoints: z.record(z.string()),
});

export const DetectedComponentSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  confidence: z.number().min(0).max(1),
  boundingBox: z
    .object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .optional(),
  styles: z.record(z.string()),
  variants: z.array(z.string()),
  observableStates: z.array(z.string()),
  responsiveBehavior: z.string(),
  subElements: z.array(z.string()),
  semanticTag: z.string(),
  accessibleRole: z.string().optional(),
  implementationNotes: z.string().optional(),
});
