import { useState, useMemo } from "react";
import { Check, Copy, GitPullRequest } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import PRModal from "./PRModal";

interface CodeBlockProps {
  language: string;
  value: string;
  projectId: string;
  filename?: string;
}

export default function CodeBlockWithPR({
  language,
  value,
  projectId,
  filename: propFilename,
}: CodeBlockProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute detected filename and clean code using useMemo
  const { detectedFilename, cleanCode } = useMemo(() => {
    const fileMatch = value.match(/^(?:\/\/|#)\s+File:\s+(.+)$/m);

    if (fileMatch) {
      return {
        detectedFilename: fileMatch[1].trim(),
        cleanCode: value.replace(fileMatch[0] + "\n", ""),
      };
    } else {
      return {
        detectedFilename: propFilename || "",
        cleanCode: value,
      };
    }
  }, [value, propFilename]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-white/10 bg-[#0d1117] shadow-lg">
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#161b22] border-b border-white/5">
        {/* Show detected filename if available, else language */}
        <span className="text-xs font-mono text-slate-400">
          {detectedFilename || language}
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
            <GitPullRequest className="w-3.5 h-3.5" />
            Create PR
          </button>

          <div className="w-px h-3 bg-white/10" />

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* CODE CONTENT */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: "1.5rem", background: "#0d1117" }}
        wrapLines={true}>
        {cleanCode}
      </SyntaxHighlighter>

      <PRModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        filePath={detectedFilename || "src/generated-code.ts"}
        newContent={cleanCode}
      />
    </div>
  );
}
