import React from "react";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, GitBranch } from "lucide-react";

export default function Features() {
  return (
    <section
      id="features"
      className="py-32 relative overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-mono text-primary mb-6">
            <span>CAPABILITIES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            Understands Code, <br />
            <span className="text-slate-500">Not Just Text.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed">
            Most AI tools treat code like a novel. DevElevator parses the
            <span className="text-white font-medium">
              {" "}
              Abstract Syntax Tree (AST)
            </span>
            , maps dependency graphs, and spots anti-patterns that regex can't
            find.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={
              <FileText
                className="text-emerald-400"
                size={24}
              />
            }
            title="Instant Documentation"
            desc="Turn spaghetti code into a beautiful, formatted README.md or Confluence page with one click."
            tags={["Markdown", "Mermaid.js", "JSDoc"]}
            delay={0}
          />
          <FeatureCard
            icon={
              <ShieldCheck
                className="text-blue-400"
                size={24}
              />
            }
            title="Tech Debt Radar"
            desc="Automatically scan for insecure patterns, lack of tests, and overly complex functions."
            tags={["Cyclomatic Complexity", "CVE Scan"]}
            delay={0.1}
          />
          <FeatureCard
            icon={
              <GitBranch
                className="text-amber-400"
                size={24}
              />
            }
            title="Onboarding Assistant"
            desc="New hire? Get a 'Day 1' summary of the repo structure, build commands, and key files."
            tags={["Dependency Graph", "Setup Guide"]}
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
}

// --- Sub Component ---

function FeatureCard({
  icon,
  title,
  desc,
  tags,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tags: string[];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-8 hover:border-white/10 transition-colors duration-300">
      {/* Hover Gradient Blob */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-all duration-500 group-hover:bg-primary/10 group-hover:blur-2xl" />

      <div className="relative z-10">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 shadow-inner">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm mb-6">{desc}</p>
      </div>

      {/* Tech Tags */}
      <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-2 py-1 text-[10px] uppercase tracking-wider font-mono font-medium rounded border border-white/5 bg-white/5 text-slate-400 group-hover:border-primary/20 group-hover:text-primary transition-colors">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
