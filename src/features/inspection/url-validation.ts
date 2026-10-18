export interface UrlValidationResult {
  isValid: boolean;
  normalizedUrl?: string;
  error?: string;
  isPrivateNetwork?: boolean;
}

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
  /^169\.254\.\d{1,3}\.\d{1,3}$/, // Link-local
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^fe80:/i,
  /^fc00:/i,
  /^fd00:/i,
  /\.local$/i,
  /\.internal$/i,
  /\.lan$/i,
];

export function isPrivateHostname(hostname: string): boolean {
  const cleaned = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  return PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(cleaned));
}

export function validateAndNormalizeUrl(input: string): UrlValidationResult {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  let trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  // Prepend https:// if no protocol was supplied by user
  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: 'Malformed URL structure' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      isValid: false,
      error: `Unsupported protocol '${parsed.protocol}'. Only http:// and https:// are permitted.`,
    };
  }

  if (!parsed.hostname || parsed.hostname.length < 3 || !parsed.hostname.includes('.')) {
    // Check if it's localhost (which we flag as private)
    if (parsed.hostname.toLowerCase() === 'localhost') {
      return {
        isValid: false,
        isPrivateNetwork: true,
        error: 'Localhost addresses cannot be inspected remotely. Use Screenshot mode for local sites.',
      };
    }
    return {
      isValid: false,
      error: 'Invalid domain name. Must contain a valid domain (e.g. example.com).',
    };
  }

  if (isPrivateHostname(parsed.hostname)) {
    return {
      isValid: false,
      isPrivateNetwork: true,
      error: 'Private/local network addresses are restricted. Use Screenshot mode for local projects.',
    };
  }

  return {
    isValid: true,
    normalizedUrl: parsed.origin + (parsed.pathname === '/' ? '' : parsed.pathname) + parsed.search,
  };
}
