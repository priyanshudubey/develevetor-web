import { useState, useEffect } from "react";
import {
  Folder,
  GitPullRequest,
  MessageSquare,
  TrendingUp,
  Clock,
  Terminal,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

// Helper to format ISO dates into relative time
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 86400;
  if (interval > 2) return Math.floor(interval) + " days ago";
  if (interval > 1) return "Yesterday";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";

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
          {
            withCredentials: true,
          },
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
      <div className="h-full bg-[#0d1117] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full mt-14 bg-[#0d1117] text-slate-200 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            Welcome back, Developer{" "}
            <Sparkles className="text-primary w-6 h-6" />
          </h1>
          <p className="text-slate-400 mt-2">
            Here is what DevElevator has been automating for you lately.
          </p>
        </div>

        {/* 1. Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#161b22] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MessageSquare className="text-blue-400 w-5 h-5" />
              </div>
              <TrendingUp className="text-emerald-400 w-4 h-4" />
            </div>
            <p className="text-3xl font-bold text-slate-100 mb-1">
              {metrics.interactions}
            </p>
            <p className="text-sm text-slate-400">Total AI Interactions</p>
          </div>

          <div className="bg-[#161b22] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <GitPullRequest className="text-purple-400 w-5 h-5" />
              </div>
              <TrendingUp className="text-emerald-400 w-4 h-4" />
            </div>
            <p className="text-3xl font-bold text-slate-100 mb-1">
              {metrics.prsAutomated}
            </p>
            <p className="text-sm text-slate-400">Pull Requests Automated</p>
          </div>

          <div className="bg-[#161b22] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Clock className="text-emerald-400 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-100 mb-1">
              {metrics.timeSaved}
            </p>
            <p className="text-sm text-slate-400">Estimated Time Saved</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2. Recent Workspaces */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">
                Jump Back In
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/dashboard/project/${project.id}`)}
                  className="group bg-[#161b22] border border-white/5 hover:border-primary/30 hover:bg-white/3 rounded-xl p-5 cursor-pointer transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-white/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                      <Folder className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                  </div>
                  <h3 className="font-semibold text-slate-200 truncate mb-1">
                    {project.name.split("/")[1] || project.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shadow-sm ${
                          project.status === "READY"
                            ? "bg-emerald-500 shadow-emerald-500/40"
                            : project.status === "INDEXING"
                              ? "bg-amber-500 animate-pulse"
                              : "bg-red-500"
                        }`}
                      />
                      {project.status}
                    </span>
                    <span>•</span>
                    <span>
                      {timeAgo(project.last_indexed_at || project.created_at)}
                    </span>
                  </div>
                </div>
              ))}

              {/* "Create New" Card */}
              <div
                onClick={onAddProject}
                className="bg-transparent border border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center min-h-35">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <Terminal className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="font-medium text-slate-300 text-sm">
                  Import New Repository
                </h3>
              </div>
            </div>
          </div>

          {/* 3. Activity Feed */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-100">
              Recent Activity
            </h2>
            <div className="bg-[#161b22] border border-white/5 rounded-xl p-5">
              {activity.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No recent activity.
                </p>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-white/10 before:to-transparent">
                  {activity.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="relative flex items-start gap-4">
                      <div className="absolute left-5 -ml-px h-full w-0.5 bg-white/10 -z-10" />
                      <div
                        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#161b22] z-10 ${
                          item.type === "chat"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}>
                        {item.type === "chat" ? (
                          <MessageSquare className="w-4 h-4" />
                        ) : (
                          <Folder className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 pt-1.5">
                        <p className="text-sm font-medium text-slate-200 mb-0.5">
                          {item.text}
                        </p>
                        <p className="text-xs text-slate-500">
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
