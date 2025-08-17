import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PrayerTimes from "@/components/PrayerTimes";
import QiblaDirection from "@/components/QiblaDirection";
import FeaturesGrid from "@/components/FeaturesGrid";
import { Compass, Clock, MapPin, Star } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";
import backgroundPattern from "@/assets/islamic-pattern-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-peaceful">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundPattern})` }}
      />
      
      {/* Header */}
      <header className="relative z-10 bg-background/80 backdrop-blur-sm border-b border-accent">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoIcon} alt="Ouribadah" className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold text-primary font-amiri">Ouribadah</h1>
                <p className="text-xs text-muted-foreground font-inter">Our Worship</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="font-inter">
              <MapPin className="h-4 w-4 mr-2" />
              Connect Location
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-amiri">
              Connecting Worship, Community, and Daily Life
            </h2>
            <p className="text-lg text-muted-foreground mb-8 font-inter">
              Your comprehensive Islamic companion for prayer times, Qibla direction, 
              mosque finder, and community connection.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button size="lg" className="font-inter shadow-soft">
                <Clock className="h-5 w-5 mr-2" />
                View Prayer Times
              </Button>
              <Button variant="secondary" size="lg" className="font-inter shadow-soft">
                <Compass className="h-5 w-5 mr-2" />
                Find Qibla
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1 font-inter">100K+</div>
                <div className="text-sm text-muted-foreground font-inter">Muslims Connected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1 font-inter">50K+</div>
                <div className="text-sm text-muted-foreground font-inter">Mosques Listed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1 font-inter">95%</div>
                <div className="text-sm text-muted-foreground font-inter">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div>
              <PrayerTimes />
            </div>
            <div>
              <QiblaDirection />
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-4 font-amiri">
              Explore More Features
            </h3>
            <p className="text-muted-foreground font-inter">
              Discover halal food, Islamic events, and connect with your local Muslim community
            </p>
          </div>

          <FeaturesGrid />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-primary/5 border-t border-accent mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src={logoIcon} alt="Ouribadah" className="w-8 h-8" />
              <span className="text-xl font-bold text-primary font-amiri">Ouribadah</span>
            </div>
            <p className="text-muted-foreground text-sm font-inter mb-4">
              Strengthening the Muslim community through technology
            </p>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground font-inter">
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
