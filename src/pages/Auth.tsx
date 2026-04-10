import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

type AuthView = "login" | "register" | "forgot" | "magic";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const Auth = () => {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) navigate("/");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) navigate("/");
      }
    );
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: fullName },
        },
      });
      if (error) {
        toast({
          title: error.message.includes("already registered") ? "Account exists" : "Sign up failed",
          description: error.message.includes("already registered")
            ? "This email is already registered. Please sign in instead."
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Welcome to Ouribadah!", description: "Please check your email to confirm your account." });
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        let description = error.message;
        if (error.message.includes("Invalid login credentials")) description = "Invalid email or password.";
        else if (error.message.includes("Email not confirmed")) description = "Please confirm your email first.";
        toast({ title: "Sign in failed", description, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (error) {
        toast({ title: "Google sign-in failed", description: error.message, variant: "destructive" });
        setGoogleLoading(false);
      }
    } catch {
      toast({ title: "Error", description: "Could not connect to Google.", variant: "destructive" });
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast({ title: "Reset failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Email sent!", description: "Check your inbox for a password reset link." });
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) {
        toast({ title: "Failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Magic link sent!", description: "Check your inbox for a secure login link." });
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
    setLoading(false);
  };

  if (user) return null;

  const renderLoginView = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-inter">Welcome Back</h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-2 font-inter">Sign in to continue your spiritual journey</p>
      </div>

      <Button
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        variant="outline"
        className="w-full h-11 sm:h-12 font-inter text-sm sm:text-base gap-3 touch-manipulation"
      >
        {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-inter">or continue with email</span>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-inter text-sm">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 text-sm sm:text-base h-11 sm:h-12 touch-manipulation" required />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-inter text-sm">Password</Label>
            <button type="button" onClick={() => setView("forgot")} className="text-primary hover:text-primary/80 text-xs font-inter underline touch-manipulation">
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 text-sm sm:text-base h-11 sm:h-12 touch-manipulation" required />
          </div>
        </div>
      </div>

      <Button onClick={handleSignIn} disabled={loading || !email || !password} className="w-full font-inter text-sm sm:text-base h-11 sm:h-12 touch-manipulation" size="lg">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>

      <div className="text-center space-y-2">
        <button type="button" onClick={() => setView("magic")} className="text-primary hover:text-primary/80 text-xs sm:text-sm font-inter underline touch-manipulation block mx-auto">
          Sign in with Magic Link
        </button>
        <button type="button" onClick={() => setView("register")} className="text-primary hover:text-primary/80 text-xs sm:text-sm font-inter underline touch-manipulation block mx-auto">
          Need an account? Sign up
        </button>
      </div>

      <div className="text-center">
        <Link to="/" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm font-inter touch-manipulation">
          Continue as Guest
        </Link>
      </div>
    </div>
  );

  const renderRegisterView = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-inter">Join Our Community</h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-2 font-inter">Create your account to get started</p>
      </div>

      <Button onClick={handleGoogleSignIn} disabled={googleLoading} variant="outline" className="w-full h-11 sm:h-12 font-inter text-sm sm:text-base gap-3 touch-manipulation">
        {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-inter">or register with email</span>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="font-inter text-sm">Full Name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="fullName" type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10 text-sm sm:text-base h-11 sm:h-12 touch-manipulation" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="regEmail" className="font-inter text-sm">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="regEmail" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 text-sm sm:text-base h-11 sm:h-12 touch-manipulation" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="regPassword" className="font-inter text-sm">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="regPassword" type="password" placeholder="Create a password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 text-sm sm:text-base h-11 sm:h-12 touch-manipulation" required />
          </div>
        </div>
      </div>

      <Button onClick={handleSignUp} disabled={loading || !email || !password || !fullName} className="w-full font-inter text-sm sm:text-base h-11 sm:h-12 touch-manipulation" size="lg">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>

      <div className="text-center">
        <button type="button" onClick={() => setView("login")} className="text-primary hover:text-primary/80 text-xs sm:text-sm font-inter underline touch-manipulation">
          Already have an account? Sign in
        </button>
      </div>

      <div className="text-center">
        <Link to="/" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm font-inter touch-manipulation">
          Continue as Guest
        </Link>
      </div>
    </div>
  );

  const renderForgotView = () => (
    <div className="space-y-4 sm:space-y-6">
      <button type="button" onClick={() => setView("login")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-inter touch-manipulation">
        <ArrowLeft className="h-4 w-4" /> Back to Sign In
      </button>

      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-inter">Reset Password</h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-2 font-inter">Enter your email to receive a reset link</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resetEmail" className="font-inter text-sm">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="resetEmail" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 text-sm sm:text-base h-11 sm:h-12 touch-manipulation" required />
        </div>
      </div>

      <Button onClick={handleForgotPassword} disabled={loading || !email} className="w-full font-inter text-sm sm:text-base h-11 sm:h-12 touch-manipulation" size="lg">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send Reset Link
      </Button>

      <div className="text-center">
        <button type="button" onClick={() => setView("magic")} className="text-primary hover:text-primary/80 text-xs sm:text-sm font-inter underline touch-manipulation">
          Or sign in with a Magic Link instead
        </button>
      </div>
    </div>
  );

  const renderMagicLinkView = () => (
    <div className="space-y-4 sm:space-y-6">
      <button type="button" onClick={() => setView("login")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-inter touch-manipulation">
        <ArrowLeft className="h-4 w-4" /> Back to Sign In
      </button>

      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-inter">Magic Link Sign In</h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-2 font-inter">We'll send a secure login link to your email — no password needed</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="magicEmail" className="font-inter text-sm">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="magicEmail" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 text-sm sm:text-base h-11 sm:h-12 touch-manipulation" required />
        </div>
      </div>

      <Button onClick={handleMagicLink} disabled={loading || !email} className="w-full font-inter text-sm sm:text-base h-11 sm:h-12 touch-manipulation" size="lg">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send Magic Link
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center p-3 sm:p-4 safe-area-top safe-area-bottom">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <img src={logoIcon} alt="Ouribadah" className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary font-amiri">Ouribadah</h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-inter">Our Worship</p>
        </div>

        <Card className="p-4 sm:p-6 shadow-prayer bg-spiritual border-accent">
          {view === "login" && renderLoginView()}
          {view === "register" && renderRegisterView()}
          {view === "forgot" && renderForgotView()}
          {view === "magic" && renderMagicLinkView()}
        </Card>
      </div>
    </div>
  );
};

export default Auth;
