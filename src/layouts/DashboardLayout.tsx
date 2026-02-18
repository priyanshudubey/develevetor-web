import { useState, useEffect, useMemo } from "react";
import {
  LogOut,
  Github,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Menu,
  X,
} from "lucide-react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import NewProjectModal from "../components/NewProjectModal";
import Sidebar from "../components/Sidebar";

// 1. Define the shape of a Project
export interface Project {
  id: string;
  name: string;
  status: "PENDING" | "INDEXING" | "READY" | "ERROR";
  is_private: boolean;
  url: string;
  created_at: string;
}

export default function DashboardLayout() {
  const { logout } = useAuth(); // Removed 'user' (it's in Sidebar)
  const navigate = useNavigate();
  const { projectId } = useParams(); // 👈 Get ID from URL

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Unified Modal State
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(288);

  const minSidebarWidth = 220;
  const maxSidebarWidth = 420;

  // 2. Derive active project from URL (Single Source of Truth)
  const activeProject = useMemo(
    () => projects.find((p) => p.id === projectId) || null,
    [projects, projectId],
  );

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get<{ projects: Project[] }>(
        `${import.meta.env.VITE_API_URL}/api/projects`,
        { withCredentials: true },
      );

      setProjects(data.projects);

      // Optional: Auto-select first project if we are at root /dashboard
      // if (data.projects.length > 0 && !projectId) {
      //   navigate(`/dashboard/project/${data.projects[0].id}`);
      // }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 3. Navigate to new project after creation
  const handleProjectAdded = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
    navigate(`/dashboard/project/${newProject.id}`);
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

  const promptDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setProjectToDelete(id);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/projects/${projectToDelete}`,
        { withCredentials: true },
      );

      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete));

      // Redirect if deleting the active project
      if (projectId === projectToDelete) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to delete project", error);
      alert("Failed to delete project");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  const handleSyncProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Optimistic Update
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "INDEXING" } : p)),
    );

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects/${id}/sync`,
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error("Failed to sync project", error);
      // Revert on error
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "READY" } : p)),
      );
    }
  };

  // Polling for status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const hasIndexing = projects.some(
        (p) => p.status === "INDEXING" || p.status === "PENDING",
      );

      if (hasIndexing) {
        try {
          const { data } = await axios.get<{ projects: Project[] }>(
            `${import.meta.env.VITE_API_URL}/api/projects`,
            { withCredentials: true },
          );
          // Only update if data changed to avoid re-renders (simple check)
          if (JSON.stringify(data.projects) !== JSON.stringify(projects)) {
            setProjects(data.projects);
          }
        } catch (error) {
          console.error("Polling failed", error);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [projects]);

  const statusMeta = activeProject
    ? getStatusBadge(activeProject.status)
    : null;

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans flex overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        projects={projects}
        isSidebarOpen={isSidebarOpen}
        sidebarWidth={sidebarWidth}
        minWidth={minSidebarWidth}
        maxWidth={maxSidebarWidth}
        onAddProject={() => setIsModalOpen(true)} // 👈 Unified Modal logic
        onDeleteProject={promptDelete}
        onSyncProject={handleSyncProject}
        onWidthChange={setSidebarWidth}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen min-w-0 bg-base-100 relative">
        {/* Top Header */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-base-100/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <button
              className="md:hidden text-slate-400 hover:text-slate-200 transition-colors"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}>
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
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
            <button
              onClick={logout}
              className="text-slate-400 hover:text-red-400 transition-colors"
              title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Dynamic Content (Chat) */}
        <div className="flex-1 overflow-hidden relative">
          <Outlet context={{ project: activeProject }} />
        </div>

        {/* New Project Modal */}
        <NewProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onProjectAdded={handleProjectAdded}
        />
      </main>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                <AlertTriangle size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-100 mb-2">
                Delete Project?
              </h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                This action cannot be undone. This will permanently delete the
                project and all associated chat history.
              </p>

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
