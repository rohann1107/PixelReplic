import { URL } from 'url';

const BLOCKED_HOST_REGEXES = [
  /^localhost$/i,
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
  /^169\.254\.\d{1,3}\.\d{1,3}$/, // Cloud metadata & link-local
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^fe80:/i,
  /^fc00:/i,
  /^fd00:/i,
  /\.internal$/i,
  /\.local$/i,
  /\.localhost$/i,
];

export function isSafePublicUrl(urlString: string): { isSafe: boolean; reason?: string } {
  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    return { isSafe: false, reason: 'Invalid URL formatting' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isSafe: false, reason: 'Unsupported scheme. Only http/https are allowed.' };
  }

  const hostname = parsed.hostname.replace(/^\[|\]$/g, '').toLowerCase();

  for (const regex of BLOCKED_HOST_REGEXES) {
    if (regex.test(hostname)) {
      return { isSafe: false, reason: `Target address '${hostname}' resolves to restricted internal network.` };
    }
  }

  return { isSafe: true };
}
