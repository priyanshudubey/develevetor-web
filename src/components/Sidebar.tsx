import { useEffect, useRef, useState } from "react";
import {
  Folder,
  Plus,
  LogOut,
  Trash2,
  RefreshCw,
  Layout,
  Search,
  Home,
  Settings,
  BookOpen,
  Activity,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Project } from "../layouts/DashboardLayout";

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

  const startXRef = useRef(0);
  const startWidthRef = useRef(sidebarWidth);

  const avatarUrl = user?.avatar_url || "https://github.com/ghost.png";
  const fullName = user?.name || user?.email || "User";

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
        className={`fixed md:relative inset-y-0 left-0 z-40 md:z-auto transform md:transform-none transition-transform duration-300 ease-in-out border-r border-white/5 bg-[#0d1117] flex flex-col shrink-0 overflow-hidden ${
          isSidebarOpen
            ? "translate-x-0 pointer-events-auto shadow-2xl"
            : "-translate-x-full pointer-events-none"
        } md:translate-x-0 md:pointer-events-auto`}>
        {/* Resize Handle */}
        <div
          className={`absolute right-0 top-0 h-full w-1.5 cursor-col-resize hidden md:block transition-colors z-50 ${
            isResizing ? "bg-primary/50" : "hover:bg-white/10"
          }`}
          onMouseDown={beginResize}
        />

        {/* 1. Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0 bg-[#0d1117]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-linear-to-br from-primary/30 to-primary/10 rounded-lg flex items-center justify-center border border-primary/20 shadow-inner">
              <Layout
                size={18}
                className="text-primary"
              />
            </div>
            <span className="font-bold text-lg tracking-tight text-transparent bg-clip-text bg-linear-to-r from-slate-100 to-slate-400">
              DevElevator
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 flex flex-col">
          {/* 2. Main Navigation (Adds structural density) */}
          <div className="px-4 py-4 space-y-1 border-b border-white/5">
            <button
              onClick={() => {
                navigate("/dashboard");
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors">
              <Home
                size={16}
                className="text-slate-500"
              />
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors">
              <Activity
                size={16}
                className="text-slate-500"
              />
              Usage & Billing
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/settings");
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors">
              <Settings
                size={16}
                className="text-slate-500"
              />
              Settings
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/docs");
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors">
              <BookOpen
                size={16}
                className="text-slate-500"
              />
              Documentation
            </button>
          </div>

          {/* 3. Projects Section */}
          <div className="p-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Workspaces
              </span>
              <button
                onClick={() => {
                  onAddProject();
                  onClose?.();
                }}
                className="p-1 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                title="New Workspace">
                <Plus size={14} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3 group">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
              />
              <input
                type="text"
                placeholder="Find project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161b22] border border-white/5 rounded-md pl-8 pr-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Projects List */}
            <div className="space-y-1 overflow-y-auto pr-1 flex-1">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-6 px-4 border border-dashed border-white/10 rounded-lg mt-2">
                  <Folder
                    size={24}
                    className="mx-auto mb-2 text-slate-600"
                  />
                  <p className="text-sm text-slate-400">No projects found</p>
                </div>
              ) : (
                filteredProjects.map((project) => {
                  const isActive = project.id === projectId;

                  return (
                    <div
                      key={project.id}
                      onClick={() => handleProjectClick(project.id)}
                      className={`group flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all border ${
                        isActive
                          ? "bg-primary/10 border-primary/20 text-primary shadow-sm"
                          : "hover:bg-white/5 border-transparent text-slate-400 hover:text-slate-200"
                      }`}>
                      <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
                        <Folder
                          size={15}
                          className={`shrink-0 ${isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-400"}`}
                        />
                        <span className="truncate text-[13px] font-medium">
                          {project.name.split("/")[1] || project.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
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

                        {/* Hover Actions (Replaces dot on hover) */}
                        <div className="absolute right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-[#161b22] p-0.5 rounded-md border border-white/5 shadow-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSyncProject(e, project.id);
                            }}
                            className="p-1 hover:bg-blue-500/20 rounded text-slate-400 hover:text-blue-400 transition-colors"
                            title="Sync Repo">
                            <RefreshCw size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProject(e, project.id);
                            }}
                            className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors"
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
        <div className="p-3 border-t border-white/5 bg-[#0d1117] shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
            <div className="relative">
              <img
                src={avatarUrl}
                alt="User"
                className="w-9 h-9 rounded-full border border-white/10"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0d1117]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {fullName}
              </p>
              <p className="text-[11px] text-slate-500 truncate font-medium">
                Free Tier
              </p>
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="Sign Out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
