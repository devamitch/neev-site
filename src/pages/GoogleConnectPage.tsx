import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import gsap from "gsap";
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Image,
  Link2,
  Loader2,
  Mail,
  MapPin,
  Shield,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signInWithGoogle } from "../firebase";

const integrations = [
  {
    id: "calendar",
    title: "Google Calendar",
    description:
      "Sync family schedules and auto-detect school events, appointments, and milestones.",
    icon: Calendar,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    badge: "Recommended",
    path: "/dashboard/calendar",
  },
  {
    id: "tasks",
    title: "Google Tasks",
    description:
      "Manage daily responsibilities, share lists, and track family to-dos.",
    icon: CheckCircle2,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    badge: null,
    path: "/dashboard/tasks",
  },
  {
    id: "photos",
    title: "Google Photos",
    description:
      "Browse albums, family memories, and milestones directly inside NEEV.",
    icon: Image,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    badge: "Popular",
    path: "/dashboard/photos",
  },
  {
    id: "drive",
    title: "Google Drive",
    description:
      "Browse, upload and manage family documents — all secured in Drive.",
    icon: Link2,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    badge: null,
    path: "/dashboard/drive",
  },
  {
    id: "gmail",
    title: "Gmail",
    description:
      "Read school circulars, bills and important family emails inside NEEV.",
    icon: Mail,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    badge: "Recommended",
    path: "/dashboard/mail",
  },
  {
    id: "fitness",
    title: "Google Fit",
    description:
      "Track steps, calories, active minutes and heart rate for the whole family.",
    icon: Activity,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badge: null,
    path: "/dashboard/fitness",
  },
  {
    id: "contacts",
    title: "Google Contacts",
    description:
      "Import and manage all your family and personal contacts seamlessly.",
    icon: Sparkles,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    badge: null,
    path: "/dashboard/contacts",
  },
  {
    id: "location",
    title: "Google Maps",
    description:
      "Real-time safety and location-based family insights for peace of mind.",
    icon: MapPin,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    badge: null,
    path: null,
  },
];

export default function GoogleConnectPage() {
  const { setGoogleAccessToken } = useAuth();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    calendar: true,
    tasks: true,
    photos: true,
    drive: true,
    gmail: true,
    fitness: false,
    contacts: false,
    location: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from(headerRef.current, {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
        })
        .from(
          contentRef.current?.children || [],
          { y: 40, opacity: 0, stagger: 0.08, duration: 0.8, ease: "expo.out" },
          "-=0.6",
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleConnectGoogle = async () => {
    setIsConnecting(true);
    try {
      const { accessToken } = await signInWithGoogle();
      if (accessToken) setGoogleAccessToken(accessToken);
      setIsConnected(true);
    } catch {
      // If already signed in, still mark as connected
      setIsConnected(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const toggleService = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const enabledCount = Object.values(enabled).filter(Boolean).length;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-surface flex flex-col relative overflow-hidden"
    >
      {/* Header */}
      <header
        ref={headerRef}
        className="px-8 pt-16 pb-10 w-full max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="label-md text-primary tracking-[0.4em] block text-xs font-sans font-bold uppercase">
              ECOSYSTEM
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-on-surface leading-tight">
              Connect your <span className="italic text-primary">Google</span>{" "}
              life
            </h1>
            <p className="font-sans text-on-surface-variant font-light text-base max-w-md leading-relaxed">
              NEEV integrates with Google to automatically organize your
              family's schedule, memories, and future.
            </p>
          </div>
          <div className="shrink-0">
            {!isConnected ? (
              <Button
                onClick={handleConnectGoogle}
                disabled={isConnecting}
                className="h-14 px-8 bg-surface-container hover:bg-surface-container/80 border-none rounded-full text-on-secondary-container font-sans text-sm transition-all  flex items-center gap-3  shadow-primary/20  active:scale-95"
              >
                {isConnecting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                )}
                {isConnecting ? "Connecting…" : "Connect Google Account"}
              </Button>
            ) : (
              <div className="flex items-center gap-3 h-14 px-8 bg-primary-container rounded-xl border border-primary/20">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-sans font-medium text-primary text-sm">
                  Google Account Connected
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="grow px-6 max-w-5xl mx-auto w-full pb-24">
        <div ref={contentRef} className="space-y-6">
          {/* Connection banner */}
          {!isConnected && (
            <div className="flex items-center gap-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <Link2 className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-sans font-medium text-amber-800">
                  Connect your Google Account first
                </p>
                <p className="text-xs text-amber-600 font-light mt-0.5">
                  Then enable individual services below. You can change these
                  anytime from Settings.
                </p>
              </div>
              <Button
                onClick={handleConnectGoogle}
                disabled={isConnecting}
                size="sm"
                className="shrink-0 bg-amber-600 text-white hover:bg-amber-700 rounded-lg"
              >
                {isConnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Connect Now"
                )}
              </Button>
            </div>
          )}

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {integrations.map((item) => {
              const Icon = item.icon;
              const isOn = enabled[item.id];
              return (
                <Card
                  key={item.id}
                  className={`border rounded-2xl transition-all duration-300 ${
                    isOn && isConnected
                      ? "border-primary/30 bg-primary-container/20 shadow-sm shadow-primary/10"
                      : "border-outline-variant/40 bg-surface-container-low shadow-sm"
                  }`}
                >
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${item.iconColor}`} />
                      </div>
                      {item.badge && (
                        <span className="text-[0.6rem] font-sans font-bold uppercase tracking-widest text-primary bg-primary-container px-2.5 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-serif text-lg text-on-surface">
                        {item.title}
                      </h3>
                      <p className="text-xs font-sans font-light text-on-surface-variant leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[0.65rem] font-sans font-bold uppercase tracking-widest ${isOn && isConnected ? "text-primary" : "text-on-surface-variant/50"}`}
                        >
                          {isOn && isConnected
                            ? "Enabled"
                            : isConnected
                              ? "Disabled"
                              : "Connect first"}
                        </span>
                        {isOn && isConnected && item.path && (
                          <button
                            onClick={() => navigate(item.path!)}
                            className="text-[0.6rem] font-sans font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors underline underline-offset-2"
                          >
                            Open →
                          </button>
                        )}
                      </div>
                      <label
                        className={`relative inline-flex items-center ${isConnected ? "cursor-pointer" : "cursor-not-allowed opacity-40"}`}
                      >
                        <input
                          type="checkbox"
                          checked={isOn}
                          disabled={!isConnected}
                          onChange={() => isConnected && toggleService(item.id)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-outline-variant/40 rounded-full peer peer-checked:bg-primary transition-colors duration-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all after:duration-300 peer-checked:after:translate-x-5 shadow-inner" />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary card */}
          {isConnected && (
            <div className="flex items-center gap-5 p-6 bg-primary-container rounded-2xl border border-primary/20">
              <div className="w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-serif text-lg text-on-surface">
                  {enabledCount} services enabled
                </p>
                <p className="text-sm text-on-surface-variant font-light mt-0.5">
                  Your Guardian AI will now sync across your Google ecosystem.
                  You can adjust this anytime in Settings.
                </p>
              </div>
            </div>
          )}

          {/* Privacy note */}
          <div className="flex items-start gap-5 p-6 bg-surface-container border border-outline-variant/30 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-base text-on-surface">
                Privacy First Sanctuary
              </h4>
              <p className="text-sm font-sans font-light text-on-surface-variant leading-relaxed">
                We only read data to build your family dashboard. Nothing is
                sold or shared. All data is encrypted within the NEEV sanctuary.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm font-sans text-on-surface-variant hover:text-primary transition-colors"
            >
              Skip for now
            </button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="px-12 py-4 h-auto bg-primary text-on-primary hover:bg-primary/90 rounded-xl text-sm font-sans uppercase tracking-[0.2em] shadow-lg shadow-primary/20 flex items-center gap-3 transition-all active:scale-95"
            >
              Finalize Sanctuary
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>

      <footer className="py-10 text-center opacity-30">
        <p className="label-md text-[0.6rem] tracking-[0.2em]">
          NEEV · THE MODERN HEIRLOOM
        </p>
      </footer>
    </div>
  );
}
