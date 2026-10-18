import dns from 'dns';
import { URL } from 'url';

// IPv4 private & reserved ranges
const PRIVATE_IPV4_PATTERNS = [
  /^0\./,                          // 0.0.0.0/8
  /^10\./,                         // 10.0.0.0/8
  /^127\./,                        // 127.0.0.0/8 (loopback)
  /^169\.254\./,                   // 169.254.0.0/16 (link-local, cloud metadata)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,// 172.16.0.0/12
  /^192\.168\./,                   // 192.168.0.0/16
  /^22[4-9]\./,                    // 224.0.0.0/4 (multicast)
  /^2[3-5][0-9]\./,                // 240.0.0.0/4 (reserved)
];

// Dangerous hostnames
const BLOCKED_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'metadata.google.internal',
  'instance-data',
];

export function isPrivateIp(ip: string): boolean {
  // IPv6 checks
  if (ip === '::1' || ip === '::' || ip.startsWith('fe80:') || ip.startsWith('fc00:') || ip.startsWith('fd00:') || ip.startsWith('ff00:')) {
    return true;
  }

  // IPv4-mapped IPv6
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  for (const pattern of PRIVATE_IPV4_PATTERNS) {
    if (pattern.test(ip)) {
      return true;
    }
  }

  return false;
}

export function isBlockedHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, '');

  if (BLOCKED_HOSTNAMES.includes(normalized)) {
    return true;
  }

  if (
    normalized.endsWith('.local') ||
    normalized.endsWith('.localhost') ||
    normalized.endsWith('.internal') ||
    normalized.endsWith('.lan') ||
    normalized.endsWith('.home') ||
    normalized.endsWith('.corp')
  ) {
    return true;
  }

  // Direct IP checks
  if (isPrivateIp(normalized)) {
    return true;
  }

  // Numeric decimal notation check (e.g. 2130706433 for 127.0.0.1)
  if (/^\d+$/.test(normalized)) {
    return true;
  }

  return false;
}

export async function validateUrlForSsrf(urlString: string): Promise<{ isSafe: boolean; error?: string; resolvedIps?: string[] }> {
  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    return { isSafe: false, error: 'Malformed URL syntax' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isSafe: false, error: `Disallowed protocol '${parsed.protocol}'. Only http: and https: are permitted.` };
  }

  const hostname = parsed.hostname;
  if (!hostname || hostname.length < 3) {
    return { isSafe: false, error: 'Invalid hostname provided' };
  }

  if (isBlockedHostname(hostname)) {
    return { isSafe: false, error: `Target host '${hostname}' points to a restricted local or internal network address.` };
  }

  // Perform DNS resolution to prevent DNS rebinding attacks pointing to private addresses
  try {
    const lookupResults = await dns.promises.lookup(hostname, { all: true });
    if (!lookupResults || lookupResults.length === 0) {
      return { isSafe: false, error: `Could not resolve domain '${hostname}' via DNS.` };
    }

    const resolvedIps: string[] = [];
    for (const record of lookupResults) {
      resolvedIps.push(record.address);
      if (isPrivateIp(record.address)) {
        return {
          isSafe: false,
          error: `Domain '${hostname}' resolves to restricted internal IP address '${record.address}'.`,
        };
      }
    }

    return { isSafe: true, resolvedIps };
  } catch (err: any) {
    return { isSafe: false, error: `DNS resolution failed for '${hostname}': ${err?.message || 'unknown error'}` };
  }
}
