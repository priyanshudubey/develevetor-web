import { useEffect, useRef, useState } from "react";
import { Folder, Plus, LogOut, Trash2, RefreshCw, Layout } from "lucide-react";
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
  const startXRef = useRef(0);
  const startWidthRef = useRef(sidebarWidth);

  const avatarUrl = user?.avatar_url || "https://github.com/ghost.png";
  const fullName = user?.name || user?.email || "User";

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

    const handleMouseUp = () => {
      setIsResizing(false);
    };

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

  const handleAddProject = () => {
    onAddProject();
    onClose?.();
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        style={{ width: sidebarWidth }}
        className={`fixed md:relative inset-y-0 left-0 z-40 md:z-auto transform md:transform-none transition-transform duration-200 border-r border-white/5 bg-[#0d1117] flex flex-col shrink-0 overflow-hidden ${
          isSidebarOpen
            ? "translate-x-0 pointer-events-auto"
            : "-translate-x-full pointer-events-none"
        } md:translate-x-0 md:pointer-events-auto`}>
        <div
          className={`absolute right-0 top-0 h-full w-1.5 cursor-col-resize hidden md:block transition-colors ${
            isResizing ? "bg-primary/30" : "hover:bg-white/10"
          }`}
          onMouseDown={beginResize}
        />
        {/* 1. Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Layout
                size={18}
                className="text-primary"
              />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-100">
              DevElevator
            </span>
          </div>
        </div>

        {/* 2. Projects List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-4">
            Projects
          </div>

          {projects.map((project) => {
            const isActive = project.id === projectId;

            return (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all border ${
                  isActive
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "hover:bg-white/5 border-transparent text-slate-400 hover:text-slate-200"
                }`}>
                {/* Left Side: Icon + Name + Status Dot */}
                <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                  <Folder
                    size={16}
                    className={`shrink-0 ${isActive ? "text-primary" : "text-slate-500"}`}
                  />

                  <span className="truncate text-sm font-medium">
                    {project.name.split("/")[1] || project.name}
                  </span>

                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ml-1 ${
                      project.status === "READY"
                        ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                        : project.status === "INDEXING"
                          ? "bg-amber-500 animate-pulse"
                          : project.status === "ERROR"
                            ? "bg-red-500"
                            : "bg-slate-600"
                    }`}
                    title={project.status}
                  />
                </div>

                {/* Hover Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e) => onSyncProject(e, project.id)}
                    className="p-1.5 hover:bg-white/10 rounded-md text-slate-500 hover:text-blue-400"
                    title="Sync Repo">
                    <RefreshCw size={13} />
                  </button>
                  <button
                    onClick={(e) => onDeleteProject(e, project.id)}
                    className="p-1.5 hover:bg-red-500/20 rounded-md text-slate-500 hover:text-red-400"
                    title="Delete Project">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Project Button */}
          <button
            onClick={handleAddProject}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors mt-2 group">
            <div className="w-8 h-8 rounded-lg border border-dashed border-slate-700 group-hover:border-primary/50 flex items-center justify-center transition-colors">
              <Plus
                size={14}
                className="text-slate-500 group-hover:text-primary"
              />
            </div>
            <span>New Project</span>
          </button>
        </div>

        {/* 3. User Footer */}
        <div className="p-4 border-t border-white/5 bg-[#0d1117]">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
            <img
              src={avatarUrl}
              alt="User"
              className="w-9 h-9 rounded-full border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {fullName}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 truncate">Free Plan</p>
                <button className="text-xs px-1 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors whitespace-nowrap">
                  Upgrade
                </button>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
              title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
