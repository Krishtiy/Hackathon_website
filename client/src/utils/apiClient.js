import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// REQUEST INTERCEPTOR: Inject Auth Token & Idempotency Key
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Inject unique Idempotency-Key on mutations to avoid duplicate charges or submits
  if (['post', 'put', 'patch'].includes(config.method.toLowerCase()) && !config.headers['Idempotency-Key']) {
    config.headers['Idempotency-Key'] = crypto.randomUUID();
  }

  return config;
});

// RESPONSE INTERCEPTOR: Exponential Backoff Retry with Full Jitter
apiClient.interceptors.response.use(null, async (error) => {
  const { config, response } = error;
  if (!config) return Promise.reject(error);

  config.__retryCount = config.__retryCount || 0;
  const MAX_RETRIES = 3;

  // Retry only on network drops or 5xx server errors / 429 Rate Limited
  const shouldRetry = !response || (response.status >= 500 && response.status <= 599) || response.status === 429;

  if (shouldRetry && config.__retryCount < MAX_RETRIES) {
    config.__retryCount += 1;

    // Respect backend 'Retry-After' header if throttled by sliding-window rate limiter
    const retryAfterHeader = response?.headers?.['retry-after'];
    const baseDelay = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : 1000 * Math.pow(2, config.__retryCount);
    
    // Add Full Jitter (random variance) to prevent thundering herd problem
    const jitteredDelay = Math.random() * baseDelay;

    await new Promise((resolve) => setTimeout(resolve, jitteredDelay));
    return apiClient(config);
  }

  return Promise.reject(error);
});

export default apiClient;
