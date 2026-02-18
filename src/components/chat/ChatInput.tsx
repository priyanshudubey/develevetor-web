import { useState, useMemo } from "react";
import { Send, FileCode, X } from "lucide-react";
import axios from "axios";
import { debounce } from "lodash";

interface ChatInputProps {
  projectId: string;
  projectStatus: string;
  disabled: boolean;
  onSend: (message: string, files: string[]) => void;
}

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
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/files?query=${query}`,
            { withCredentials: true },
          );
          setMentionResults(data.files);
        } catch (err) {
          console.error("Search failed", err);
        }
      }, 300),
    [projectId],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
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
    <div className="p-2 md:p-2 border-t border-white/5 bg-base-100 z-10">
      <div className="max-w-3xl mx-auto relative">
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
          <div className="absolute bottom-16 left-0 right-0 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto z-50">
            {mentionResults.map((file) => (
              <button
                key={file}
                onClick={() => selectFile(file)}
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-primary/20 hover:text-white flex items-center gap-2">
                <FileCode
                  size={14}
                  className="text-slate-500"
                />{" "}
                {file}
              </button>
            ))}
          </div>
        )}

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
          placeholder={
            projectStatus === "READY"
              ? "Ask a question (type @ to add files)..."
              : "Waiting for indexing..."
          }
          disabled={disabled || projectStatus !== "READY"}
          className="w-full h-14 pl-5 pr-14 bg-base-200/50 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary/50"
        />

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="absolute right-2 top-0 bottom-0 my-auto h-10 w-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg flex items-center justify-center transition-all">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
