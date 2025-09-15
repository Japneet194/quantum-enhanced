export function getApiBaseUrl(): string {
  const env = (import.meta as any).env?.VITE_API_URL as string | undefined;
  if (env && env.length > 0) return env;
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    // If we're on Vercel (no dev server port) and no env provided, default to same-origin API under /api
    // Otherwise, assume local backend on 4000.
    const isLocalhost = /localhost|127\.0\.0\.1/.test(hostname);
    if (isLocalhost) {
      return `${protocol}//${hostname}:4000`;
    }
    // Prefer relative /api so Vercel rewrites/proxy can be used, else require env.
    return `${protocol}//${hostname.replace(/:\d+$/, '')}`.replace(/\/$/, '') + '/api';
  }
  return 'http://localhost:4000';
}
