import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PrayerTimes from "@/components/PrayerTimes";
import QiblaDirection from "@/components/QiblaDirection";
import FeaturesGrid from "@/components/FeaturesGrid";
import { Compass, Clock, MapPin, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
import ShareButtons from "@/components/ShareButtons";
import SocialFollow from "@/components/SocialFollow";
import logoIcon from "@/assets/logo-icon.png";
import backgroundPattern from "@/assets/islamic-pattern-bg.jpg";

const Index = () => {
  // const { user, signOut } = useAuth();
  const user = null;
  const signOut = async () => {};

  return (
    <div className="min-h-screen bg-gradient-peaceful">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundPattern})` }}
      />
      
      {/* Header */}
      <header className="relative z-10 bg-background/80 backdrop-blur-sm border-b border-accent safe-area-top">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src={logoIcon} alt="Ouribadah" className="w-8 h-8 sm:w-10 sm:h-10" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary font-amiri">Ouribadah</h1>
                <p className="text-xs text-muted-foreground font-inter hidden sm:block">Our Worship</p>
              </div>
            </div>
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground font-inter hidden sm:inline">
                  Welcome back!
                </span>
                <Button variant="secondary" size="sm" onClick={signOut} className="font-inter text-xs sm:text-sm px-2 sm:px-3">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link to="/auth">
                  <Button variant="secondary" size="sm" className="font-inter text-xs sm:text-sm px-2 sm:px-3">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 font-amiri leading-tight">
              Connecting Worship, Community, and Daily Life
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 font-inter px-2">
              Your comprehensive Islamic companion for prayer times, Qibla direction, 
              mosque finder, and community connection.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
              <Button size="lg" className="font-inter shadow-soft text-sm sm:text-base">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                View Prayer Times
              </Button>
              <Button variant="secondary" size="lg" className="font-inter shadow-soft text-sm sm:text-base">
                <Compass className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Find Qibla
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-1 font-inter">100K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-inter">Muslims</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-1 font-inter">50K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-inter">Mosques</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-1 font-inter">95%</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-inter">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="relative z-10 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-2 font-amiri">Share Ouribadah</h3>
            <p className="text-sm text-muted-foreground font-inter">Help others discover our Islamic community</p>
          </div>
          <div className="flex justify-center">
            <ShareButtons />
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="relative z-10 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            <div>
              <PrayerTimes />
            </div>
            <div>
              <QiblaDirection />
            </div>
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4 font-amiri">
              Explore More Features
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground font-inter px-4">
              Discover halal food, Islamic events, and connect with your local Muslim community
            </p>
          </div>

          <FeaturesGrid />
        </div>
      </section>

      {/* Social Follow Section */}
      <section className="relative z-10 py-8 bg-spiritual/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-2 font-amiri">Follow Us</h3>
            <p className="text-sm text-muted-foreground font-inter">Stay connected with the Ouribadah community</p>
          </div>
          <SocialFollow />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-primary/5 border-t border-accent safe-area-bottom">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <img src={logoIcon} alt="Ouribadah" className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-lg sm:text-xl font-bold text-primary font-amiri">Ouribadah</span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm font-inter mb-3 sm:mb-4 px-4">
              Strengthening the Muslim community through technology
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground font-inter">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Contact Us</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
