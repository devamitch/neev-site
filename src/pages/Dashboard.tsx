import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Baby,
  Bell,
  BookOpen,
  CalendarDays,
  CheckSquare,
  CreditCard,
  HardDrive,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Phone,
  Search,
  Settings,
  Shield,
  Sparkles,
  Stethoscope,
  Target,
  Users,
  X,
} from "lucide-react";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ModuleSkeleton } from "../components/dashboard/ModuleSkeleton";
import { useAuth } from "../contexts/AuthContext";
import { db, logOut } from "../firebase";

// Code-split all modules — zero upfront cost
const DashboardHome = lazy(() => import("./dashboard/DashboardHome"));
const VaultModule = lazy(() => import("./dashboard/VaultModule"));
const GuardianModule = lazy(() => import("./dashboard/GuardianModule"));
const SettingsModule = lazy(() => import("./dashboard/SettingsModule"));
const CalendarModule = lazy(() => import("./dashboard/CalendarModule"));
const TasksModule = lazy(() => import("./dashboard/TasksModule"));
const ChildrenModule = lazy(() => import("./dashboard/ChildrenModule"));
const PlansModule = lazy(() => import("./dashboard/PlansModule"));
const PhotosModule = lazy(() => import("./dashboard/PhotosModule"));
const DriveModule = lazy(() => import("./dashboard/DriveModule"));
const FitnessModule = lazy(() => import("./dashboard/FitnessModule"));
const MailModule = lazy(() => import("./dashboard/MailModule"));
const ContactsModule = lazy(() => import("./dashboard/ContactsModule"));
const MedicalModule = lazy(() => import("./dashboard/MedicalModule"));
const SchoolModule = lazy(() => import("./dashboard/SchoolModule"));
const SubscriptionModule = lazy(() => import("./dashboard/SubscriptionModule"));

function ModuleFallback() {
  return (
    <div className="p-4 md:p-8 lg:p-0">
      <ModuleSkeleton />
    </div>
  );
}

// Nav config — defined outside component, no re-creation on render
const NAV_ITEMS = [
  { path: "/dashboard", label: "HOME", icon: LayoutDashboard, group: "family" },
  {
    path: "/dashboard/children",
    label: "CHILDREN",
    icon: Baby,
    group: "family",
  },
  {
    path: "/dashboard/medical",
    label: "MEDICAL",
    icon: Stethoscope,
    group: "family",
  },
  {
    path: "/dashboard/school",
    label: "SCHOOL",
    icon: BookOpen,
    group: "family",
  },
  {
    path: "/dashboard/calendar",
    label: "CALENDAR",
    icon: CalendarDays,
    group: "family",
  },
  {
    path: "/dashboard/tasks",
    label: "TASKS",
    icon: CheckSquare,
    group: "family",
  },
  {
    path: "/dashboard/plans",
    label: "LIFE CYCLES",
    icon: Target,
    group: "family",
  },
  {
    path: "/dashboard/photos",
    label: "PHOTOS",
    icon: ImageIcon,
    group: "google",
  },
  {
    path: "/dashboard/drive",
    label: "DRIVE",
    icon: HardDrive,
    group: "google",
  },
  { path: "/dashboard/mail", label: "GMAIL", icon: Mail, group: "google" },
  {
    path: "/dashboard/fitness",
    label: "FITNESS",
    icon: Activity,
    group: "google",
  },
  {
    path: "/dashboard/contacts",
    label: "CONTACTS",
    icon: Users,
    group: "google",
  },
  {
    path: "/dashboard/vault",
    label: "LEGACY VAULT",
    icon: Shield,
    group: "tools",
  },
  {
    path: "/dashboard/guidance",
    label: "GUARDIAN AI",
    icon: Sparkles,
    group: "tools",
  },
  {
    path: "/dashboard/subscription",
    label: "PLANS",
    icon: CreditCard,
    group: "tools",
  },
  {
    path: "/dashboard/settings",
    label: "SETTINGS",
    icon: Settings,
    group: "tools",
  },
] as const;

// The 5 most critical tabs for mobile quick-access
const MOBILE_TABS = [
  "/dashboard",
  "/dashboard/children",
  "/dashboard/medical",
  "/dashboard/tasks",
  "/dashboard/guidance",
];

const FAMILY_ITEMS = NAV_ITEMS.filter((i) => i.group === "family");
const GOOGLE_ITEMS = NAV_ITEMS.filter((i) => i.group === "google");
const TOOLS_ITEMS = NAV_ITEMS.filter((i) => i.group === "tools");
const MOBILE_ITEMS = NAV_ITEMS.filter((i) => MOBILE_TABS.includes(i.path));

function NavLink({
  item,
  active,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={item.path}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${
        active
          ? "bg-primary text-on-primary"
          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
      }`}
    >
      <item.icon
        className={`w-5 h-5 shrink-0 transition-transform duration-300 ${active ? "" : "group-hover:scale-110"}`}
        aria-hidden="true"
      />
      <span className="label-md tracking-[0.2em] text-[0.7rem] uppercase">
        {item.label}
      </span>
      {active && (
        <motion.div
          layoutId="activeNavDot"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-on-primary"
        />
      )}
    </Link>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyChildren, setEmergencyChildren] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, userRole, familyId, signOutUser } = useAuth();
  const activeFamilyId = familyId || user?.uid || "default";
  const sidebarRef = useRef<HTMLElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Load children for emergency modal
  useEffect(() => {
    if (!activeFamilyId) return;
    const q = query(
      collection(db, "families", activeFamilyId, "children"),
      orderBy("createdAt", "asc"),
    );
    return onSnapshot(q, (snap) =>
      setEmergencyChildren(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, [activeFamilyId]);

  const handleLogout = useCallback(async () => {
    try {
      await signOutUser();
      await logOut();
      navigate("/");
    } catch {
      /* ignore */
    }
  }, [navigate, signOutUser]);

  const isActive = useCallback(
    (path: string) => {
      if (path === "/dashboard") return location.pathname === "/dashboard";
      return location.pathname.startsWith(path);
    },
    [location.pathname],
  );

  // Real date display
  const dateDisplay = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
      }),
    [],
  );

  const userInitial =
    user?.displayName?.charAt(0) ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row selection:bg-primary-container selection:text-on-primary-container">
      {/* ── Desktop Sidebar ── */}
      <aside
        ref={sidebarRef}
        className="hidden lg:flex flex-col w-64 xl:w-72 bg-surface-container-low px-5 xl:px-6 py-8 fixed h-full z-50 overflow-y-auto"
        aria-label="Main navigation"
      >
        <Link
          to="/dashboard"
          className="flex items-center gap-1 mb-8 hover:opacity-80 transition-opacity px-2 italic text-primary tracking-tight"
          aria-label="NEEV Home"
        >
          <img
            src="/maskable_icon.png"
            className="w-[25px] h-8 rounded"
            aria-hidden="true"
          />
          <span className="text-xl font-semibold font-serif italic text-primary tracking-widest leading-none">
            Neev
          </span>
        </Link>

        <nav className="grow space-y-0.5" role="navigation">
          <p className="text-[0.58rem] font-sans font-bold uppercase tracking-[0.35em] text-on-surface-variant/40 px-4 pb-1 pt-3">
            Family
          </p>
          {FAMILY_ITEMS.map((item) => (
            <div key={item.path}>
              <NavLink item={item} active={isActive(item.path)} />
            </div>
          ))}

          <p className="text-[0.58rem] font-sans font-bold uppercase tracking-[0.35em] text-on-surface-variant/40 px-4 pb-1 pt-5">
            Google Services
          </p>
          {GOOGLE_ITEMS.map((item) => (
            <div key={item.path}>
              <NavLink item={item} active={isActive(item.path)} />
            </div>
          ))}

          <p className="text-[0.58rem] font-sans font-bold uppercase tracking-[0.35em] text-on-surface-variant/40 px-4 pb-1 pt-5">
            Tools
          </p>
          {TOOLS_ITEMS.map((item) => (
            <div key={item.path}>
              <NavLink item={item} active={isActive(item.path)} />
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-10">
          <div className="flex items-center justify-between p-4 bg-surface-container rounded-2xl">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="w-10 h-10 rounded-2xl shrink-0">
                <AvatarFallback className="bg-primary text-on-primary font-serif">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 min-w-0">
                <p className="font-serif text-base truncate max-w-[100px] xl:max-w-[120px]">
                  {user?.displayName || "User"}
                </p>
                <p className="label-md text-[0.6rem] text-primary tracking-[0.15em] uppercase">
                  {userRole || "STEWARD"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Sign out"
              className="text-on-surface-variant hover:text-destructive transition-colors shrink-0"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main
        ref={mainContentRef}
        className="grow lg:ml-64 xl:ml-72 min-h-screen flex flex-col relative"
      >
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/10 px-4 sm:px-8 md:px-10 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2.5 text-on-surface-variant hover:text-primary transition-colors rounded-xl hover:bg-surface-container"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
            {/* Mobile logo */}
            <Link
              to="/"
              className="lg:hidden flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                <Sparkles
                  className="w-3.5 h-3.5 text-on-primary"
                  aria-hidden="true"
                />
              </div>
              <span className="text-base font-serif italic text-primary tracking-widest">
                NEEV
              </span>
            </Link>
            <div className="relative hidden md:block group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/30 group-focus-within:text-primary transition-colors duration-300"
                aria-hidden="true"
              />
              <input
                placeholder="Search children, tasks, events…"
                aria-label="Search dashboard"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-container h-11 pl-11 pr-6 rounded-full w-64 xl:w-80 focus:w-96 transition-all duration-500 font-sans text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button
              aria-label="Notifications"
              className="relative p-2.5 text-on-surface-variant hover:text-primary transition-colors rounded-xl hover:bg-surface-container"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              {emergencyChildren.some((c: any) =>
                (c.vaccinations || []).some((v: any) => !v.done),
              ) && (
                <span
                  className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full"
                  aria-label="Pending vaccinations"
                />
              )}
            </button>
            <div className="hidden sm:block text-right">
              <p className="font-serif text-sm">{dateDisplay}</p>
              <p className="label-md text-[0.6rem] text-on-surface-variant/60 tracking-[0.12em] uppercase">
                {user?.displayName?.split(" ")[0] || "Family"} Dashboard
              </p>
            </div>
          </div>
        </header>

        {/* Routed Content */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 max-w-[1400px] mx-auto w-full grow pb-28 lg:pb-12">
          <Suspense fallback={<ModuleFallback />}>
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="vault" element={<VaultModule />} />
              <Route path="guidance" element={<GuardianModule />} />
              <Route path="settings" element={<SettingsModule />} />
              <Route path="calendar" element={<CalendarModule />} />
              <Route path="tasks" element={<TasksModule />} />
              <Route path="children" element={<ChildrenModule />} />
              <Route path="plans" element={<PlansModule />} />
              <Route path="photos" element={<PhotosModule />} />
              <Route path="drive" element={<DriveModule />} />
              <Route path="fitness" element={<FitnessModule />} />
              <Route path="mail" element={<MailModule />} />
              <Route path="contacts" element={<ContactsModule />} />
              <Route path="medical" element={<MedicalModule />} />
              <Route path="school" element={<SchoolModule />} />
              <Route path="subscription" element={<SubscriptionModule />} />
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                    <p className="label-md text-primary tracking-[0.25em] uppercase text-xs mb-3">404 Module</p>
                    <h2 className="font-serif text-4xl md:text-5xl text-on-surface mb-4">
                      Module not <em className="italic text-primary">found</em>
                    </h2>
                    <p className="font-sans text-on-surface-variant text-base max-w-sm mb-8">
                      This section doesn't exist. Use the sidebar to navigate to a valid module.
                    </p>
                    <Link
                      to="/dashboard"
                      className="bg-primary text-on-primary px-7 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all"
                    >
                      Back to Dashboard
                    </Link>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </div>

        {/* Mobile Bottom Tab Bar — 5 most critical modules */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-outline-variant/10 safe-area-pb"
          aria-label="Quick navigation"
        >
          <div className="flex justify-around items-stretch px-2 py-2">
            {MOBILE_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-2xl transition-all ${
                    active
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant/60 hover:text-on-surface"
                  }`}
                >
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                  <span className="text-[0.52rem] label-md tracking-wider mt-1 uppercase leading-tight text-center">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Emergency Button */}
        <button
          onClick={() => setShowEmergency(true)}
          aria-label="Open emergency contacts"
          className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 bg-red-600 text-white p-4 rounded-full z-50 flex items-center justify-center group hover:bg-red-700 active:scale-95 transition-all shadow-xl shadow-red-600/40"
        >
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2.5 transition-all duration-500 font-semibold text-sm uppercase tracking-widest">
            Emergency
          </span>
        </button>
      </main>

      {/* ── Emergency Modal ── */}
      <AnimatePresence>
        {showEmergency && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmergency(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-80"
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Emergency information"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-xl bg-white rounded-3xl z-90 overflow-y-auto max-h-[92vh] shadow-2xl"
            >
              <div className="bg-red-600 text-white p-5 rounded-t-3xl">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h2 className="text-xl font-bold">Emergency</h2>
                  </div>
                  <button
                    onClick={() => setShowEmergency(false)}
                    aria-label="Close emergency modal"
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
                <p className="text-red-100 text-xs">
                  Quick access to critical info and emergency contacts
                </p>
              </div>

              <div className="p-5 space-y-5">
                {/* Emergency services */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Emergency Services
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        label: "Ambulance",
                        number: "108",
                        color: "bg-red-50 border-red-200 text-red-700",
                      },
                      {
                        label: "Police",
                        number: "100",
                        color: "bg-blue-50 border-blue-200 text-blue-700",
                      },
                      {
                        label: "Fire",
                        number: "101",
                        color: "bg-orange-50 border-orange-200 text-orange-700",
                      },
                    ].map(({ label, number, color }) => (
                      <a
                        key={label}
                        href={`tel:${number}`}
                        aria-label={`Call ${label} at ${number}`}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 ${color} hover:opacity-80 active:scale-95 transition-all`}
                      >
                        <Phone className="w-5 h-5 mb-1" aria-hidden="true" />
                        <span className="text-lg font-bold">{number}</span>
                        <span className="text-xs font-medium">{label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Children critical info */}
                {emergencyChildren.length > 0 ? (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                      Children — Critical Info
                    </p>
                    <div className="space-y-3">
                      {emergencyChildren.map((child: any) => (
                        <div
                          key={child.id}
                          className="p-4 rounded-2xl bg-gray-50 border border-gray-200"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`w-9 h-9 rounded-full ${child.color || "bg-primary-container"} flex items-center justify-center font-bold text-sm ${child.textColor || "text-primary"}`}
                            >
                              {child.name?.[0] || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 truncate">
                                {child.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {child.age || "Age unknown"}
                              </p>
                            </div>
                            {child.bloodGroup &&
                              child.bloodGroup !== "Unknown" && (
                                <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                                  {child.bloodGroup}
                                </span>
                              )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                              <p className="text-[0.6rem] text-amber-600 uppercase tracking-wide font-bold">
                                Allergies
                              </p>
                              <p className="text-sm font-semibold text-amber-800">
                                {child.allergies || "None"}
                              </p>
                            </div>
                            <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
                              <p className="text-[0.6rem] text-purple-600 uppercase tracking-wide font-bold">
                                Medications
                              </p>
                              <p className="text-sm font-semibold text-purple-800 truncate">
                                {child.medications?.length > 0
                                  ? child.medications
                                      .map((m: any) => m.name)
                                      .join(", ")
                                  : "None"}
                              </p>
                            </div>
                          </div>
                          {child.health?.doctorPhone && (
                            <a
                              href={`tel:${child.health.doctorPhone}`}
                              aria-label={`Call ${child.health.doctorName || "doctor"}`}
                              className="flex items-center gap-2 p-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors mb-1.5"
                            >
                              <Phone
                                className="w-4 h-4 text-blue-500 shrink-0"
                                aria-hidden="true"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-blue-800 truncate">
                                  {child.health.doctorName || "Doctor"}
                                </p>
                                <p className="text-xs text-blue-600">
                                  {child.health.doctorPhone}
                                </p>
                              </div>
                            </a>
                          )}
                          {(child.emergencyContacts || []).map(
                            (ec: any, idx: number) => (
                              <a
                                key={idx}
                                href={`tel:${ec.phone}`}
                                aria-label={`Call ${ec.name}`}
                                className="flex items-center gap-2 p-2 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors mb-1"
                              >
                                <Phone
                                  className="w-4 h-4 text-red-500 shrink-0"
                                  aria-hidden="true"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-red-800 truncate">
                                    {ec.name} ({ec.relation})
                                  </p>
                                  <p className="text-xs text-red-600">
                                    {ec.phone}
                                  </p>
                                </div>
                              </a>
                            ),
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    Add children in the <strong>Children</strong> module to see
                    their emergency info here.
                  </div>
                )}

                <button
                  onClick={() => setShowEmergency(false)}
                  className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-on-surface/40 backdrop-blur-md z-60 lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-surface z-70 px-5 py-8 lg:hidden flex flex-col overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 px-2">
                <Link
                  to="/"
                  className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                  aria-label="NEEV Home"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles
                      className="w-4 h-4 text-on-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-lg font-serif italic text-primary tracking-widest leading-none">
                    NEEV
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-xl hover:bg-surface-container"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <nav className="grow space-y-0.5" role="navigation">
                <p className="text-[0.58rem] font-sans font-bold uppercase tracking-[0.35em] text-on-surface-variant/40 px-3 pb-1 pt-2">
                  Family
                </p>
                {FAMILY_ITEMS.map((item) => (
                  <div key={item.path}>
                    <NavLink
                      item={item}
                      active={isActive(item.path)}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  </div>
                ))}
                <p className="text-[0.58rem] font-sans font-bold uppercase tracking-[0.35em] text-on-surface-variant/40 px-3 pb-1 pt-4">
                  Google Services
                </p>
                {GOOGLE_ITEMS.map((item) => (
                  <div key={item.path}>
                    <NavLink
                      item={item}
                      active={isActive(item.path)}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  </div>
                ))}
                <p className="text-[0.58rem] font-sans font-bold uppercase tracking-[0.35em] text-on-surface-variant/40 px-3 pb-1 pt-4">
                  Tools
                </p>
                {TOOLS_ITEMS.map((item) => (
                  <div key={item.path}>
                    <NavLink
                      item={item}
                      active={isActive(item.path)}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  </div>
                ))}
              </nav>

              <div className="mt-auto pt-8 border-t border-outline-variant/10">
                <div className="flex items-center justify-between p-4 bg-surface-container-high/30 rounded-2xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-10 h-10 rounded-2xl border-2 border-primary/10 shrink-0">
                      <AvatarFallback className="bg-primary text-on-primary font-serif">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-serif text-base truncate max-w-[130px]">
                        {user?.displayName || "User"}
                      </p>
                      <p className="label-md text-[0.6rem] text-primary tracking-[0.15em] uppercase">
                        {userRole || "STEWARD"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    aria-label="Sign out"
                    className="text-on-surface-variant hover:text-destructive transition-colors shrink-0"
                  >
                    <LogOut className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
