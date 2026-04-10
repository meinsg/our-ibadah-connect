import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { LocationProvider } from "@/contexts/LocationContext";
import BottomNav from "@/components/BottomNav";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import Mosques from "@/pages/Mosques";
import HalalFood from "@/pages/HalalFood";
import Finder from "@/pages/Finder";
import IbadahTracker from "@/pages/IbadahTracker";
import KnowledgeHub from "@/pages/KnowledgeHub";
import ContactUs from "@/pages/ContactUs";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/pages/NotFound";

const App = () => (
  <LanguageProvider>
    <LocationProvider>
      <BrowserRouter>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
        <Toaster />
      </BrowserRouter>
    </LocationProvider>
  </LanguageProvider>
);

export default App;
