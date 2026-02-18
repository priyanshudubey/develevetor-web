import {
  useState,
  isValidElement,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { Check, Copy } from "lucide-react";

export default function CodeBlock({
  children,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const extractText = (node: ReactNode): string => {
      if (typeof node === "string") return node;
      if (typeof node === "number") return String(node);
      if (!node) return "";
      if (Array.isArray(node)) return node.map(extractText).join("");
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
      <pre
        {...props}
        className="p-3 overflow-x-auto">
        {children}
      </pre>
    </div>
  );
}
