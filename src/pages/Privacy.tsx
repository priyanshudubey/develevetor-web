import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Database, 
  Code2, 
  Server, 
  Clock, 
  Lock, 
  Mail,
  CreditCard
} from "lucide-react";
// Assuming Footer is in the correct path for your project
import Footer from "../components/Footer";

export default function Privacy() {
  const lastUpdated = "March 5, 2026";
  const contactEmail = "support@develevator.com";

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans flex flex-col">
      {/* Premium Header */}
      <header className="border-b border-base-300 bg-base-200/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="font-bold text-lg text-emerald-400 hover:text-emerald-300 transition-colors">
              DevElevator
            </Link>
            <span className="text-base-content/40">/</span>
            <span className="font-medium text-base-content/80">Privacy Policy</span>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-500/50" />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-base-content mb-4">
            Privacy Policy
          </h1>
          <p className="text-base-content/60 text-lg">
            Effective Date: <span className="text-base-content/90 font-medium">{lastUpdated}</span>
          </p>
          <p className="mt-4 text-base-content/70 text-lg leading-relaxed max-w-3xl">
            We built DevElevator to analyze your code, not to own it. This policy outlines exactly how we protect your intellectual property, handle your data, and secure your workflow.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section className="bg-base-200/30 p-6 rounded-xl border border-base-300">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-semibold text-base-content">1. Introduction</h2>
            </div>
            <p className="text-base-content/80 leading-relaxed">
              Welcome to <strong>DevElevator</strong> ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the absolute security of your proprietary code. This policy explains how we collect, use, and safeguard your information when you use our AI-powered codebase intelligence tools.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-semibold text-base-content">2. Information We Collect</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <li className="bg-base-200 p-4 rounded-lg border border-base-300">
                <strong className="block text-emerald-400 mb-1">Account Data</strong>
                <span className="text-base-content/70 text-sm">GitHub username, email address, and basic profile metadata used for authentication.</span>
              </li>
              <li className="bg-base-200 p-4 rounded-lg border border-base-300">
                <strong className="block text-emerald-400 mb-1">Codebase Metadata</strong>
                <span className="text-base-content/70 text-sm">File names, paths, AST structural metrics, and logic summaries from explicitly selected repositories.</span>
              </li>
              <li className="bg-base-200 p-4 rounded-lg border border-base-300">
                <strong className="block text-emerald-400 mb-1">Usage Logs</strong>
                <span className="text-base-content/70 text-sm">Chat queries, feature utilization, and error logs to maintain system stability.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 - The Most Important Section */}
          <section className="border-l-4 border-emerald-500 pl-6 py-2">
            <div className="flex items-center space-x-3 mb-4">
              <Code2 className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-semibold text-base-content">3. How We Process Your Code</h2>
            </div>
            <p className="mb-4 text-base-content/80">
              Your code is your intellectual property. We treat it as highly confidential data:
            </p>
            <div className="space-y-4 text-base-content/80">
              <div className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                <p><strong>Indexing & Vectorization:</strong> Code is processed to create mathematical embeddings. These allow our RAG system to find relevant files instantly.</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                <p><strong>Ephemeral AI Processing:</strong> Only the relevant snippets necessary to answer your query are sent to our AI providers. We do not upload your entire codebase to third-party APIs indiscriminately.</p>
              </div>
              <div className="flex items-start space-x-3 bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20 mt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></span>
                <p><strong className="text-emerald-300">Zero Model Training:</strong> We explicitly opt out of data sharing with our AI providers (OpenAI, DeepSeek). <strong>Your proprietary code is never used to train foundational AI models.</strong></p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Server className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-semibold text-base-content">4. Trusted Sub-Processors</h2>
            </div>
            <p className="mb-4 text-base-content/80">We utilize enterprise-grade infrastructure to run DevElevator securely:</p>
            <ul className="space-y-3 text-base-content/80">
              <li className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-base-content/50" />
                <span><strong>Cloud & Auth:</strong> Supabase (SOC2 Type II compliant) for vector storage and RLS-secured databases.</span>
              </li>
              <li className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-base-content/50" />
                <span><strong>AI Providers:</strong> OpenAI and DeepSeek (via API, strictly opted out of training).</span>
              </li>
              <li className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-base-content/50" />
                <span><strong>Payment Processing:</strong> Razorpay for secure handling of Pro tier subscriptions. We do not store your credit card details.</span>
              </li>
            </ul>
          </section>

          {/* Section 5 & 6 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold text-base-content">5. Data Retention</h2>
              </div>
              <p className="text-base-content/80 text-sm leading-relaxed">
                We retain your code embeddings and chat history only for as long as your account is active. Using the "Delete Account" function will permanently wipe your user row, usage data, and all associated codebase insights via database cascades.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-3">
                <Lock className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold text-base-content">6. Security</h2>
              </div>
              <p className="text-base-content/80 text-sm leading-relaxed">
                All traffic is encrypted in transit (TLS 1.3), and sensitive fields are encrypted at rest. Database access is strictly governed by Row Level Security (RLS) ensuring that your codebase data is completely isolated from other users.
              </p>
            </section>
          </div>

          {/* Section 7 */}
          <section className="bg-base-200/50 p-6 rounded-xl border border-base-300 text-center mt-8">
            <Mail className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-base-content mb-2">7. Contact & Compliance</h2>
            <p className="text-base-content/70 mb-4 max-w-lg mx-auto">
              If you have questions about our data practices, GDPR compliance, or wish to export your data, our security team is ready to help.
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center justify-center px-6 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium rounded-lg hover:bg-emerald-500/20 transition-colors"
            >
              {contactEmail}
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}