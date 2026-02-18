import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User, FileText } from "lucide-react";
// Remove the old CodeBlock if you aren't using it anymore, or keep it as backup
// import CodeBlock from "./CodeBlock";
import CodeBlockWithPR from "../CodeBlockWithPR"; // Ensure path is correct

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  projectId: string; // 👈 ADDED: Required for the PR Modal
  onSourceClick: (file: string) => void;
}

export default function ChatMessage({
  role,
  content,
  sources,
  projectId, // 👈 Destructure this
  onSourceClick,
}: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          role === "user"
            ? "bg-primary/20 text-primary"
            : "bg-slate-700/50 text-slate-300"
        }`}>
        {role === "user" ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Content Bubble */}
      <div className={`max-w-[85%] space-y-2`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-normal shadow-sm overflow-hidden prose prose-invert max-w-none ${
            role === "user"
              ? "bg-primary/10 text-primary-content border border-primary/20 rounded-tr-none"
              : "bg-base-200/50 text-slate-200 border border-white/5 rounded-tl-none"
          }`}>
          <ReactMarkdown
            components={{
              a: ({ ...props }) => (
                <a
                  {...props}
                  className="text-primary hover:underline"
                  target="_blank"
                />
              ),
              ul: ({ children, ...props }) => (
                <ul
                  {...props}
                  className="list-disc list-outside ml-4 mb-3 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children, ...props }) => (
                <ol
                  {...props}
                  className="list-decimal list-outside ml-4 mb-3 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children, ...props }) => (
                <li
                  {...props}
                  className="pl-1">
                  {children}
                </li>
              ),

              // 👇 CHANGED: Strip the default <pre> tag.
              // We let the <code> component inside handle the full block rendering.
              pre: ({ children }) => <>{children}</>,

              // 👇 UPDATED: Handle Code Blocks with PR Button
              code: ({
                className,
                children,
                ...props
              }: ComponentPropsWithoutRef<"code">) => {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match; // If no language class, treat as inline

                if (!isInline && match) {
                  return (
                    <CodeBlockWithPR
                      language={match[1]}
                      value={String(children).replace(/\n$/, "")}
                      projectId={projectId} // 👈 Pass the ID here
                    />
                  );
                }

                // Fallback for Inline Code (e.g. `const x = 1`)
                return (
                  <code
                    {...props}
                    className="bg-white/10 text-slate-200 rounded px-1.5 py-0.5 font-mono text-[13px] border border-white/10">
                    {children}
                  </code>
                );
              },
            }}>
            {content}
          </ReactMarkdown>
        </div>

        {/* Citations */}
        {sources && sources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {sources.slice(0, 3).map((source, idx) => (
              <div
                key={idx}
                onClick={() => onSourceClick(source)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-base-200 border border-white/5 text-[10px] text-slate-400 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer">
                <FileText size={10} />
                <span className="truncate max-w-37.5">{source}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
