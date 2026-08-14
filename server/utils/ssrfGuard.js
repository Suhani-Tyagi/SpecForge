import { URL } from 'url';

/**
 * SSRF Guard Utility
 * Validates external URLs before fetching to prevent Server-Side Request Forgery.
 */
export function isSafeUrl(urlString) {
  try {
    const parsed = new URL(urlString);

    // Only allow HTTP/HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: `Disallowed protocol: ${parsed.protocol}. Only HTTP and HTTPS are permitted.` };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost and loopback addresses
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0' || hostname === '::1') {
      return { safe: false, reason: 'Access to localhost and loopback addresses is prohibited.' };
    }

    // Block private IPv4 ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x, 169.254.x.x AWS metadata)
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Pattern);
    if (match) {
      const [, p1, p2] = match.map(Number);
      if (
        p1 === 10 ||
        (p1 === 172 && p2 >= 16 && p2 <= 31) ||
        (p1 === 192 && p2 === 168) ||
        (p1 === 169 && p2 === 254)
      ) {
        return { safe: false, reason: 'Access to private and link-local IP addresses is prohibited.' };
      }
    }

    // Block cloud metadata endpoints and internal hostnames
    if (
      hostname.includes('metadata') ||
      hostname.includes('internal') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      return { safe: false, reason: 'Access to cloud metadata endpoints and internal domains is prohibited.' };
    }

    return { safe: true };
  } catch (err) {
    return { safe: false, reason: `Invalid URL format: ${err.message}` };
  }
}
