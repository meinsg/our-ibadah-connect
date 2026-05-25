import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShieldCheck, History } from "lucide-react";
import { useConsent } from "@/hooks/useConsent";
import ConsentForm from "@/components/ConsentForm";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ConsentState } from "@/lib/consent";
import { useToast } from "@/hooks/use-toast";

interface HistoryRow {
  id: string;
  category: string;
  status: string;
  consent_version: string;
  source: string;
  created_at: string;
}

const PrivacyPreferences = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, save, withdrawAll } = useConsent();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<HistoryRow[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("consent_records")
      .select("id, category, status, consent_version, source, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => setHistory((data ?? []) as HistoryRow[]));
  }, [user, state]);

  const handleSave = async (next: ConsentState) => {
    setSubmitting(true);
    await save(next, "settings");
    setSubmitting(false);
    toast({ title: "Preferences saved", description: "Your choices have been recorded." });
  };

  const handleWithdraw = async () => {
    setSubmitting(true);
    await withdrawAll();
    setSubmitting(false);
    toast({ title: "Optional consents withdrawn" });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2 mb-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Privacy preferences
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Control how your data is used. You can withdraw any optional consent at any time.
          </p>
        </div>

        <Card className="p-4 sm:p-5">
          <ConsentForm initial={state} onSubmit={handleSave} submitting={submitting} showHeading={false} />
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={handleWithdraw} disabled={submitting}>
              Withdraw all optional consents
            </Button>
          </div>
        </Card>

        {user && (
          <Card className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <History className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold">Your consent history</h2>
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No records yet.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-xs border-b border-border/50 pb-2 last:border-0">
                    <div>
                      <div className="font-medium text-sm capitalize">{h.category.replace("_", " ")}</div>
                      <div className="text-muted-foreground">
                        {new Date(h.created_at).toLocaleString()} · v{h.consent_version} · {h.source}
                      </div>
                    </div>
                    <Badge variant={h.status === "granted" ? "default" : "outline"}>{h.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default PrivacyPreferences;