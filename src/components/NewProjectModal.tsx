import { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  Search,
  Lock,
  Globe,
  Loader2,
  Github,
  AlertCircle,
} from "lucide-react"; // 👈 Added AlertCircle

interface Project {
  id: string;
  name: string;
  status: "PENDING" | "INDEXING" | "READY" | "ERROR";
  is_private: boolean;
  url: string;
  created_at: string;
}

interface Repo {
  id: number;
  name: string;
  description: string;
  url: string;
  private: boolean;
  stars: number;
  updated_at: string;
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (project: Project) => void;
}

export default function NewProjectModal({
  isOpen,
  onClose,
  onProjectAdded,
}: NewProjectModalProps) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [importingId, setImportingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null); // 👈 New error state

  // Fetch repos and clear errors when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null); // Reset error state on open
      fetchRepos();
    }
  }, [isOpen]);

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/projects/github-repos",
        {
          withCredentials: true,
        },
      );
      setRepos(data.repos);
    } catch (error) {
      console.error("Failed to fetch repos", error);
      setError("Failed to fetch your repositories from GitHub.");
    } finally {
      setLoading(false);
    }
  };

  const importRepo = async (repo: Repo) => {
    setImportingId(repo.id);
    setError(null); // Clear previous errors on new attempt

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/projects",
        {
          repoId: repo.id,
          name: repo.name,
          url: repo.url,
          isPrivate: repo.private,
        },
        { withCredentials: true },
      );

      onProjectAdded(data.project); // Update parent state
      onClose(); // Close modal
    } catch (err: unknown) {
      // 👇 The Rate Limit Error Handling
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const errorMessage = err.response.data.error;

        if (status === 429 || status === 403) {
          setError(`Limit Reached: ${errorMessage}`);
        } else {
          setError(errorMessage || "Failed to import repository.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setImportingId(null);
    }
  };

  // Filter repos based on search
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-base-100 rounded-xl border border-white/10 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-base-200/50">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Github size={18} />
            Import Git Repository
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* 🆕 Error Banner */}
        {error && (
          <div className="px-4 pt-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-start gap-2">
              <AlertCircle
                size={16}
                className="shrink-0 mt-0.5"
              />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search your repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-base-100 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Repo List */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2
                className="animate-spin mb-3"
                size={24}
              />
              <span className="text-xs">Fetching repositories...</span>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No repositories found.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-md ${repo.private ? "bg-amber-500/10 text-amber-500" : "bg-slate-700/50 text-slate-400"}`}>
                      {repo.private ? <Lock size={16} /> : <Globe size={16} />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-200 truncate group-hover:text-primary transition-colors">
                        {repo.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-75">
                        {repo.updated_at.split("T")[0]} • {repo.stars} stars
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => importRepo(repo)}
                    disabled={importingId === repo.id}
                    className="px-3 py-1.5 text-xs font-medium bg-white text-black rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {importingId === repo.id ? "Importing..." : "Import"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-base-200/30 border-t border-white/5 text-center">
          <p className="text-[10px] text-slate-600">
            Only showing repositories you have admin access to.
          </p>
        </div>
      </div>
    </div>
  );
}
