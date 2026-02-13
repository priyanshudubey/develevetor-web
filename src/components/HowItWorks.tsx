import React from "react";
import { Github, Code2, Terminal } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-24 bg-base-200/30 border-y border-white/5">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold text-center mb-16 font-mono tracking-tight uppercase text-base-content/50">
          Pipeline Workflow
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-20 right-20 h-px bg-linear-to-r from-transparent via-base-content/20 to-transparent -translate-y-8 z-0"></div>

          <Step
            number="01"
            title="Connect Repo"
            desc="Paste a URL or login with GitHub."
            icon={<Github size={20} />}
          />
          <Step
            number="02"
            title="Vector Indexing"
            desc="Code is chunked & embedded."
            icon={<Code2 size={20} />}
          />
          <Step
            number="03"
            title="Actionable Insights"
            desc="Chat, generate, or refactor."
            icon={<Terminal size={20} />}
          />
        </div>
      </div>
    </section>
  );
}

// --- Sub Component ---

function Step({
  number,
  title,
  desc,
  icon,
}: {
  number: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center max-w-xs bg-base-100 p-4 rounded-xl border border-transparent hover:border-white/5 transition-colors">
      <div className="w-16 h-16 rounded-full bg-base-200 border border-white/5 flex items-center justify-center text-primary mb-4 shadow-lg">
        {icon}
      </div>
      <div className="font-mono text-xs text-primary mb-1 opacity-80">
        {number}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-base-content/50">{desc}</p>
    </div>
  );
}
