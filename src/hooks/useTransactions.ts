import { useEffect, useMemo, useState } from 'react';
import type { TransactionDto } from '@/api/types';
import { useApi } from './useApi';

export function useTransactions() {
  const api = useApi();
  const [items, setItems] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true); setError(null);
    try {
      const data = await api.get<TransactionDto[]>('/transactions');
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    const url = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:4000/ws';
    const ws = new WebSocket(url);
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'transaction:new') {
          setItems((prev) => [msg.payload, ...prev]);
        } else if (msg.type === 'transaction:update') {
          setItems((prev) => prev.map((t) => t._id === msg.payload._id ? msg.payload : t));
        }
      } catch {}
    };
    return () => ws.close();
  }, []);

  return { items, loading, error, refresh };
}
