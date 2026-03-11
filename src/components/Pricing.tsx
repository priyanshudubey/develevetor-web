// File: src/components/Pricing.tsx
"use client";

import { useState } from "react";
import { Check, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Hobby",
    price: "₹0",
    description: "Perfect for exploring AI-assisted code navigation on open source.",
    features: [
      "15 AI Chats per day",
      "Standard Regex Security Scans",
      "Public GitHub Repos only",
      "DeepSeek V3 (Standard Context)",
      "Community Support",
    ],
    buttonText: "Start for Free",
    highlight: false,
  },
  {
    name: "Pro",
    monthlyPrice: "₹799",
    annualPrice: "₹639", // 20% off
    description: "For power users and teams shipping production code.",
    features: [
      "Unlimited AI Chats",
      "God-Mode Hierarchical RAG Map",
      "AST-Powered Security (0 False Positives)",
      "Private Repo & GitLab Support",
      "DeepSeek V3 (64k Expanded Context)",
      "Priority Indexing & Support",
    ],
    buttonText: "Upgrade to Pro",
    highlight: true,
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="relative py-32 px-4 overflow-hidden bg-zinc-50 dark:bg-[#050505] transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-200/40 dark:from-emerald-900/20 via-transparent to-transparent blur-3xl pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tight">
            Simple pricing for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
              shipping faster.
            </span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 font-light">
            Whether you're a solo dev diving into open source or a senior engineer auditing legacy monoliths, we have a plan for you.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}>
            Monthly
          </span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-12 items-center rounded-full bg-zinc-200 dark:bg-zinc-800 transition-colors focus:outline-none hover:bg-zinc-300 dark:hover:bg-zinc-700"
          >
            <span 
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? "translate-x-7 bg-emerald-500" : "translate-x-1"}`} 
            />
          </button>
          <span className={`text-sm font-medium flex items-center gap-2 transition-colors ${isAnnual ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}>
            Annually 
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-wider font-bold">
              Save 20%
            </span>
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
              key={tier.name}
              className="relative w-full h-full"
            >
              {/* Animated Gradient Border for Pro Tier */}
              {tier.highlight && (
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-emerald-400 to-teal-600 dark:from-emerald-500 dark:to-teal-800 opacity-50 blur-[2px]" />
              )}

              <div className={`relative h-full flex flex-col p-8 rounded-2xl transition-all duration-300 ${
                tier.highlight
                  ? "bg-white dark:bg-[#0A0A0A] border-transparent shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-500/20"
                  : "bg-white/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 backdrop-blur-md"
              }`}>
                
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white font-mono text-[10px] uppercase tracking-widest rounded-full font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-1">
                    <Zap size={12} className="fill-current" /> Most Popular
                  </div>
                )}

                {/* Card Header */}
                <div className="mb-8 text-left">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                      {tier.monthlyPrice ? (isAnnual ? tier.annualPrice : tier.monthlyPrice) : tier.price}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">
                      / month
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed min-h-[40px]">
                    {tier.description}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-10 text-left flex-1">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                      <Check className={`w-5 h-5 shrink-0 mt-0.5 ${tier.highlight ? "text-emerald-500" : "text-zinc-400 dark:text-zinc-600"}`} />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    tier.highlight
                      ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10"
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-400 text-xs font-medium"
        >
          <ShieldCheck size={14} className="text-emerald-500" />
          Payments securely processed by Razorpay. Cancel anytime.
        </motion.div>

      </div>
    </section>
  );
}