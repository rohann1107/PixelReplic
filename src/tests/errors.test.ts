import { describe, it, expect } from 'vitest';
import { formatError } from '../lib/errors';

describe('Error Formatting and User Guidance', () => {
  it('formats invalid URL error with actionable advice', () => {
    const err = formatError('INVALID_URL', 'Failed URL parse');
    expect(err.title).toBe('Invalid Website URL');
    expect(err.suggestedAction).toContain('https://example.com');
  });

  it('formats private network SSRF blocked error', () => {
    const err = formatError('PRIVATE_NETWORK_BLOCKED');
    expect(err.title).toBe('Restricted Address Blocked');
    expect(err.suggestedAction).toContain('publicly accessible');
  });

  it('formats timeout and access blocked errors', () => {
    const err = formatError('TIMEOUT');
    expect(err.title).toBe('Website Timed Out');

    const blocked = formatError('ACCESS_BLOCKED');
    expect(blocked.title).toBe('Automated Access Restricted');
  });
});
