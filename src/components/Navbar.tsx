import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Add a background blur only when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-zinc-200 dark:border-white/5 shadow-sm"
          : "bg-transparent border-transparent py-5"
      }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100 cursor-pointer select-none hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="DevElevator Logo" className="w-10 h-8 rounded-md" />
          <span>DevElevator</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#working">Working</NavLink>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3 items-center">
          <ThemeToggle />
          <button 
            onClick={login}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors">
            Log in
          </button>
          {/* <Link to="/dashboard">
            <button className="px-4 py-2 text-sm font-medium bg-emerald-500 text-white rounded-md hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Start Free Trial
            </button>
          </Link> */}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4 shadow-xl">
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
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
          <div className="flex justify-between items-center py-2">
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Theme</span>
            <ThemeToggle />
          </div>
          <button 
            onClick={login}
            className="w-full py-3 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Log in
          </button>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/dashboard");
            }}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-md font-medium transition-colors">
            Get Started
          </button>
        </div>
      )}
    </motion.nav>
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
      className="relative text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-emerald-500 after:transition-all hover:after:w-full">
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
      className="text-lg font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
      {children}
    </a>
  );
}
