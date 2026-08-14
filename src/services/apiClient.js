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
      let userFriendlyMsg = 'An error occurred while contacting the server.';

      if (response.status === 400) {
        userFriendlyMsg = data?.error || 'Invalid request payload format.';
      } else if (response.status === 401) {
        userFriendlyMsg = 'Unauthorized access: Invalid or missing API authentication credentials.';
      } else if (response.status === 429) {
        userFriendlyMsg = data?.error || 'Rate limit exceeded: Too many processing requests. Please wait a minute before retrying.';
      } else if (response.status === 500) {
        userFriendlyMsg = 'SpecForge processing service encountered an internal error. Please try again.';
      }

      throw new ApiError(userFriendlyMsg, response.status, data?.requestId || requestId, data?.details);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('SpecForge could not reach the AI processing service. Please check your network connection.', 0, requestId);
  }
}
