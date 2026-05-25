import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation2, LocateFixed, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import PrayerTimes from "@/components/PrayerTimes";
import QiblahCompass from "@/components/QiblahCompass";
import LanguageToggle from "@/components/LanguageToggle";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSharedLocation } from "@/contexts/LocationContext";
import logoIcon from "@/assets/logo-icon.png";

const Index = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { location, loading: locationLoading, setManualLocation, switchToAutoLocation } = useSharedLocation();
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleGoPremium = async () => {
    if (!user) {
      navigate("/auth?redirect=/");
      return;
    }
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          success_url: `${window.location.origin}/?payment=success`,
          cancel_url: `${window.location.origin}/?payment=cancelled`,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast({
        title: "Checkout failed",
        description: err.message || "Could not start checkout. Please try again.",
        variant: "destructive",
      });
      setCheckoutLoading(false);
    }
  };

  const locationText = locationLoading
    ? t("prayer.gettingLocation")
    : location
      ? `${location.city || ""}${location.city && location.country ? ", " : ""}${location.country || ""}`
      : t("prayer.locationUnavailable");

  const handleLocationSelect = (lat: number, lon: number, city?: string, country?: string) => {
    // Use setManualLocation with a formatted address string
    const address = [city, country].filter(Boolean).join(", ");
    if (address) {
      setManualLocation(address);
    }
    setShowLocationSearch(false);
  };

  const handleUseGPS = () => {
    switchToAutoLocation();
    setShowLocationSearch(false);
  };

  return (
    <div className="has-bottom-nav min-h-screen bg-background">
      {/* Compact Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border safe-area-top">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img src={logoIcon} alt="OurIbadah" width={32} height={32} className="w-8 h-8 shrink-0" loading="eager" decoding="async" />
              <span className="text-base sm:text-lg font-bold text-primary truncate">{t("app.name")}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowLocationSearch(!showLocationSearch)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors"
              >
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[90px] sm:max-w-[160px]">
                  {locationLoading ? "..." : locationText || t("prayer.locationUnavailable")}
                </span>
              </button>
              <LanguageToggle />
            </div>
          </div>

          {/* Location search dropdown */}
          {showLocationSearch && (
            <div className="mt-3 pb-1 space-y-2">
              <LocationAutocomplete
                onSelect={handleLocationSelect}
                placeholder={t("prayer.gettingLocation") === locationText ? "Search your city..." : "Change location..."}
                className="w-full"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleUseGPS}
                disabled={locationLoading}
                className="w-full text-xs gap-1.5"
              >
                <LocateFixed className="h-3.5 w-3.5" />
                Use GPS Location
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-5">
        {/* Greeting */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-foreground mb-1">
            {t("home.greeting")} 👋
          </h1>
          <p className="text-sm text-muted-foreground">{t("home.subtitle")}</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <PrayerTimes />
          <QiblahCompass />
        </div>

        {/* Go Premium CTA */}
        <Card className="mb-6 p-5 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Go Premium</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Unlock all features and support OurIbadah
                </p>
              </div>
            </div>
            <Button
              onClick={handleGoPremium}
              disabled={checkoutLoading}
              className="w-full sm:w-auto gap-2"
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Upgrade Now
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Quick Access Cards */}
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          {t("home.quickAccess")}
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link to="/tracker">
            <Card className="p-4 border-border hover:shadow-prayer transition-all cursor-pointer group">
              <div className="text-2xl mb-2">📿</div>
              <h3 className="text-sm font-semibold text-foreground">{t("nav.tracker")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("home.trackerHint")}</p>
            </Card>
          </Link>
          <Link to="/finder">
            <Card className="p-4 border-border hover:shadow-prayer transition-all cursor-pointer group">
              <div className="text-2xl mb-2">🕌</div>
              <h3 className="text-sm font-semibold text-foreground">{t("nav.finder")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("home.finderHint")}</p>
            </Card>
          </Link>
          <Link to="/knowledge">
            <Card className="p-4 border-border hover:shadow-prayer transition-all cursor-pointer group">
              <div className="text-2xl mb-2">📖</div>
              <h3 className="text-sm font-semibold text-foreground">{t("nav.knowledge")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("home.knowledgeHint")}</p>
            </Card>
          </Link>
          <Link to="/halal-food">
            <Card className="p-4 border-border hover:shadow-prayer transition-all cursor-pointer group">
              <div className="text-2xl mb-2">🍽️</div>
              <h3 className="text-sm font-semibold text-foreground">{t("features.halalFood")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("home.halalHint")}</p>
            </Card>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src={logoIcon} alt="" width={20} height={20} className="w-5 h-5" loading="lazy" decoding="async" />
            <span className="text-sm font-semibold text-primary">{t("app.name")}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">{t("footer.tagline")}</p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">{t("footer.privacy")}</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">{t("footer.terms")}</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">{t("footer.contact")}</Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
