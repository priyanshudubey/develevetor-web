import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Info, Sparkles } from "lucide-react";
import type { ScoreBreakdown, HeatmapFilter } from "../hooks/useInsightsData";

// --- Framer Motion variants ---
const card: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export function HealthGauge({ score }: { score: number }) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = "#10b981"; // Emerald-500
  let label = "Excellent";
  if (score < 45) {
    color = "#f87171"; // Red-400
    label = "Critical";
  } else if (score < 75) {
    color = "#fbbf24"; // Amber-400
    label = "Needs Focus";
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="stroke-zinc-200 dark:stroke-zinc-800"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center pointer-events-none">
        <span className="text-3xl font-bold" style={{ color, textShadow: `0 0 10px ${color}40` }}>
          {score}
        </span>
        <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-500 tracking-wider uppercase">
          {label}
        </span>
      </div>
      {/* Mock Score Momentum */}
      <div className="absolute -bottom-5 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-500 bg-emerald-500/20 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
        <Sparkles size={10} />
        +3% since last scan
      </div>
    </div>
  );
}

interface Props {
  breakdown: ScoreBreakdown;
  heatmapFilter: HeatmapFilter;
  handleFilterClick: (key: HeatmapFilter) => void;
  totalFiles: number;
}

export default function HealthScoreSection({ breakdown, heatmapFilter, handleFilterClick, totalFiles }: Props) {
  const [showInfo, setShowInfo] = useState(false);

  const impactRows: { key: HeatmapFilter; label: string; health: number; affected: number; color: string; barColor: string }[] = [
    { key: "complexity", label: "Complexity",  health: breakdown.ccHealth,       affected: breakdown.ccFiles.length,       color: "text-amber-400",   barColor: "bg-amber-400"   },
    { key: "security",   label: "Security",    health: breakdown.securityHealth, affected: breakdown.securityFiles.length, color: "text-red-400",     barColor: "bg-red-400"     },
    { key: "nesting",    label: "Nesting",     health: breakdown.nestingHealth,  affected: breakdown.nestingFiles.length,  color: "text-violet-400",  barColor: "bg-violet-400"  },
  ];

  return (
    <motion.div
      variants={card}
      className="lg:col-span-2 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)] transition-shadow"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-500">
          Project Health Score
        </span>
        <button
          onClick={() => setShowInfo((v) => !v)}
          className="p-0.5 rounded text-zinc-500 dark:text-zinc-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          title="How is this calculated?"
        >
          <Info size={13} />
        </button>
      </div>

      {/* Info popup */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-emerald-500/30 text-[11px] text-zinc-900 dark:text-zinc-300 leading-relaxed shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
        >
          Your score is a weighted blend: <span className="text-amber-400 font-semibold">40% Complexity</span> + <span className="text-red-400 font-semibold">40% Security</span> + <span className="text-violet-400 font-semibold">20% Nesting</span>. Each category’s health = <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">100 × (clean files / total files)</code>.
        </motion.div>
      )}

      <div className="relative flex items-center justify-center">
        <HealthGauge score={breakdown.total} />
      </div>

      {/* Score Impact Breakdown */}
      <div className="w-full space-y-2.5 mt-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-500 text-center">
          Score Impact
        </div>
        {impactRows.map((row) => (
          <button
            key={row.key}
            onClick={() => handleFilterClick(row.key)}
            className={`w-full text-left rounded-lg px-3 py-2 transition-all border ${
              heatmapFilter === row.key
                ? "bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                : "border-transparent hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-semibold ${row.color}`}>
                {row.label}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold tracking-wide ${row.health >= 75 ? 'text-emerald-400' : row.health >= 45 ? 'text-amber-400' : 'text-red-400'}`}>
                  {row.health}%
                </span>
                <span className="text-[9px] text-zinc-500 dark:text-zinc-600 font-medium">
                  {row.affected}/{totalFiles}
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${row.barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${100 - row.health}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
