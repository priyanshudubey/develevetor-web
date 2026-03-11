import { X, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function UpgradeModal({ isOpen, onClose, message }: UpgradeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    onClose();
    // Redirect to the billing or settings page where Razorpay checkout is initialized
    navigate("/dashboard/settings");
    // Alternatively, if you have a specific billing route: navigate("/billing");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content - Glassmorphism Midnight Emerald Theme */}
      <div className="relative w-full max-w-md bg-zinc-950/80 backdrop-blur-2xl border border-emerald-500/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] rounded-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-start p-4 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="font-semibold text-white tracking-wide">Upgrade Required</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
              Limit Reached
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Pro Benefits */}
          <div className="space-y-3 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Unlimited standard AI models</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Rocket className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Access to advanced models (GPT-4o, Claude 3.5 Sonnet)</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Priority indexing & 15 Active Projects</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-zinc-900/30 relative z-10">
          <button
            onClick={handleUpgradeClick}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.6)] active:scale-[0.98]"
          >
            Upgrade to Pro
          </button>
          <p className="text-center text-[10px] text-zinc-500 mt-3 uppercase tracking-wider font-semibold">
            Cancel anytime • Secure checkout
          </p>
        </div>
      </div>
    </div>
  );
}
