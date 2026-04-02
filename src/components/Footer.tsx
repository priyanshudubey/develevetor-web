// File: src/components/Footer.tsx
import { Github, Twitter, Linkedin, Code2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { login } = useAuth();

  return (
    <footer className="bg-zinc-50 dark:bg-[#050505] border-t border-zinc-200 dark:border-white/10 pt-20 pb-8 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-200/30 dark:from-emerald-900/20 via-transparent to-transparent blur-3xl pointer-events-none z-0" />
      
      <div 
        className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.1) 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* 1. Brand Section (Takes up more space) */}
          <div className="col-span-1 md:col-span-5 pr-0 md:pr-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Code2 size={18} />
              </div>
              <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
                DevElevator
              </span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8 font-light">
              Stop context switching. Chat with your codebase instantly, audit security, and map architectures. Built for developers, by developers.
            </p>
            
            {/* Developer Credit */}
            <a 
              href="mailto:priyanshu0dubey@gmail.com"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 shadow-sm dark:shadow-none hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all duration-300 group cursor-pointer hover:-translate-y-0.5"
            >
              <Mail size={14} className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                Developed by <span className="font-bold text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/30 underline-offset-2 group-hover:decoration-emerald-500">Priyanshu Dubey</span>
              </span>
            </a>
          </div>

          {/* 2. Product Column */}
          <div className="col-span-1 md:col-span-2 pt-2">
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
              </li>
              <li>
                <a href="#working" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How it Works</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Pricing</a>
              </li>
              <li>
                <button onClick={login} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left">
                  Sign In / Register
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Resources Column (Restored & Polished) */}
          {/* <div className="col-span-1 md:col-span-2 pt-2">
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Documentation</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">API Reference</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-2">
                  Changelog <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 uppercase">New</span>
                </a>
              </li>
            </ul>
          </div> */}

          {/* 4. Legal Column */}
          <div className="col-span-1 md:col-span-3 pt-2">
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link to="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-8 border-t border-zinc-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-400 dark:text-zinc-500 text-sm">
            © {currentYear} DevElevator. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a href="https://github.com/priyanshudubey" target="_blank" rel="noreferrer" className="text-zinc-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:-translate-y-1 transition-all">
              <span className="sr-only">GitHub</span>
              <Github size={20} />
            </a>
            <a href="https://x.com/PriyanshuDube15" target="_blank" rel="noreferrer" className="text-zinc-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:-translate-y-1 transition-all">
              <span className="sr-only">Twitter</span>
              <Twitter size={20} />
            </a>
            <a href="https://www.linkedin.com/in/priyanshudubey/" target="_blank" rel="noreferrer" className="text-zinc-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:-translate-y-1 transition-all">
              <span className="sr-only">LinkedIn</span>
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}