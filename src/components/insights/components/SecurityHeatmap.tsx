import React from "react";
import { motion, type Variants } from "framer-motion";
import { ShieldAlert, Sparkles, ThumbsUp } from "lucide-react";
import type { FileInsight } from "../../../context/InsightsContext";
import type { HeatmapFilter } from "../hooks/useInsightsData";
import InsightTag from "../InsightTag";

// --- Framer Motion variants ---
const card: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

// --- Helpers ---
const CRITICAL_VULNS = new Set([
  "sql-injection",
  "xss",
  "command-injection",
  "hardcoded-secret",
  "path-traversal",
]);

function isCriticalFile(f: FileInsight) {
  return f.vulnerability_tags.some((t) => CRITICAL_VULNS.has(t));
}

// --- Heatmap Cell (Memoized for performance) ---
interface CellProps {
  insight: FileInsight;
  onRefactor: (f: FileInsight) => void;
}

const HeatmapCell = React.memo(function HeatmapCell({ insight, onRefactor }: CellProps) {
  const critical = isCriticalFile(insight);
  const count = insight.vulnerability_tags.length;
  const name = insight.file_path.replace(/\\/g, "/").split("/").pop() ?? insight.file_path;

  return (
    <motion.div
      variants={card}
      className={`relative rounded-xl p-3 border text-left overflow-visible transition-all group/cell min-h-[80px] hover:-translate-y-0.5 hover:shadow-lg ${
        critical
          ? "bg-red-500/10 border-red-500/30"
          : count > 0
            ? "bg-base-100 border-emerald-500/8"
            : "bg-base-200 border-base-300"
      }`}
    >
      {critical && (
        <span className="absolute inset-0 rounded-xl animate-pulse bg-red-500/5 pointer-events-none" />
      )}
      <div className="flex items-start justify-between mb-1.5">
        <p className="text-[12px] font-mono font-medium text-base-content/80 truncate pr-6">
          {name}
        </p>
        <button
          onClick={() => onRefactor(insight)}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 opacity-0 group-hover/cell:opacity-100 hover:bg-emerald-500/20 transition-all border border-emerald-500/20 shadow-sm"
          title="AI Refactoring Suggestion"
        >
          <Sparkles size={13} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {insight.vulnerability_tags.slice(0, 3).map((t) => (
          <InsightTag key={t} label={t} size="xs" />
        ))}
        {insight.vulnerability_tags.length > 3 && (
          <span className="text-[10px] text-base-content/40">
            +{insight.vulnerability_tags.length - 3} more
          </span>
        )}
        {insight.vulnerability_tags.length === 0 && (
          <span className="text-[10px] text-success/70">✓ Clean</span>
        )}
      </div>
    </motion.div>
  );
});

// --- Main Security Heatmap Grid ---
interface GridProps {
  heatmapFilter: HeatmapFilter;
  filteredHeatmap: FileInsight[];
  isFiltering: boolean;
  handleFilterClick: (key: HeatmapFilter) => void;
  setRefactorFile: (f: FileInsight) => void;
}

export default function SecurityHeatmap({
  heatmapFilter,
  filteredHeatmap,
  isFiltering,
  handleFilterClick,
  setRefactorFile
}: GridProps) {
  return (
    <motion.div
      variants={card}
      className="bg-base-200 border border-base-300 rounded-2xl p-6"
    >
      <h2 className="text-sm font-semibold text-base-content flex items-center gap-2 mb-4">
        <ShieldAlert size={15} className="text-red-400" />
        {heatmapFilter === "all" ? "Security Heatmap" : `Filtered: ${heatmapFilter === "security" ? "Security" : heatmapFilter === "complexity" ? "Complexity" : "Nesting"} Issues`}
        <span className="ml-auto flex items-center gap-2">
          {heatmapFilter !== "all" && (
            <button
              onClick={() => handleFilterClick("all")}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            >
              ✕ Clear filter
            </button>
          )}
          <span className="text-[11px] font-normal text-base-content/40">
            {filteredHeatmap.length} files
          </span>
        </span>
      </h2>
      <div className="max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-base-content/10 scrollbar-track-transparent rounded-xl">
        {isFiltering ? (
          // Skeleton state
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pr-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="min-h-[80px] rounded-xl p-3 border border-base-300 bg-base-100/50 flex flex-col gap-2">
                <div className="h-3 w-3/4 bg-emerald-500/10 rounded animate-pulse" />
                <div className="flex gap-1">
                  <div className="h-4 w-16 bg-base-content/5 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-base-content/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            key={heatmapFilter}
            variants={container}
            initial="hidden"
            animate="show"
            className="pr-1 items-start"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}
          >
            {filteredHeatmap.map((f) => (
              <HeatmapCell key={f.file_path} insight={f} onRefactor={setRefactorFile} />
            ))}
            {filteredHeatmap.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-16 text-base-content/50">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  <ThumbsUp size={28} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-base-content mb-1">Great Job!</h3>
                <p className="text-sm max-w-[250px]">
                  Your {heatmapFilter === 'security' ? 'security posture' : heatmapFilter === 'complexity' ? 'code structure' : 'nesting depth'} is airtight. No issues found.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
