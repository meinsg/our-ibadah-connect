import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Home, CheckSquare, MapPin, BookOpen, LogOut, LogIn } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { path: "/", icon: Home, labelKey: "nav.home" },
  { path: "/tracker", icon: CheckSquare, labelKey: "nav.tracker" },
  { path: "/finder", icon: MapPin, labelKey: "nav.finder" },
  { path: "/knowledge", icon: BookOpen, labelKey: "nav.knowledge" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  // Map /mosques and /halal-food to /finder
  const currentPath = ["/mosques", "/halal-food"].includes(location.pathname)
    ? "/finder"
    : location.pathname;

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all touch-manipulation ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${isActive ? "bg-primary/10" : ""}`}>
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium leading-none">
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
        <button
          onClick={handleAuthAction}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all touch-manipulation text-muted-foreground hover:text-foreground"
        >
          <div className="p-1.5 rounded-xl transition-colors">
            {user ? <LogOut className="h-5 w-5" strokeWidth={2} /> : <LogIn className="h-5 w-5" strokeWidth={2} />}
          </div>
          <span className="text-[10px] font-medium leading-none">
            {user ? t("nav.logout") || "Logout" : t("nav.login") || "Login"}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
