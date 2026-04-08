import { useState, useMemo } from "react";
import { Send, FileCode, X } from "lucide-react";
import api from "../../services/api";
import { debounce } from "lodash";

interface ChatInputProps {
  projectId: string;
  projectStatus: string;
  disabled: boolean;
  onSend: (message: string, files: string[]) => void;
}

const PREDEFINED_MESSAGES = [
  "Explain me this repository",
  "Write a detailed README for this repository",
  "How is the authentication implemented?",
  "Help me find any security vulnerabilities"
];

export default function ChatInput({
  projectId,
  projectStatus,
  disabled,
  onSend,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Mention State
  const [showMentions, setShowMentions] = useState(false);
  const [mentionResults, setMentionResults] = useState<string[]>([]);

  // Debounced Search
  const debouncedFetchFiles = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query) return;
        try {
          const { data } = await api.get(
            `/api/projects/${projectId}/files?query=${query}`
          );
          setMentionResults(data.files);
        } catch (err) {
          console.error("Search failed", err);
        }
      }, 300),
    [projectId],
  );

  const MAX_CHARS = 1000;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let val = e.target.value;
    // Limit to max characters
    if (val.length > MAX_CHARS) {
      val = val.slice(0, MAX_CHARS);
    }
    setInput(val);

    const lastChar = val.slice(-1);
    if (lastChar === "@") {
      setShowMentions(true);
      debouncedFetchFiles(""); // Fetch default list
      return;
    }

    if (showMentions) {
      const parts = val.split("@");
      const query = parts[parts.length - 1];
      debouncedFetchFiles(query);
    }

    if (!val.includes("@")) {
      setShowMentions(false);
    }
  };

  const selectFile = (fileName: string) => {
    if (!selectedFiles.includes(fileName)) {
      setSelectedFiles((prev) => [...prev, fileName]);
    }
    const parts = input.split("@");
    parts.pop();
    setInput(parts.join("@"));
    setShowMentions(false);
    setMentionResults([]);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input, selectedFiles);
    setInput("");
    setSelectedFiles([]);
    setShowMentions(false);
  };

  return (
    <div className="p-2 md:p-2 border-t border-base-300 bg-base-200 z-10">
      <div className="max-w-3xl mx-auto relative">
        {/* Predefined Messages */}
        {!input && selectedFiles.length === 0 && projectStatus === "READY" && !disabled && (
          <div className="flex flex-wrap gap-2 px-1 mb-3">
            {PREDEFINED_MESSAGES.map((msg, idx) => (
              <button
                key={idx}
                onClick={() => setInput(msg)}
                className="text-xs bg-base-100 hover:bg-base-300 border border-base-300 px-3 py-1.5 rounded-full transition-colors text-base-content/70 hover:text-base-content"
              >
                {msg}
              </button>
            ))}
          </div>
        )}

        {/* Selected File Chips */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1 pb-2">
            {selectedFiles.map((file) => (
              <div
                key={file}
                className="cursor-pointer flex items-center gap-1 bg-primary/20 text-primary text-xs px-2 py-1 rounded-md border border-primary/30">
                <FileCode size={12} />
                <span>{file}</span>
                <button
                  onClick={() =>
                    setSelectedFiles((prev) => prev.filter((f) => f !== file))
                  }
                  className="hover:text-white">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Mentions Dropdown */}
        {showMentions && mentionResults.length > 0 && (
          <div className="absolute bottom-16 left-0 right-0 bg-base-100 border border-base-300 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto z-50">
            {mentionResults.map((file) => (
              <button
                key={file}
                onClick={() => selectFile(file)}
                className="w-full text-left px-4 py-2 text-sm text-base-content/80 hover:bg-base-200 hover:text-base-content flex items-center gap-2 transition-colors">
                <FileCode
                  size={14}
                  className="text-base-content/50"
                />{" "}
                {file}
              </button>
            ))}
          </div>
        )}

        {/* Text Input - Expandable Textarea */}
        <div className="relative">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              // Submit on Ctrl+Enter, new line on Shift+Enter, normal Enter submits
              if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              projectStatus === "READY"
                ? "Ask a question (type @ to add files)..."
                : "Waiting for indexing..."
            }
            disabled={disabled || projectStatus !== "READY"}
            rows={1}
            className="w-full min-h-14 max-h-40 p-4 pr-14 pb-8 bg-base-100 border border-base-300 rounded-xl text-base-content focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none overflow-y-auto shadow-sm placeholder:text-base-content/50"
          />

          {/* Character Counter */}
          <div className="absolute right-14 bottom-2 text-xs text-base-content/50">
            {input.length}/{MAX_CHARS}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            className="absolute right-3 bottom-3 h-10 w-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg flex items-center justify-center transition-all disabled:opacity-50">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
