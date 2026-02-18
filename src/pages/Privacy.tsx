import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Privacy() {
  const lastUpdated = "February 17, 2026"; // Update this date
  const contactEmail = "support@develevator.com"; // Update this

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 font-sans">
      {/* Simple Header */}
      <div className="border-b border-white/5 bg-[#161b22]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <span className="font-bold text-lg text-slate-100">
            <Link to="/">DevElevator</Link>
          </span>
          <span className="mx-3 text-slate-600">/</span>
          <span className="font-medium text-slate-400">Privacy Policy</span>
        </div>
      </div>

      {/* Legal Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last Updated: {lastUpdated}</p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>DevElevator</strong> ("we," "our," or "us"). We
              are committed to protecting your privacy and ensuring the security
              of your personal information and code. This Privacy Policy
              explains how we collect, use, disclosure, and safeguard your
              information when you visit our application and use our AI-powered
              coding assistant services.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-2">
              We collect information to provide and improve our Service:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account Information:</strong> When you sign up via
                GitHub, we collect your username, email address, and avatar
                image.
              </li>
              <li>
                <strong>Codebase Data:</strong> To provide our core service, we
                access and index specific repositories you explicitly select.
                This includes file names, file paths, and code content.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect logs on how you interact
                with the service, including chat queries and feature usage, to
                improve system performance.
              </li>
            </ul>
          </section>

          {/* Section 3 - Critical for Dev Tools */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. How We Process Your Code
            </h2>
            <p className="mb-2">
              We understand that your code is your intellectual property. Here
              is strictly how we handle it:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Indexing & Vectorization:</strong> Your code is
                processed to create "embeddings" (mathematical representations)
                that allow our AI to search it. These embeddings are stored
                securely in our database.
              </li>
              <li>
                <strong>Ephemeral Processing:</strong> When you ask a question,
                relevant snippets of your code are sent to our AI Provider
                (OpenAI) to generate an answer.
              </li>
              <li>
                <strong>No Model Training:</strong> We do{" "}
                <strong className="text-white">not</strong> use your proprietary
                code to train our own foundational AI models. Your code is used
                solely to answer your specific questions.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Third-Party Service Providers
            </h2>
            <p className="mb-2">
              We share data with trusted third-party providers solely for the
              purpose of running the application:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>AI & LLM Providers (e.g., OpenAI):</strong>
                Used solely for the purpose of generating responses to your
                queries. We have opted out of data training where available.
              </li>
              <li>
                <strong>Cloud Database & Auth Providers:</strong>
                We use enterprise-grade cloud infrastructure (SOC2 compliant) to
                securely store user metadata, chat history, and vector
                embeddings.
              </li>
              <li>
                <strong>Git Providers (e.g., GitHub):</strong>
                Used strictly for authentication and retrieving the repositories
                you explicitly select.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Data Retention
            </h2>
            <p>
              We retain your personal information and indexed code data only for
              as long as necessary to provide the Service. You can request the
              deletion of your account and all associated data (including chat
              history and indexed vectors) at any time by contacting support or
              using the "Delete Account" feature in your settings.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Security
            </h2>
            <p>
              We implement industry-standard security measures, including
              encryption in transit (SSL/TLS) and encryption at rest for
              sensitive database fields. However, no method of transmission over
              the Internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
              <br />
              <a
                href={`mailto:${contactEmail}`}
                className="text-primary hover:underline mt-1 block">
                {contactEmail}
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
