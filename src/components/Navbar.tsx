import React, { useState, useEffect } from "react";
import { Terminal, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add a background blur only when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-base-100/80 backdrop-blur-md border-white/5 py-3"
          : "bg-transparent border-transparent py-5"
      }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-white cursor-pointer select-none hover:opacity-80 transition-opacity">
          <div className="bg-primary/10 text-primary p-1.5 rounded-md border border-primary/20">
            <Terminal size={18} />
          </div>
          <span>DevElevator</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#docs">Docs</NavLink>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3">
          <a href="http://localhost:3000/api/auth/github">
            <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Log in
            </button>
          </a>
          <Link to="/dashboard">
            <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-content rounded-md hover:bg-emerald-400 transition-colors shadow-[0_0_15px_-3px_var(--color-primary)]">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300 hover:text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-base-100 border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
          <MobileNavLink
            href="#features"
            onClick={() => setMobileMenuOpen(false)}>
            Features
          </MobileNavLink>
          <MobileNavLink
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </MobileNavLink>
          <MobileNavLink
            href="#docs"
            onClick={() => setMobileMenuOpen(false)}>
            Docs
          </MobileNavLink>
          <div className="h-px bg-white/10 my-2" />
          <button className="w-full py-3 text-slate-300 border border-white/10 rounded-md">
            Log in
          </button>
          <button className="w-full py-3 bg-primary text-primary-content rounded-md font-medium">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}

// --- Helper Components ---

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="relative hover:text-primary transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all hover:after:w-full">
      {children}
    </a>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-lg font-medium text-slate-300 hover:text-primary transition-colors">
      {children}
    </a>
  );
}
