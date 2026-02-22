import { useState, useEffect } from "react";
import { Cpu, MessageSquare, Save, CheckCircle2, Loader2 } from "lucide-react";

export default function AIPrefsTab() {
  const [model, setModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState(0.3);
  const [instructions, setInstructions] = useState("");

  // UX States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // 1. Fetch preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/preferences",
          {
            credentials: "include", // Ensures cookies/auth tokens are sent
          },
        );

        if (response.ok) {
          const data = await response.json();
          setModel(data.model);
          setTemperature(data.temperature);
          setInstructions(data.instructions);
        }
      } catch (error) {
        console.error("Failed to load AI preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // 2. Save preferences to the database
  const handleSave = async () => {
    setIsSaving(true);
    setIsSaved(false);

    try {
      const response = await fetch(
        "http://localhost:3000/api/users/preferences",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            model,
            temperature,
            instructions,
            theme: "dark", // Placeholder if you add appearance settings later
          }),
        },
      );

      if (response.ok) {
        setIsSaved(true);
        // Reset the green success button after 3 seconds
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save AI preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-white/5 pb-4 mb-6">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Cpu
            size={20}
            className="text-primary"
          />
          Model Preferences
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Tune the AI's behavior and underlying intelligence engine.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-300 block">
          Intelligent Model
        </label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full md:w-2/3 bg-[#161b22] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-slate-200 transition-shadow">
          <option value="gpt-4o">GPT-4o (Smartest & Most Capable)</option>
          <option value="gpt-4o-mini">
            GPT-4o-Mini (Faster & Cost Effective)
          </option>
        </select>
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex justify-between items-center md:w-2/3">
          <label className="text-sm font-medium text-slate-300">
            Creativity (Temperature)
          </label>
          <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
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
          className="w-full md:w-2/3 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[11px] text-slate-500 md:w-2/3">
          <span>Strict (Refactoring)</span>
          <span>Creative (Brainstorming)</span>
        </div>
      </div>

      <div className="space-y-3 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2">
          <MessageSquare
            size={16}
            className="text-slate-400"
          />
          <label className="text-sm font-medium text-slate-300">
            Global System Instructions
          </label>
        </div>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g., Always write React components using TypeScript interfaces instead of types. Never use var."
          className="w-full bg-[#161b22] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-slate-200 placeholder:text-slate-600 min-h-30 resize-y transition-shadow"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || isSaved}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-70 ${
            isSaved
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-primary hover:bg-primary/90 text-primary-content"
          }`}>
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
          ) : isSaved ? (
            <CheckCircle2 size={16} />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
