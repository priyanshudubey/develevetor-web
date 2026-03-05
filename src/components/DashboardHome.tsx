import { useState, useEffect } from "react";
import {
  Folder,
  GitPullRequest,
  MessageSquare,
  TrendingUp,
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
      <div className="h-full bg-base-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <Zap className="absolute inset-0 m-auto w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-base-content/50 font-mono">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-base-100 text-base-content overflow-y-auto">
      {/* Subtle ambient gradient top */}
      <div className="absolute top-14 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-2 py-2 space-y-4">

        {/* ── Welcome Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                ACTIVE SESSION
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-base-content tracking-tight">
              Welcome back{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Developer
              </span>
              <Sparkles className="inline ml-2 text-primary w-6 h-6" />
            </h1>
            <p className="text-base-content/50 mt-2 text-sm">
              Here's what DevElevator has been automating for you.
            </p>
          </div>
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="group relative bg-base-200 border border-base-300 hover:border-info/40 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(99,179,237,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-info/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="p-2.5 bg-info/10 rounded-xl border border-info/20">
                  <MessageSquare className="text-info w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-xs text-success font-medium bg-success/10 px-2 py-1 rounded-full border border-success/20">
                  <TrendingUp className="w-3 h-3" />
                  Active
                </div>
              </div>
              <p className="text-4xl font-bold text-base-content tabular-nums mb-1">
                {metrics.interactions.toLocaleString()}
              </p>
              <p className="text-sm text-base-content/50">AI Interactions</p>
              <div className="mt-4 h-1 bg-base-300 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-info/60 to-info w-3/4 rounded-full" />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-base-200 border border-base-300 hover:border-secondary/40 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(99,143,237,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="p-2.5 bg-secondary/10 rounded-xl border border-secondary/20">
                  <GitPullRequest className="text-secondary w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-xs text-success font-medium bg-success/10 px-2 py-1 rounded-full border border-success/20">
                  <TrendingUp className="w-3 h-3" />
                  Active
                </div>
              </div>
              <p className="text-4xl font-bold text-base-content tabular-nums mb-1">
                {metrics.prsAutomated.toLocaleString()}
              </p>
              <p className="text-sm text-base-content/50">PRs Generated</p>
              <div className="mt-4 h-1 bg-base-300 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary/60 to-secondary w-1/2 rounded-full" />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-base-200 border border-base-300 hover:border-primary/40 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                  <Clock className="text-primary w-5 h-5" />
                </div>
                <Sparkles className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-4xl font-bold text-base-content tabular-nums mb-1">
                {metrics.timeSaved}
              </p>
              <p className="text-sm text-base-content/50">Time Saved</p>
              <div className="mt-4 h-1 bg-base-300 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary/60 to-primary w-2/3 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Recent Workspaces ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-base-content">Jump Back In</h2>
                <p className="text-xs text-base-content/40 mt-0.5">Your recent workspaces</p>
              </div>
              <button
                onClick={onAddProject}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 border border-primary/20 px-3 py-1.5 rounded-lg transition-all">
                <Terminal className="w-3.5 h-3.5" />
                New Repo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentProjects.map((project) => {
                const st = statusConfig[project.status as keyof typeof statusConfig] ?? statusConfig.ERROR;
                return (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/dashboard/project/${project.id}`)}
                    className="group relative bg-base-200 border border-base-300 hover:border-primary/40 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.3)] overflow-hidden">
                    {/* hover shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-base-300/50 rounded-xl group-hover:bg-primary/10 transition-colors">
                          <Folder className="w-5 h-5 text-base-content/50 group-hover:text-primary transition-colors" />
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-base-content/20 group-hover:text-primary transition-all -translate-y-0.5 translate-x-0.5 group-hover:translate-y-0 group-hover:translate-x-0" />
                      </div>
                      <h3 className="font-semibold text-base-content truncate mb-2 text-sm">
                        {project.name.split("/")[1] || project.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-base-content/40">
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
                className="group relative border border-dashed border-base-content/15 hover:border-primary/40 hover:bg-primary/5 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center min-h-36 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-base-content/5 group-hover:bg-primary/10 border border-base-content/10 group-hover:border-primary/30 flex items-center justify-center mb-3 transition-all">
                  <Terminal className="w-5 h-5 text-base-content/40 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm font-medium text-base-content/50 group-hover:text-base-content/80 transition-colors">Import Repository</p>
                <p className="text-xs text-base-content/30 mt-0.5">Connect a GitHub repo</p>
              </div>
            </div>
          </div>

          {/* ── Activity Feed ── */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-base-content">Recent Activity</h2>
              <p className="text-xs text-base-content/40 mt-0.5">Latest events</p>
            </div>
            <div className="bg-base-200 border border-base-300 rounded-2xl overflow-hidden">
              {activity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <GitCommit className="w-8 h-8 text-base-content/20 mb-3" />
                  <p className="text-sm text-base-content/40">No activity yet</p>
                  <p className="text-xs text-base-content/30 mt-1">Start chatting with your codebase</p>
                </div>
              ) : (
                <div className="divide-y divide-base-300/50">
                  {activity.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-start gap-3 p-4 hover:bg-base-content/5 transition-colors">
                      <div
                        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${
                          item.type === "chat"
                            ? "bg-info/15 text-info"
                            : "bg-success/15 text-success"
                        }`}>
                        {item.type === "chat"
                          ? <MessageSquare className="w-3.5 h-3.5" />
                          : <Folder className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-base-content/80 leading-snug truncate">
                          {item.text}
                        </p>
                        <p className="text-xs text-base-content/40 mt-0.5 font-mono">
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
