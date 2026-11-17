import axios from 'axios';

export const TOKEN_KEY = 'stoneman_ops_token';

export const tokenStore = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable (private mode) — session lasts for this tab only */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 45000,
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let unauthorizedHandler = null;
export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hadToken = Boolean(error.config?.headers?.Authorization);
    if (status === 401 && hadToken && unauthorizedHandler) unauthorizedHandler(error.response?.data?.message);
    return Promise.reject(error);
  }
);

export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
  if (!error?.response) return 'Cannot reach the server. Check your connection.';
  return error.response.data?.message || fallback;
}

export function fieldErrors(error) {
  return error?.response?.data?.details || {};
}

export default api;
