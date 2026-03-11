// File: src/components/Hero.tsx
import { motion, type Variants } from "framer-motion";
import { Sparkles, ArrowRight, Code2, ShieldAlert } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-zinc-50 dark:bg-[#050505] flex flex-col items-center justify-start pt-22 pb-20 overflow-hidden font-sans transition-colors duration-300">
      
      {/* --- BACKGROUND GLOWS (Emerald & Teal theme) --- */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-200/40 dark:bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-200/40 dark:bg-teal-900/20 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
        
        {/* --- 1. GLASS BADGE --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md text-xs font-medium tracking-wide text-emerald-700 dark:text-emerald-300 mb-8 cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
        >
          <Sparkles size={14} className="text-emerald-500 dark:text-emerald-400" />
          <span>DeepSeek V3 Integration is Live</span>
          <div className="w-px h-3 bg-zinc-300 dark:bg-white/20 mx-1" />
          <span className="text-zinc-800 dark:text-white flex items-center gap-1">
            Read Announcement <ArrowRight size={12} />
          </span>
        </motion.div>

        {/* --- 2. HEADLINE --- */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-zinc-900 dark:text-white max-w-4xl mx-auto mb-6 drop-shadow-sm dark:drop-shadow-2xl"
        >
          Understand any legacy codebase in{" "}
          <span className="relative inline-block whitespace-nowrap">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
              seconds.
            </span>
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_4px_12px_rgba(16,185,129,0.5)] z-0"
            />
          </span>
        </motion.h1>

        {/* --- 3. SUBHEAD --- */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
        >
          The AI Staff Engineer that maps your architecture, audits your security with zero false positives, and onboards new hires instantly.
        </motion.p>

        {/* --- 4. BUTTONS --- */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          {/* Emerald Primary Button */}
          <button className="group relative flex items-center justify-center h-12 px-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold tracking-wide hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] border border-emerald-400/50">
            <span className="relative z-10 flex items-center gap-2">
              Import Repository <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          {/* Secondary Outline Button */}
          <button className="flex items-center justify-center h-12 px-8 rounded-lg bg-white/60 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-white font-medium hover:bg-zinc-100 dark:hover:bg-white/10 transition-all duration-200 backdrop-blur-sm shadow-sm dark:shadow-none hover:border-emerald-500/30 dark:hover:border-emerald-400/30">
            Watch Demo
          </button>
        </motion.div>

        {/* --- 5. THE 3D APP MOCKUP --- */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
          style={{ perspective: 1200 }}
          className="mt-20 w-full max-w-5xl relative"
        >
          {/* Mockup Container */}
          <div className="relative rounded-xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl shadow-2xl overflow-hidden shadow-emerald-500/5 dark:shadow-emerald-500/10 transition-colors duration-300">
            
            {/* macOS Window Header */}
            <div className="h-12 border-b border-zinc-200 dark:border-white/10 flex items-center px-4 bg-zinc-50/50 dark:bg-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 text-xs font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                <Code2 size={14} /> develevator / src / controllers / logisticsController.ts
              </div>
            </div>

            {/* App Body - Split View */}
            <div className="flex flex-col md:flex-row h-auto md:h-[400px]">
              
              {/* Left Side: Fake Code */}
              <div className="w-full md:w-1/2 p-6 font-mono text-sm text-zinc-500 dark:text-zinc-400 border-r border-zinc-200 dark:border-white/10 overflow-hidden text-left bg-zinc-50 dark:bg-black/40 transition-colors">
                <div className="flex gap-4">
                  <div className="flex flex-col text-zinc-300 dark:text-zinc-700 select-none">
                    <span>41</span><span>42</span><span>43</span><span>44</span><span>45</span><span>46</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-pink-600 dark:text-pink-400">const</span> <span className="text-blue-600 dark:text-blue-400">createDeliveryOrder</span> = <span className="text-pink-600 dark:text-pink-400">async</span> (req, res) =&gt; {'{'}
                    <span className="pl-4">const {'{'} orderId {'}'} = req.body;</span>
                    <span className="pl-4">await db.query(<span className="text-emerald-600 dark:text-emerald-400">"UPDATE stock SET qty = qty - 1"</span>);</span>
                    <span className="pl-4 text-zinc-400 dark:text-zinc-500">// TODO: Add rollback on failure</span>
                    <span className="pl-4">return res.status(200).send();</span>
                    {'}'}
                  </div>
                </div>
              </div>

              {/* Right Side: AI Insight Chat */}
              <div className="w-full md:w-1/2 p-6 bg-white dark:bg-[#0A0A0A] flex flex-col gap-4 text-left transition-colors">
                
                {/* User Message */}
                <div className="self-end bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[85%] text-sm shadow-sm dark:shadow-none">
                  Explain the tech debt in this controller.
                </div>

                {/* AI Message */}
                <div className="self-start flex flex-col gap-3 max-w-[95%]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md border border-emerald-400">
                      <Sparkles size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">DevElevator AI</span>
                  </div>
                  
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-zinc-700 dark:text-zinc-300 px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
                    I found a <span className="text-red-600 dark:text-red-400 font-semibold">Critical Vulnerability</span> in <code className="bg-zinc-100 dark:bg-black px-1 rounded text-pink-600 dark:text-pink-300 border border-zinc-200 dark:border-transparent">createDeliveryOrder</code>.
                    <br/><br/>
                    <div className="flex items-start gap-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-3 rounded-lg mb-2">
                      <ShieldAlert size={16} className="text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-red-800 dark:text-red-200">The database transaction on line 43 allows stock levels to go negative because it lacks a rollback wrapper. A failed network request will result in ghost orders.</p>
                    </div>
                    Would you like me to generate the fixed AST node for this?
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Bottom Fade Gradient (Adapts to Light/Dark) */}
          <div className="absolute -bottom-4 left-0 w-full h-32 bg-gradient-to-t from-zinc-50 dark:from-[#050505] to-transparent pointer-events-none transition-colors duration-300" />
        </motion.div>

      </div>
    </section>
  );
}