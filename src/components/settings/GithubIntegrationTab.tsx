import { useState, useEffect } from "react";
import {
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  Save,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function GithubIntegrationTab() {
  const [githubToken, setGithubToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  // UX States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tokenSaved, setTokenSaved] = useState(false);
  const [hasExistingToken, setHasExistingToken] = useState(false);

  // 1. Check if they already have a vaulted token
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/integrations",
          {
            credentials: "include",
          },
        );

        if (response.ok) {
          const data = await response.json();
          setHasExistingToken(data.hasGithubToken);
        }
      } catch (error) {
        console.error("Failed to check integration status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  // 2. Save the new token to the vault
  const handleSave = async () => {
    if (!githubToken.trim()) return;

    setIsSaving(true);
    setTokenSaved(false);

    try {
      const response = await fetch(
        "http://localhost:3000/api/users/integrations/github",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token: githubToken }),
        },
      );

      if (response.ok) {
        setTokenSaved(true);
        setHasExistingToken(true);
        setGithubToken(""); // Clear the token from memory for security
        setShowToken(false);

        // Reset success state
        setTimeout(() => setTokenSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save token:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <Key
                size={20}
                className="text-primary"
              />
              Authentication
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Connect your GitHub account to enable AI-powered Pull Requests and
              repository syncing.
            </p>
          </div>

          {/* Dynamic Status Badge */}
          {hasExistingToken && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
              <ShieldCheck size={14} />
              Vault Active
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-blue-400 mb-1">
          How to get your token
        </h3>
        <p className="text-sm text-blue-200/70 mb-3">
          You need a classic Personal Access Token to allow DevElevator to read
          files and open Pull Requests. Make sure to check the{" "}
          <strong>repo</strong> scope when generating it.
        </p>
        <a
          href="https://github.com/settings/tokens/new"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-md">
          Generate Token on GitHub <ExternalLink size={12} />
        </a>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-300">
          {hasExistingToken
            ? "Update Personal Access Token"
            : "Personal Access Token (PAT)"}
        </label>
        <div className="relative w-full md:w-2/3">
          <input
            type={showToken ? "text" : "password"}
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder={
              hasExistingToken
                ? "••••••••••••••••••••••••••••"
                : "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            }
            className="w-full bg-[#161b22] border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-slate-200 font-mono transition-shadow placeholder:font-sans"
          />
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
            {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Your token is encrypted before being stored securely in our database.
        </p>
      </div>

      <div className="pt-4 flex justify-end md:w-2/3">
        <button
          onClick={handleSave}
          disabled={isSaving || !githubToken.trim() || tokenSaved}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-70 ${
            tokenSaved
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-primary hover:bg-primary/90 text-primary-content"
          }`}>
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
          ) : tokenSaved ? (
            <CheckCircle2 size={16} />
          ) : (
            <Save size={16} />
          )}
          {isSaving
            ? "Encrypting..."
            : tokenSaved
              ? "Secured!"
              : hasExistingToken
                ? "Update Token"
                : "Save Connection"}
        </button>
      </div>
    </div>
  );
}
