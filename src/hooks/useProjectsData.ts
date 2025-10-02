import { useEffect, useState } from 'react';
import { fetchProjects, ProjectRow } from '../services/projectService';

export interface ProjectsState {
  rows: ProjectRow[];
  loading: boolean;
  error?: string;
  refresh: () => void;
  kpis?: ReturnType<typeof fetchProjects>['kpis'];
}

export function useProjectsData(): ProjectsState {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [kpis, setKpis] = useState<ReturnType<typeof fetchProjects>['kpis']>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    try {
      setLoading(true);
      const { rows, kpis } = fetchProjects();
      setRows(rows);
      setKpis(kpis);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [nonce]);

  return { rows, loading, error, refresh: () => setNonce(n => n + 1), kpis };
}
