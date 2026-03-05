"use client";

import { Github, Code2, Terminal } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Github,
    label: "Source Integration",
    description:
      "Connect your GitHub account. We support public and private repositories.",
  },
  {
    icon: Code2,
    label: "AST Semantic Analysis",
    description:
      "Our engine parses your Abstract Syntax Tree, mapping logic dependencies into vectors.",
  },
  {
    icon: Terminal,
    label: "Intelligent Output",
    description:
      "Chat with your codebase, automate PRs, or trigger refactors via dashboard or CLI.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="working"
      className="relative py-24 overflow-hidden bg-slate-50 dark:bg-base-100 border-y border-slate-900/10 dark:border-white/5">
      {/* Background Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
            Pipeline Workflow
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
            From repo to insights{" "}
            <span className="text-slate-500">in minutes</span>
          </h2>
        </div>

        {/* Desktop: Horizontal Pipeline */}
        <div className="hidden lg:block relative">
          {/* 🌟 RE-ENGINEERED SVG LAYER */}
          <div className="absolute top-7 left-0 w-full h-10 pointer-events-none -translate-y-1/2">
            <svg
              width="100%"
              height="40"
              viewBox="0 0 1000 40"
              fill="none"
              preserveAspectRatio="none"
              className="overflow-visible">
              {/* --- SECTION 1: Step 01 to Step 02 --- */}
              {/* Solid Background Line */}
              <motion.path
                d="M 194 20 H 472"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
                className="text-slate-900 dark:text-white"
              />
              {/* Static Arrowhead (Fixed at the end) */}
              <path
                d="M 467 16 L 472 20 L 467 24"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
              {/* Animated Laser Pulse */}
              <motion.path
                d="M 194 20 H 472"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="90 150"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -180 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />

              {/* --- SECTION 2: Step 02 to Step 03 --- */}
              {/* Solid Background Line */}
              <motion.path
                d="M 528 20 H 806"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
                className="text-slate-900 dark:text-white"
              />
              {/* Static Arrowhead (Fixed at the end) */}
              <path
                d="M 801 16 L 806 20 L 801 24"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
              {/* Animated Laser Pulse */}
              <motion.path
                d="M 528 20 H 806"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="90 150"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -180 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center px-4 group">
                {/* Icon Container (h-14 = 56px) */}
                <div className="relative z-10 mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-900/10 dark:border-white/5 bg-white dark:bg-white/[0.02] text-emerald-500 dark:text-emerald-400 shadow-sm dark:shadow-2xl transition-all duration-300 group-hover:border-emerald-500/50 group-hover:bg-slate-50 dark:group-hover:bg-white/[0.05]">
                  <step.icon className="h-6 w-6" />
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-600/80 dark:text-emerald-500/60 font-bold">
                    Phase {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    {step.label}
                  </h3>
                  <p className="max-w-60 text-sm leading-relaxed text-slate-600 dark:text-slate-400 mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
