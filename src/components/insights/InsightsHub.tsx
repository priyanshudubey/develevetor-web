/**
 * InsightsHub — The main insights dashboard shell.
 *
 * This version has been fully decomposed into modular components
 * located in the ./components and ./hooks directories.
 */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import axios from "axios";
import {
  FolderGit2,
  AlertTriangle,
  Activity,
  ArrowLeft,
  Sparkles,
  Loader2,
  FolderOpen,
} from "lucide-react";
import {
  InsightsProvider,
  useInsights,
} from "../../context/InsightsContext";
import { useAuth } from "../../context/AuthContext";

export interface ProjectData {
  id: string;
  name: string;
  local_path: string;
}

// Sub-components & Hooks
import { useInsightsData } from "./hooks/useInsightsData";
import HealthScoreSection from "./components/HealthScoreSection";
import TopSmellsList from "./components/TopSmellsList";
import SecurityHeatmap from "./components/SecurityHeatmap";
import RefactorPanel from "./RefactorPanel";

// ─── Animation helpers ────────────────────────────────────────────────────────

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

// ─── Project Picker (Runs when no projectId in URL) ───────────────────────────

function ProjectPicker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, {
          withCredentials: true,
        });
        if (isMounted) {
          setProjects(res.data.projects || []);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSync = async (e: React.MouseEvent, pId: string) => {
    e.stopPropagation();
    try {
      setSyncingId(pId);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects/${pId}/sync`,
        {},
        { withCredentials: true }
      );
      navigate(`/dashboard/insights/${pId}`);
    } catch (err) {
      console.error("Sync failed:", err);
      navigate(`/dashboard/insights/${pId}`);
    } finally {
      setSyncingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-base-content/40 gap-3">
        <Activity size={20} className="animate-pulse" />
        <span className="text-sm font-medium tracking-wide">
          Loading your workspaces…
        </span>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center mb-2">
          <FolderOpen size={28} className="text-base-content/30" />
        </div>
        <h2 className="text-xl font-bold text-base-content">
          No projects found.
        </h2>
        <p className="text-sm text-base-content/50 max-w-sm">
          Head over to the Dashboard home to add a local or remote repository
          first.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 max-w-6xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-base-content flex items-center gap-2 mb-2">
          <Sparkles size={28} className="text-primary" />
          Select a Workspace
        </h1>
        <p className="text-base-content/60">
          Choose a repository to view deep static analysis, code smells, and
          actionable refactoring insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p: ProjectData) => (
          <motion.div
            variants={card}
            key={p.id}
            onClick={() => navigate(`/dashboard/insights/${p.id}`)}
            className="group relative bg-base-200 border border-base-300 hover:border-primary/40 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 overflow-hidden flex flex-col h-[180px]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start gap-4 mb-auto">
              <div className="w-12 h-12 rounded-xl bg-base-100 flex items-center justify-center shrink-0 border border-base-300 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                <FolderGit2 size={24} className="text-base-content/60 group-hover:text-primary transition-colors" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-lg text-base-content truncate group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-base-content/40 font-mono truncate mt-0.5">
                  {p.local_path || "Remote repo"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-base-300">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-base-content/30 mb-0.5">
                  Status
                </span>
                <span className="text-xs font-medium text-emerald-500 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ready for analysis
                </span>
              </div>
              <button
                onClick={(e) => handleSync(e, p.id)}
                disabled={syncingId === p.id}
                className="btn btn-sm btn-ghost hover:bg-primary/10 hover:text-primary"
              >
                {syncingId === p.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Activity size={16} />
                )}
                <span className="ml-1.5 text-xs font-semibold">Analyze</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Inner detail dashboard (Consumes InsightsContext) ─────────────────────────

function InsightsDetail() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const { insights, summaries, isLoading, error } = useInsights();

  // Hook handles filtering, score math, and selected file state
  const {
    heatmapFilter,
    isFiltering,
    refactorFile,
    setRefactorFile,
    handleFilterClick,
    breakdown,
    topComplex,
    filteredHeatmap,
  } = useInsightsData(insights);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-base-content/40 gap-3">
        <Activity size={18} className="animate-pulse" />
        <span className="text-sm">Loading insights…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-error/70 gap-2 text-sm">
        <AlertTriangle size={16} /> {error}
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-base-content/40 gap-3">
        <Sparkles size={28} />
        <p className="text-sm">
          No insights yet — sync this project to generate analytics.
        </p>
        <button
          onClick={() => navigate("/dashboard/insights")}
          className="text-xs text-primary hover:underline"
        >
          ← Select a different project
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 space-y-8 max-w-6xl mx-auto"
    >
      {/* Back + Title */}
      <motion.div variants={card} className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/insights")}
          className="p-2 rounded-lg hover:bg-base-content/5 text-base-content/40 hover:text-base-content transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <Sparkles size={22} className="text-primary" />
            Insights Hub
          </h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            {insights.length} files analysed · {summaries.length} AI summaries
          </p>
        </div>
      </motion.div>

      {/* Row 1: Health + Top Complex */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <HealthScoreSection
          breakdown={breakdown}
          heatmapFilter={heatmapFilter}
          handleFilterClick={handleFilterClick}
          totalFiles={insights.length}
        />
        <TopSmellsList topComplex={topComplex} />
      </div>

      {/* Row 2: Security Heatmap (CSS Grid with align-items: start) */}
      <SecurityHeatmap
        heatmapFilter={heatmapFilter}
        filteredHeatmap={filteredHeatmap}
        isFiltering={isFiltering}
        handleFilterClick={handleFilterClick}
        setRefactorFile={setRefactorFile}
      />

      {/* Slide-in panel (AI Refactoring) */}
      {refactorFile && (
        <RefactorPanel
          insight={refactorFile}
          summary={summaries.find(s => s.file_path === refactorFile.file_path)?.summary_text}
          projectId={projectId}
          onClose={() => setRefactorFile(null)}
        />
      )}
    </motion.div>
  );
}

// ─── MAIN COMPONENT — picks mode based on URL params ───────────────────────────

export default function InsightsHub() {
  const { projectId } = useParams<{ projectId?: string }>();

  // No projectId → show project picker
  if (!projectId) {
    return <ProjectPicker />;
  }

  // Has projectId → wrap in InsightsProvider and show detail view
  return (
    <InsightsProvider projectId={projectId}>
      <InsightsDetail />
    </InsightsProvider>
  );
}
