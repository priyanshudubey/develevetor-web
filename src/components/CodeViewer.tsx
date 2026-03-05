import { X, Copy, Check, FileWarning, Brain, ShieldAlert } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect } from "react";
import { useInsights } from "../context/InsightsContext";

interface CodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  content: string;
  /** Relative file path within the repo (for insight lookup) */
  filePath?: string;
}

export default function CodeViewer({
  isOpen,
  onClose,
  fileName,
  content,
  filePath,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const { insights, summaries } = useInsights();

  // Look up AI summary and metrics for this specific file
  const insight = filePath ? insights.find((i) => i.file_path === filePath) : undefined;
  const summary = filePath ? summaries.find((s) => s.file_path === filePath)?.summary_text : undefined;

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Detect Extension
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  // 2. Check for Binary Files
  const isBinary = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "ico",
    "svg", // Images
    "pdf",
    "eot",
    "ttf",
    "woff",
    "woff2", // Fonts/Docs
    "zip",
    "tar",
    "gz",
    "7z",
    "rar", // Archives
    "exe",
    "dll",
    "so",
    "dylib",
    "bin", // Binaries
  ].includes(extension);

  // 3. Render Binary Fallback
  if (isBinary) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-lg bg-white dark:bg-[#1e1e1e] border border-slate-900/10 dark:border-white/10 rounded-xl shadow-xl dark:shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-[#252526] border-b border-slate-900/10 dark:border-white/5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-mono">
              {fileName}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md text-slate-400 transition-colors">
              <X size={18} />
            </button>
          </div>
          {/* Body */}
          <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
              <FileWarning size={32} />
            </div>
            <div>
              <h3 className="text-slate-200 font-medium mb-1">
                Cannot Display File
              </h3>
              <p className="text-slate-500 text-sm">
                This file is binary or an image and cannot be rendered as text.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 rounded-lg text-sm text-slate-700 dark:text-slate-300 transition-colors border border-slate-900/10 dark:border-white/5">
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Determine Language for Syntax Highlighter
  const language =
    extension === "ts" || extension === "tsx"
      ? "typescript"
      : extension === "js" || extension === "jsx"
        ? "javascript"
        : extension === "py"
          ? "python"
          : extension === "css"
            ? "css"
            : extension === "html"
              ? "html"
              : extension === "json"
                ? "json"
                : extension === "sql"
                  ? "sql"
                  : extension === "md"
                    ? "markdown"
                    : extension === "yml" || extension === "yaml"
                      ? "yaml"
                      : "text";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="w-full max-w-4xl h-[80vh] bg-white dark:bg-[#1e1e1e] border border-slate-900/10 dark:border-white/10 rounded-xl shadow-xl dark:shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-[#252526] border-b border-slate-900/10 dark:border-white/5">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-mono">
            {fileName}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
              title="Copy Code">
              {copied ? (
                <Check
                  size={16}
                  className="text-emerald-400"
                />
              ) : (
                <Copy size={16} />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md text-slate-400 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Insights Panel — shows AI summary + metrics for this file */}
        {(summary || insight) && (
          <div className="px-4 py-3 border-b border-white/5 bg-[#1a1a2e]/80 backdrop-blur-sm flex flex-col gap-2">
            {summary && (
              <div className="flex items-start gap-2">
                <Brain size={13} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-[12px] text-blue-200/80 italic leading-relaxed">
                  {summary}
                </p>
              </div>
            )}
            {insight && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-mono">
                  CC: {insight.cyclomatic_complexity}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 font-mono">
                  Depth: {insight.max_nesting_depth}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-base-content/5 text-base-content/50 font-mono">
                  {insight.loc} LOC
                </span>
                {insight.vulnerability_tags.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">
                    <ShieldAlert size={9} />
                    {insight.vulnerability_tags.length} risk{insight.vulnerability_tags.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Code Content */}
        <div className="flex-1 overflow-auto bg-[#1e1e1e] relative text-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "1.5rem",
              background: "transparent",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
            showLineNumbers={true}
            lineNumberStyle={{
              minWidth: "3em",
              paddingRight: "1em",
              color: "#6e7681",
              textAlign: "right",
            }}>
            {content}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
