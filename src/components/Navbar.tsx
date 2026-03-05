import React, { useState, useEffect } from "react";
import { Terminal, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-base-100/80 backdrop-blur-md border-base-300 py-3 shadow-sm"
          : "bg-transparent border-transparent py-5"
      }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-base-content cursor-pointer select-none hover:opacity-80 transition-opacity">
          <div className="bg-primary/10 text-primary p-1.5 rounded-md border border-primary/20">
            <Terminal size={18} />
          </div>
          <span>DevElevator</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-base-content/60">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#working">Working</NavLink>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3 items-center">
          <ThemeToggle />
          <button 
            onClick={login}
            className="px-4 py-2 text-sm font-medium text-base-content/60 hover:text-base-content transition-colors">
            Log in
          </button>
          <Link to="/dashboard">
            <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-content rounded-md hover:brightness-110 transition-colors shadow">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-base-content/60 hover:text-base-content">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-base-100 border-b border-base-300 p-6 flex flex-col gap-4 shadow-xl">
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
          <div className="h-px bg-base-300 my-2" />
          <div className="flex justify-between items-center py-2">
            <span className="text-base-content/70 font-medium">Theme</span>
            <ThemeToggle />
          </div>
          <button 
            onClick={login}
            className="w-full py-3 text-base-content/70 border border-base-300 rounded-md">
            Log in
          </button>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/dashboard");
            }}
            className="w-full py-3 bg-secondary text-secondary-content rounded-md font-medium">
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
      className="text-lg font-medium text-base-content/60 hover:text-primary transition-colors">
      {children}
    </a>
  );
}
