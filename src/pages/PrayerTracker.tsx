import PrayerTracker from "@/components/PrayerTracker";

const PrayerTrackerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-spiritual via-background to-spiritual-light">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Prayer Tracker
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your daily prayers privately and build consistent habits in your spiritual journey.
            </p>
          </div>
          
          <PrayerTracker />
        </div>
      </div>
    </div>
  );
};

export default PrayerTrackerPage;