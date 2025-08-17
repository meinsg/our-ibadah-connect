import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Contact Us (Ouribadah)
            </CardTitle>
            <p className="text-muted-foreground text-center">
              Last updated: August 17, 2025
            </p>
            <p className="text-center">We're here to help.</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Email</h3>
              <ul className="space-y-2">
                <li><strong>General support:</strong> <a href="mailto:support@ouribadah.com" className="text-primary hover:underline">support@ouribadah.com</a></li>
                <li><strong>Privacy & data requests:</strong> <a href="mailto:privacy@ouribadah.com" className="text-primary hover:underline">privacy@ouribadah.com</a></li>
                <li><strong>Legal & policy:</strong> <a href="mailto:legal@ouribadah.com" className="text-primary hover:underline">legal@ouribadah.com</a></li>
                <li><strong>Abuse reports:</strong> <a href="mailto:abuse@ouribadah.com" className="text-primary hover:underline">abuse@ouribadah.com</a></li>
                <li><strong>Company enquiries:</strong> <a href="mailto:info@aljadeedenterprise.com" className="text-primary hover:underline">info@aljadeedenterprise.com</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Postal address</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-semibold">ALJADEED ENTERPRISE PTE LTD</p>
                <p>BLK 625, ALJUNIED Industrial Estate, Aljunied Road, Singapore 389836</p>
                <p>SG, SG 389836</p>
                <p>Singapore</p>
                <p className="mt-2"><strong>Phone:</strong> 60413928</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Data requests (access/deletion/correction)</h3>
              <p>Email <a href="mailto:privacy@ouribadah.com" className="text-primary hover:underline">privacy@ouribadah.com</a> from the address associated with your account and specify your request. We may ask for additional verification.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Response time</h3>
              <p>We aim to reply within 5–10 business days.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactUs;