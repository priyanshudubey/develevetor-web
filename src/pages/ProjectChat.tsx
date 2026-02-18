import { useState, useRef, useEffect } from "react";
import { Sparkles, Bot, Loader2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import type { Project } from "../layouts/DashboardLayout";

// Import our new components
import CodeViewer from "../components/CodeViewer";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export default function ProjectChat() {
  const { project } = useOutletContext<{ project: Project | null }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Viewer State
  const [viewFile, setViewFile] = useState<{
    name: string;
    content: string;
  } | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // 1. Load History
  useEffect(() => {
    if (!project?.id) {
      setMessages([]);
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/chat/${project.id}`, {
        withCredentials: true,
      })
      .then((res) => setMessages(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("History failed", err));
  }, [project?.id]);

  // 2. Auto Scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 3. Open File Logic
  const openFile = async (fileName: string) => {
    if (!project) return;
    // Normalize path just in case
    const cleanName = fileName.replace(/\\/g, "/");
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects/${project.id}/file?path=${cleanName}`,
        { withCredentials: true },
      );
      setViewFile({ name: cleanName, content: data.content });
      setIsViewerOpen(true);
    } catch (error) {
      console.error("Failed to load file", error);
      alert("Could not load file content.");
    }
  };

  // 4. Send Message Logic
  const handleSend = async (text: string, selectedFiles: string[]) => {
    if (!project) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          message: text,
          selectedFiles: selectedFiles,
        }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Stream failed");
      if (!response.body) throw new Error("No body");

      const sourcesHeader = response.headers.get("x-sources");
      const sources = sourcesHeader ? JSON.parse(sourcesHeader) : [];

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", sources },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;

          const lastMsg = { ...newMessages[lastIndex] };

          if (lastMsg.role === "assistant") {
            lastMsg.content += chunkValue;
            newMessages[lastIndex] = lastMsg;
          }

          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat failed", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <Bot
          size={48}
          className="mb-4 opacity-50"
        />
        <p>Select a project from the sidebar to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative bg-base-100">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-20 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
            <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mb-6 shadow-inner border border-white/5">
              <Sparkles
                className="text-primary"
                size={32}
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-200 mb-2">
              Ask about <span className="text-primary">{project.name}</span>
            </h2>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            role={msg.role}
            content={msg.content}
            sources={msg.sources}
            projectId={project.id}
            onSourceClick={openFile}
          />
        ))}

        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
              <Loader2
                className="animate-spin text-slate-400"
                size={16}
              />
            </div>
            <div className="flex items-center gap-1 h-10 px-4 bg-base-200/30 rounded-2xl rounded-tl-none">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Component */}
      <ChatInput
        projectId={project.id}
        projectStatus={project.status}
        disabled={loading}
        onSend={handleSend}
      />

      {/* Code Viewer Modal */}
      <CodeViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        fileName={viewFile?.name || ""}
        content={viewFile?.content || ""}
      />
    </div>
  );
}
