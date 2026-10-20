import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ArrowRight, KeyRound, Lock, Mail, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signInWithEmail, signInWithGoogle } from "../firebase";

export default function SignInPage() {
  const { setGoogleAccessToken, signInAsDemo, signInAsGuest } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to(containerRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      })
        .from(
          leftSideRef.current?.children || [],
          { y: 30, opacity: 0, stagger: 0.15, duration: 1.2, ease: "expo.out" },
          "-=0.4",
        )
        .from(
          rightSideRef.current,
          { x: 40, opacity: 0, duration: 1.2, ease: "expo.out" },
          "-=1",
        );
    });
    return () => ctx.revert();
  }, []);

  const animateOut = (destination: string) => {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => navigate(destination),
    });
  };

  const handleSecretKeySignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
      animateOut("/onboarding");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { accessToken } = await signInWithGoogle();
      if (accessToken) setGoogleAccessToken(accessToken);
      animateOut("/onboarding");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in with Google.");
      setGoogleLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    signInAsDemo();
    animateOut("/dashboard");
  };

  const handleGuestSignIn = () => {
    signInAsGuest();
    animateOut("/dashboard");
  };

  return (
    <div
      ref={containerRef}
      className="h-screen bg-surface flex opacity-0 overflow-hidden"
    >
      {/* ── Left Panel ── */}
      <div
        ref={leftSideRef}
        className="hidden lg:flex lg:w-[48%]  flex-col justify-between p-10 pl-20 relative overflow-hidden"
      >
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="NEEV Home"
        >
          <img
            src="/maskable_icon.png"
            className="w-7 h-7 rounded-lg"
            alt="Neev logo"
          />
          <span className="text-xl font-semibold font-serif italic text-primary tracking-widest leading-none">
            Neev
          </span>
        </Link>

        {/* Center: Heading + Image */}
        <div className="relative z-10 space-y-4 flex-1 flex flex-col justify-center">
          <div>
            <h1 className="font-serif text-[clamp(2.2rem,3.5vw,3.2rem)] leading-[1.08] text-on-primary-container letter-tight">
              Welcome back to
              <br />
              <span className="italic text-primary-dim">the Sanctuary</span>
            </h1>
            <p className="mt-3 font-sans text-sm text-on-primary-container/70 max-w-xs leading-relaxed">
              Your family's rhythm is waiting. Continue your legacy with
              AI-guided wisdom.
            </p>
          </div>

          <div className="w-full max-w-[600px] rounded-3xl overflow-hidden shadow-md tilted-img">
            <img
              src="/images/neev_signin_family_1774253718340.png"
              alt="Indian father with family"
              className="w-full h-full object-cover aspect-4/3"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="z-10 border border-outline bg-surface/95 rounded-full px-6 py-3 w-fit absolute bottom-20 -left-5 ">
            <p className="text-on-surface-variant font-serif italic text-md">
              "Wisdom is the bridge between generations."
            </p>
          </div>
        </div>

        {/* Quote card */}
      </div>

      {/* ── Right Panel: Form ── */}
      <div
        ref={rightSideRef}
        className="flex-1 flex items-center justify-center px-6 py-8 md:px-16"
      >
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile brand */}
          <div className="lg:hidden">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="NEEV Home"
            >
              <img
                src="/maskable_icon.png"
                className="w-8 h-8 rounded-lg"
                alt="Neev logo"
              />
              <span className="text-2xl font-serif italic text-primary tracking-widest leading-none">
                Neev
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h2 className="font-serif text-[1.75rem] leading-tight text-on-surface">
              Sign In
            </h2>
            <p className="font-sans text-on-surface-variant text-sm">
              Enter your family's digital heirloom.
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-error-container text-on-error-container text-sm rounded-2xl font-sans">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSecretKeySignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="label-md text-on-surface-variant">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type="email"
                  placeholder="arjun@legacy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-surface-container-low h-12 pl-12 pr-5 rounded-full font-sans text-sm text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary-container transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="label-md text-on-surface-variant">
                Secret Key
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-surface-container-low h-12 pl-12 pr-5 rounded-full font-sans text-sm text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary-container transition-all outline-none"
                />
              </div>
              <div className="flex justify-end pr-1">
                <Link
                  to="/forgot-password"
                  className="text-primary text-xs hover:underline font-sans"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-on-primary hover:bg-primary-dim rounded-full font-sans text-sm tracking-wide transition-all active:scale-[0.97]"
              disabled={loading}
            >
              <KeyRound className="mr-2 w-4 h-4" />
              {loading ? "Unlocking Vault..." : "Sign in with Secret Key"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-outline-variant/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-4 text-outline text-xs font-sans uppercase tracking-widest">
                or
              </span>
            </div>
          </div>

          {/* Google */}
          <Button
            variant="outline"
            className="w-full h-12 bg-surface-container hover:bg-surface-container/80 border-none rounded-full text-on-secondary-container font-sans text-sm transition-all"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            {googleLoading ? "Connecting..." : "Continue with Google"}
            <ArrowRight className="ml-auto w-4 h-4 opacity-40" />
          </Button>

          {/* Demo User & Guest Testing Fast Access */}
          <div className="space-y-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 rounded-full font-sans text-xs font-semibold tracking-wide transition-all shadow-xs"
              onClick={handleDemoSignIn}
            >
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              Try Demo Sanctuary (All Features Unlocked)
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full h-10 hover:bg-surface-container/60 text-on-surface-variant font-sans text-xs rounded-full transition-all"
              onClick={handleGuestSignIn}
            >
              <User className="w-4 h-4 mr-2" />
              Continue as Guest
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-on-surface-variant font-sans">
            New to the lineage?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Create Legacy Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
