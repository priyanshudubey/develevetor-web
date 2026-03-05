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
      className="lg:col-span-3 bg-base-200 border border-base-300 rounded-2xl p-6"
    >
      <h2 className="text-sm font-semibold text-base-content flex items-center gap-2 mb-4">
        <GitBranch size={15} className="text-primary" />
        Top Code Smells
      </h2>
      <div className="space-y-2">
        {topComplex.map((f, i) => {
          const name = f.file_path.replace(/\\/g, "/").split("/").pop() ?? f.file_path;
          const ccHigh = f.cyclomatic_complexity > 15;
          const nestHigh = f.max_nesting_depth > 5;
          const modifiedAgo = formatDistanceToNow(new Date(f.updated_at), { addSuffix: true });

          return (
            <div
              key={f.file_path}
              className="flex flex-col gap-2 px-3 py-2.5 rounded-xl bg-base-100 border border-base-300 hover:border-base-content/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-base-content/30 w-4">
                  {i + 1}
                </span>
                <Layers size={13} className="text-base-content/40 shrink-0" />
                <span className="flex-1 text-[13px] font-mono text-base-content/80 truncate">
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
                    <span className="text-[10px] text-success/60">✓</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 pl-10">
                <Clock size={10} className="text-base-content/30" />
                <span className="text-[10px] text-base-content/40 font-mono">
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
