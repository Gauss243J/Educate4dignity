import { useEffect, useState } from 'react';
import { DashboardData, getDashboardData } from '../services/dashboardService';

interface State {
  data?: DashboardData;
  loading: boolean;
  error?: string;
  refresh: () => void;
}

export function useDashboardData(): State {
  const [data, setData] = useState<DashboardData | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(undefined);
    getDashboardData({ signal: controller.signal })
      .then((d) => setData(d))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [nonce]);

  return {
    data,
    loading,
    error,
    refresh: () => setNonce((n) => n + 1),
  };
}
