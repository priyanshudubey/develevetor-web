/**
 * InsightsContext — provides file_insights + file_summaries data
 * for the active project to any consumer in the tree.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FileInsight {
  file_path: string;
  loc: number;
  cyclomatic_complexity: number;
  max_nesting_depth: number;
  vulnerability_tags: string[];
  updated_at: string;
}

export interface FileSummary {
  file_path: string;
  summary_text: string;
  file_hash: string;
}

export interface InsightsData {
  insights: FileInsight[];
  summaries: FileSummary[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const InsightsContext = createContext<InsightsData>({
  insights: [],
  summaries: [],
  isLoading: false,
  error: null,
  refresh: () => {},
});

export function InsightsProvider({
  projectId,
  children,
}: {
  projectId: string | undefined;
  children: ReactNode;
}) {
  const [insights, setInsights] = useState<FileInsight[]>([]);
  const [summaries, setSummaries] = useState<FileSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!projectId) {
      setInsights([]);
      setSummaries([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [insightsRes, summariesRes] = await Promise.all([
        axios.get<{ insights: FileInsight[] }>(
          `${API}/api/projects/${projectId}/insights`,
          { withCredentials: true },
        ),
        axios.get<{ summaries: FileSummary[] }>(
          `${API}/api/projects/${projectId}/summaries`,
          { withCredentials: true },
        ),
      ]);

      setInsights(insightsRes.data.insights ?? []);
      setSummaries(summariesRes.data.summaries ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Failed to load insights");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <InsightsContext.Provider value={{ insights, summaries, isLoading, error, refresh }}>
      {children}
    </InsightsContext.Provider>
  );
}

export function useInsights() {
  return useContext(InsightsContext);
}

// ─── Derived helpers (used by multiple components) ────────────────────────────

export function computeHealthScore(insights: FileInsight[]): number {
  if (insights.length === 0) return 100;

  const avgCC =
    insights.reduce((s, f) => s + f.cyclomatic_complexity, 0) / insights.length;
  const totalVulns = insights.reduce((s, f) => s + f.vulnerability_tags.length, 0);
  const avgVulns = totalVulns / insights.length;

  // Score degrades linearly: CC > 20 → 0 pts from CC, vuln avg > 5 → 0 pts
  const ccScore   = Math.max(0, 100 - (avgCC / 20) * 100);
  const vulnScore = Math.max(0, 100 - (avgVulns / 5) * 100);

  return Math.round((ccScore * 0.6 + vulnScore * 0.4));
}

export const CRITICAL_TAGS = new Set(["hardcoded-secret", "dangerous-eval", "sql-injection-risk"]);

export function isCriticalFile(insight: FileInsight): boolean {
  return insight.vulnerability_tags.some((t) => CRITICAL_TAGS.has(t));
}
