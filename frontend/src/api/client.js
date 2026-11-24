// HTTP Client configured strictly for Spring Boot REST API
const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  constructor() {
    this.baseUrl = localStorage.getItem('SPRING_BOOT_API_URL') || DEFAULT_API_BASE_URL;
  }

  setBaseUrl(url) {
    this.baseUrl = url;
    localStorage.setItem('SPRING_BOOT_API_URL', url);
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  getToken() {
    return localStorage.getItem('JWT_ACCESS_TOKEN') || '';
  }

  setTokens(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem('JWT_ACCESS_TOKEN', accessToken);
    if (refreshToken) localStorage.setItem('JWT_REFRESH_TOKEN', refreshToken);
  }

  clearTokens() {
    localStorage.removeItem('JWT_ACCESS_TOKEN');
    localStorage.removeItem('JWT_REFRESH_TOKEN');
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('EXPENSE_TRACKER_CURRENT_USER', JSON.stringify(user));
    } else {
      localStorage.removeItem('EXPENSE_TRACKER_CURRENT_USER');
    }
  }

  getCurrentUser() {
    try {
      const u = localStorage.getItem('EXPENSE_TRACKER_CURRENT_USER');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const user = this.getCurrentUser();

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (user) {
      if (user.email) headers['X-User-Email'] = user.email;
      if (user.id) headers['X-User-Id'] = String(user.id);
    }

    const config = {
      ...options,
      headers,
    };

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.clearTokens();
        this.setCurrentUser(null);
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Session expired or unauthorized. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.warn(`[API Error] ${url}:`, error.message);
      throw error;
    }
  }

  getServerBaseUrl() {
    return this.baseUrl.replace(/\/api\/v1\/?$/, '');
  }

  async getActuator(endpoint) {
    const serverBase = this.getServerBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${serverBase}${cleanEndpoint}`;

    const headers = {
      Accept: 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Actuator request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`[Actuator Error] ${url}:`, error.message);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
