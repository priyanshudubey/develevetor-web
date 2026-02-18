import { Layout, Github, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0d1117] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* 1. Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Layout
                  size={18}
                  className="text-primary"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-100">
                DevElevator
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Stop context switching. Chat with your codebase instantly using
              AI. Built for developers, by developers.
            </p>
          </div>

          {/* 2. Product Column */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-primary transition-colors">
                  Login / Sign Up
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Resources Column */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Legal Column */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">
            © {currentYear} DevElevator. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
