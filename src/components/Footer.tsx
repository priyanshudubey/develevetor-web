import React from "react";
import { Terminal, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-base-100 text-sm z-10 relative">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2 font-bold text-slate-200">
          <div className="bg-primary/10 text-primary p-1 rounded-md border border-primary/20">
            <Terminal size={16} />
          </div>
          <span>DevElevator</span>
        </div>

        {/* Copyright */}
        <div className="text-slate-500 font-mono text-xs">
          © 2026 DevElevator Ltd. All rights reserved.
        </div>

        {/* Links */}
        <div className="flex gap-6 text-slate-400">
          <FooterLink href="#">Privacy</FooterLink>
          <FooterLink href="#">Terms</FooterLink>

          <div className="w-px h-4 bg-white/10 mx-2" />

          <SocialLink
            href="#"
            icon={<Twitter size={16} />}
          />
          <SocialLink
            href="#"
            icon={<Github size={16} />}
          />
          <SocialLink
            href="#"
            icon={<Linkedin size={16} />}
          />
        </div>
      </div>
    </footer>
  );
}

// --- Helper Components ---

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="hover:text-primary transition-colors duration-200">
      {children}
    </a>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="hover:text-white hover:scale-110 transition-all duration-200">
      {icon}
    </a>
  );
}
