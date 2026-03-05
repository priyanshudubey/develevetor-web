import { Check, Zap, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for exploring AI-assisted development.",
    features: [
      "15 AI Chats per day",
      "3 Automated PRs per day",
      "3 Active Workspaces",
      "Standard Claude 3 Haiku",
      "Public GitHub Repos only",
    ],
    buttonText: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$15",
    unit: "/month",
    description: "For power users who want to ship at lightning speed.",
    features: [
      "Unlimited AI Chats",
      "Unlimited Automated PRs",
      "15 Active Workspaces",
      "Claude 3.5 Sonnet Access",
      "Private Repo Support",
      "Priority Indexing",
    ],
    buttonText: "Upgrade to Pro",
    highlight: true,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-24 px-6 overflow-hidden bg-white dark:bg-base-100">
      {/* Background Dot Grid */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)",
          backgroundSize: "24px 24px"
        }}
      />
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16">
          Whether you're a solo dev or a shipping machine, we've got a plan to
          supercharge your workflow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              key={tier.name}
              className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
                tier.highlight
                  ? "bg-slate-50 dark:bg-white/[0.04] border-emerald-500/50 dark:border-emerald-500/50 shadow-[0_0_30px_rgba(217,70,239,0.1)]"
                  : "bg-slate-50 dark:bg-white/[0.02] border-slate-900/10 dark:border-white/5 hover:border-slate-900/20 dark:hover:border-white/10"
              }`}>
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white font-mono text-xs uppercase tracking-widest rounded-full font-bold">
                  Recommended
                </div>
              )}

              <div className="mb-8 text-left">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                    {tier.price}
                  </span>
                  {tier.unit && (
                    <span className="text-slate-600 dark:text-slate-400">{tier.unit}</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-10 text-left flex-1">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <Check
                      className={`w-5 h-5 shrink-0 ${tier.highlight ? "text-emerald-500" : "text-emerald-400"}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  tier.highlight
                    ? "bg-primary hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25"
                    : "bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-900 dark:text-slate-200 border border-slate-900/10 dark:border-white/10"
                }`}>
                {tier.highlight && <Zap className="w-4 h-4 fill-current" />}
                {tier.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="mt-12 text-slate-600 dark:text-slate-500 text-sm flex items-center justify-center gap-2">
          <HelpCircle size={14} />
          All plans include 256-bit encryption and SOC2 compliant data handling.
        </p>
      </div>
    </section>
  );
}
