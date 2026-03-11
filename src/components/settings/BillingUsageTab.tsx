import { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Zap,
  MessageSquare,
  GitPullRequest,
  Folder,
  Loader2,
  CheckCircle2,
  XCircle,
  MapPin,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UsageData {
  usage: {
    chats: number;
    prs: number;
    projectCreates: number;
    activeProjects: number;
  };
  limits: {
    chats: number;
    prs: number;
    dailyProjectCreates: number;
    maxActiveProjects: number;
  };
  totals?: { chats: number; prs: number };
  resetAt: string | null;
}

interface User {
  plan: "FREE" | "PRO";
}

declare global {
  interface Window { Razorpay: any; }
}

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ─── Pricing Config ───────────────────────────────────────────────────────────

const PRICING = {
  IN:  { currency: "INR", amount: 79900, display: "₹799/mo",  original: "₹1,999/mo", symbol: "₹", value: 799  },
  INT: { currency: "USD", amount: 1500,  display: "$15/mo",   original: "$29/mo",     symbol: "$", value: 15   },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

async function detectCountry(): Promise<string | null> {
  try {
    // Uses ipapi.co — free, no API key required for low volume
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
    const { country_code } = await res.json();
    return country_code ?? null;
  } catch {
    return null;  // Safely default; server validates anyway
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BillingUsageTab() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLocalPricing, setIsLocalPricing] = useState(false);
  const [geoReady, setGeoReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const pricing = isLocalPricing ? PRICING.IN : PRICING.INT;

  // ── Data Fetch ─────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    try {
      const [usageRes, userRes] = await Promise.all([
        fetch(`${API}/api/auth/usage`, { credentials: "include" }),
        fetch(`${API}/api/auth/me`,    { credentials: "include" }),
      ]);
      if (usageRes.ok) setData(await usageRes.json());
      if (userRes.ok) {
        const { user: u } = await userRes.json();
        setUser(u);
      }
    } catch (e) {
      console.error("Failed to fetch billing data:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Geo Detection ──────────────────────────────────────────────────────────

  useEffect(() => {
    fetchData();
    detectCountry().then((code) => {
      setIsLocalPricing(code === "IN");
      setGeoReady(true);
    });
  }, [fetchData]);

  // ── Razorpay Checkout ──────────────────────────────────────────────────────

  const handleUpgrade = async () => {
    setIsPaying(true);
    setPaymentStatus(null);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      setIsPaying(false);
      return;
    }

    try {
      // 1. Create order on server — pass currency + amount so server can validate
      const orderRes = await fetch(`${API}/api/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currency: pricing.currency,
          amount: pricing.amount,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || "Order creation failed");
      }

      const { orderId, amount, currency, keyId } = await orderRes.json();

      // 2. Open Razorpay modal
      const options = {
        key: keyId,
        amount,
        currency,
        name: "DevElevator",
        description: `Pro Plan — ${pricing.display}`,
        order_id: orderId,
        theme: { color: "#10b981" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch(`${API}/api/razorpay/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(response),
            });
            const result = await verifyRes.json();
            if (result.success) {
              setPaymentStatus({
                type: "success",
                message: `Payment of ${pricing.display} successful! Welcome to Pro 🎉`,
              });
              await fetchData();
            } else {
              setPaymentStatus({ type: "error", message: "Verification failed. Contact support." });
            }
          } catch {
            setPaymentStatus({ type: "error", message: "Network error during verification." });
          } finally {
            setIsPaying(false);
          }
        },
        modal: { ondismiss: () => setIsPaying(false) },
      };

      new window.Razorpay(options).open();
    } catch (err: any) {
      setPaymentStatus({ type: "error", message: err.message || "Payment initiation failed." });
      setIsPaying(false);
    }
  };

  // ── Cancel Subscription ───────────────────────────────────────────────────

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your Pro subscription?")) return;
    setIsCancelling(true);
    try {
      await fetch(`${API}/api/razorpay/cancel-subscription`, {
        method: "POST",
        credentials: "include",
      });
      await fetchData();
    } finally {
      setIsCancelling(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400 dark:text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const isPro = user?.plan === "PRO";
  const getPercentage = (used: number, limit: number) => Math.min((used / limit) * 100, 100);
  const timeUntilReset = data.resetAt
    ? Math.max(0, Math.round((new Date(data.resetAt).getTime() - Date.now()) / 3_600_000))
    : 24;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <CreditCard size={20} className="text-emerald-500" />
              Usage & Billing
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Track your AI consumption and manage your subscription.
            </p>
          </div>
          <span
            className={`px-3 py-1 border rounded-full text-xs font-medium ${
              isPro
                ? "bg-violet-500/10 border-violet-500/20 text-violet-400"
                : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}>
            {isPro ? "Pro Plan" : "Free Plan"}
          </span>
        </div>
      </div>

      {/* Payment status banner */}
      {paymentStatus && (
        <div
          className={`flex items-center gap-2 p-3 border rounded-xl text-sm ${
            paymentStatus.type === "success"
              ? "bg-success/10 border-success/20 text-success"
              : "bg-error/10  border-error/20  text-error"
          }`}>
          {paymentStatus.type === "success"
            ? <CheckCircle2 size={16} />
            : <XCircle size={16} />}
          {paymentStatus.message}
        </div>
      )}

      {/* Regional Pricing Badge (India only) */}
      {geoReady && isLocalPricing && !isPro && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 w-fit
                        shadow-[0_0_18px_-4px_rgba(16,185,129,0.4)] animate-in fade-in duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <MapPin size={13} className="text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400 tracking-wide">
            Regional Pricing Applied — Special rate for India 🇮🇳
          </span>
        </div>
      )}

      {/* Upgrade / Manage CTA */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 border border-emerald-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-1">
            <Zap size={16} className="text-yellow-400 fill-yellow-400/20" />
            {isPro ? "Pro Plan Active" : "Upgrade to Pro"}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {isPro
              ? "You have unlimited AI chats and unmetered PR generation."
              : "Unlimited AI chats, unmetered PRs, and access to all 6 AI models."}
          </p>

          {/* Price display with Early Bird strikethrough */}
          {!isPro && geoReady && (
            <div className="flex flex-col gap-1 mt-3">
              {/* Early Bird tag */}
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full w-fit
                               bg-amber-400/15 border border-amber-400/30 text-amber-400">
                🐣 Early Bird Discount
              </span>
              {/* Struck price + current price */}
              <div className="flex items-baseline gap-2">
                <span className="text-base font-medium line-through text-zinc-400 dark:text-zinc-500">
                  {pricing.original}
                </span>
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {pricing.display}
                </span>
              </div>
            </div>
          )}
        </div>

        {isPro ? (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="shrink-0 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold rounded-xl text-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors disabled:opacity-70 flex items-center gap-2">
            {isCancelling && <Loader2 className="w-4 h-4 animate-spin" />}
            {isCancelling ? "Cancelling..." : "Cancel Subscription"}
          </button>
        ) : (
          <button
            onClick={handleUpgrade}
            disabled={isPaying || !geoReady}
            className="shrink-0 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            {isPaying
              ? <><Loader2 className="w-4 h-4 animate-spin" />Loading...</>
              : !geoReady
                ? <><Loader2 className="w-4 h-4 animate-spin" />Detecting region...</>
                : `Upgrade Now — ${pricing.display}`}
          </button>
        )}
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Meter
          icon={<MessageSquare size={14} className="text-blue-400" />}
          label="Daily Chats"
          used={data.usage.chats}
          limit={data.limits.chats}
          unlimited={isPro}
          color="bg-blue-500"
          getPercentage={getPercentage}
        />
        <Meter
          icon={<GitPullRequest size={14} className="text-violet-400" />}
          label="Daily Pull Requests"
          used={data.usage.prs}
          limit={data.limits.prs}
          unlimited={isPro}
          color="bg-violet-500"
          getPercentage={getPercentage}
        />

        {/* Workspaces card */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <Folder size={14} className="text-emerald-400" />
            Workspace Limits
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Created Today</span>
              <span className="font-mono">{data.usage.projectCreates} / {data.limits.dailyProjectCreates}</span>
            </div>
            <ProgressBar
              pct={getPercentage(data.usage.projectCreates, data.limits.dailyProjectCreates)}
              maxed={data.usage.projectCreates >= data.limits.dailyProjectCreates}
              color="bg-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Total Active Workspaces</span>
              <span className="font-mono">{data.usage.activeProjects} / {data.limits.maxActiveProjects}</span>
            </div>
            <ProgressBar
              pct={getPercentage(data.usage.activeProjects, data.limits.maxActiveProjects)}
              maxed={data.usage.activeProjects >= data.limits.maxActiveProjects}
              color="bg-emerald-500"
            />
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Up to {data.limits.dailyProjectCreates} new workspaces/day, max {data.limits.maxActiveProjects} active total.
          </p>
        </div>
      </div>

      <p className="text-xs text-center text-zinc-500 pt-2">
        Daily limits reset in approximately <strong>{timeUntilReset} hours</strong>.
      </p>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ pct, maxed, color }: { pct: number; maxed: boolean; color: string }) {
  return (
    <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${maxed ? "bg-error" : color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function Meter({
  icon, label, used, limit, unlimited, color, getPercentage,
}: {
  icon: React.ReactNode;
  label: string;
  used: number;
  limit: number;
  unlimited: boolean;
  color: string;
  getPercentage: (u: number, l: number) => number;
}) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {icon} {label}
        </div>
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          {used} / {unlimited ? "∞" : limit}
        </span>
      </div>
      <ProgressBar
        pct={unlimited ? Math.min((used / limit) * 5, 100) : getPercentage(used, limit)}
        maxed={!unlimited && used >= limit}
        color={color}
      />
    </div>
  );
}
