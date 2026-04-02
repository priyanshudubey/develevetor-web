// File: src/components/FAQ.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const faqs = [
  {
    question: "How do I get started with my first repository?",
    answer: "Getting started takes less than two minutes. Simply log in with GitHub to access your Workspace. Click 'Add Repository', select the codebase you want to analyze, and let DevElevator complete its initial indexing. Once the index is built, you can immediately start chatting with your AI Staff Engineer!"
  },
  {
    question: "Is my source code secure?",
    answer: "Absolutely. DevElevator requests read-only access to your repositories strictly for analysis. We do not permanently store your proprietary source code, and we never use your codebase to train public AI models. Your code stays yours."
  },
  {
    question: "How is this different from GitHub Copilot?",
    answer: "Copilot is an assistant that sits in your IDE and helps you write lines of code. DevElevator is your AI Staff Engineer. It zooms out to map your entire system architecture, audit security vulnerabilities across multiple files, and explain legacy spaghetti code before you write a single line."
  },
  {
    question: "How does DevElevator avoid AI hallucinations?",
    answer: "Unlike standard chatbots, DevElevator's logic is strictly grounded in your indexed codebase. When you ask a question about your architecture, it reads your actual files and cites the exact file paths and functions it used to generate the answer, eliminating false positives."
  },
  {
    question: "Does DevElevator support large monorepos?",
    answer: "Yes! DevElevator intelligently indexes your entire directory structure. For complex monorepos, it maps the dependencies between your frontend apps, backend microservices, and shared packages so it understands the full system context."
  },
  {
    question: "How do the automated PR audits work?",
    answer: "DevElevator doesn't just chat; it acts as a gatekeeper. It reviews your Pull Requests just like a Senior Engineer would, checking for architectural consistency, security vulnerabilities, and performance bottlenecks before you merge to production."
  },
  {
    question: "What is included in the Free tier?",
    answer: "We offer a generous free tier that resets automatically every 24 hours. Free users get up to 15 AI chats, 3 automated PR audits, and can manage up to 3 active projects simultaneously. You can upgrade to Pro anytime for unlimited access."
  },
  {
    question: "What programming languages do you support?",
    answer: "Because DevElevator is powered by state-of-the-art LLMs, it understands virtually all modern and legacy languages—from TypeScript, Python, and Rust, all the way down to 15-year-old Java or PHP monoliths."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 relative bg-zinc-50 dark:bg-[#050505] transition-colors duration-300">
      {/* Background Ambience / Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-zinc-200 dark:via-white/10 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm dark:shadow-none">
            <MessageCircleQuestion size={16} />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Everything you need to know about DevElevator and how it supercharges your development workflow.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? "bg-white dark:bg-zinc-900/80 border-emerald-200 dark:border-emerald-500/40 shadow-lg shadow-emerald-500/5 dark:shadow-emerald-500/10 scale-[1.01]" 
                    : "bg-white/60 dark:bg-zinc-900/30 border-zinc-200 dark:border-white/5 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-white dark:hover:bg-zinc-900/50 hover:shadow-sm"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 lg:px-8 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className={`text-base md:text-lg font-medium transition-colors duration-300 pr-8 ${
                    isOpen ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-300"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    isOpen ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-500"
                  }`}>
                    <ChevronDown 
                      size={18} 
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                    />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 lg:px-8 pb-6 text-zinc-600 dark:text-zinc-400 leading-relaxed font-light border-t border-emerald-100 dark:border-white/5 pt-5 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
