import { useState } from "react";
import {
  BookOpen,
  Database,
  ShieldCheck,
  GitPullRequest,
  Cpu,
  Terminal,
  Layers,
} from "lucide-react";

type DocSection = "overview" | "rag" | "security" | "github";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState<DocSection>("overview");

  return (
    <div className="flex-1 bg-[#0d1117] text-slate-200 p-8 overflow-y-auto h-full">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        {/* --- DOCS SIDEBAR --- */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <div className="flex items-center gap-2 px-2 mb-4">
              <BookOpen
                size={20}
                className="text-primary"
              />
              <h2 className="text-lg font-bold text-slate-100">
                Documentation
              </h2>
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === "overview"
                    ? "bg-primary/10 text-primary"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}>
                <Layers size={16} /> System Architecture
              </button>
              <button
                onClick={() => setActiveSection("rag")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === "rag"
                    ? "bg-primary/10 text-primary"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}>
                <Database size={16} /> The RAG Pipeline
              </button>
              <button
                onClick={() => setActiveSection("security")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === "security"
                    ? "bg-primary/10 text-primary"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}>
                <ShieldCheck size={16} /> Token Security Vault
              </button>
              <button
                onClick={() => setActiveSection("github")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === "github"
                    ? "bg-primary/10 text-primary"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}>
                <GitPullRequest size={16} /> Automated PR Engine
              </button>
            </nav>
          </div>
        </aside>

        {/* --- DOCS CONTENT --- */}
        <main className="flex-1 min-w-0 pb-20">
          {/* OVERVIEW SECTION */}
          {activeSection === "overview" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                System Architecture
              </h1>
              <p className="text-slate-400 leading-relaxed">
                DevElevator is a multi-tenant SaaS application designed to act
                as a Senior AI Engineer for your codebase. It bridges the gap
                between conversational AI and automated Git workflows.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="p-5 rounded-xl border border-white/10 bg-[#161b22]">
                  <Cpu
                    className="text-purple-400 mb-3"
                    size={24}
                  />
                  <h3 className="font-semibold text-slate-200 mb-2">
                    Intelligent Context
                  </h3>
                  <p className="text-sm text-slate-400">
                    Your entire repository is mapped into an ASCII file tree and
                    chunked into pgvector embeddings, allowing the LLM to
                    understand your macro architecture.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-white/10 bg-[#161b22]">
                  <Terminal
                    className="text-emerald-400 mb-3"
                    size={24}
                  />
                  <h3 className="font-semibold text-slate-200 mb-2">
                    Actionable Output
                  </h3>
                  <p className="text-sm text-slate-400">
                    Instead of just printing code snippets, the platform
                    performs hidden merges and pushes fully-formed Pull Requests
                    directly to your private branches.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* RAG PIPELINE SECTION */}
          {activeSection === "rag" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                The RAG Pipeline
              </h1>
              <p className="text-slate-400 leading-relaxed mb-6">
                Retrieval-Augmented Generation (RAG) is how we give the AI its
                memory. When you sync a project, we don't just dump files into a
                database; we process them for semantic understanding.
              </p>

              <div className="my-8">
                {/* Visual placeholder for the diagram tag */}
                <div className="w-full h-48 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center justify-center mb-2">
                  <p className="text-blue-400/50 text-sm font-mono">
                    [RAG Vector Diagram]
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-200 mt-8 mb-3">
                How Context Injection Works
              </h3>
              <ol className="space-y-4 text-sm text-slate-400 list-decimal list-inside">
                <li>
                  <strong className="text-slate-300">
                    Explicit Selection:
                  </strong>{" "}
                  If you select specific files in the UI, they are guaranteed to
                  be injected into the prompt.
                </li>
                <li>
                  <strong className="text-slate-300">Core Fallbacks:</strong> If
                  no files are selected, the system automatically pulls routing
                  files (e.g.,{" "}
                  <code className="text-yellow-300 bg-white/5 px-1 rounded">
                    package.json
                  </code>
                  ,{" "}
                  <code className="text-yellow-300 bg-white/5 px-1 rounded">
                    index.ts
                  </code>
                  ).
                </li>
                <li>
                  <strong className="text-slate-300">Similarity Search:</strong>{" "}
                  We convert your chat message into a vector using{" "}
                  <code className="text-purple-300">
                    text-embedding-3-small
                  </code>{" "}
                  and query Supabase for the top 5 most mathematically similar
                  code chunks in your repository.
                </li>
              </ol>
            </div>
          )}

          {/* SECURITY VAULT SECTION */}
          {activeSection === "security" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                Token Security Vault
              </h1>
              <p className="text-slate-400 leading-relaxed">
                Personal Access Tokens (PATs) grant access to your private
                repositories. Storing them in plain-text is a massive security
                vulnerability. We employ a Zero-Trust Architecture.
              </p>

              <div className="my-8">
                <div className="w-full h-48 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-2">
                  <p className="text-emerald-400/50 text-sm font-mono">
                    [Encryption Flow Diagram]
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3 mt-6">
                <h4 className="font-semibold text-slate-200">
                  The Encryption Lifecycle
                </h4>
                <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
                  <li>Tokens are intercepted by the Node.js backend.</li>
                  <li>
                    Encrypted in-memory using <strong>AES-256-CBC</strong>{" "}
                    standard encryption.
                  </li>
                  <li>
                    Stored in an isolated{" "}
                    <code className="text-blue-300">user_integrations</code>{" "}
                    table.
                  </li>
                  <li>
                    <strong>Row Level Security (RLS)</strong> prevents the React
                    frontend from ever reading this table.
                  </li>
                  <li>
                    Only the backend service role can decrypt the token
                    momentarily when a PR is requested.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* GITHUB ENGINE SECTION */}
          {activeSection === "github" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                Automated PR Engine
              </h1>
              <p className="text-slate-400 leading-relaxed">
                The final step of the pipeline. Transforming a markdown code
                snippet from an AI into a fully merged, deeply integrated Pull
                Request on GitHub.
              </p>

              <div className="space-y-6 mt-8">
                <div className="pl-4 border-l-2 border-purple-500">
                  <h4 className="font-semibold text-slate-200 mb-1">
                    1. The Invisible Merge
                  </h4>
                  <p className="text-sm text-slate-400">
                    If an AI returns a 20-line fix for a 500-line file, we
                    cannot just push 20 lines to GitHub (it would overwrite the
                    whole file). The engine silently fetches the original file
                    and seamlessly grafts the new logic into the existing
                    structure.
                  </p>
                </div>

                <div className="pl-4 border-l-2 border-blue-500">
                  <h4 className="font-semibold text-slate-200 mb-1">
                    2. Branch Creation
                  </h4>
                  <p className="text-sm text-slate-400">
                    A dedicated feature branch is dynamically spun up using your
                    decrypted identity token.
                  </p>
                </div>

                <div className="pl-4 border-l-2 border-emerald-500">
                  <h4 className="font-semibold text-slate-200 mb-1">
                    3. The Octokit Push
                  </h4>
                  <p className="text-sm text-slate-400">
                    Using the GitHub REST API, the fully merged file is
                    committed, and a Pull Request is opened with the exact title
                    and description you reviewed in the UI.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
