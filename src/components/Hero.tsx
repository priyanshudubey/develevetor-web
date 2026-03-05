import { motion } from "framer-motion";
import { Github, ChevronRight, CheckCircle2 } from "lucide-react";
// import { HeroGraphic } from "./HeroGraphic";

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

export default function Hero() {
  return (
    <section className="relative pt-20 pb-20 md:pt-28 md:pb-32 overflow-hidden z-10">
      {/* <HeroGraphic /> */}
      {/* Background Dot Grid inside section (if desired, or reliance on LandingPage container) */}
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto relative z-10">
          {/* --- 1. SPOTLIGHT EFFECT --- */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-125 h-75 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

          {/* --- 2. GLASS BADGE --- */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-base-content/10 bg-base-content/5 backdrop-blur-md text-xs font-mono tracking-widest uppercase text-primary mb-8 shadow-[0_0_15px_-5px_rgba(16,185,129,0.4)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-base-content/60">v1.0</span>
            <span className="w-px h-3 bg-base-content/20 mx-1"></span>
            <span className="tracking-wide">RELEASED</span>
          </motion.div>

          {/* --- 3. HEADLINE --- */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-base-content drop-shadow-sm">
            Your AI{" "}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-800">
              Technical Lead
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-50"
                viewBox="0 0 100 10"
                preserveAspectRatio="none">
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </span>
            <br className="hidden md:block" /> for any Codebase.
          </motion.h1>

          {/* --- 4. SUBHEAD --- */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-base-content/60 mb-10 max-w-2xl mx-auto leading-relaxed text-balance font-light">
            Index your repository instantly.{" "}
            <span className="text-base-content font-medium">
              Generate docs, find technical debt, and onboard developers
            </span>{" "}
            without reading thousands of lines of code.
          </motion.p>

          {/* --- 5. BUTTONS --- */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary Button with Shine Effect */}
            <button className="group relative btn bg-primary hover:brightness-110 text-primary-content border-0 btn-lg h-12 min-h-0 rounded-md gap-3 px-8 font-semibold shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all">
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
              <Github
                size={20}
                className="relative z-10"
              />
              <span className="relative z-10 text-primary-content font-bold">Index Public Repo</span>
            </button>

            {/* Secondary Button */}
            <button className="btn btn-ghost btn-lg h-12 min-h-0 rounded-md gap-2 px-8 font-medium text-base-content/60 border border-base-content/10 bg-base-content/5 hover:bg-base-content/10 hover:text-base-content hover:border-base-content/20 backdrop-blur-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary">
              View Demo <ChevronRight size={16} />
            </button>
          </motion.div>
        </motion.div>

        {/* --- TERMINAL MOCKUP --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 mx-auto max-w-5xl">
          <div className="rounded-2xl border border-base-300 bg-base-200 shadow-2xl overflow-hidden text-left font-mono text-sm">
            {/* Terminal Header */}
            <div className="bg-base-300/30 px-4 py-2 flex items-center gap-2 border-b border-base-300">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-error/80"></div>
                <div className="w-3 h-3 rounded-full bg-warning/80"></div>
                <div className="w-3 h-3 rounded-full bg-success/80"></div>
              </div>
              <div className="ml-4 text-xs text-base-content/40">
                user@develevator:~/project
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 space-y-2 text-base-content/80 font-mono text-sm leading-relaxed">
              {/* 1. Typing Animation */}
              <div className="flex gap-2 items-center h-6">
                <span className="text-secondary">➜</span>
                <span className="text-base-content/50">~</span>
                <div className="relative">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "linear", delay: 0.2 }}
                    className="overflow-hidden whitespace-nowrap inline-block align-bottom text-base-content">
                    npx develevator analyze ./src
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: 3, duration: 0.8 }}
                    className="inline-block w-2 h-4 bg-base-content/50 ml-1 align-middle"
                  />
                </div>
              </div>

              {/* 2. Processing Line */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.4, duration: 0.2 }}
                className="text-base-content/60 animate-pulse">
                Analyzing 14 files...
              </motion.div>

              {/* 3. Output Block */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      delayChildren: 1.8,
                      staggerChildren: 0.1,
                    },
                  },
                }}
                className="pt-2 space-y-1">
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="flex items-center gap-2 text-secondary">
                  <CheckCircle2 size={14} />
                  <span>Indexing complete (0.4s)</span>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="pl-6 border-l border-base-content/10 ml-1.5 space-y-2 py-2">
                  <div className="flex justify-between max-w-md">
                    <span>Documentation</span>
                    <span className="text-error">Missing (0%)</span>
                  </div>
                  <div className="flex justify-between max-w-md">
                    <span>Auth Complexity</span>
                    <span className="text-warning">
                      High (Cyclomatic: 15)
                    </span>
                  </div>
                  <div className="flex justify-between max-w-md">
                    <span>Test Coverage</span>
                    <span className="text-secondary">Good (84%)</span>
                  </div>
                </motion.div>

                <motion.div
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  className="text-info pt-2">
                  ? What would you like to do next?{" "}
                  <span className="text-base-content/50">(Use arrow keys)</span>
                </motion.div>

                <motion.div
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  className="pl-2 text-base-content font-bold bg-base-content/10 rounded w-fit pr-4 py-0.5">
                  <span className="text-secondary mr-2">❯</span>
                  Generate README.md{" "}
                  <span className="text-base-content/50 font-normal text-xs ml-2">
                    Recommended
                  </span>
                </motion.div>

                <motion.div
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  className="pl-6 text-base-content/60">
                  Draft Jira Ticket
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
