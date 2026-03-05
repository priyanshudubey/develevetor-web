/**
 * FileExplorerOverlay — full-screen overlay showing the project file tree
 * with inline insights badges and glassmorphism hover tooltips.
 */
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileCode2,
  AlertTriangle,
  ShieldAlert,
  FileText,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useInsights, isCriticalFile, type FileInsight } from "../../context/InsightsContext";
import InsightTag from "./InsightTag";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileNode {
  name: string;
  path: string;
  children?: FileNode[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Tree Builder ─────────────────────────────────────────────────────────────

function buildTree(paths: string[]): FileNode[] {
  const root: FileNode = { name: "root", path: "", children: [] };

  for (const rawPath of paths) {
    // Normalize Windows backslashes → forward slashes
    const p = rawPath.replace(/\\/g, "/");
    const parts = p.split("/");
    let cursor = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i] ?? "";
      const isFile = i === parts.length - 1;
      const existingChild = cursor.children?.find((c) => c.name === part);

      if (existingChild) {
        cursor = existingChild;
      } else {
        const node: FileNode = {
          name: part,
          path: parts.slice(0, i + 1).join("/"),
          children: isFile ? undefined : [],
        };
        cursor.children?.push(node);
        cursor = node;
      }
    }
  }

  return root.children ?? [];
}

// ─── Glassmorphism Tooltip ────────────────────────────────────────────────────

function InsightTooltip({
  insight,
  summary,
  visible,
}: {
  insight: FileInsight | undefined;
  summary: string | undefined;
  visible: boolean;
}) {
  if (!insight && !summary) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -6, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -6, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="absolute left-full top-0 ml-3 z-50 w-72 pointer-events-none"
          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))" }}>

          {/* Glassmorphism card */}
          <div className="rounded-xl border border-white/10 bg-base-100/70 backdrop-blur-xl p-3 space-y-2">
            {summary && (
              <p className="text-[12px] text-base-content/90 leading-relaxed italic">
                "{summary}"
              </p>
            )}

            {insight && (
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-base-content/10">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                  CC: {insight.cyclomatic_complexity}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-mono">
                  Depth: {insight.max_nesting_depth}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-base-content/5 text-base-content/50 font-mono">
                  {insight.loc} LOC
                </span>
              </div>
            )}

            {insight && insight.vulnerability_tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1 border-t border-base-content/10">
                {insight.vulnerability_tags.slice(0, 4).map((t) => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FileRow({
  node,
  insightMap,
  summaryMap,
  depth,
}: {
  node: FileNode;
  insightMap: Map<string, FileInsight>;
  summaryMap: Map<string, string>;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isDir = !!node.children;
  const insight = insightMap.get(node.path);
  const summary = summaryMap.get(node.path);

  const hasHighCC   = insight && insight.cyclomatic_complexity > 15;
  const hasSecRisk  = insight && insight.vulnerability_tags.length > 0;
  const hasSummary  = !!summary;
  const isCritical  = insight && isCriticalFile(insight);

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setHovered(true), 300);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    setHovered(false);
  };

  const handleClick = () => {
    if (isDir) {
      setExpanded((v) => !v);
    } else {
      setSelected((v) => !v);
    }
  };

  return (
    <div>
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>

        <button
          onClick={handleClick}
          className={`w-full flex items-center gap-1.5 px-2 py-1 rounded-lg text-left text-[13px] transition-colors ${
            selected && !isDir
              ? "bg-primary/10 text-base-content border-l-2 border-primary"
              : isDir
                ? "text-base-content/70 hover:bg-base-content/5 cursor-pointer"
                : "text-base-content/80 hover:bg-base-content/5 cursor-pointer"
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}>

          {/* Expand arrow for dirs */}
          {isDir ? (
            expanded
              ? <ChevronDown size={12} className="text-base-content/40 shrink-0" />
              : <ChevronRight size={12} className="text-base-content/40 shrink-0" />
          ) : (
            <span className="w-3 shrink-0" />
          )}

          {/* Icon */}
          {isDir ? (
            expanded
              ? <FolderOpen size={13} className="text-primary/70 shrink-0" />
              : <Folder size={13} className="text-primary/50 shrink-0" />
          ) : (
            <FileCode2 size={12} className={`shrink-0 ${selected ? "text-primary" : "text-base-content/40"}`} />
          )}

          {/* Name */}
          <span className="flex-1 truncate">{node.name}</span>

          {/* Badges */}
          {!isDir && (
            <span className="flex items-center gap-1 ml-1 shrink-0">
              {hasHighCC && (
                <span title="High Complexity" className="text-amber-400">
                  <AlertTriangle size={11} />
                </span>
              )}
              {hasSecRisk && (
                <span title="Security Risk" className={isCritical ? "text-red-400 animate-pulse" : "text-amber-500"}>
                  <ShieldAlert size={11} />
                </span>
              )}
              {hasSummary && (
                <span title="Has AI Summary" className="text-blue-400 opacity-70">
                  <FileText size={11} />
                </span>
              )}
            </span>
          )}
        </button>

        {/* Glassmorphism Tooltip on hover */}
        {!isDir && !selected && (insight || summary) && (
          <InsightTooltip insight={insight} summary={summary} visible={hovered} />
        )}
      </div>

      {/* ── Expanded Detail Panel (on click) ─────────────────────────────── */}
      <AnimatePresence>
        {!isDir && selected && (insight || summary) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
            style={{ marginLeft: `${depth * 14 + 22}px` }}>

            <div className="my-1 mr-2 rounded-xl border border-base-300 bg-base-200/80 p-3 space-y-2.5">

              {/* AI Summary */}
              {summary && (
                <div className="flex gap-2">
                  <FileText size={12} className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-base-content/80 leading-relaxed italic">
                    "{summary}"
                  </p>
                </div>
              )}

              {/* Metrics row */}
              {insight && (
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-semibold">
                    CC: {insight.cyclomatic_complexity}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-mono font-semibold">
                    Depth: {insight.max_nesting_depth}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-base-content/5 text-base-content/50 font-mono">
                    {insight.loc} LOC
                  </span>
                </div>
              )}

              {/* Security risks */}
              {insight && insight.vulnerability_tags.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-red-400 uppercase tracking-wider">
                    <ShieldAlert size={10} />
                    Security Risks ({insight.vulnerability_tags.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {insight.vulnerability_tags.map((tag) => (
                      <InsightTag key={tag} label={tag} size="xs" />
                    ))}
                  </div>
                </div>
              )}

              {/* Clean badge */}
              {insight && insight.vulnerability_tags.length === 0 && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-500">
                  <ShieldAlert size={10} />
                  <span className="font-medium">No security risks detected</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Children */}
      {isDir && expanded && node.children?.map((child) => (
        <FileRow
          key={child.path}
          node={child}
          insightMap={insightMap}
          summaryMap={summaryMap}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

// ─── Main Overlay ─────────────────────────────────────────────────────────────

export default function FileExplorerOverlay({ isOpen, onClose }: Props) {
  const { insights, summaries } = useInsights();

  // Normalize paths: Windows backslash → forward slash for consistent keying
  const normalize = (p: string) => p.replace(/\\/g, "/");

  const insightMap = new Map(insights.map((i) => [normalize(i.file_path), i]));
  const summaryMap = new Map(summaries.map((s) => [normalize(s.file_path), s.summary_text]));

  const tree = buildTree(insights.map((i) => i.file_path));

  const criticalCount = insights.filter(isCriticalFile).length;
  const withSummary   = summaries.length;
  const highCC        = insights.filter((i) => i.cyclomatic_complexity > 15).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-96 bg-base-100 border-r border-base-300 flex flex-col shadow-2xl">

            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-base-300 shrink-0">
              <div className="flex items-center gap-2">
                <Folder size={16} className="text-primary" />
                <span className="font-semibold text-sm text-base-content">File Explorer</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-base-content/40 hover:text-base-content hover:bg-base-content/10 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-b border-base-300 bg-base-200 text-[11px] text-base-content/50 shrink-0">
              <span className="flex items-center gap-1">
                <AlertTriangle size={10} className="text-amber-400" />
                {highCC} high CC
              </span>
              <span className="flex items-center gap-1">
                <ShieldAlert size={10} className="text-red-400" />
                {criticalCount} critical
              </span>
              <span className="flex items-center gap-1">
                <FileText size={10} className="text-blue-400" />
                {withSummary} summarised
              </span>
            </div>

            {/* Tree */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-0.5">
              {tree.map((node) => (
                <FileRow
                  key={node.path}
                  node={node}
                  insightMap={insightMap}
                  summaryMap={summaryMap}
                  depth={0}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="px-4 py-3 border-t border-base-300 bg-base-200 flex items-center gap-4 text-[10px] text-base-content/40 shrink-0">
              <span className="flex items-center gap-1"><AlertTriangle size={10} className="text-amber-400" /> High CC</span>
              <span className="flex items-center gap-1"><ShieldAlert size={10} className="text-red-400" /> Security risk</span>
              <span className="flex items-center gap-1"><FileText size={10} className="text-blue-400" /> AI summary</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
