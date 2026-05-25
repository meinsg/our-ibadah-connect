import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useConsent } from "@/hooks/useConsent";
import ConsentForm from "./ConsentForm";
import { CONSENT_TEXT, ConsentState, DEFAULT_CONSENT } from "@/lib/consent";
import { Cookie } from "lucide-react";

const CookieConsentBanner = () => {
  const { hasDecided, loading, save, managerOpen, closeManager, state, strictMode, region } = useConsent();
  const [manageOpen, setManageOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const showBanner = !loading && !hasDecided;
  const showDialog = manageOpen || managerOpen;

  const acceptAll = async () => {
    setSubmitting(true);
    const next: ConsentState = {
      account_service: true,
      analytics: true,
      marketing: true,
      personalization: true,
      cookies: true,
    };
    await save(next, "banner");
    setSubmitting(false);
  };

  const rejectOptional = async () => {
    setSubmitting(true);
    await save({ ...DEFAULT_CONSENT, account_service: true }, "banner");
    setSubmitting(false);
  };

  const handleManagedSave = async (next: ConsentState) => {
    setSubmitting(true);
    await save(next, "banner");
    setSubmitting(false);
    setManageOpen(false);
    closeManager();
  };

  return (
    <>
      {showBanner && (
        <div role="dialog" aria-label="Privacy and cookie consent" className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4 pointer-events-none">
          <div className="max-w-3xl mx-auto bg-card border border-border shadow-2xl rounded-2xl p-4 sm:p-5 pointer-events-auto">
            <div className="flex items-start gap-3">
              <Cookie className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base">
                  Your privacy matters
                  {strictMode && (
                    <span className="ml-2 text-[10px] uppercase tracking-wide bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      EU / EEA / UK
                    </span>
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {CONSENT_TEXT}{" "}
                  <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>
                </p>
                {strictMode ? (
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Button size="sm" onClick={acceptAll} disabled={submitting}>Accept all</Button>
                    <Button size="sm" variant="outline" onClick={rejectOptional} disabled={submitting}>Reject optional</Button>
                    <Button size="sm" variant="ghost" onClick={() => setManageOpen(true)} disabled={submitting}>Manage choices</Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Button size="sm" onClick={acceptAll} disabled={submitting}>OK, got it</Button>
                    <Button size="sm" variant="ghost" onClick={() => setManageOpen(true)} disabled={submitting}>Manage choices</Button>
                  </div>
                )}
                {!strictMode && (
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Region: {region.toLowerCase()}. You can adjust every optional consent anytime in Settings.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={(o) => { if (!o) { setManageOpen(false); closeManager(); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage privacy preferences</DialogTitle>
          </DialogHeader>
          <ConsentForm initial={state} onSubmit={handleManagedSave} submitting={submitting} showHeading={false} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsentBanner;