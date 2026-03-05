import { Link } from "react-router-dom";
import { 
  Cookie, 
  HelpCircle, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Settings2, 
  RefreshCw, 
  Mail 
} from "lucide-react";
// Assuming Footer is in the correct path for your project
import Footer from "../components/Footer";

export default function Cookies() {
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
            <span className="font-medium text-base-content/80">Cookie Policy</span>
          </div>
          <Cookie className="w-5 h-5 text-emerald-500/50" />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-base-content mb-4">
            Cookie Policy
          </h1>
          <p className="text-base-content/60 text-lg">
            Effective Date: <span className="text-base-content/90 font-medium">{lastUpdated}</span>
          </p>
          <p className="mt-4 text-base-content/70 text-lg leading-relaxed max-w-3xl">
            We believe in transparency. This page explains how and why we use cookies (and similar tracking technologies) to ensure DevElevator runs securely and efficiently.
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-base-200/30 p-6 rounded-xl border border-base-300">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-semibold text-base-content">1. What are Cookies?</h2>
            </div>
            <p className="text-base-content/80 leading-relaxed text-sm mb-3">
              Cookies are small text files stored on your device when you visit a website. They allow the platform to recognize your device and remember your preferences across different pages or sessions.
            </p>
            <p className="text-base-content/80 leading-relaxed text-sm">
              For a developer tool like DevElevator, we primarily use cookies as a security measure—to keep you authenticated via Supabase and to remember your local workspace settings without needing to query the database on every click.
            </p>
          </section>

          {/* Section 2 - The Categories */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Layers className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-semibold text-base-content">2. How We Use Cookies</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Essential */}
              <div className="bg-base-200/50 p-5 rounded-xl border border-base-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <div className="flex justify-between items-start mb-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">Always Active</span>
                </div>
                <h3 className="text-base-content font-semibold mb-2">Essential</h3>
                <p className="text-base-content/60 text-xs mb-3 leading-relaxed">
                  Strictly necessary for the application to function. They handle user authentication, security tokens, and routing.
                </p>
                <div className="bg-base-300/50 rounded p-2 text-xs font-mono text-emerald-400/80">
                  e.g., sb-access-token
                </div>
              </div>

              {/* Functional */}
              <div className="bg-base-200/50 p-5 rounded-xl border border-base-300">
                <Settings2 className="w-6 h-6 text-base-content/50 mb-3" />
                <h3 className="text-base-content font-semibold mb-2">Functional</h3>
                <p className="text-base-content/60 text-xs mb-3 leading-relaxed">
                  Allows the website to remember choices you make (like your last viewed repository or dark mode preference).
                </p>
                <div className="bg-base-300/50 rounded p-2 text-xs font-mono text-base-content/60">
                  e.g., dev-elev-workspace
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-base-200/50 p-5 rounded-xl border border-base-300">
                <Activity className="w-6 h-6 text-base-content/50 mb-3" />
                <h3 className="text-base-content font-semibold mb-2">Analytics</h3>
                <p className="text-base-content/60 text-xs mb-3 leading-relaxed">
                  Helps us understand how users interact with the app so we can improve the UI and indexing speed.
                </p>
                <div className="bg-base-300/50 rounded p-2 text-xs font-mono text-base-content/60">
                  e.g., _ga, _gid
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 & 4 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <div className="flex items-center space-x-3 mb-3">
                <Settings2 className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold text-base-content">3. Managing Cookies</h2>
              </div>
              <p className="text-base-content/80 text-sm leading-relaxed mb-3">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept the "Essential" cookies, you will not be able to log in to your DevElevator dashboard.
              </p>
              <a
                href="https://www.aboutcookies.org"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 text-sm inline-flex items-center transition-colors"
              >
                Learn more at aboutcookies.org →
              </a>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-3">
                <RefreshCw className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold text-base-content">4. Updates to this Policy</h2>
              </div>
              <p className="text-base-content/80 text-sm leading-relaxed">
                We may update this policy periodically to reflect changes in our operational or regulatory requirements. Any major changes to how we handle tracking will be communicated via your dashboard.
              </p>
            </section>
          </div>

          {/* Section 5 */}
          <section className="bg-base-200/50 p-6 rounded-xl border border-base-300 text-center mt-8">
            <Mail className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-base-content mb-2">5. Contact Us</h2>
            <p className="text-base-content/70 mb-4 max-w-lg mx-auto">
              If you have any questions about our use of cookies or privacy technologies, please reach out to our team.
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