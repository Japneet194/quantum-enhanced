export interface ApiConfig {
  baseUrl: string;
  getToken: () => string | null;
}

export class ApiClient {
  constructor(private cfg: ApiConfig) {}

  private headers(): HeadersInit {
    const token = this.cfg.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.cfg.baseUrl}${path}`, { headers: this.headers() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async post<T>(path: string, body?: any): Promise<T> {
    const res = await fetch(`${this.cfg.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async patch<T>(path: string, body?: any): Promise<T> {
    const res = await fetch(`${this.cfg.baseUrl}${path}`, {
      method: 'PATCH',
      headers: this.headers(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}

export const defaultApi = new ApiClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  getToken: () => localStorage.getItem('qeads_token'),
});
