import React, { Suspense, lazy } from "react";
import InstallPrompt from "@/components/InstallPrompt";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { AuthProvider } from "@/hooks/useAuth";
import { ConsentProvider } from "@/hooks/useConsent";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import BottomNav from "@/components/BottomNav";
import Index from "@/pages/Index";
const Auth = lazy(() => import("@/pages/Auth"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Mosques = lazy(() => import("@/pages/Mosques"));
const HalalFood = lazy(() => import("@/pages/HalalFood"));
const Finder = lazy(() => import("@/pages/Finder"));
const IbadahTracker = lazy(() => import("@/pages/IbadahTracker"));
const KnowledgeHub = lazy(() => import("@/pages/KnowledgeHub"));
const ContactUs = lazy(() => import("@/pages/ContactUs"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Admin = lazy(() => import("@/pages/Admin"));
const PrivacyPreferences = lazy(() => import("@/pages/PrivacyPreferences"));

const RouteFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-sm text-muted-foreground">
    Loading…
  </div>
);

const App = () => (
  <LanguageProvider>
    <LocationProvider>
      <AuthProvider>
      <ConsentProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/finder" element={<Finder />} />
          <Route path="/mosques" element={<Mosques />} />
          <Route path="/halal-food" element={<HalalFood />} />
          <Route path="/tracker" element={<IbadahTracker />} />
          <Route path="/knowledge" element={<KnowledgeHub />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy-preferences" element={<PrivacyPreferences />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <BottomNav />
        <InstallPrompt />
        <CookieConsentBanner />
        <Toaster />
      </BrowserRouter>
      </ConsentProvider>
      </AuthProvider>
    </LocationProvider>
  </LanguageProvider>
);

export default App;
