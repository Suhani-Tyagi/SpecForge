/**
 * Centralized API Client for SpecForge
 * Standardizes fetch requests, header handling, error response parsing,
 * request correlation IDs, and user-friendly error messages.
 */
export class ApiError extends Error {
  constructor(message, status, requestId = null, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.requestId = requestId;
    this.details = details;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

  const headers = {
    'Content-Type': 'application/json',
    'x-request-id': requestId,
    ...(options.headers || {})
  };

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      let userFriendlyMsg = data?.error?.message || data?.error || data?.message;

      if (!userFriendlyMsg || typeof userFriendlyMsg !== 'string') {
        if (response.status === 400) {
          userFriendlyMsg = 'Invalid request payload format. Please check submitted product fields.';
        } else if (response.status === 401) {
          userFriendlyMsg = 'Unauthorized: Missing or invalid API authentication key.';
        } else if (response.status === 429) {
          userFriendlyMsg = 'Rate limit exceeded: Too many processing requests. Please wait a minute before retrying.';
        } else if (response.status === 500) {
          userFriendlyMsg = 'SpecForge AI processing service encountered an internal error. Please try again.';
        } else {
          userFriendlyMsg = `Server returned HTTP status ${response.status}.`;
        }
      }

      throw new ApiError(userFriendlyMsg, response.status, data?.requestId || requestId, data?.details);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('SpecForge could not reach the AI processing service. Please check your network connection.', 0, requestId);
  }
}
