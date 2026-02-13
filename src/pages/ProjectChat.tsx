import {
  useState,
  useRef,
  useEffect,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  FileText,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import type { Project } from "../layouts/DashboardLayout";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

// Shape of a Chat Message
interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[]; // Array of file paths
}

// --- 1. EXTRACTED COMPONENT (Handles Copy Logic & Styling) ---
const PreBlock = ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Recursively extract all text content from React elements
    const extractText = (node: ReactNode): string => {
      if (typeof node === "string") return node;
      if (typeof node === "number") return String(node);
      if (!node) return "";

      // If it's an array, join all elements
      if (Array.isArray(node)) {
        return node.map(extractText).join("");
      }

      // If it's a React element with children prop
      if (isValidElement(node) && node.props) {
        return extractText((node.props as { children?: ReactNode }).children);
      }

      return "";
    };

    const codeText = extractText(children);
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-lg overflow-hidden bg-[#1e1e1e] border border-white/10 group">
      {/* Mac-style Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
        </div>
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded text-slate-400 hover:text-slate-200"
          title="Copy Code">
          {copied ? (
            <Check
              size={14}
              className="text-emerald-400"
            />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>
      {/* Actual Code Area */}
      <pre
        {...props}
        className="p-3 overflow-x-auto">
        {children}
      </pre>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ProjectChat() {
  const { project } = useOutletContext<{ project: Project | null }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project?.id) {
      axios
        .get(`http://localhost:3000/api/chat/${project.id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setMessages(res.data);
        })
        .catch((err) => console.error("Failed to load chat history", err));
    } else {
      setMessages([]);
    }
  }, [project?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || !project) return;

    const userMsg = input;
    setInput("");

    // 1. Optimistic User Message
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      // 2. Start Request (Use fetch instead of axios)
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, message: userMsg }),
        // Important: Include credentials if you need cookies
        credentials: "include",
      });

      if (!response.ok) throw new Error("Stream failed");
      if (!response.body) throw new Error("No body");

      // 3. Get Sources from Header
      const sourcesHeader = response.headers.get("x-sources");
      const sources = sourcesHeader ? JSON.parse(sourcesHeader) : [];

      // 4. Create Placeholder Assistant Message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", sources: sources },
      ]);

      // 5. Read the Stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });

        // Update state by appending new chunk to the last message
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          // Only append if it's the assistant's message we just added
          if (lastMsg.role === "assistant") {
            lastMsg.content += chunkValue;
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat failed", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong with the stream.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- EMPTY STATE (If no project selected or no messages) ---
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
      {/* --- CHAT HISTORY --- */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
        {/* Welcome Message */}
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
            <p className="text-slate-500 max-w-md mb-8">
              I've indexed your codebase. Ask me to find bugs, explain
              architecture, or write documentation.
            </p>
          </div>
        )}

        {/* Message List */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}>
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-primary/20 text-primary"
                  : "bg-slate-700/50 text-slate-300"
              }`}>
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] space-y-2`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-normal shadow-sm overflow-hidden prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 ${
                  msg.role === "user"
                    ? "bg-primary/10 text-primary-content border border-primary/20 rounded-tr-none"
                    : "bg-base-200/50 text-slate-200 border border-white/5 rounded-tl-none"
                }`}>
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    // 1. Links
                    a: ({ ...props }) => (
                      <a
                        {...props}
                        className="text-primary hover:underline font-medium "
                        target="_blank"
                        rel="noreferrer"
                      />
                    ),

                    // 2. Pre Block (The extracted component)
                    pre: PreBlock,

                    // 3. Code Handling (Inline vs Block detection)
                    code: ({
                      className,
                      children,
                      ...props
                    }: ComponentPropsWithoutRef<"code">) => {
                      const hasLang = /language-(\w+)/.exec(className || "");
                      const hasNewLine = String(children)
                        .replace(/\n$/, "")
                        .includes("\n");
                      const isInline = !hasLang && !hasNewLine;

                      if (isInline) {
                        return (
                          <code
                            {...props}
                            className="bg-gray-200! text-slate-800! rounded px-1 py-0.5 font-mono text-[12px] font-bold!">
                            {children}
                          </code>
                        );
                      }

                      // Block Code
                      return (
                        <code
                          className={`${className} text-sm font-mono`}
                          {...props}>
                          {children}
                        </code>
                      );
                    },

                    // 4. Typography Elements
                    p: ({ ...props }) => (
                      <p
                        {...props}
                        className="mb-2 last:mb-0 space-y-4"
                      />
                    ),
                    ul: ({ ...props }) => (
                      <ul
                        {...props}
                        className="list-disc pl-4 mb-2 space-y-2"
                      />
                    ),
                    ol: ({ ...props }) => (
                      <ol
                        {...props}
                        className="list-decimal pl-4 mb-2 space-y-2"
                      />
                    ),
                    li: ({ ...props }) => (
                      <li
                        {...props}
                        className="pl-1 marker:text-slate-500 space-y-2"
                      />
                    ),
                  }}>
                  {msg.content}
                </ReactMarkdown>
              </div>

              {/* Citations (Only for AI) */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.sources.slice(0, 3).map((source, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-base-200 border border-white/5 text-[10px] text-slate-400 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer">
                      <FileText size={10} />
                      <span className="truncate max-w-[150px]">{source}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center shrink-0">
              <Loader2
                className="animate-spin text-slate-400"
                size={16}
              />
            </div>
            <div className="flex items-center gap-1 h-10 px-4 bg-base-200/30 rounded-2xl rounded-tl-none">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-2 md:p-2 border-t border-white/5 bg-base-100 z-10">
        <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={
              project.status === "READY"
                ? "Ask a question about the codebase..."
                : "Waiting for indexing to complete..."
            }
            disabled={loading || project.status !== "READY"}
            className="w-full h-14 pl-5 pr-14 bg-base-200/50 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim() || project.status !== "READY"}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-primary/10 hover:bg-primary text-primary hover:text-primary-content rounded-lg flex items-center justify-center transition-all disabled:opacity-0 disabled:scale-90">
            <Send size={18} />
          </button>
        </div>
        <div className="text-center mt-3 flex justify-center gap-4">
          <span className="text-[10px] text-slate-600">
            {project.status === "INDEXING" ? (
              <span className="flex items-center gap-1.5 text-amber-500">
                <Loader2
                  size={10}
                  className="animate-spin"
                />{" "}
                Indexing {project.name}...
              </span>
            ) : (
              "DevElevator can make mistakes. Check code citations."
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
