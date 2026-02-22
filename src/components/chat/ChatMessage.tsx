import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User, FileText, Paperclip } from "lucide-react"; // 👈 Added Paperclip for attachments
import CodeBlockWithPR from "../CodeBlockWithPR";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  projectId: string;
  onSourceClick: (file: string) => void;
  isError?: boolean;
  attachments?: string[];
}

export default function ChatMessage({
  role,
  content,
  sources,
  projectId,
  onSourceClick,
  isError,
  attachments,
}: ChatMessageProps) {
  // 1. Extract attached file names (User messages only)
  const attachedFiles: string[] = attachments ? [...attachments] : [];
  if (role === "user" && attachedFiles.length === 0) {
    const fileRegex = /--- Start of File: (.*?) ---/g;
    let match;
    while ((match = fileRegex.exec(content)) !== null) {
      attachedFiles.push(match[1].trim());
    }
  }

  // 2. Mask the content: Remove everything between "Start of File" and "End of File"
  const displayContent =
    role === "user"
      ? content
          .replace(/\n\n--- Start of File:[\s\S]*?--- End of File ---/g, "")
          .trim()
      : content;

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

      {/* Content Bubble Area */}
      <div className={`max-w-[85%] space-y-2`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-normal shadow-sm overflow-hidden prose prose-invert max-w-none ${
            isError
              ? "bg-red-500/10 text-red-200 border border-red-500/20 rounded-tl-none"
              : role === "user"
                ? "bg-primary/10 text-primary-content border border-primary/20 rounded-tr-none"
                : "bg-base-200/50 text-slate-200 border border-white/5 rounded-tl-none"
          }`}>
          {/* 👇 Render the MASKED content here instead of raw content */}
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
              pre: ({ children }) => <>{children}</>,

              code: ({
                className,
                children,
                ...props
              }: ComponentPropsWithoutRef<"code">) => {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match;

                if (!isInline && match) {
                  const language = match[1].toLowerCase();

                  // 👇 1. Define languages that should NOT get a PR button
                  const noPRLanguages = [
                    "bash",
                    "sh",
                    "shell",
                    "text",
                    "plaintext",
                    "json",
                    "yaml",
                    "yml",
                    "powershell",
                    "cmd",
                    "markdown",
                    "md",
                  ];

                  // 👇 2. Evaluate if it gets a button
                  const isPRable = !noPRLanguages.includes(language);
                  return (
                    <CodeBlockWithPR
                      language={match[1]}
                      value={String(children).replace(/\n$/, "")}
                      projectId={projectId}
                      allowPR={isPRable}
                    />
                  );
                }

                return (
                  <code
                    {...props}
                    className="bg-white/10 text-slate-200 rounded px-1.5 py-0.5 font-mono text-[13px] border border-white/10">
                    {children}
                  </code>
                );
              },
            }}>
            {displayContent}
          </ReactMarkdown>

          {/* 👇 Render Attached Files for User Messages inside the bubble */}
          {attachedFiles.length > 0 && (
            <div className="mt-3 pt-3 border-t border-primary/20 flex flex-wrap gap-2">
              {attachedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/20 text-primary-content/80 text-[11px] font-medium">
                  <Paperclip
                    size={12}
                    className="opacity-70"
                  />
                  <span className="truncate max-w-50">{file}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Citations (For AI Assistant) */}
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
