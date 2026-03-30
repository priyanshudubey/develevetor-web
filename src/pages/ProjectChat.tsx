import { useState, useRef, useEffect } from "react";
import { Sparkles, Bot, Loader2, AlertTriangle } from "lucide-react"; // 👈 Added AlertTriangle
import { useOutletContext } from "react-router-dom";
import api from "../services/api";
import type { Project } from "../layouts/DashboardLayout";

// Import our new components
import CodeViewer from "../components/CodeViewer";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  isError?: boolean;
  attachments?: string[];
}

export default function ProjectChat() {
  const { project } = useOutletContext<{ project: Project | null }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [usageStats, setUsageStats] = useState({
    current: 0,
    limit: 15,
    resetAt: "",
  });

  const [historyLoading, setHistoryLoading] = useState(false);

  // 👇 1. New State to lock the chat UI
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Viewer State
  const [viewFile, setViewFile] = useState<{
    name: string;
    content: string;
  } | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // 👇 2. Fetch Usage on Mount
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const { data } = await api.get("/api/auth/usage");

        setUsageStats({
          current: data.usage.chats,
          limit: data.limits.chats,
          resetAt: data.resetAt,
        });

        // Preemptively lock if they are already at the limit
        if (data.usage.chats >= data.limits.chats) {
          lockUI(data.resetAt, data.limits.chats);
        }
      } catch (err) {
        console.error("Failed to fetch usage data", err);
      }
    };

    fetchUsage();
  }, []);

  // Helper to format the time and lock the UI
  const lockUI = (resetIso: string, limit: number) => {
    const resetDate = new Date(resetIso);
    const diffMs = resetDate.getTime() - new Date().getTime();
    
    if (diffMs <= 0) return; // Should not happen but good safeguard
    
    const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    // For smaller wait times (like 60s spam limiter), we might have 0h 0m left. Let's make it clearer.
    if (hoursLeft === 0 && minutesLeft === 0) {
      const secondsLeft = Math.floor(diffMs / 1000);
      setRateLimitMessage(`Please wait a moment before sending another request (${secondsLeft}s).`);
    } else {
      setRateLimitMessage(
        `Daily chat limit reached (${limit}/day). Limit resets in ${hoursLeft}h ${minutesLeft}m.`
      );
    }
    
    // Auto-unlock UI when the penalty period is over
    setTimeout(() => {
       setRateLimitMessage(null);
    }, diffMs);
  };

  // 1. Load History
  useEffect(() => {
    if (!project?.id) {
      setMessages([]);
      return;
    }

    setHistoryLoading(true);
    api
      .get(`/api/chat/${project.id}`)
      .then((res) => setMessages(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("History failed", err))
      .finally(() => setHistoryLoading(false));
  }, [project?.id]);
  // 2. Auto Scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 3. Open File Logic
  const openFile = async (fileName: string) => {
    if (!project) return;
    const cleanName = fileName.replace(/\\/g, "/");
    try {
      const { data } = await api.get(
        `/api/projects/${project.id}/file?path=${cleanName}`
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
    if (!project || rateLimitMessage || usageStats.current >= usageStats.limit)
      return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, attachments: selectedFiles },
    ]);
    setLoading(true);

    try {
      let messageToSend = text;

      if (selectedFiles.length > 0) {
        const filePromises = selectedFiles.map(async (filePath) => {
          try {
            const { data } = await api.get(
              `/api/projects/${project.id}/file?path=${encodeURIComponent(filePath)}`
            );
            return `\n\n--- Start of File: ${filePath} ---\n${data.content}\n--- End of File ---`;
          } catch (error) {
            console.error(
              `Failed to fetch context for ${filePath}, skipping.`,
              error,
            );
            return "";
          }
        });

        const fileContents = await Promise.all(filePromises);
        messageToSend += fileContents.join("");
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          message: messageToSend,
          selectedFiles: selectedFiles,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 429 || response.status === 403) {
          const errorData = await response.json();
          let limitMsg = errorData.error || errorData.message || "Rate limit exceeded.";

          if (errorData.resetAt) {
            lockUI(errorData.resetAt, usageStats.limit);
            
            // Only overwrite limitMsg if it is standard quota; otherwise keep the original errorData.error 
            // the backend emits for the exact reason. (eg. "Too Many Requests").
          } else {
            setRateLimitMessage(limitMsg);
          }

          // Dispatch native browser event to trigger UpgradeModal for SSE route natively
          window.dispatchEvent(
            new CustomEvent("rate-limit-hit", { detail: { message: limitMsg } })
          );

          throw new Error(limitMsg);
        }
        throw new Error("Stream failed");
      }
      if (!response.body) throw new Error("No body");
      
      const sourcesHeader = response.headers.get("x-sources");
      const modelCostHeader = response.headers.get("x-model-cost");
      const sources = sourcesHeader ? JSON.parse(sourcesHeader) : [];
      const modelCost = modelCostHeader ? parseInt(modelCostHeader, 10) : 1;

      setUsageStats((prev) => {
        const newCount = prev.current + modelCost;
        // If this pushed them over, lock it down!
        if (newCount >= prev.limit) {
          lockUI(prev.resetAt, prev.limit);
        }
        return { ...prev, current: newCount };
      });

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

      let errorMessage = "Sorry, something went wrong.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-base-content/50">
        <Bot
          size={48}
          className="mb-4 opacity-50 text-base-content/40"
        />
        <p className="text-base-content/60">Select a project from the sidebar to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative bg-base-100">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
        {historyLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-base-content/50 animate-in fade-in duration-500">
            <Loader2 size={32} className="animate-spin mb-4 text-primary opacity-80" />
            <p className="text-sm font-medium">Loading previous chats...</p>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center mt-20 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
                <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mb-6 shadow-sm border border-base-300">
                  <Sparkles
                    className="text-primary"
                    size={32}
                  />
                </div>
                <h2 className="text-2xl font-bold text-base-content mb-2">
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
                isError={msg.isError}
                attachments={msg.attachments}
              />
            ))}
          </>
        )}

        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center border border-base-300">
              <Loader2
                className="animate-spin text-base-content/60"
                size={16}
              />
            </div>
            <div className="flex items-center gap-1 h-10 px-4 bg-base-200/50 rounded-2xl rounded-tl-none border border-base-300">
              <span className="w-1.5 h-1.5 bg-base-content/50 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-base-content/50 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-base-content/50 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* 👇 3. Persistent Rate Limit Banner */}
      {rateLimitMessage && (
        <div className="mx-3 md:mx-4 mb-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-in slide-in-from-bottom-2">
          <AlertTriangle
            size={18}
            className="shrink-0"
          />
          <p>{rateLimitMessage}</p>
        </div>
      )}

      {/* Input Component */}
      <ChatInput
        projectId={project.id}
        projectStatus={project.status}
        // 👇 4. Disable the input completely if rate limited
        disabled={loading || !!rateLimitMessage}
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
