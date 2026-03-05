/**
 * RefactorPanel — Slide-in side panel for AI-powered refactoring suggestions.
 *
 * Shows detected smells + AI summary for a file, and (if DeepSeek balance
 * is available) fetches a refactoring suggestion from the backend.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ShieldAlert, Loader2, Copy, Check } from "lucide-react";
import axios from "axios";
import InsightTag from "./InsightTag";
import type { FileInsight } from "../../context/InsightsContext";

interface Props {
  insight: FileInsight | null;
  summary?: string;
  projectId?: string;
  onClose: () => void;
}

export default function RefactorPanel({ insight, summary, projectId, onClose }: Props) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileName = insight?.file_path.replace(/\\/g, "/").split("/").pop() ?? "";

  // Fetch AI refactoring suggestion
  useEffect(() => {
    if (!insight || !projectId) return;
    setSuggestion(null);
    setError(null);
    setLoading(true);

    const controller = new AbortController();

    (async () => {
      try {
        const { data } = await axios.post<{ suggestion: string }>(
          `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/refactor`,
          {
            file_path: insight.file_path,
            smells: insight.vulnerability_tags,
            cyclomatic_complexity: insight.cyclomatic_complexity,
            max_nesting_depth: insight.max_nesting_depth,
          },
          { withCredentials: true, signal: controller.signal },
        );
        setSuggestion(data.suggestion);
      } catch (err: any) {
        if (!controller.signal.aborted) {
          const msg = err?.response?.data?.error ?? err?.message ?? "Failed to get suggestion";
          // If 404 (endpoint missing) or 402 (no balance), show graceful fallback
          if (err?.response?.status === 404) {
            setSuggestion(buildLocalSuggestion(insight));
          } else {
            setError(msg);
            setSuggestion(buildLocalSuggestion(insight));
          }
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [insight?.file_path, projectId]);

  const handleCopy = () => {
    if (suggestion) {
      navigator.clipboard.writeText(suggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {insight && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg z-50 bg-base-200 border-l border-base-300 shadow-2xl shadow-black/20 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-base-300">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-base-content truncate">
                  {fileName}
                </p>
                <p className="text-[10px] text-base-content/40 font-mono truncate">
                  {insight.file_path.replace(/\\/g, "/")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-base-content/40 hover:text-base-content hover:bg-base-content/5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* File Metrics */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-base-content/40">
                  File Metrics
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-primary/10 text-primary font-mono font-semibold">
                    CC: {insight.cyclomatic_complexity}
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-violet-500/10 text-violet-400 font-mono font-semibold">
                    Depth: {insight.max_nesting_depth}
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-base-content/5 text-base-content/50 font-mono">
                    {insight.loc} LOC
                  </span>
                </div>
              </div>

              {/* AI Summary */}
              {summary && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-base-content/40">
                    AI Summary
                  </h3>
                  <p className="text-[12px] text-base-content/70 leading-relaxed italic bg-base-100 rounded-lg p-3 border border-base-300">
                    "{summary}"
                  </p>
                </div>
              )}

              {/* Detected Issues */}
              {insight.vulnerability_tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-base-content/40 flex items-center gap-1.5">
                    <ShieldAlert size={10} />
                    Detected Issues ({insight.vulnerability_tags.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {insight.vulnerability_tags.map((tag) => (
                      <InsightTag key={tag} label={tag} size="sm" />
                    ))}
                  </div>
                </div>
              )}

              {/* AI Suggestion */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-base-content/40 flex items-center gap-1.5">
                    <Sparkles size={10} className="text-emerald-400" />
                    Refactoring Suggestion
                  </h3>
                  {suggestion && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[10px] text-base-content/40 hover:text-emerald-400 transition-colors"
                    >
                      {copied ? <Check size={10} /> : <Copy size={10} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  )}
                </div>

                {loading && (
                  <div className="flex items-center gap-2 py-6 justify-center text-base-content/40">
                    <Loader2 size={14} className="animate-spin text-emerald-400" />
                    <span className="text-[11px]">Analyzing code patterns…</span>
                  </div>
                )}

                {error && !suggestion && (
                  <div className="text-[11px] text-red-400/70 bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                    {error}
                  </div>
                )}

                {suggestion && (
                  <div className="bg-slate-900/90 border border-emerald-500/20 rounded-xl p-4 text-[12px] text-slate-200 leading-relaxed whitespace-pre-wrap font-mono">
                    {suggestion}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-base-300 flex flex-col items-center gap-2 mt-auto bg-base-100/30">
              <button
                disabled
                className="w-full flex flex-col items-center justify-center gap-1 py-2 rounded-lg bg-emerald-500/10 text-emerald-500/40 font-semibold cursor-not-allowed border border-emerald-500/20"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span>Fix with AI</span>
                </div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-base-content/30">
                  Coming soon
                </span>
              </button>
              <span className="text-[10px] text-base-content/40 text-center leading-tight mt-1">
                AI can make mistakes. Please review suggestions before applying them.
              </span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Local fallback when AI endpoint is unavailable ────────────────────────────

function buildLocalSuggestion(insight: FileInsight): string {
  const tips: string[] = [];

  if (insight.cyclomatic_complexity > 15) {
    tips.push(
      `HIGH COMPLEXITY (CC: ${insight.cyclomatic_complexity})\n` +
      `   → Extract complex conditionals into named helper functions.\n` +
      `   → Use early returns to reduce nesting and simplify flow.\n` +
      `   → Consider the Strategy pattern for multi-branch logic.`
    );
  }

  if (insight.max_nesting_depth > 5) {
    tips.push(
      `DEEP NESTING (Depth: ${insight.max_nesting_depth})\n` +
      `   → Flatten nested callbacks with async/await.\n` +
      `   → Extract inner blocks into well-named sub-functions.\n` +
      `   → Use guard clauses at the top of functions.`
    );
  }

  for (const tag of insight.vulnerability_tags) {
    switch (tag) {
      case "hardcoded-secret":
        tips.push(`HARDCODED SECRET\n   → Move to .env file or a secrets manager.\n   → Use process.env.SECRET_NAME at runtime.`);
        break;
      case "console-log-leak":
        tips.push(`CONSOLE LOG LEAK\n   → Remove or replace with a structured logger.\n   → Use debug/info/warn levels instead of console.log.`);
        break;
      case "magic-number":
        tips.push(`MAGIC NUMBER\n   → Extract to a named constant: const MAX_RETRIES = 3;\n   → Group related constants in a config object.`);
        break;
      case "dangerous-eval":
        tips.push(`DANGEROUS EVAL\n   → Replace eval() with JSON.parse() for data.\n   → Use a sandboxed VM for dynamic code execution.`);
        break;
      case "sql-injection":
        tips.push(`SQL INJECTION RISK\n   → Use parameterized queries: db.query('SELECT * FROM users WHERE id = $1', [id])\n   → Never concatenate user input into SQL strings.`);
        break;
      case "deep-nesting":
        tips.push(`DEEP NESTING\n   → Reduce callback depth with Promise.all or async/await.\n   → Extract deeply nested logic into separate functions.`);
        break;
      default:
        tips.push(`${tag.replace(/-/g, " ").toUpperCase()}\n   → Review and address this code pattern.`);
    }
  }

  if (tips.length === 0) {
    return "This file looks clean. No immediate refactoring needed.";
  }

  return `Refactoring recommendations for ${insight.file_path.replace(/\\/g, "/").split("/").pop()}:\n\n${tips.join("\n\n")}`;
}
