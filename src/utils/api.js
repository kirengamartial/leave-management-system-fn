const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function apiRequest(path, options = {}) {
    let headers = options.headers || {};
    // If body is FormData, do not set Content-Type (browser will set it)
    if (options.body instanceof FormData) {
        headers = { ...headers };
    } else {
        headers = { 'Content-Type': 'application/json', ...headers };
    }
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw data.error || data || 'API Error';
    }
    return data;
} 