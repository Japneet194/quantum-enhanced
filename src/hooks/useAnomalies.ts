import { useEffect, useState } from 'react';
import type { TransactionDto } from '@/api/types';
import { useApi } from './useApi';

export function useAnomalies() {
  const api = useApi();
  const [items, setItems] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true); setError(null);
    try {
      const data = await api.get<TransactionDto[]>('/analytics/anom');
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  return { items, loading, error, refresh };
}
