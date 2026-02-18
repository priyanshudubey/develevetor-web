import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Cookies() {
  const lastUpdated = "February 17, 2026";
  const contactEmail = "support@develevator.com";

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 font-sans">
      {/* Simple Header */}
      <div className="border-b border-white/5 bg-[#161b22]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <span className="font-bold text-lg text-slate-100">
            <Link to="/">DevElevator</Link>
          </span>
          <span className="mx-3 text-slate-600">/</span>
          <span className="font-medium text-slate-400">Cookie Policy</span>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Cookie Policy</h1>
        <p className="text-slate-500 mb-8">Last Updated: {lastUpdated}</p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          {/* 1. What are cookies? */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. What are Cookies?
            </h2>
            <p>
              Cookies are small text files that are stored on your computer or
              mobile device when you visit a website. They allow the website to
              recognize your device and remember if you have been to the website
              before.
            </p>
            <p className="mt-2">
              For a developer tool like DevElevator, cookies are primarily used
              to keep you logged in securely and to remember your repository
              preferences.
            </p>
          </section>

          {/* 2. How we use them */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. How We Use Cookies
            </h2>
            <p className="mb-4">We use cookies for the following purposes:</p>

            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5">
                <h3 className="text-white font-medium mb-1">
                  Essential Cookies
                </h3>
                <p className="text-slate-400 text-xs">
                  These are necessary for the website to function and cannot be
                  switched off. They are usually only set in response to actions
                  made by you, such as logging in or setting your privacy
                  preferences.
                </p>
                <p className="text-primary/80 text-xs mt-2">
                  Example: Supabase Auth Token (sb-access-token)
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5">
                <h3 className="text-white font-medium mb-1">
                  Functional Cookies
                </h3>
                <p className="text-slate-400 text-xs">
                  These enable the website to provide enhanced functionality and
                  personalization. They may be set by us or by third-party
                  providers whose services we have added to our pages.
                </p>
                <p className="text-primary/80 text-xs mt-2">
                  Example: Remembering your last selected project ID.
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5">
                <h3 className="text-white font-medium mb-1">
                  Analytics Cookies
                </h3>
                <p className="text-slate-400 text-xs">
                  These allow us to count visits and traffic sources so we can
                  measure and improve the performance of our site. They help us
                  to know which features are the most popular and see how
                  visitors move around the site.
                </p>
                <p className="text-primary/80 text-xs mt-2">
                  Example: Google Analytics (if applicable).
                </p>
              </div>
            </div>
          </section>

          {/* 3. Managing Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. Managing Cookies
            </h2>
            <p>
              You can control and/or delete cookies as you wish. You can delete
              all cookies that are already on your computer and you can set most
              browsers to prevent them from being placed. If you do this,
              however, you may have to manually adjust some preferences every
              time you visit a site and some services (like logging in) may not
              work.
            </p>
            <p className="mt-2">
              To learn more about cookies and how to manage them, visit{" "}
              <a
                href="https://www.aboutcookies.org"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline">
                aboutcookies.org
              </a>
              .
            </p>
          </section>

          {/* 4. Updates */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Updates to this Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time in order to
              reflect, for example, changes to the cookies we use or for other
              operational, legal, or regulatory reasons. Please therefore
              re-visit this Cookie Policy regularly to stay informed about our
              use of cookies and related technologies.
            </p>
          </section>

          {/* 5. Contact */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Contact Us
            </h2>
            <p>
              If you have any questions about our use of cookies or other
              technologies, please email us at:
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
