import { useState } from "react";
import { Sparkles, Github, CreditCard, Palette } from "lucide-react";
import AIPrefsTab from "./AIPrefsTab";
import GithubIntegrationTab from "./GithubIntegrationTab";
import BillingUsageTab from "./BillingUsageTab";

export type SettingsTab = "ai" | "github" | "billing" | "appearance";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("ai");

  return (
    <div className="h-full bg-[#0d1117] text-slate-200 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-1 text-slate-100">Settings</h1>
        <p className="text-sm text-slate-400 mb-8">
          Manage your AI preferences, integrations, and account details.
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0 space-y-1">
            <button
              onClick={() => setActiveTab("ai")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "ai"
                  ? "bg-primary/10 text-primary"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}>
              <Sparkles
                size={18}
                className={activeTab === "ai" ? "text-primary" : ""}
              />
              AI Configuration
            </button>

            <button
              onClick={() => setActiveTab("github")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "github"
                  ? "bg-primary/10 text-primary"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}>
              <Github
                size={18}
                className={activeTab === "github" ? "text-primary" : ""}
              />
              GitHub Integration
            </button>

            <button
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "billing"
                  ? "bg-primary/10 text-primary"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}>
              <CreditCard size={18} />
              Usage & Billing
            </button>

            <button
              onClick={() => setActiveTab("appearance")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "appearance"
                  ? "bg-primary/10 text-primary"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}>
              <Palette size={18} />
              Appearance
            </button>
          </aside>

          {/* Right Content Area */}
          <main className="flex-1 min-w-0">
            {activeTab === "ai" && <AIPrefsTab />}
            {activeTab === "github" && <GithubIntegrationTab />}
            {activeTab === "billing" && <BillingUsageTab />}

            {activeTab === "appearance" && (
              <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-xl bg-[#161b22]/50 animate-in fade-in duration-300">
                <p className="text-slate-400 text-sm font-medium">
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
