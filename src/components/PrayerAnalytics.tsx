import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, BarChart3, RefreshCw, Users, AlertCircle } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  days: number;
  series: Array<{
    date: string;
    counts: { on_time: number; delayed: number; qada: number };
  }>;
  overall: {
    total: number;
    on_time: number;
    delayed: number;
    qada: number;
    avgDelayMin: number;
    location: { home: number; masjid: number };
  };
  perPrayerSummary: Record<string, { on_time: number; delayed: number; qada: number }>;
  type: 'personal' | 'aggregate';
}

interface AggregateData {
  k?: number;
  note?: string;
  on_time?: number;
  delayed?: number;
  qada?: number;
  avgDelayMin?: number;
  perPrayer?: Record<string, { on_time: number; delayed: number; qada: number }>;
  type: 'aggregate';
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--destructive))'];

const PrayerAnalytics = () => {
  const { user } = useAuth();
  const { location } = useLocation();
  const { toast } = useToast();
  const [days, setDays] = useState(30);
  const [personalData, setPersonalData] = useState<AnalyticsData | null>(null);
  const [aggregateData, setAggregateData] = useState<AggregateData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async () => {
    setLoading(true);
    
    try {
      // Load personal analytics if user is authenticated
      if (user) {
        const { data, error } = await supabase.functions.invoke('prayer-analytics', {
          body: { days, type: 'personal' }
        });

        if (error) throw error;
        setPersonalData(data);
      }

      // Load aggregate analytics if location is available
      if (location) {
        const { data, error } = await supabase.functions.invoke('prayer-analytics', {
          body: { 
            days: Math.min(days, 90), // Limit aggregate to 90 days
            type: 'aggregate',
            latitude: location.latitude,
            longitude: location.longitude
          }
        });

        if (error) throw error;
        setAggregateData(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast({
        title: "Analytics Error",
        description: "Failed to load prayer analytics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [days, user, location]);

  const chartData = personalData?.series.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    onTime: Math.round((item.counts.on_time / (item.counts.on_time + item.counts.delayed + item.counts.qada)) * 100) || 0,
    total: item.counts.on_time + item.counts.delayed + item.counts.qada
  })) || [];

  const prayerBreakdown = personalData ? Object.entries(personalData.perPrayerSummary).map(([prayer, stats]) => ({
    prayer: prayer.charAt(0).toUpperCase() + prayer.slice(1),
    onTime: stats.on_time,
    delayed: stats.delayed,
    qada: stats.qada
  })) : [];

  const overallPieData = personalData ? [
    { name: 'On Time', value: personalData.overall.on_time, color: COLORS[0] },
    { name: 'Delayed', value: personalData.overall.delayed, color: COLORS[1] },
    { name: 'Qada', value: personalData.overall.qada, color: COLORS[2] }
  ].filter(item => item.value > 0) : [];

  const aggregatePieData = aggregateData && aggregateData.k && aggregateData.k >= 20 ? [
    { name: 'On Time', value: aggregateData.on_time || 0, color: COLORS[0] },
    { name: 'Delayed', value: aggregateData.delayed || 0, color: COLORS[1] },
    { name: 'Qada', value: aggregateData.qada || 0, color: COLORS[2] }
  ].filter(item => item.value > 0) : [];

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6 bg-card border-accent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Prayer Analytics</h2>
            <Badge variant="secondary">Private</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={days.toString()} onValueChange={(value) => setDays(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={loadAnalytics}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {!user && (
          <div className="mb-4 p-3 bg-gold/10 border border-gold/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gold-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Sign in to view your personal prayer analytics and trends.</span>
            </div>
          </div>
        )}

        {/* Personal Analytics */}
        {user && personalData && (
          <div className="space-y-6">
            {/* On-time Percentage Trend */}
            <div>
              <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                On-time Performance Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'On-time %']} />
                    <Line 
                      type="monotone" 
                      dataKey="onTime" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Prayer Breakdown */}
            <div>
              <h3 className="text-base font-medium mb-3">Prayer Performance by Type</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prayerBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="prayer" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="onTime" stackId="a" fill={COLORS[0]} name="On Time" />
                    <Bar dataKey="delayed" stackId="a" fill={COLORS[1]} name="Delayed" />
                    <Bar dataKey="qada" stackId="a" fill={COLORS[2]} name="Qada" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Overall Statistics */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-base font-medium mb-3">Overall Distribution</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overallPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {overallPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium mb-3">Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Prayers:</span>
                    <span className="font-medium">{personalData.overall.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>On-time Rate:</span>
                    <span className="font-medium text-primary">
                      {personalData.overall.total > 0 
                        ? Math.round((personalData.overall.on_time / personalData.overall.total) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Delay:</span>
                    <span className="font-medium">{personalData.overall.avgDelayMin} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Home vs Masjid:</span>
                    <span className="font-medium">
                      {personalData.overall.location.home} / {personalData.overall.location.masjid}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Local Area Aggregate */}
      <Card className="p-4 sm:p-6 bg-card border-accent">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Local Area Aggregate</h3>
          <Badge variant="outline">Anonymous</Badge>
        </div>

        {!location && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Location access needed to show local community statistics.
            </p>
          </div>
        )}

        {location && aggregateData && (
          <>
            {aggregateData.note ? (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{aggregateData.note}</p>
                {aggregateData.k && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current sample size: {aggregateData.k} (need ≥20 for privacy)
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Anonymous statistics from your local area. Sample size: {aggregateData.k}
                </p>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-base font-medium mb-3">Community Distribution</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={aggregatePieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {aggregatePieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-medium mb-3">Community Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sample Size:</span>
                        <span className="font-medium">{aggregateData.k}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>On-time Rate:</span>
                        <span className="font-medium text-primary">
                          {aggregateData.k && aggregateData.k > 0
                            ? Math.round(((aggregateData.on_time || 0) / aggregateData.k) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Delay:</span>
                        <span className="font-medium">{aggregateData.avgDelayMin || 0} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default PrayerAnalytics;