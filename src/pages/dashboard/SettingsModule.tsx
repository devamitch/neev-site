import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import gsap from "gsap";
import {
  Bell,
  Camera,
  Check,
  CreditCard,
  Loader2,
  LogOut,
  Shield,
  Smartphone,
  User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, logOut } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

type Section = "profile" | "notifications" | "privacy" | "billing";

export default function SettingsModule() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [name, setName] = useState(user?.displayName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState("Father");
  const [saved, setSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photoURL ?? null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load role from Firestore users/{uid}
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.role) setRole(data.role);
          if (data.displayName) setName(data.displayName);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setRoleLoading(false);
      }
    })();
  }, [user]);

  // GSAP animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(headerRef.current?.children || [], {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(
          sidebarRef.current?.children || [],
          {
            x: -20,
            opacity: 0,
            stagger: 0.05,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .from(
          contentRef.current,
          { y: 30, opacity: 0, duration: 1, ease: "expo.out" },
          "-=0.4",
        );
    });
    return () => ctx.revert();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: name,
        role,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const handleSignOut = async () => {
    await logOut();
    navigate("/");
  };

  const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const displayInitial = name.charAt(0) || user?.email?.charAt(0) || "U";

  return (
    <div className="max-w-[1160px] mx-auto">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoChange}
      />

      <div ref={headerRef} className="mb-10">
        <h1 className="font-serif text-3xl text-text-ink mb-2">Settings</h1>
        <p className="text-sm text-text-muted font-sans font-light">
          Manage your family's operating system.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-64 shrink-0">
          <nav ref={sidebarRef} className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-md font-medium transition-colors font-sans text-sm text-left ${
                  activeSection === item.id
                    ? "bg-sage-mist text-sage-dim"
                    : "text-text-muted hover:bg-surface-lo hover:text-text-ink"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <Link
              to="/google-connect"
              className="flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-surface-lo hover:text-text-ink rounded-md transition-colors font-sans text-sm"
            >
              <Smartphone className="w-4 h-4" />
              Integrations
            </Link>
          </nav>
        </div>

        <div ref={contentRef} className="flex-1">
          <Card className="bg-surface-hi border-none rounded-md p-8">
            {activeSection === "profile" && (
              <>
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="font-serif text-2xl text-text-ink">
                    Profile Information
                  </CardTitle>
                </CardHeader>

                <div className="flex items-center gap-8 mb-10">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <AvatarFallback className="bg-sage text-surface-hi font-serif text-3xl">
                          {displayInitial.toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-surface-lo text-text-ink border border-surface-mid hover:bg-surface-mid flex items-center gap-2"
                      onClick={() => photoInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4" />
                      Change Photo
                    </Button>
                    <p className="text-[0.68rem] text-text-muted mt-3 font-sans font-medium uppercase tracking-wider">
                      JPG, GIF or PNG. Max size of 800K
                    </p>
                  </div>
                </div>

                {roleLoading ? (
                  <div className="flex items-center gap-2 text-text-muted py-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-sans font-light">Loading profile…</span>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="space-y-8 max-w-md">
                    <div className="space-y-3">
                      <Label className="text-[0.68rem] font-sans font-medium uppercase tracking-widest text-sage-dim">
                        Full Name
                      </Label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-surface-lo border-none focus:ring-2 focus:ring-sage-pale"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[0.68rem] font-sans font-medium uppercase tracking-widest text-sage-dim">
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-surface-lo border-none focus:ring-2 focus:ring-sage-pale"
                        disabled
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[0.68rem] font-sans font-medium uppercase tracking-widest text-sage-dim">
                        Role in Family
                      </Label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-3 bg-surface-lo text-text-ink rounded-sm border-none focus:ring-2 focus:ring-sage-pale transition-shadow appearance-none font-sans text-sm"
                      >
                        <option>Father</option>
                        <option>Mother</option>
                        <option>Grandparent</option>
                        <option>Guardian</option>
                      </select>
                    </div>

                    <div className="pt-8 border-t border-surface-lo flex justify-between items-center">
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={handleSignOut}
                        className="text-terracotta text-sm font-medium flex items-center gap-2 hover:opacity-80 p-0"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="px-8 bg-primary text-on-primary hover:bg-primary/90 flex items-center gap-2"
                      >
                        {saved ? (
                          <>
                            <Check className="w-4 h-4" /> Saved!
                          </>
                        ) : saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </>
            )}

            {activeSection === "notifications" && (
              <>
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="font-serif text-2xl text-text-ink">
                    Notifications
                  </CardTitle>
                </CardHeader>
                <div className="space-y-6 max-w-md">
                  {[
                    {
                      label: "Guardian Daily Briefing",
                      desc: `Morning summary of your family's rhythm`,
                    },
                    {
                      label: "Children Milestones",
                      desc: "Alerts when a child completes a task or milestone",
                    },
                    {
                      label: "Calendar Reminders",
                      desc: "Event reminders from your Google Calendar",
                    },
                    {
                      label: "Vault Updates",
                      desc: "When family members add new documents",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-4 border-b border-surface-lo last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-text-ink font-sans">
                          {item.label}
                        </p>
                        <p className="text-xs text-text-muted font-sans font-light mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-mid rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeSection === "privacy" && (
              <>
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="font-serif text-2xl text-text-ink">
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <div className="space-y-6 max-w-md">
                  <div className="p-6 bg-surface-lo rounded-md space-y-2">
                    <p className="text-sm font-medium text-text-ink font-sans">
                      Data Encryption
                    </p>
                    <p className="text-xs text-text-muted font-sans font-light">
                      All your family data is quantum-encrypted and stored
                      securely.
                    </p>
                    <span className="inline-block text-[0.65rem] font-bold tracking-widest text-primary uppercase font-sans bg-primary/10 px-3 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="p-6 bg-surface-lo rounded-md space-y-3">
                    <p className="text-sm font-medium text-text-ink font-sans">
                      Change Password
                    </p>
                    <Input
                      type="password"
                      placeholder="New password"
                      className="bg-surface-hi border-none"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-surface-hi border-none"
                    />
                    <Button className="bg-primary text-on-primary hover:bg-primary/90 w-full">
                      Update Password
                    </Button>
                  </div>
                </div>
              </>
            )}

            {activeSection === "billing" && (
              <>
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="font-serif text-2xl text-text-ink">
                    Billing
                  </CardTitle>
                </CardHeader>
                <div className="space-y-6 max-w-md">
                  <div className="p-6 bg-primary-container rounded-md space-y-2">
                    <p className="text-[0.68rem] font-bold tracking-widest text-primary uppercase font-sans">
                      Current Plan
                    </p>
                    <p className="font-serif text-2xl text-text-ink">
                      Family Guardian
                    </p>
                    <p className="text-sm text-text-muted font-sans font-light">
                      ₹999 / month · Renews on Apr 1, 2026
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full border border-surface-mid text-text-ink hover:bg-surface-lo font-sans text-sm"
                  >
                    Manage Subscription
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
