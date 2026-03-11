import { useEffect, useRef, useState } from "react";
import {
  Folder,
  Plus,
  LogOut,
  Trash2,
  RefreshCw,
  Search,
  Home,
  Settings,
  BookOpen,
  Activity,
  Files,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Project } from "../layouts/DashboardLayout";
import FileExplorerOverlay from "./insights/FileExplorerOverlay";
import { InsightsProvider } from "../context/InsightsContext";

interface SidebarProps {
  projects: Project[];
  isSidebarOpen: boolean;
  sidebarWidth: number;
  minWidth: number;
  maxWidth: number;
  onAddProject: () => void;
  onDeleteProject: (e: React.MouseEvent, id: string) => void;
  onSyncProject: (e: React.MouseEvent, id: string) => void;
  onWidthChange: (width: number) => void;
  onClose?: () => void;
}

export default function Sidebar({
  projects,
  isSidebarOpen,
  sidebarWidth,
  minWidth,
  maxWidth,
  onAddProject,
  onDeleteProject,
  onSyncProject,
  onWidthChange,
  onClose,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [isResizing, setIsResizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  const startXRef = useRef(0);
  const startWidthRef = useRef(sidebarWidth);

  const avatarUrl = user?.avatar_url || "https://github.com/ghost.png";
  const fullName = user?.name || user?.email || "User";
  const isPro = user?.plan === "PRO";

  // Filter projects based on search
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (event: MouseEvent) => {
      const delta = event.clientX - startXRef.current;
      const nextWidth = Math.min(
        Math.max(startWidthRef.current + delta, minWidth),
        maxWidth,
      );
      onWidthChange(nextWidth);
    };

    const handleMouseUp = () => setIsResizing(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, maxWidth, minWidth, onWidthChange]);

  const beginResize = (event: React.MouseEvent) => {
    startXRef.current = event.clientX;
    startWidthRef.current = sidebarWidth;
    setIsResizing(true);
    event.preventDefault();
  };

  const handleProjectClick = (id: string) => {
    navigate(`/dashboard/project/${id}`);
    onClose?.();
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}
      <aside
        style={{ width: sidebarWidth }}
        className={`fixed md:relative inset-y-0 left-0 z-40 md:z-auto transform md:transform-none transition-all duration-300 ease-in-out border-r border-zinc-200 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950 flex flex-col shrink-0 overflow-hidden ${
          isSidebarOpen
            ? "translate-x-0 pointer-events-auto shadow-2xl"
            : "-translate-x-full pointer-events-none"
        } md:translate-x-0 md:pointer-events-auto`}>
        {/* Resize Handle */}
        <div
          className={`absolute right-0 top-0 h-full w-1.5 cursor-col-resize hidden md:block transition-colors z-50 ${
            isResizing ? "bg-primary/50" : "hover:bg-base-content/10"
          }`}
          onMouseDown={beginResize}
        />

        {/* 1. Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800/60 shrink-0 bg-zinc-50 dark:bg-zinc-950 transition-colors">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="DevElevator Logo" className="w-8 h-8 rounded-lg shadow-inner" />
            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
              DevElevator
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-800 flex flex-col">
          {/* 2. Main Navigation (Adds structural density) */}
          <div className="px-4 py-4 space-y-1 border-b border-zinc-200 dark:border-zinc-800/60">
            <button
              onClick={() => {
                navigate("/dashboard");
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors">
              <Home size={16} className="text-zinc-500" />
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/insights");
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors">
              <Activity size={16} className="text-zinc-500" />
              Insights Hub
            </button>
            <button
              onClick={() => {
                setIsExplorerOpen(true);
                onClose?.();
              }}
              disabled={!projectId}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Files size={16} className="text-zinc-500" />
              File Explorer
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/settings");
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors">
              <Settings size={16} className="text-zinc-500" />
              Settings
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/docs");
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors">
              <BookOpen size={16} className="text-zinc-500" />
              Documentation
            </button>
          </div>

          {/* 3. Projects Section */}
          <div className="p-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Workspaces
              </span>
              <button
                onClick={() => {
                  onAddProject();
                  onClose?.();
                }}
                className="p-1 text-zinc-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                title="New Workspace">
                <Plus size={14} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3 group">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors"
              />
              <input
                type="text"
                placeholder="Find project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm"
              />
            </div>

            {/* Projects List */}
            <div className="space-y-1 overflow-y-auto pr-1 flex-1">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-6 px-4 border border-dashed border-zinc-800 rounded-lg mt-2">
                  <Folder size={24} className="mx-auto mb-2 text-zinc-600" />
                  <p className="text-sm text-zinc-500">No projects found</p>
                </div>
              ) : (
                filteredProjects.map((project) => {
                  const isActive = project.id === projectId;

                  return (
                    <div
                      key={project.id}
                      onClick={() => handleProjectClick(project.id)}
                      className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all border ${
                        isActive
                          ? "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-primary shadow-sm border-r-4 border-r-primary"
                          : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}>
                      <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
                        <Folder
                          size={15}
                          className={`shrink-0 ${isActive ? "text-primary shadow-[0_0_15px_rgba(16,185,129,0.3)] rounded-sm" : "text-zinc-500 group-hover:text-zinc-400"}`}
                        />
                        <span className={`truncate text-[13px] font-medium ${isActive ? "text-zinc-900 dark:text-zinc-100" : ""}`}>
                          {project.name.split("/")[1] || project.name}
                        </span>
                      </div>

                      <div className="flex items-center shrink-0 relative">
                        {/* Status Dot (Hidden on hover so buttons show cleanly) */}
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 mx-2 transition-opacity group-hover:opacity-0 ${
                            project.status === "READY"
                              ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                              : project.status === "INDEXING"
                                ? "bg-amber-500 animate-pulse"
                                : "bg-red-500"
                          }`}
                          title={project.status}
                        />

                        {/* Hover Actions (replaces dot on hover) */}
                        <div className="absolute right-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-900 p-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSyncProject(e, project.id);
                            }}
                            className="p-1 hover:bg-info/20 rounded text-base-content/50 hover:text-info transition-colors"
                            title="Sync Repo">
                            <RefreshCw size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProject(e, project.id);
                            }}
                            className="p-1 hover:bg-error/20 rounded text-base-content/50 hover:text-error transition-colors"
                            title="Delete Project">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 4. User Footer */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950 shrink-0 transition-colors">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer border border-transparent hover:border-zinc-300 dark:hover:border-zinc-800">
            <div className="relative">
              <img
                src={avatarUrl}
                alt="User"
                className="w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-800"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-base-100 rounded-full border-2" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {fullName}
              </p>
              <p
                className={`text-[11px] truncate font-medium ${
                  isPro
                    ? "text-primary font-bold tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "text-zinc-500"
                }`}>
                {isPro ? "Pro" : "Free"}
              </p>
            </div>

            <button
              onClick={logout}
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="Sign Out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* File Explorer Overlay — needs its own InsightsProvider */}
      {projectId && (
        <InsightsProvider projectId={projectId}>
          <FileExplorerOverlay
            isOpen={isExplorerOpen}
            onClose={() => setIsExplorerOpen(false)}
          />
        </InsightsProvider>
      )}
    </>
  );
}
