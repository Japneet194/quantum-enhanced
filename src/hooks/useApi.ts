import { useMemo } from 'react';
import { ApiClient } from '@/api/client';
import { getApiBaseUrl } from '@/lib/apiBaseUrl';

export function useApi() {
  const baseUrl = getApiBaseUrl();
  return useMemo(() => new ApiClient({
    baseUrl,
    getToken: () => localStorage.getItem('qeads_token'),
  }), [baseUrl]);
}
