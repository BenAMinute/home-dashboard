import type { StatusState } from '../types/dashboard';

export async function checkServicePing(url: string, timeoutMs: number = 3500): Promise<{ status: StatusState; responseTime?: number }> {
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Attempt no-cors fetch to test socket / HTTP server connectivity
    await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const responseTime = Math.round(performance.now() - startTime);
    return { status: 'online', responseTime };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    // If aborted due to timeout
    if (error.name === 'AbortError') {
      return { status: 'offline' };
    }

    // Try secondary image ping fallback for CORS-strict servers
    return new Promise((resolve) => {
      const img = new Image();
      const imgTimeout = setTimeout(() => {
        img.src = '';
        resolve({ status: 'offline' });
      }, 2000);

      const checkDone = (isOnline: boolean) => {
        clearTimeout(imgTimeout);
        const duration = Math.round(performance.now() - startTime);
        resolve({ status: isOnline ? 'online' : 'offline', responseTime: duration });
      };

      // Even if favicon 404s, reaching the server fires onload or onerror (with HTTP status response)
      img.onload = () => checkDone(true);
      img.onerror = () => {
        // If image ping errors quickly, it's often due to 404 or CORS, meaning host IS online
        const duration = performance.now() - startTime;
        if (duration < 1800) {
          checkDone(true);
        } else {
          checkDone(false);
        }
      };

      try {
        const pingUrl = new URL(url);
        pingUrl.pathname = '/favicon.ico';
        pingUrl.searchParams.set('_t', Date.now().toString());
        img.src = pingUrl.toString();
      } catch (e) {
        checkDone(false);
      }
    });
  }
}
