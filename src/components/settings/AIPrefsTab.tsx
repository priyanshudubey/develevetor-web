import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  Cpu,
  MessageSquare,
  Save,
  CheckCircle2,
  Loader2,
  Sparkles,
  Zap,
  Globe,
  Code2,
  Bot,
  Wrench,
} from "lucide-react";
import axios from "axios";

// ── Model definitions ─────────────────────────────────────────────────────────

interface ModelDef {
  id: string;
  label: string;
  provider: string;
  providerColor: string;
  useCase: string;
  icon: React.ReactNode;
  badge?: string;
  speed: { emoji: string; label: string; color: string };
}

const MODELS: ModelDef[] = [
  {
    id: "claude-opus-4-5",
    label: "Claude Opus 4.5",
    provider: "Anthropic",
    providerColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    useCase: "High-level architecture & refactoring",
    icon: <Sparkles className="w-5 h-5" />,
    badge: "Smartest",
    speed: { emoji: "🧠", label: "Deep Reasoning", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  },
  {
    id: "gpt-4o",
    label: "GPT-4o",
    provider: "OpenAI",
    providerColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    useCase: "Risky migrations & tricky debugging",
    icon: <Zap className="w-5 h-5" />,
    speed: { emoji: "⚡", label: "Fast", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  },
  {
    id: "gemini-2.5-pro-preview-05-06",
    label: "Gemini 2.5 Pro",
    provider: "Google",
    providerColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    useCase: "Analyzing the entire repository at once",
    icon: <Globe className="w-5 h-5" />,
    badge: "Largest Context",
    speed: { emoji: "🌐", label: "Balanced", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  },
  {
    id: "claude-sonnet-4-5",
    label: "Claude Sonnet 4.5",
    provider: "Anthropic",
    providerColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    useCase: "Daily tickets & iterative building",
    icon: <Bot className="w-5 h-5" />,
    badge: "Best Value",
    speed: { emoji: "⚡", label: "Fast", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  },
  {
    id: "deepseek-chat",
    label: "DeepSeek-V3",
    provider: "DeepSeek",
    providerColor: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    useCase: "Rapid iterations & competitive coding",
    icon: <Code2 className="w-5 h-5" />,
    speed: { emoji: "⚡", label: "Instant", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  },
  {
    id: "qwen-coder-plus-latest",
    label: "Qwen3-Coder",
    provider: "Alibaba Cloud",
    providerColor: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    useCase: "Autonomous agent-based coding",
    icon: <Wrench className="w-5 h-5" />,
    speed: { emoji: "🚀", label: "Very Fast", color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
  },
];

// ── Tilt Card Component ───────────────────────────────────────────────────────

function TiltCard({
  model: m,
  isSelected,
  onClick,
}: {
  model: ModelDef;
  isSelected: boolean;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 25 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);
  const glowX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  // Hoisted unconditionally — hooks must never be called inside JSX or conditionals
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(99,179,237,0.12) 0%, transparent 65%)`,
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative text-left p-4 rounded-xl border cursor-pointer transition-colors duration-200 overflow-hidden ${
        isSelected
          ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_24px_-8px_rgba(16,185,129,0.5)]"
          : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/30 dark:hover:border-emerald-500/30"
      }`}>

      {/* Mouse-follow glow — always rendered, visibility controlled by CSS opacity */}
      {!isSelected && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
          style={{ background: glowBackground }}
        />
      )}

      {/* Selected ping dot */}
      {isSelected && (
        <span className="absolute top-3 right-3 w-2 h-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}

      <div className="flex items-start gap-3 relative" style={{ transform: "translateZ(12px)" }}>
        {/* Icon */}
        <div
          className={`p-2 rounded-lg shrink-0 ${
            isSelected
              ? "bg-emerald-500/20 text-emerald-500"
              : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-500/60"
          }`}>
          {m.icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + badge */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-sm font-semibold ${isSelected ? "text-emerald-500" : "text-zinc-900 dark:text-zinc-100"}`}>
              {m.label}
            </span>
            {m.badge && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {m.badge}
              </span>
            )}
          </div>

          {/* Provider + Speed tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${m.providerColor}`}>
              {m.provider}
            </span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${m.speed.color}`}>
              {m.speed.emoji} {m.speed.label}
            </span>
          </div>

          {/* Use-case */}
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{m.useCase}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AIPrefsTab() {
  const [model, setModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState(0.3);
  const [instructions, setInstructions] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/preferences`,
          { withCredentials: true },
        );
        setModel(data.model || "gpt-4o");
        setTemperature(data.temperature ?? 0.3);
        setInstructions(data.instructions || "");
      } catch (error) {
        console.error("Failed to load AI preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setIsSaved(false);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/preferences`,
        { model, temperature, instructions },
        { withCredentials: true },
      );
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save AI preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400 dark:text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Section Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Cpu size={20} className="text-emerald-500" />
          Model Preferences
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Choose the AI engine that best fits your current task.
        </p>
      </div>

      {/* Model Card Grid */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block">Active Model</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ perspective: "1000px" }}>
          {MODELS.map((m) => (
            <TiltCard
              key={m.id}
              model={m}
              isSelected={model === m.id}
              onClick={() => setModel(m.id)}
            />
          ))}
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Creativity (Temperature)
          </label>
          <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {temperature.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
          <span>Strict (Refactoring)</span>
          <span>Creative (Brainstorming)</span>
        </div>
      </div>

      {/* Global Instructions */}
      <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-zinc-400 dark:text-zinc-500" />
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Global System Instructions
          </label>
        </div>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g., Always write React components using TypeScript interfaces instead of types. Never use var."
          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 min-h-28 resize-y transition-shadow"
        />
      </div>

      {/* Save */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || isSaved}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-70 ${
            isSaved
              ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
              : "bg-emerald-500 hover:bg-emerald-400 text-white"
          }`}>
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
          ) : isSaved ? (
            <CheckCircle2 size={16} />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Saving..." : isSaved ? "Preferences Saved!" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
