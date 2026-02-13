import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* --- TECHNICAL BACKGROUND GRID --- */}
      {/* This creates a subtle dot grid pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
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

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}
