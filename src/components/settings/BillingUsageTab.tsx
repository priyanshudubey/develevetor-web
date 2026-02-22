import { useState, useEffect } from "react";
import {
  CreditCard,
  Zap,
  MessageSquare,
  GitPullRequest,
  Folder,
  Loader2,
} from "lucide-react";

interface UsageData {
  usage: { chats: number; prs: number; projects: number };
  limits: { chats: number; prs: number; projects: number };
  resetAt: string | null;
}

export default function BillingUsageTab() {
  const [data, setData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/usage", {
          credentials: "include",
        });
        if (response.ok) {
          setData(await response.json());
        }
      } catch (error) {
        console.error("Failed to fetch usage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // Helper to calculate progress bar width
  const getPercentage = (used: number, limit: number) =>
    Math.min((used / limit) * 100, 100);

  // Time until reset formatting
  const timeUntilReset = data.resetAt
    ? Math.max(
        0,
        Math.round(
          (new Date(data.resetAt).getTime() - Date.now()) / (1000 * 60 * 60),
        ),
      )
    : 24;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <CreditCard
                size={20}
                className="text-primary"
              />
              Usage & Billing
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Track your API consumption and manage your subscription.
            </p>
          </div>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">
            Free Plan
          </span>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2 mb-1">
            <Zap
              size={16}
              className="text-yellow-400 fill-yellow-400/20"
            />
            Upgrade to Pro
          </h3>
          <p className="text-sm text-slate-400">
            Get unlimited AI chats, unmetered PR generation, and access to
            Claude 3.5 Sonnet.
          </p>
        </div>
        <button className="shrink-0 px-6 py-2.5 bg-white text-black font-semibold rounded-lg text-sm hover:bg-slate-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          Upgrade Now - $15/mo
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Chats Progress */}
        <div className="bg-[#161b22] border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <MessageSquare
                size={16}
                className="text-blue-400"
              />{" "}
              Daily Chats
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {data.usage.chats} / {data.limits.chats}
            </span>
          </div>
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${data.usage.chats >= data.limits.chats ? "bg-red-500" : "bg-blue-500"}`}
              style={{
                width: `${getPercentage(data.usage.chats, data.limits.chats)}%`,
              }}
            />
          </div>
        </div>

        {/* PRs Progress */}
        <div className="bg-[#161b22] border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <GitPullRequest
                size={16}
                className="text-purple-400"
              />{" "}
              Daily Pull Requests
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {data.usage.prs} / {data.limits.prs}
            </span>
          </div>
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${data.usage.prs >= data.limits.prs ? "bg-red-500" : "bg-purple-500"}`}
              style={{
                width: `${getPercentage(data.usage.prs, data.limits.prs)}%`,
              }}
            />
          </div>
        </div>

        {/* Projects Progress */}
        <div className="bg-[#161b22] border border-white/5 rounded-xl p-5 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Folder
                size={16}
                className="text-emerald-400"
              />{" "}
              Active Workspaces
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {data.usage.projects} / {data.limits.projects}
            </span>
          </div>
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${data.usage.projects >= data.limits.projects ? "bg-red-500" : "bg-emerald-500"}`}
              style={{
                width: `${getPercentage(data.usage.projects, data.limits.projects)}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Workspaces are a hard limit. Delete an existing workspace to create
            a new one.
          </p>
        </div>
      </div>

      <p className="text-xs text-center text-slate-500 pt-4">
        Daily limits reset in approximately{" "}
        <strong>{timeUntilReset} hours</strong>.
      </p>
    </div>
  );
}
