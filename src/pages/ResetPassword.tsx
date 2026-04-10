import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, CheckCircle } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setHasSession(true);
          setChecking(false);
        }
      }
    );

    // Also check if we already have a session (user clicked the link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true);
      }
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords are the same.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast({ title: "Reset failed", description: error.message, variant: "destructive" });
      } else {
        setSuccess(true);
        toast({ title: "Password updated!", description: "You can now sign in with your new password." });
        // Sign out so they can log in fresh
        await supabase.auth.signOut();
        setTimeout(() => navigate("/auth"), 2500);
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center p-3 sm:p-4">
        <Card className="p-6 max-w-md w-full text-center shadow-prayer bg-spiritual border-accent">
          <h2 className="text-xl font-semibold text-foreground font-inter mb-2">Invalid or Expired Link</h2>
          <p className="text-muted-foreground text-sm font-inter mb-4">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Button onClick={() => navigate("/auth")} className="font-inter">
            Back to Sign In
          </Button>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center p-3 sm:p-4">
        <Card className="p-6 max-w-md w-full text-center shadow-prayer bg-spiritual border-accent">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground font-inter mb-2">Password Reset Successfully!</h2>
          <p className="text-muted-foreground text-sm font-inter">Redirecting you to sign in…</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center p-3 sm:p-4 safe-area-top safe-area-bottom">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <img src={logoIcon} alt="Ouribadah" className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary font-amiri">Ouribadah</h1>
        </div>

        <Card className="p-4 sm:p-6 shadow-prayer bg-spiritual border-accent">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-inter">Set New Password</h2>
              <p className="text-muted-foreground text-xs sm:text-sm mt-2 font-inter">Choose a strong password for your account</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="font-inter text-sm">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="newPassword" type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-10 text-sm sm:text-base h-11 sm:h-12 touch-manipulation" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-inter text-sm">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 text-sm sm:text-base h-11 sm:h-12 touch-manipulation" required />
                </div>
              </div>
            </div>

            <Button onClick={handleReset} disabled={loading || !newPassword || !confirmPassword} className="w-full font-inter text-sm sm:text-base h-11 sm:h-12 touch-manipulation" size="lg">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
