/**
 * InsightTag — Reusable tag pill with explanatory hover tooltip
 *
 * 3-tier severity:  HIGH (red)  ·  MEDIUM (amber)  ·  LOW (sky blue)
 */

// ─── Tooltip Definitions ──────────────────────────────────────────────────────

const DEFINITIONS: Record<string, string> = {
  // Code Smells
  "magic-number":
    "A hardcoded numeric value without a named constant. Replace with a descriptive variable for better readability.",
  "long-method":
    "A function exceeding our 60-line limit. Consider breaking it into smaller, testable sub-functions.",
  "console-log-leak":
    "A debug log left in the code. These can leak sensitive data or clutter production logs.",
  "deep-nesting":
    "Code logic nested too many levels deep (e.g., multiple if/else). High risk for bugs and hard to follow.",
  "todo-fixme":
    "An unresolved TODO or FIXME comment. These indicate incomplete work that may cause issues.",
  "empty-catch":
    "An empty catch block that silently swallows errors, making debugging extremely difficult.",
  "god-function":
    "An overly complex function doing too many things. Split into focused, single-responsibility functions.",

  // Security Risks
  "hardcoded-secret":
    "A secret key, password, or token hardcoded in source code. Use environment variables or a secrets manager.",
  "dangerous-eval":
    "Use of eval() or Function() to execute dynamic code. This opens the door to code injection attacks.",
  "sql-injection":
    "Raw SQL query with string concatenation. Use parameterized queries or an ORM to prevent injection.",
  "path-traversal":
    "Unsanitized file path from user input. Attackers can read/write arbitrary files on the server.",
  "xss-risk":
    "Unescaped user input rendered in HTML. Use proper escaping or a framework that auto-sanitizes.",
  "insecure-random":
    "Use of Math.random() for security-sensitive operations. Use crypto.randomBytes() or equivalent.",
  "weak-crypto":
    "Use of a deprecated hashing algorithm (MD5/SHA1). Use SHA-256 or bcrypt for password hashing.",
  "cors-wildcard":
    "CORS configured with '*' origin. This allows any website to make requests to your API.",
  "no-auth-check":
    "An endpoint handler that doesn't verify authentication. Add auth middleware to protect this route.",
  "debug-endpoint":
    "A debug or test endpoint left in production code. Remove or gate behind a feature flag.",
  "prototype-pollution":
    "Object manipulation that could allow prototype chain pollution, leading to unexpected behavior.",
  "command-injection":
    "Unsanitized input passed to shell commands. Use parameterized execution or input validation.",
};

// ─── 3-Tier Severity ──────────────────────────────────────────────────────────

type Severity = "high" | "medium" | "low";

const SEVERITY_MAP: Record<string, Severity> = {
  // HIGH — red  (security-critical + data leak risks)
  "hardcoded-secret":    "high",
  "dangerous-eval":      "high",
  "sql-injection":       "high",
  "command-injection":   "high",
  "console-log-leak":    "high",
  "prototype-pollution": "high",
  "path-traversal":      "high",

  // MEDIUM — amber  (common code quality + moderate security)
  "magic-number":        "medium",
  "deep-nesting":        "medium",
  "xss-risk":            "medium",
  "cors-wildcard":       "medium",
  "no-auth-check":       "medium",
  "insecure-random":     "medium",
  "weak-crypto":         "medium",
  "debug-endpoint":      "medium",

  // LOW — sky blue  (stylistic / maintainability)
  "long-method":         "low",
  "god-function":        "low",
  "todo-fixme":          "low",
  "empty-catch":         "low",
};

const SEVERITY_STYLES: Record<Severity, { pill: string; icon: string; titleColor: string }> = {
  high: {
    pill:       "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25",
    icon:       "🔴",
    titleColor: "text-red-400",
  },
  medium: {
    pill:       "bg-amber-500/12 text-amber-400 border border-amber-500/25 hover:bg-amber-500/20",
    icon:       "🟡",
    titleColor: "text-amber-400",
  },
  low: {
    pill:       "bg-sky-500/12 text-sky-400 border border-sky-500/25 hover:bg-sky-500/20",
    icon:       "🔵",
    titleColor: "text-sky-400",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface InsightTagProps {
  label: string;
  /** Override default size. Defaults to "sm" */
  size?: "xs" | "sm";
}

export default function InsightTag({ label, size = "sm" }: InsightTagProps) {
  const severity = SEVERITY_MAP[label] ?? "medium";
  const style = SEVERITY_STYLES[severity];
  const definition = DEFINITIONS[label];
  const displayName = label.replace(/-/g, " ");

  const sizeClasses =
    size === "xs"
      ? "text-[9px] px-1.5 py-0.5"
      : "text-[10px] px-2 py-0.5";

  return (
    <span className="relative inline-flex group/tag">
      {/* The pill */}
      <button
        type="button"
        tabIndex={0}
        className={`inline-flex items-center gap-1 rounded font-bold uppercase tracking-wider cursor-help transition-colors ${sizeClasses} ${style.pill}`}
      >
        {style.icon} {displayName}
      </button>

      {/* Tooltip — shown on hover/focus */}
      {definition && (
        <span
          role="tooltip"
          className="
            pointer-events-none absolute z-[100] top-full left-1/2 -translate-x-1/2 mt-2
            w-64 px-3 py-2.5 rounded-lg
            bg-slate-900/95 backdrop-blur-sm
            border border-emerald-500/30 shadow-xl shadow-black/30
            text-[11px] text-slate-200 leading-relaxed font-normal normal-case tracking-normal
            opacity-0 scale-95 -translate-y-1
            group-hover/tag:opacity-100 group-hover/tag:scale-100 group-hover/tag:translate-y-0
            group-focus-within/tag:opacity-100 group-focus-within/tag:scale-100 group-focus-within/tag:translate-y-0
            transition-all duration-200 ease-out
          "
        >
          {/* Arrow */}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900/95" />

          {/* Severity badge + title */}
          <span className={`block font-semibold text-[10px] uppercase tracking-wider mb-1 ${style.titleColor}`}>
            {style.icon} {displayName}
            <span className="ml-1.5 text-[8px] opacity-60">
              ({severity.toUpperCase()} RISK)
            </span>
          </span>

          {definition}
        </span>
      )}
    </span>
  );
}
