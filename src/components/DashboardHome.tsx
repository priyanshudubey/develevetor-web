import { useState, useEffect } from "react";
import {
  Folder,
  GitPullRequest,
  MessageSquare,
  Clock,
  Terminal,
  Sparkles,
  Zap,
  ArrowUpRight,
  GitCommit,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

// Helper to format ISO dates into relative time
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 86400;
  if (interval > 2) return Math.floor(interval) + "d ago";
  if (interval > 1) return "Yesterday";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";

  return "Just now";
};

interface DashboardProject {
  id: string;
  name: string;
  status: "READY" | "INDEXING" | "ERROR" | string;
  updated_at: string;
  created_at: string;
  last_indexed_at: string | null;
}

interface ActivityItem {
  id: string | number;
  type: "chat" | "project" | "pr" | "system";
  text: string;
  time: string;
}

const statusConfig = {
  READY: { color: "bg-success", glow: "shadow-[0_0_8px_rgba(16,185,129,0.5)]", label: "Ready", dot: "bg-success" },
  INDEXING: { color: "bg-warning animate-pulse", glow: "", label: "Indexing", dot: "bg-warning animate-pulse" },
  ERROR: { color: "bg-error", glow: "", label: "Error", dot: "bg-error" },
};

export default function DashboardHome() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { onAddProject } = useOutletContext<{ onAddProject: () => void }>();

  const [metrics, setMetrics] = useState({
    interactions: 0,
    prsAutomated: 0,
    timeSaved: "0 hrs",
  });
  const [recentProjects, setRecentProjects] = useState<DashboardProject[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dashboard`,
          { withCredentials: true },
        );
        setMetrics(data.metrics);
        setRecentProjects(data.recentProjects);
        setActivity(data.activityFeed);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <Zap className="absolute inset-0 m-auto w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-sm text-zinc-500 font-mono tracking-wider">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-y-auto transition-colors duration-300">
      {/* Subtle ambient gradient top */}
      <div className="absolute top-14 left-0 right-0 h-64 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-2 py-2 space-y-4">

        {/* ── Welcome Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                ACTIVE SESSION
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Welcome back{" "}
              <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Developer
              </span>
              <Sparkles className="inline ml-2 text-emerald-400 w-6 h-6" />
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm font-medium">
              Here's what DevElevator has been automating for you.
            </p>
          </div>
        </div>

        {/* ── Metric Cards (Bento) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group relative bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="p-2.5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500/30 transition-colors">
                  <MessageSquare className="text-emerald-500 w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums mb-1 tracking-tight">
                {metrics.interactions.toLocaleString()}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">AI Interactions</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="p-2.5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500/30 transition-colors">
                  <GitPullRequest className="text-emerald-500 w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums mb-1 tracking-tight">
                {metrics.prsAutomated.toLocaleString()}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">PRs Generated</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] hover:-translate-y-1">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="p-2.5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500/30 transition-colors">
                  <Clock className="text-emerald-500 w-5 h-5" />
                </div>
                <Sparkles className="w-4 h-4 text-emerald-500/40 group-hover:text-emerald-500 transition-colors drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums mb-1 tracking-tight">
                {metrics.timeSaved}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Time Saved</p>
            </div>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Recent Workspaces ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Jump Back In</h2>
                <p className="text-sm text-zinc-500 font-medium mt-0.5">Your recent workspaces</p>
              </div>
              <button
                onClick={onAddProject}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-950 bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                <Terminal className="w-3.5 h-3.5" />
                New Repo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentProjects.map((project) => {
                const st = statusConfig[project.status as keyof typeof statusConfig] ?? statusConfig.ERROR;
                return (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/dashboard/project/${project.id}`)}
                    className="group relative bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] overflow-hidden">
                    {/* hover shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500/30 transition-colors">
                          <Folder className="w-5 h-5 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-all -translate-y-0.5 translate-x-0.5 group-hover:translate-y-0 group-hover:translate-x-0" />
                      </div>
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate mb-1.5 text-[15px] group-hover:text-emerald-400 transition-colors">
                        {project.name.split("/")[1] || project.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {project.status}
                        </span>
                        <span>{timeAgo(project.last_indexed_at || project.created_at)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Import New Card */}
              <div
                onClick={onAddProject}
                className="group relative bg-white/30 dark:bg-zinc-950/30 border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-emerald-500/40 hover:bg-white/60 dark:hover:bg-zinc-900/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[160px] overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-950 group-hover:bg-emerald-500/10 border border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500/30 flex items-center justify-center mb-3 transition-all">
                  <Terminal className="w-6 h-6 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                </div>
                <p className="font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">Import Repository</p>
                <p className="text-xs text-zinc-500 mt-1 font-medium">Connect a GitHub repo</p>
              </div>
            </div>
          </div>

          {/* ── Activity Feed ── */}
          <div className="space-y-4">
            <div className="px-1">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Recent Activity</h2>
              <p className="text-sm text-zinc-500 font-medium mt-0.5">Latest events</p>
            </div>
            <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden h-[calc(100%-3rem)] flex flex-col transition-colors">
              {activity.length === 0 ? (
                <div className="flex flex-col flex-1 items-center justify-center py-10 px-4 text-center">
                  <GitCommit className="w-8 h-8 text-zinc-700 mb-3" />
                  <p className="text-sm font-medium text-zinc-400">No activity yet</p>
                  <p className="text-xs text-zinc-600 mt-1">Start chatting with your codebase</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800/60 overflow-y-auto">
                  {activity.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-start gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div
                        className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 border ${
                          item.type === "chat"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-teal-500/10 border-teal-500/20 text-teal-400"
                        }`}>
                        {item.type === "chat"
                          ? <MessageSquare className="w-4 h-4" />
                          : <Folder className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed pr-2">
                          {item.text}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1.5 font-mono">
                          {timeAgo(item.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
