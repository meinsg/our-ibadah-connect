import PrayerAnalytics from "@/components/PrayerAnalytics";

const PrayerAnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-spiritual via-background to-spiritual-light">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Prayer Analytics
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gain insights into your prayer patterns and see how your community is performing.
            </p>
          </div>
          
          <PrayerAnalytics />
        </div>
      </div>
    </div>
  );
};

export default PrayerAnalyticsPage;