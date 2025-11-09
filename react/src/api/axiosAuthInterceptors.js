import instance from './axios';
import { refreshTokenRequest } from './auth';

let isRefreshing = false;
let refreshPromise = null;
let subscribers = [];

function subscribeTokenRefresh(cb) { subscribers.push(cb); }
function onRefreshed(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function triggerLogout() {
  try {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth:logout'));
  } catch (_) {}
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error || {};
    const status = response?.status;

    if (status === 401 && config && !config.__isRetryRequest) {
      const storedRefresh = localStorage.getItem('refresh');
      if (!storedRefresh) {
        triggerLogout();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshTokenRequest(storedRefresh)
          .then((data) => {
            const newAccess = data?.access;
            if (newAccess) {
              localStorage.setItem('access', newAccess);
              localStorage.setItem('token', newAccess);
              try { window.dispatchEvent(new Event('auth:tokenRefreshed')); } catch (_) {}
              return newAccess;
            }
            throw new Error('No access token in refresh response');
          })
          .catch((e) => {
            triggerLogout();
            throw e;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      try {
        const newAccess = await refreshPromise;
        onRefreshed(newAccess);
        const retryConfig = { ...config, __isRetryRequest: true };
        retryConfig.headers = { ...(config.headers || {}), Authorization: `Bearer ${newAccess}` };
        return instance.request(retryConfig);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
