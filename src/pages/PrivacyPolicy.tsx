import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Ouribadah Legal Pack
            </CardTitle>
            <p className="text-muted-foreground text-center">
              Last updated: August 17, 2025
            </p>
            <p className="text-sm text-muted-foreground text-center">
              This document bundles the Privacy Policy, Terms of Service, Community Harmony & Anti‑Abuse Disclaimer, and Contact Us for Ouribadah.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Publisher Details */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Publisher / Organization Details</h2>
              <ul className="space-y-1 text-sm">
                <li><strong>Organization:</strong> ALJADEED ENTERPRISE PTE LTD</li>
                <li><strong>Address:</strong> BLK 625, ALJUNIED Industrial Estate, Aljunied Road, Singapore 389836</li>
                <li><strong>City/State/Postal:</strong> SG, SG 389836</li>
                <li><strong>Country:</strong> Singapore</li>
                <li><strong>Phone:</strong> 60413928</li>
                <li><strong>Email:</strong> info@aljadeedenterprise.com</li>
              </ul>
            </section>

            {/* Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Privacy Policy (Ouribadah)</h2>
              <p className="text-sm text-muted-foreground mb-4">Last updated: August 17, 2025</p>
              <p className="mb-4">
                This Privacy Policy explains how Ouribadah ("we", "us", "our") collects, uses, and protects your information when you use our website and app at ouribadah.com and related services (the "Service").
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. Information we collect</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Account & profile:</strong> name, email (optional), gender (optional), language, preferences (e.g., madhhab, calculation method).</li>
                    <li><strong>Location data:</strong> approximate or precise location when you allow it, to show nearby mosques/halal venues, compute prayer times/Qibla, and local events.</li>
                    <li><strong>Prayer tracker data (optional):</strong> your self-logged records of obligatory prayers (e.g., in-time/delayed minutes, prayed at home or masjid). This is private to you unless you choose to share. Aggregates may be computed only in anonymized form and shown only when a minimum threshold is met (k-anonymity).</li>
                    <li><strong>Device & usage:</strong> device type, browser, pages viewed, referral URLs, crash logs, and general analytics.</li>
                    <li><strong>Cookies & local storage:</strong> to keep you signed in, remember settings, and store favorites/saved places.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2. How we use your information</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Provide core features: mosque/halal discovery, prayer times/Qibla, events, reminders.</li>
                    <li>Personalize content (e.g., nearby results), save favorites, and remember your preferences.</li>
                    <li>Prayer tracker & analytics (optional): compute your own summaries/graphs; show anonymized local trends when available.</li>
                    <li>Safety, security, abuse prevention, and troubleshooting.</li>
                    <li>Legal compliance and to enforce our Terms.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">3. Legal bases (where applicable)</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Consent:</strong> location access, notifications, prayer tracking, and gender are optional.</li>
                    <li><strong>Legitimate interests:</strong> service operation, fraud prevention, usage analytics.</li>
                    <li><strong>Contract:</strong> to deliver the Service you request.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">4. Third-party services</h3>
                  <p className="mb-2">We use trusted providers, for example:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Google Maps/Places & Programmable Search (CSE):</strong> to fetch location and search results. Your use is also subject to Google's terms and privacy policies.</li>
                    <li>Analytics/Crash reporting (if enabled).</li>
                  </ul>
                  <p className="mt-2">We do not sell your personal information.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">5. Sharing</h3>
                  <p>We share data only with processors who help us run the Service under confidentiality obligations, or when required by law. We do not share your prayer tracker entries with other users. Aggregated community stats (if shown) are anonymized.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">6. Data retention</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Account/profile:</strong> kept while your account is active.</li>
                    <li><strong>Prayer logs:</strong> kept while you use the tracker; you can delete your logs.</li>
                    <li><strong>Technical logs:</strong> typically 12–24 months, unless needed longer for security/compliance.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">7. Your choices & rights</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Turn off location/notifications at any time in your device/browser settings.</li>
                    <li>Access, correct, export, or delete your data by contacting us (see "Contact Us").</li>
                    <li>Withdraw consent for prayer tracking or notifications at any time.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">8. Security</h3>
                  <p>We use reasonable technical and organizational safeguards. No method of transmission or storage is 100% secure.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">9. Children</h3>
                  <p>The Service is not directed to children under 16 without parental/guardian consent.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">10. International transfers</h3>
                  <p>Your data may be processed in countries other than your own, where privacy laws may differ.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">11. Changes</h3>
                  <p>We'll post updates here and adjust the "Last updated" date.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">12. Contact</h3>
                  <p>Questions or requests? Email privacy@ouribadah.com or info@aljadeedenterprise.com.</p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;