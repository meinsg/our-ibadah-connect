import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Terms of Service (Ouribadah)
            </CardTitle>
            <p className="text-muted-foreground text-center">
              Last updated: August 17, 2025
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p>
              These Terms govern your access to and use of Ouribadah. By using the Service, you agree to these Terms.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. The Service</h3>
                <p>Ouribadah helps users find mosques and halal venues, view prayer times/Qibla, discover events, connect with communities, set reminders, and optionally track prayers.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2. Eligibility & accounts</h3>
                <p>You must be able to form a binding contract. Provide accurate information. You are responsible for your account and for maintaining the confidentiality of your credentials.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3. Acceptable Use & Community Harmony</h3>
                <p className="mb-2">You agree not to use the Service to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Promote or incite hatred, racism, xenophobia, sectarianism, misogyny, or any form of harassment or abuse.</li>
                  <li>Spread misinformation or disinformation, including false claims about individuals, communities, mosques, or halal status.</li>
                  <li>Encourage or engage in violence, extremism, discrimination, or any criminal or unlawful conduct.</li>
                  <li>Violate local laws, public order, or community harmony (including racial and religious harmony obligations).</li>
                  <li>Post pornographic, obscene, or otherwise inappropriate content.</li>
                  <li>Interfere with others' use of the Service, attempt to bypass security, or misuse our APIs and data sources.</li>
                </ul>
                <p className="mt-2">We may moderate, remove, or restrict content or accounts that violate these rules, and may notify relevant authorities where required by law.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4. User content & licenses</h3>
                <p>You retain rights to the content you post (e.g., group posts, edits/suggestions). You grant us a non-exclusive, worldwide, royalty-free license to host and display that content solely to operate and improve the Service. Do not post content you do not have the right to share.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">5. Mosque, halal & events information</h3>
                <p>Venue data and search results come from third-party sources (e.g., Google Places, registries, community suggestions). We do not guarantee accuracy or certification status. Always verify with the venue, certification body, or local authorities.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">6. Prayer reminders & tracker</h3>
                <p>Notifications and schedules are best-effort and may not arrive in all conditions (device settings, connectivity, OS limits). Do not rely on the Service for safety-critical timing. Prayer tracker entries are user-provided and for self-monitoring only.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">7. No religious rulings or professional advice</h3>
                <p>Ouribadah provides general information. For religious rulings (fatwa) or personal circumstances, please consult qualified scholars or your local religious authority.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">8. Third-party services</h3>
                <p>Your use of maps/search and other integrations may be subject to third-party terms and privacy policies (e.g., Google). We are not responsible for third-party sites or services.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">9. Termination</h3>
                <p>We may suspend or terminate access at any time for violations or risk to users, the platform, or public harmony. You may stop using the Service and request data deletion.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">10. Disclaimers & limitation of liability</h3>
                <p>The Service is provided "as is" without warranties of any kind. To the fullest extent permitted by law, we are not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data, profits, or goodwill.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">11. Indemnity</h3>
                <p>You agree to indemnify and hold us harmless from claims arising from your use of the Service or your content, except to the extent caused by our own willful misconduct.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">12. Governing law</h3>
                <p>These Terms are governed by the laws of Singapore (without regard to conflicts of law). Courts in Singapore have exclusive jurisdiction, unless local consumer laws require otherwise.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">13. Changes</h3>
                <p>We may update these Terms; continued use constitutes acceptance.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">14. Contact</h3>
                <p>Questions about these Terms? Email legal@ouribadah.com or info@aljadeedenterprise.com.</p>
              </div>
            </div>

            {/* Community Harmony Section */}
            <section className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-4">Community Harmony & Anti‑Abuse Disclaimer (Ouribadah)</h2>
              <p className="text-sm text-muted-foreground mb-4">Last updated: August 17, 2025</p>
              <p className="mb-2">Ouribadah exists to serve the Muslim community and to foster peaceful coexistence with all communities. We strictly prohibit:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Hate speech, racial or religious insults, or demeaning stereotypes about any group.</li>
                <li>Calls to violence, intimidation, or support for extremist organizations.</li>
                <li>Misuse of religious content to justify abuse or discrimination.</li>
                <li>Misinformation, fabricated claims, or impersonation that could harm individuals or public harmony.</li>
              </ul>
              <p className="mt-2">We may remove content, restrict features, suspend accounts, and cooperate with relevant authorities where necessary to uphold racial and religious harmony and comply with local laws. If you see content that violates these principles, please report it via Contact Us.</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;