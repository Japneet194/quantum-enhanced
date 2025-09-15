import { useEffect, useState } from 'react';
import { useApi } from './useApi';
import type { CategoryPattern } from '@/api/types';

export function useAnalytics() {
  const api = useApi();
  const [patterns, setPatterns] = useState<CategoryPattern[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get<{ categories: CategoryPattern[] }>('/analytics/patterns');
      setPatterns(res.categories);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  return { patterns, loading, error, refresh };
}
