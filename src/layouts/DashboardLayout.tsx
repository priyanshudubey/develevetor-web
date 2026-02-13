import { useState, useEffect, useMemo } from "react";
import {
  Terminal,
  Plus,
  LogOut,
  Search,
  Github,
  Folder,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import NewProjectModal from "../components/NewProjectModal";

// 1. Define the shape of a Project (No more 'any')
export interface Project {
  id: string;
  name: string; // e.g., "facebook/react"
  status: "PENDING" | "INDEXING" | "READY" | "ERROR";
  is_private: boolean;
  url: string;
  created_at: string;
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const navigate = useNavigate();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 2. Derive the full project object from the active ID
  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) || null,
    [projects, activeProjectId],
  );

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const { data } = await axios.get<{ projects: Project[] }>(
        "http://localhost:3000/api/projects",
        { withCredentials: true },
      );

      setProjects(data.projects);

      // Auto-select the first project if none selected
      if (data.projects.length > 0 && !activeProjectId) {
        setActiveProjectId(data.projects[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectAdded = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setActiveProjectId(newProject.id);
  };

  // Helper to render status icon/color
  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "READY":
        return {
          color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          icon: <CheckCircle2 size={12} />,
          label: "READY",
        };
      case "INDEXING":
        return {
          color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
          icon: (
            <Loader2
              size={12}
              className="animate-spin"
            />
          ),
          label: "INDEXING",
        };
      case "ERROR":
        return {
          color: "text-red-500 bg-red-500/10 border-red-500/20",
          icon: <AlertCircle size={12} />,
          label: "ERROR",
        };
      default:
        return {
          color: "text-slate-500 bg-slate-500/10 border-slate-500/20",
          icon: <Clock size={12} />,
          label: "PENDING",
        };
    }
  };

  const promptDelete = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setProjectToDelete(projectId); // Opens the modal
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);

    try {
      await axios.delete(
        `http://localhost:3000/api/projects/${projectToDelete}`,
        {
          withCredentials: true,
        },
      );

      // Update UI
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete));

      // Redirect if we were on that project page
      if (location.pathname.includes(projectToDelete)) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to delete project", error);
      alert("Failed to delete project");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null); // Close modal
    }
  };

  const handleSyncProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();

    // Optimistic Update: Set status to INDEXING immediately in UI
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: "INDEXING" } : p)),
    );

    try {
      await axios.post(
        `http://localhost:3000/api/projects/${projectId}/sync`,
        {},
        {
          withCredentials: true,
        },
      );
      // The backend will handle the rest.
      // Since we updated the UI optimistically, we don't need to do much else.
    } catch (error) {
      console.error("Failed to sync project", error);
      alert("Failed to sync project");
      // Revert status on error
      setProjects((prev) =>
        prev.map(
          (p) => (p.id === projectId ? { ...p, status: "READY" } : p), // Assume it was ready before
        ),
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      // Only poll if we have projects that are INDEXING
      const hasIndexing = projects.some(
        (p) => p.status === "INDEXING" || p.status === "PENDING",
      );

      if (hasIndexing) {
        try {
          const { data } = await axios.get(
            "http://localhost:3000/api/projects",
            { withCredentials: true },
          );
          setProjects(data.projects);
        } catch (error) {
          console.error("Polling failed", error);
        }
      }
    }, 5000); // Check every 5s

    return () => clearInterval(interval);
  }, [projects]);

  const statusMeta = activeProject
    ? getStatusBadge(activeProject.status)
    : null;

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans flex overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside className="w-60 shrink-0 border-r border-white/5 bg-base-200/50 flex flex-col h-screen">
        {/* Brand Header */}
        <div className="h-14 flex items-center px-4 border-b border-white/5">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <div className="bg-primary/10 text-primary p-1 rounded-md border border-primary/20">
              <Terminal size={16} />
            </div>
            <span className="tracking-tight">DevElevator</span>
          </div>
        </div>

        {/* Project Selector / Search */}
        <div className="p-3">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 bg-base-100 border border-white/5 rounded-md hover:border-white/10 hover:text-white transition-colors group">
            <Search
              size={14}
              className="group-hover:text-white"
            />
            <span>Find Repository...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] text-slate-400 opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="text-xs font-semibold text-slate-500 px-3 mb-2 uppercase tracking-wider">
            Your Projects
          </div>

          {loadingProjects ? (
            <div className="px-3 py-4 text-center">
              <Loader2
                className="animate-spin text-slate-600 mx-auto"
                size={20}
              />
            </div>
          ) : (
            <>
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => setActiveProjectId(proj.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200 group ${
                    activeProjectId === proj.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                  }`}>
                  <Folder
                    size={16}
                    className={
                      activeProjectId === proj.id
                        ? "text-primary"
                        : "text-slate-500 group-hover:text-slate-400"
                    }
                  />
                  <span className="truncate">
                    {proj.name.split("/")[1] || proj.name}
                  </span>

                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Status Dot */}
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        proj.status === "READY"
                          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                          : proj.status === "INDEXING"
                            ? "bg-amber-500 animate-pulse"
                            : "bg-slate-600"
                      }`}
                    />
                  </div>

                  <button
                    onClick={(e) => handleSyncProject(e, proj.id)}
                    disabled={proj.status === "INDEXING"}
                    className={`p-1.5 rounded-lg transition-all ${
                      proj.status === "INDEXING"
                        ? "text-amber-500 cursor-not-allowed"
                        : "hover:bg-primary/20 hover:text-primary text-slate-400"
                    }`}
                    title="Sync Repository">
                    <RefreshCw
                      size={14}
                      className={
                        proj.status === "INDEXING" ? "animate-spin" : ""
                      }
                    />
                  </button>

                  {/* 👇 DELETE BUTTON (Visible on Group Hover) */}
                  <div
                    onClick={(e) => promptDelete(e, proj.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                    title="Delete Project">
                    <Trash2 size={14} />
                  </div>
                </button>
              ))}

              {/* Add Project Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-primary hover:bg-primary/5 rounded-md border border-dashed border-white/10 hover:border-primary/20 transition-all mt-4">
                <Plus size={16} />
                <span>Add New Project</span>
              </button>
            </>
          )}
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors group">
            <img
              src={user?.avatar_url}
              alt={user?.name}
              className="w-8 h-8 rounded-full ring-1 ring-white/10"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-200 truncate">
                {user?.name}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {user?.email}
              </div>
            </div>
            <button
              onClick={logout}
              className="text-slate-500 hover:text-red-400 transition-colors"
              title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen min-w-0 bg-base-100 relative">
        {/* Top Navigation (Breadcrumbs / Context) */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-base-100/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            {activeProject ? (
              <>
                <span className="hover:text-white cursor-pointer transition-colors">
                  {activeProject.name.split("/")[0]}
                </span>
                <span className="text-slate-600">/</span>
                <span className="font-medium text-slate-200 flex items-center gap-2">
                  <Github size={14} />
                  {activeProject.name.split("/")[1]}
                </span>

                {/* Dynamic Status Badge */}
                {statusMeta && (
                  <span
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ml-2 ${statusMeta.color}`}>
                    {statusMeta.icon}
                    {statusMeta.label}
                  </span>
                )}
              </>
            ) : (
              <span className="text-slate-500">Select a project to start</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
              Feedback
            </button>
            <div className="h-4 w-px bg-white/10"></div>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-red-400 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden relative">
          {/* We pass the activeProject to the child route (ProjectChat) via context */}
          <Outlet context={{ project: activeProject }} />
        </div>

        <NewProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onProjectAdded={handleProjectAdded}
        />
      </main>
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* Modal Card */}
          <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                <AlertTriangle size={24} />
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-slate-100 mb-2">
                Delete Project?
              </h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                This action cannot be undone. This will permanently delete the
                project and all associated chat history from your database.
              </p>

              {/* Actions */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setProjectToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all text-sm font-medium">
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                  {isDeleting ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  {isDeleting ? "Deleting..." : "Delete Project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
