import { useState } from 'react';

export function useCsvUpload(baseUrl: string, getToken: () => string | null) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
  const headers: HeadersInit = { Accept: 'application/json' };
      const tokenVal = getToken();
      if (tokenVal) {
        (headers as any)['Authorization'] = `Bearer ${tokenVal}`;
      } else {
        // Dev convenience: if server enables DEV_AUTH_FALLBACK, we can identify a dev user
        (headers as any)['X-Dev-User-Id'] = '000000000000000000000001';
      }

      const res = await fetch(`${baseUrl}/transactions/upload/csv`, {
        method: 'POST',
        headers,
        body: fd,
      });
      const text = await res.text();
      if (!res.ok) {
        try {
          const jsonErr = JSON.parse(text);
          throw new Error(jsonErr?.message || text || 'Upload failed');
        } catch {
          throw new Error(text || 'Upload failed');
        }
      }
      const json = JSON.parse(text);
      setResult(json);
      return json;
    } catch (e: any) {
      setError(e.message || 'Upload failed');
      throw e;
    } finally {
      setUploading(false);
    }
  }

  return { uploading, error, result, upload };
}
