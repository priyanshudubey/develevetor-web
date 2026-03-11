import { useState } from "react";
import { Sparkles, Github, CreditCard, Palette } from "lucide-react";
import AIPrefsTab from "./AIPrefsTab";
import GithubIntegrationTab from "./GithubIntegrationTab";
import BillingUsageTab from "./BillingUsageTab";

export type SettingsTab = "ai" | "github" | "billing" | "appearance";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("ai");

  return (
    <div className="h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-8 overflow-y-auto transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-1 text-zinc-900 dark:text-zinc-100">Settings</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
          Manage your AI preferences, integrations, and account details.
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0 space-y-1">
            <button
              onClick={() => setActiveTab("ai")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "ai"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"
              }`}>
              <Sparkles
                size={18}
                className={activeTab === "ai" ? "text-emerald-500" : ""}
              />
              AI Configuration
            </button>

            <button
              onClick={() => setActiveTab("github")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "github"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"
              }`}>
              <Github
                size={18}
                className={activeTab === "github" ? "text-emerald-500" : ""}
              />
              GitHub Integration
            </button>

            <button
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "billing"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"
              }`}>
              <CreditCard size={18} className={activeTab === "billing" ? "text-emerald-500" : ""} />
              Usage & Billing
            </button>

            <button
              onClick={() => setActiveTab("appearance")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "appearance"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"
              }`}>
              <Palette size={18} className={activeTab === "appearance" ? "text-emerald-500" : ""} />
              Appearance
            </button>
          </aside>

          {/* Right Content Area */}
          <main className="flex-1 min-w-0">
            {activeTab === "ai" && <AIPrefsTab />}
            {activeTab === "github" && <GithubIntegrationTab />}
            {activeTab === "billing" && <BillingUsageTab />}

            {activeTab === "appearance" && (
              <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-200 dark:border-white/5 rounded-xl bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md animate-in fade-in duration-300">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                  settings coming soon.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
