// File: src/components/Features.tsx
import React from "react";
import { motion } from "framer-motion";
import { FileCode2, Network, ShieldCheck, Zap, ChevronRight, CheckCircle2, XCircle } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-32 relative overflow-hidden bg-zinc-50 dark:bg-[#050505] transition-colors duration-300">
      
      {/* Background Decorative Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.15) 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }}
      />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        
        {/* --- SECTION HEADER --- */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/5 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-6 shadow-sm dark:shadow-none"
          >
            <span>Platform Capabilities</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-zinc-900 dark:text-white"
          >
            Understands Code, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 dark:from-zinc-500 dark:to-zinc-700">
              Not Just Text.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-light"
          >
            Most AI tools treat your repository like a novel. DevElevator parses the Abstract Syntax Tree, maps global dependencies, and catches architectural flaws that regex completely misses.
          </motion.p>
        </div>

        {/* --- BENTO BOX GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(280px,auto)] gap-6">
          
          {/* CARD 1: AST Parser (Wide) */}
          <BentoCard 
            delay={0.1}
            className="md:col-span-2"
            title="AST-Powered Security Auditor"
            desc="Ditch the brittle Regex. Our 3-Stage Trust Pipeline parses the actual Abstract Syntax Tree to find vulnerabilities with zero false positives."
            icon={<ShieldCheck size={24} />}
          >
            {/* Interactive Visual for Card 1 */}
            <div className="mt-6 flex flex-col gap-2 font-mono text-xs w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2 border-b border-zinc-200 dark:border-white/10 pb-2">
                <span>src/auth.ts</span>
                <span className="text-emerald-500">Regex vs AST</span>
              </div>
              
              {/* Fake positive (Ignored) */}
              <div className="flex items-start gap-3 opacity-60">
                <XCircle size={14} className="text-zinc-400 mt-0.5" />
                <div>
                  <span className="text-pink-500">const</span> msg = <span className="text-emerald-600 dark:text-emerald-400">"Do not use eval() here"</span>;
                  <div className="text-zinc-400 dark:text-zinc-500 mt-1 text-[10px]">AST: Ignored (String Literal)</div>
                </div>
              </div>

              {/* Real positive (Flagged) */}
              <div className="flex items-start gap-3 mt-2 bg-red-50 dark:bg-red-500/10 p-2 rounded border border-red-100 dark:border-red-500/20">
                <CheckCircle2 size={14} className="text-red-500 mt-0.5" />
                <div>
                  <span className="text-blue-500">eval</span>(userInput);
                  <div className="text-red-600 dark:text-red-400 mt-1 text-[10px] font-bold">AST: FLAGGED (CallExpression)</div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* CARD 2: God-Mode Map (Square) */}
          <BentoCard 
            delay={0.2}
            className="md:col-span-1"
            title="Hierarchical RAG Map"
            desc="We pre-compute semantic summaries for every file, giving the AI 'God-Mode' context of your entire architecture."
            icon={<Network size={24} />}
          >
            {/* File Tree Visual */}
            <div className="mt-6 font-mono text-[10px] leading-relaxed text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-black/40 p-4 rounded-lg border border-zinc-200 dark:border-white/5">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold mb-2">System Map Generated</div>
              <div className="pl-2 border-l border-zinc-300 dark:border-zinc-700 ml-1">
                ├── 📁 api/
                <br />
                │   ├── 📄 routes.ts <span className="text-indigo-400">→ auth logic</span>
                <br />
                │   └── 📄 db.ts <span className="text-indigo-400">→ connection pool</span>
                <br />
                └── 📁 services/
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;└── 📄 ai.ts <span className="text-indigo-400">→ deepseek wrapper</span>
              </div>
            </div>
          </BentoCard>

          {/* CARD 3: Auto Docs (Square) */}
          <BentoCard 
            delay={0.3}
            className="md:col-span-1"
            title="One-Click Documentation"
            desc="Turn spaghetti logic into formatted READMEs, Mermaid.js diagrams, and Day-1 onboarding wikis instantly."
            icon={<FileCode2 size={24} />}
          >
             <div className="mt-6 flex gap-2">
                <div className="h-20 w-1/3 bg-zinc-200 dark:bg-white/10 rounded animate-pulse" />
                <div className="flex flex-col gap-2 w-2/3">
                  <div className="h-4 w-full bg-emerald-100 dark:bg-emerald-500/20 rounded" />
                  <div className="h-4 w-4/5 bg-emerald-100 dark:bg-emerald-500/20 rounded" />
                  <div className="h-4 w-full bg-emerald-100 dark:bg-emerald-500/20 rounded" />
                </div>
             </div>
          </BentoCard>

          {/* CARD 4: Performance (Wide) */}
          <BentoCard 
            delay={0.4}
            className="md:col-span-2"
            title="Massive Context Window"
            desc="Powered by DeepSeek V3. Feed it your monolithic backend, database schemas, and frontend all at once without breaking a sweat."
            icon={<Zap size={24} />}
          >
            <div className="mt-6 w-full">
              <div className="flex justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-2">
                <span>Context Limit</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">64,000 Tokens</span>
              </div>
              <div className="h-2 w-full bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "85%" }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                />
              </div>
              <div className="flex justify-between mt-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500"/> DB Schemas</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500"/> Controllers</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500"/> Middlewares</span>
              </div>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}

// --- Sub Component (The Bento Card) ---

function BentoCard({
  icon, title, desc, delay, className = "", children
}: {
  icon: React.ReactNode; title: string; desc: string; delay: number; className?: string; children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-[#0A0A0A]/80 backdrop-blur-md p-8 transition-all duration-300 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 shadow-sm dark:shadow-[0_0_30px_-15px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] ${className}`}
    >
      {/* Subtle Glow inside the card on hover */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/20 group-hover:blur-2xl pointer-events-none z-0" />

      <div className="relative z-10">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm dark:shadow-inner shrink-0">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">{title}</h3>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm pr-4">{desc}</p>
      </div>

      {/* Custom visual content slot */}
      <div className="relative z-10 mt-auto pt-6 flex-1 flex flex-col justify-end">
        {children}
      </div>
      
      {/* Decorative arrow that appears on hover */}
      <div className="absolute bottom-6 right-6 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        <ChevronRight size={20} className="text-emerald-500/50" />
      </div>
    </motion.div>
  );
}