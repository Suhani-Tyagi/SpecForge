import { URL } from 'url';

/**
 * SSRF Guard Utility (Hardened)
 * Validates external URLs before fetching to prevent Server-Side Request Forgery.
 */
export function isSafeUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return { safe: false, reason: 'Missing or non-string URL parameter.' };
  }

  try {
    const parsed = new URL(urlString);

    // Protocol check: Only allow HTTP and HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: `Disallowed protocol: ${parsed.protocol}. Only HTTP and HTTPS are permitted.` };
    }

    // Strip surrounding brackets for IPv6 hostnames
    let hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

    // Block localhost, loopback, and broadcast hostnames
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '::' ||
      hostname.startsWith('0.')
    ) {
      return { safe: false, reason: 'Access to localhost and loopback addresses is prohibited.' };
    }

    // Block IPv4-mapped IPv6 addresses (e.g. ::ffff:127.0.0.1 or ::ffff:7f00:1)
    if (hostname.includes('ffff:')) {
      return { safe: false, reason: 'Access to IPv4-mapped IPv6 loopback and private addresses is prohibited.' };
    }

    // Block IPv6 Private and Link-Local Ranges (fc00::/7, fd00::/8, fe80::/10)
    if (
      hostname.startsWith('fe80:') ||
      hostname.startsWith('fe90:') ||
      hostname.startsWith('fea0:') ||
      hostname.startsWith('feb0:') ||
      hostname.startsWith('fc') ||
      hostname.startsWith('fd')
    ) {
      return { safe: false, reason: 'Access to IPv6 private and link-local ranges is prohibited.' };
    }

    // Check Hex / Octal / Single Decimal Number IP Bypass formats (e.g. 0x7f000001, 2130706433, 017700000001)
    if (/^(0x[0-9a-f]+|\d+)$/i.test(hostname)) {
      return { safe: false, reason: 'Numeric, hex, or octal IP encoding bypass prohibited.' };
    }

    // Standard IPv4 range check
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Pattern);
    if (match) {
      const [, p1, p2] = match.map(Number);
      if (
        p1 === 10 ||
        (p1 === 172 && p2 >= 16 && p2 <= 31) ||
        (p1 === 192 && p2 === 168) ||
        (p1 === 169 && p2 === 254) ||
        p1 === 127 ||
        p1 === 0
      ) {
        return { safe: false, reason: 'Access to private, link-local, or loopback IP addresses is prohibited.' };
      }
    }

    // Block cloud metadata endpoints and internal hostnames
    if (
      hostname.includes('metadata') ||
      hostname.includes('internal') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.lan')
    ) {
      return { safe: false, reason: 'Access to cloud metadata endpoints and internal domains is prohibited.' };
    }

    return { safe: true };
  } catch (err) {
    return { safe: false, reason: `Invalid URL format: ${err.message}` };
  }
}

