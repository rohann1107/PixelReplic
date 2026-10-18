import { describe, it, expect, vi } from 'vitest';
import { isPrivateIp, isBlockedHostname, validateUrlForSsrf } from '../url-safety';

describe('Server SSRF Protection & URL Safety', () => {
  describe('isPrivateIp', () => {
    it('identifies loopback addresses', () => {
      expect(isPrivateIp('127.0.0.1')).toBe(true);
      expect(isPrivateIp('127.0.1.1')).toBe(true);
      expect(isPrivateIp('::1')).toBe(true);
      expect(isPrivateIp('::ffff:127.0.0.1')).toBe(true);
    });

    it('identifies RFC 1918 private subnets', () => {
      expect(isPrivateIp('10.0.0.1')).toBe(true);
      expect(isPrivateIp('10.254.254.254')).toBe(true);
      expect(isPrivateIp('172.16.0.1')).toBe(true);
      expect(isPrivateIp('172.31.255.255')).toBe(true);
      expect(isPrivateIp('192.168.1.1')).toBe(true);
      expect(isPrivateIp('192.168.0.254')).toBe(true);
    });

    it('identifies AWS / cloud metadata and link-local ranges', () => {
      expect(isPrivateIp('169.254.169.254')).toBe(true);
      expect(isPrivateIp('169.254.1.1')).toBe(true);
    });

    it('identifies IPv6 private and link-local ranges', () => {
      expect(isPrivateIp('fe80::1')).toBe(true);
      expect(isPrivateIp('fc00::1')).toBe(true);
      expect(isPrivateIp('fd00::1')).toBe(true);
    });

    it('permits public unicast IP addresses', () => {
      expect(isPrivateIp('8.8.8.8')).toBe(false);
      expect(isPrivateIp('1.1.1.1')).toBe(false);
      expect(isPrivateIp('142.250.190.46')).toBe(false);
      expect(isPrivateIp('76.76.21.21')).toBe(false); // Vercel
    });
  });

  describe('isBlockedHostname', () => {
    it('blocks dangerous well-known hostnames and TLDs', () => {
      expect(isBlockedHostname('localhost')).toBe(true);
      expect(isBlockedHostname('app.localhost')).toBe(true);
      expect(isBlockedHostname('server.local')).toBe(true);
      expect(isBlockedHostname('metadata.google.internal')).toBe(true);
      expect(isBlockedHostname('internal.corp')).toBe(true);
      expect(isBlockedHostname('router.lan')).toBe(true);
      expect(isBlockedHostname('127.0.0.1')).toBe(true);
      expect(isBlockedHostname('169.254.169.254')).toBe(true);
      expect(isBlockedHostname('2130706433')).toBe(true); // integer representation of 127.0.0.1
    });

    it('allows legitimate public hostnames', () => {
      expect(isBlockedHostname('ripplier.vercel.app')).toBe(false);
      expect(isBlockedHostname('stripe.com')).toBe(false);
      expect(isBlockedHostname('github.com')).toBe(false);
    });
  });

  describe('validateUrlForSsrf', () => {
    it('rejects disallowed protocols', async () => {
      const ftp = await validateUrlForSsrf('ftp://example.com/file');
      expect(ftp.isSafe).toBe(false);
      expect(ftp.error).toContain('Disallowed protocol');

      const file = await validateUrlForSsrf('file:///etc/passwd');
      expect(file.isSafe).toBe(false);
      expect(file.error).toContain('Disallowed protocol');
    });

    it('rejects localhost and private network targets without making requests', async () => {
      const res = await validateUrlForSsrf('http://localhost:3000');
      expect(res.isSafe).toBe(false);
      expect(res.error).toContain('restricted');

      const meta = await validateUrlForSsrf('http://169.254.169.254/latest/meta-data/');
      expect(meta.isSafe).toBe(false);
      expect(meta.error).toContain('restricted');
    });

    it('validates public domains successfully', async () => {
      // Testing with a globally known public DNS domain
      const res = await validateUrlForSsrf('https://one.one.one.one');
      expect(res.isSafe).toBe(true);
      expect(res.resolvedIps?.length).toBeGreaterThan(0);
    });
  });
});
