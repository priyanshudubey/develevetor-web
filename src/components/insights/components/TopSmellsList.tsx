import { motion, type Variants } from "framer-motion";
import { GitBranch, Layers, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { FileInsight } from "../../../context/InsightsContext";

// --- Framer Motion variants ---
const card: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

interface Props {
  topComplex: FileInsight[];
}

export default function TopSmellsList({ topComplex }: Props) {
  return (
    <motion.div
      variants={card}
      className="lg:col-span-3 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)] transition-shadow"
    >
      <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4 tracking-wide">
        <GitBranch size={15} className="text-emerald-500" />
        Top Code Smells
      </h2>
      <div className="space-y-2.5">
        {topComplex.map((f, i) => {
          const name = f.file_path.replace(/\\/g, "/").split("/").pop() ?? f.file_path;
          const ccHigh = f.cyclomatic_complexity > 15;
          const nestHigh = f.max_nesting_depth > 5;
          const modifiedAgo = formatDistanceToNow(new Date(f.updated_at), { addSuffix: true });

          return (
            <div
              key={f.file_path}
              className="group flex flex-col gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500/50 dark:hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-600 w-4 group-hover:text-zinc-700 dark:group-hover:text-zinc-500 transition-colors">
                  {i + 1}
                </span>
                <Layers size={13} className="text-zinc-400 dark:text-zinc-500 shrink-0 group-hover:text-emerald-600 dark:group-hover:text-emerald-500/70 transition-colors" />
                <span className="flex-1 text-[13px] font-mono text-zinc-700 dark:text-zinc-300 truncate group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                  {name}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {ccHigh && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        f.cyclomatic_complexity > 30
                          ? "bg-red-500/15 text-red-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      CC: {f.cyclomatic_complexity}
                    </span>
                  )}
                  {nestHigh && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400">
                      Depth: {f.max_nesting_depth}
                    </span>
                  )}
                  {!ccHigh && !nestHigh && (
                    <span className="text-[10px] text-emerald-500/60 font-bold">✓</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 pl-10">
                <Clock size={10} className="text-zinc-400 dark:text-zinc-600" />
                <span className="text-[10px] text-zinc-500 font-mono">
                  Modified {modifiedAgo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
