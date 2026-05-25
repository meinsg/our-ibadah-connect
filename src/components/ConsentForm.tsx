import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ShieldCheck } from "lucide-react";
import {
  CONSENT_CATEGORIES,
  CONSENT_TEXT,
  ConsentState,
  DEFAULT_CONSENT,
} from "@/lib/consent";

interface Props {
  initial?: ConsentState;
  onSubmit: (state: ConsentState, mode: "accept_selected" | "reject_optional") => void | Promise<void>;
  submitting?: boolean;
  showHeading?: boolean;
  compact?: boolean;
}

const ConsentForm: React.FC<Props> = ({
  initial,
  onSubmit,
  submitting,
  showHeading = true,
  compact = false,
}) => {
  const [state, setState] = useState<ConsentState>(initial ?? DEFAULT_CONSENT);

  const toggle = (key: keyof ConsentState, val: boolean) => {
    if (key === "account_service") return;
    setState((s) => ({ ...s, [key]: val }));
  };

  const handleRejectOptional = () => {
    const next: ConsentState = { ...DEFAULT_CONSENT, account_service: true };
    setState(next);
    onSubmit(next, "reject_optional");
  };

  return (
    <div className="space-y-4">
      {showHeading && (
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Your privacy choices</h3>
            <p className="text-sm text-muted-foreground mt-1">{CONSENT_TEXT}</p>
            <Link to="/privacy" className="text-xs text-primary underline mt-2 inline-block">
              Read our Privacy Policy
            </Link>
          </div>
        </div>
      )}

      <div className={compact ? "space-y-2" : "space-y-3"}>
        {CONSENT_CATEGORIES.map((c) => (
          <Card key={c.key} className="p-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={state[c.key]}
                disabled={c.required}
                onCheckedChange={(v) => toggle(c.key, !!v)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{c.title}</span>
                  {c.required && (
                    <span className="text-[10px] uppercase tracking-wide bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
              </div>
            </label>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <Button type="button" onClick={() => onSubmit(state, "accept_selected")} disabled={submitting} className="flex-1">
          {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Accept selected
        </Button>
        <Button type="button" variant="outline" onClick={handleRejectOptional} disabled={submitting} className="flex-1">
          Reject optional
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground text-center">
        You can change or withdraw your choices anytime in Settings → Privacy Preferences.
      </p>
    </div>
  );
};

export default ConsentForm;