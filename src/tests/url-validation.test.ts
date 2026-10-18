import { describe, it, expect } from 'vitest';
import { validateAndNormalizeUrl, isPrivateHostname } from '../features/inspection/url-validation';

describe('URL Validation & Security Engine', () => {
  it('accepts and normalizes valid HTTPS URLs', () => {
    const res = validateAndNormalizeUrl('https://example.com/pricing');
    expect(res.isValid).toBe(true);
    expect(res.normalizedUrl).toBe('https://example.com/pricing');
  });

  it('prepends https:// when user enters domain without protocol', () => {
    const res = validateAndNormalizeUrl('github.com');
    expect(res.isValid).toBe(true);
    expect(res.normalizedUrl).toBe('https://github.com');
  });

  it('rejects unsupported protocols such as ftp, javascript, and file', () => {
    const ftpRes = validateAndNormalizeUrl('ftp://example.com/file.zip');
    expect(ftpRes.isValid).toBe(false);
    expect(ftpRes.error).toContain('Unsupported protocol');

    const jsRes = validateAndNormalizeUrl('javascript:alert(1)');
    expect(jsRes.isValid).toBe(false);

    const fileRes = validateAndNormalizeUrl('file:///etc/passwd');
    expect(fileRes.isValid).toBe(false);
  });

  it('identifies and blocks private IPv4 and localhost SSRF addresses', () => {
    expect(isPrivateHostname('localhost')).toBe(true);
    expect(isPrivateHostname('127.0.0.1')).toBe(true);
    expect(isPrivateHostname('10.0.1.5')).toBe(true);
    expect(isPrivateHostname('192.168.1.1')).toBe(true);
    expect(isPrivateHostname('172.16.0.1')).toBe(true);
    expect(isPrivateHostname('169.254.169.254')).toBe(true); // Cloud metadata
    expect(isPrivateHostname('example.local')).toBe(true);

    const localRes = validateAndNormalizeUrl('http://127.0.0.1:8080');
    expect(localRes.isValid).toBe(false);
    expect(localRes.isPrivateNetwork).toBe(true);
  });

  it('allows valid public domains', () => {
    expect(isPrivateHostname('stripe.com')).toBe(false);
    expect(isPrivateHostname('linear.app')).toBe(false);
    expect(isPrivateHostname('vercel.com')).toBe(false);
  });
});
