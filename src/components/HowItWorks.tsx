// File: src/components/HowItWorks.tsx
"use client";

import { motion } from "framer-motion";
import { Github, Sparkles, Database } from "lucide-react";

const steps = [
  {
    label: "Source Integration",
    description: "Connect your GitHub account. We securely ingest public and private repositories in seconds.",
  },
  {
    label: "AST Semantic Analysis",
    description: "Our engine parses the Abstract Syntax Tree, mapping logic dependencies into vector embeddings.",
  },
  {
    label: "Intelligent Output",
    description: "Chat with your codebase, generate instant wikis, or hunt down complex technical debt.",
  },
];

export default function HowItWorks() {
  return (
    <section id="working" className="relative py-32 px-4 overflow-hidden bg-zinc-50 dark:bg-[#050505] transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-900/5 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold mb-6"
          >
            <Database size={14} /> Pipeline Workflow
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-5xl mb-6"
          >
            From raw code to insights{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
              in minutes.
            </span>
          </motion.h2>
        </div>

        {/* --- PIPELINE GRID --- */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Continuous Background Line (Desktop) */}
          <div className="hidden md:block absolute top-32 left-[16%] right-[16%] h-[2px] bg-zinc-200 dark:bg-white/5 z-0" />
          
          {/* Animated Flowing Laser (Desktop) */}
          <div className="hidden md:block absolute top-32 left-[16%] right-[16%] h-[2px] overflow-hidden z-0">
            <motion.div 
              initial={{ x: "-100%" }}
              whileInView={{ x: "200%" }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="w-1/3 h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.8)]"
            />
          </div>

          {/* --- STEP 1: INGESTION --- */}
          <StepCard index={0} step={steps[0]}>
            <div className="h-32 w-full rounded-lg bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-white/10 flex items-center justify-center relative overflow-hidden">
              <Github size={32} className="text-zinc-300 dark:text-zinc-700 absolute opacity-20" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 px-3 py-1.5 rounded-md shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">git clone dev-elevator</span>
                </div>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  className="h-1 bg-emerald-500 rounded-full w-24 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>
          </StepCard>

          {/* --- STEP 2: AST PARSING --- */}
          <StepCard index={1} step={steps[1]}>
            <div className="h-32 w-full rounded-lg bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-white/10 flex items-center justify-center p-4">
               {/* Abstract Tree Graphic */}
               <div className="flex flex-col items-center gap-2 w-full">
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono rounded">Program</div>
                  <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700" />
                  <div className="flex justify-between w-3/4">
                    <div className="w-1/2 flex flex-col items-center">
                      <div className="w-full h-px bg-zinc-300 dark:bg-zinc-700" />
                      <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700" />
                      <div className="px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-[9px] font-mono rounded">ImportDecl</div>
                    </div>
                    <div className="w-1/2 flex flex-col items-center">
                      <div className="w-full h-px bg-emerald-500/50" />
                      <div className="w-px h-3 bg-emerald-500/50" />
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1], borderColor: ["rgba(16,185,129,0.2)", "rgba(16,185,129,0.8)", "rgba(16,185,129,0.2)"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 text-[9px] font-mono rounded shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                      >
                        FuncDecl
                      </motion.div>
                    </div>
                  </div>
               </div>
            </div>
          </StepCard>

          {/* --- STEP 3: OUTPUT --- */}
          <StepCard index={2} step={steps[2]}>
            <div className="h-32 w-full rounded-lg bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-white/10 flex flex-col justify-end p-3 overflow-hidden">
               
               {/* Fake Chat Interface */}
               <div className="flex flex-col gap-2 w-full">
                 <div className="self-end bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1.5 rounded-xl rounded-tr-sm text-[10px] max-w-[80%]">
                   Generate an architecture doc.
                 </div>
                 
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5 }}
                   className="self-start bg-white dark:bg-[#0A0A0A] border border-emerald-500/20 px-3 py-2 rounded-xl rounded-tl-sm text-[10px] max-w-[90%] shadow-sm"
                 >
                   <div className="flex items-center gap-1.5 mb-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                     <Sparkles size={10} /> <span>DevElevator</span>
                   </div>
                   <div className="space-y-1">
                     <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                     <div className="h-1.5 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                     <div className="h-1.5 w-4/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                   </div>
                 </motion.div>
               </div>

            </div>
          </StepCard>

        </div>
      </div>
    </section>
  );
}

// --- SUB COMPONENT ---
function StepCard({ index, step, children }: { index: number; step: typeof steps[0]; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative z-10 flex flex-col bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-white/5 p-6 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group"
    >
      {/* Node indicator */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-zinc-50 dark:bg-[#050505] border-2 border-emerald-500 flex items-center justify-center z-20 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{index + 1}</span>
      </div>

      <div className="mt-4 mb-6">
        {children}
      </div>

      <div className="space-y-2 flex-1 text-center">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
          {step.label}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}