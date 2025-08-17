import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy (Ouribadah)</h1>
            <p className="text-muted-foreground">Last updated: August 17, 2025</p>
          </header>

          <section className="mb-8">
            <p className="text-foreground leading-relaxed">
              This Privacy Policy explains how Ouribadah ("we", "us", "our") collects, uses, and protects your information when you use our website and app at ouribadah.com and related services (the "Service").
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information we collect</h2>
            <div className="space-y-4 text-foreground">
              <p><strong>Account & profile:</strong> name, email (optional), gender (optional), language, preferences (e.g., madhhab, calculation method).</p>
              
              <p><strong>Location data:</strong> approximate or precise location when you allow it, to show nearby mosques/halal venues, compute prayer times/Qibla, and local events.</p>
              
              <p><strong>Prayer tracker data (optional):</strong> your self-logged records of obligatory prayers (e.g., in-time/delayed minutes, prayed at home or masjid). This is private to you unless you choose to share. Aggregates may be computed only in anonymized form and shown only when a minimum threshold is met (k-anonymity).</p>
              
              <p><strong>Device & usage:</strong> device type, browser, pages viewed, referral URLs, crash logs, and general analytics.</p>
              
              <p><strong>Cookies & local storage:</strong> to keep you signed in, remember settings, and store favorites/saved places.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How we use your information</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>Provide core features: mosque/halal discovery, prayer times/Qibla, events, reminders.</li>
              <li>Personalize content (e.g., nearby results), save favorites, and remember your preferences.</li>
              <li>Prayer tracker & analytics (optional): compute your own summaries/graphs; show anonymized local trends when available.</li>
              <li>Safety, security, abuse prevention, and troubleshooting.</li>
              <li>Legal compliance and to enforce our Terms.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Legal bases (where applicable)</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li><strong>Consent:</strong> location access, notifications, prayer tracking, and gender are optional.</li>
              <li><strong>Legitimate interests:</strong> service operation, fraud prevention, usage analytics.</li>
              <li><strong>Contract:</strong> to deliver the Service you request.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Third-party services</h2>
            <div className="space-y-4 text-foreground">
              <p>We use trusted providers, for example:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Google Maps/Places & Programmable Search (CSE):</strong> to fetch location and search results. Your use is also subject to Google's terms and privacy policies.</li>
                <li>Analytics/Crash reporting (if enabled).</li>
              </ul>
              <p>We do not sell your personal information.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Sharing</h2>
            <p className="text-foreground">
              We share data only with processors who help us run the Service under confidentiality obligations, or when required by law. We do not share your prayer tracker entries with other users. Aggregated community stats (if shown) are anonymized.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data retention</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li><strong>Account/profile:</strong> kept while your account is active.</li>
              <li><strong>Prayer logs:</strong> kept while you use the tracker; you can delete your logs.</li>
              <li><strong>Technical logs:</strong> typically 12–24 months, unless needed longer for security/compliance.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Your choices & rights</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>Turn off location/notifications at any time in your device/browser settings.</li>
              <li>Access, correct, export, or delete your data by contacting us (see "Contact Us").</li>
              <li>Withdraw consent for prayer tracking or notifications at any time.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Security</h2>
            <p className="text-foreground">
              We use reasonable technical and organizational safeguards. No method of transmission or storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children</h2>
            <p className="text-foreground">
              The Service is not directed to children under 16 without parental/guardian consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. International transfers</h2>
            <p className="text-foreground">
              Your data may be processed in countries other than your own, where privacy laws may differ.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Changes</h2>
            <p className="text-foreground">
              We'll post updates here and adjust the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contact</h2>
            <p className="text-foreground">
              Questions or requests? See Contact Us below or email{" "}
              <a href="mailto:privacy@ouribadah.com" className="text-primary hover:underline">
                privacy@ouribadah.com
              </a>.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
};

export default PrivacyPolicy;