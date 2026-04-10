import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MapPin, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const FinderPage = () => {
  const { t } = useLanguage();

  return (
    <div className="has-bottom-nav min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("finder.title")}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t("finder.subtitle")}</p>

        <div className="grid gap-4">
          <Link to="/mosques">
            <Card className="p-6 hover:shadow-prayer transition-all group cursor-pointer border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <MapPin className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{t("features.mosqueFinder")}</h2>
                  <p className="text-sm text-muted-foreground">{t("features.mosqueFinderDesc")}</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/halal-food">
            <Card className="p-6 hover:shadow-prayer transition-all group cursor-pointer border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gold/10 text-gold group-hover:scale-110 transition-transform">
                  <UtensilsCrossed className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{t("features.halalFood")}</h2>
                  <p className="text-sm text-muted-foreground">{t("features.halalFoodDesc")}</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FinderPage;
