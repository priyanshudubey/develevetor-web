import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content selection:bg-emerald-500/20 selection:text-emerald-900 overflow-x-hidden">
      {/* --- TECHNICAL BACKGROUND GRID --- */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* --- NAVBAR --- */}
      <Navbar />

      {/* --- HERO SECTION --- */}
      <Hero />

      {/* --- FEATURES SECTION --- */}
      <Features />

      {/* --- HOW IT WORKS (Pipeline) --- */}
      <HowItWorks />

      {/* --- PRICING --- */}
      <Pricing />

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}
