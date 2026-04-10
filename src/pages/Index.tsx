import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation2 } from "lucide-react";
import PrayerTimes from "@/components/PrayerTimes";
import QiblahCompass from "@/components/QiblahCompass";
import LanguageToggle from "@/components/LanguageToggle";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSharedLocation } from "@/contexts/LocationContext";
import logoIcon from "@/assets/logo-icon.png";

const Index = () => {
  const { t } = useLanguage();
  const { location, loading: locationLoading } = useSharedLocation();

  const locationText = locationLoading
    ? t("prayer.gettingLocation")
    : location
      ? `${location.city || ""}${location.city && location.country ? ", " : ""}${location.country || ""}`
      : t("prayer.locationUnavailable");

  return (
    <div className="has-bottom-nav min-h-screen bg-background">
      {/* Compact Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border safe-area-top">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src={logoIcon} alt="OurIbadah" className="w-8 h-8" />
              <span className="text-lg font-bold text-primary">{t("app.name")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[140px]">{locationText}</span>
              </div>
              <LanguageToggle />
            </div>
          </div>
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
          {/* Prayer Times - full width on mobile */}
          <PrayerTimes />

          {/* Qibla */}
          <QiblahCompass />
        </div>

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
            <img src={logoIcon} alt="" className="w-5 h-5" />
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
