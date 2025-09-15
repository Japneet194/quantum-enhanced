export function getApiBaseUrl(): string {
  const env = (import.meta as any).env?.VITE_API_URL as string | undefined;
  if (env && env.length > 0) return env;
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    const port = '4000';
    return `${protocol}//${hostname}:${port}`;
  }
  return 'http://localhost:4000';
}
