import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleCalendarIcon,
  GoogleDriveIcon,
  GoogleGmailIcon,
  GooglePhotosIcon,
} from "../components/GoogleIcons";
import { useAuth } from "../contexts/AuthContext";

gsap.registerPlugin(ScrollTrigger);

/* ─── Remote image assets — curated Indian-themed with full lifecycle coverage ─ */
const REMOTE = {
  /* Heritage / archive — local numbered variants */
  leatherJournal: "/images/neev_schooling_kids.png",
  ancientDocs: "/images/neev_role_father_1774253493761.png",
  ritualFlowers: "/images/neev_real_guardian_1774253647528.png",
  /* Life cycle phases — local numbered variants */
  mother: "/images/neev_role_mother_1774253680740.png",
  father: "/images/neev_role_father_1774253493761.png",
  elder: "/images/neev_role_elder_1774253476030.png",
  child: "/images/neev_role_child_1774253443291.png",
  /* Extended lifecycle phases — AI-powered parenting journey */
  schoolingKids: "/images/neev_schooling_kids.png",
  studyingStudent: "/images/neev_studying_student.png",
  collegeStudents: "/images/neev_college_students.png",
  newJob: "/images/neev_new_job.png",
  marriage: "/images/neev_marriage.png",
  guardianLaptop: "/images/neev_guardian_laptop.png",
  /* Shared scenes — local numbered variants */
  familyHome: "/images/neev_real_home_1774253423028.png",
  familyTea: "/images/neev_role_father_1774253754421.png",
  guardian: "/images/neev_real_guardian_1774253403460.png",
  connection: "/images/neev_real_connection_1774252910820.png",
  vault: "/images/neev_vault.png",
};

/* ─── Resilient Img component — falls back to remote on error ─ */
const Img = ({
  src,
  fallback,
  alt,
  className,
}: {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
}) => (
  <img
    src={src}
    alt={alt}
    className={className}
    onError={(e) => {
      const el = e.currentTarget;
      if (el.src !== fallback) el.src = fallback;
    }}
  />
);

/* ─── Custom Cursor ──────────────────────────────────────── */
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setActive(true);
    document.body.classList.add("custom-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mouseX = 0,
      mouseY = 0,
      ringX = 0,
      ringY = 0,
      raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX, y: mouseY });
    };
    const tick = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onEnter = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement).closest(
          'button, a, [role="button"], .tilt-card, input, label',
        )
      ) {
        gsap.to(ring, {
          scale: 2.5,
          opacity: 0.4,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, { scale: 0.4, duration: 0.2 });
      }
    };
    const onLeave = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.5, ease: "expo.out" });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "expo.out" });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(raf);
      document.body.classList.remove("custom-cursor");
    };
  }, []);

  if (!active) return null;
  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{ width: 8, height: 8 }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 40,
          height: 40,
          border: "1.5px solid var(--color-primary)",
        }}
      />
    </>
  );
};

/* ─── Reveal Label — clip-path slide up on scroll ────────── */
const RevealLabel = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  const elRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 14 });
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" });
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <span ref={elRef} className={className}>
      {text}
    </span>
  );
};

/* ─── Count-up number ────────────────────────────────────── */
const CountUp = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const [val, setVal] = React.useState(0);
  const elRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const dur = 1800;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={elRef}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ─── Sacred Geometry Background ────────────────────────── */
const SacredBg = () => (
  <div
    className="absolute inset-0 overflow-hidden pointer-events-none select-none"
    aria-hidden="true"
  >
    <svg
      className="absolute right-[-10%] lg:right-0 top-1/2 -translate-y-1/2 w-[80vw] lg:w-[56vw] max-w-2xl opacity-[0.035]"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Flower of Life geometry */}
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const r = 66.7;
        const cx = 200 + r * Math.cos((a * Math.PI) / 180);
        const cy = 200 + r * Math.sin((a * Math.PI) / 180);
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            stroke="var(--color-primary)"
            strokeWidth="0.8"
          />
        );
      })}
      <circle
        cx="200"
        cy="200"
        r="66.7"
        stroke="var(--color-primary)"
        strokeWidth="0.8"
      />
      <circle
        cx="200"
        cy="200"
        r="133.4"
        stroke="var(--color-primary)"
        strokeWidth="0.5"
      />
      <circle
        cx="200"
        cy="200"
        r="200"
        stroke="var(--color-primary)"
        strokeWidth="0.4"
      />
    </svg>
  </div>
);

/* ─── Navbar ──────────────────────────────────────────────── */
export const Navbar = () => {
  const [hidden, setHidden] = React.useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 100);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-[60] bg-surface/90 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="flex justify-between items-center px-4 md:px-8 py-3 max-w-screen-2xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="NEEV Home"
        >
          <img
            src="/maskable_icon.png"
            className="w-8 h-8 rounded-lg"
            aria-hidden="true"
          />
          <span className="text-xl font-semibold font-serif italic text-primary tracking-widest leading-none">
            Neev
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Philosophy", href: "#sanctuary" },
            { label: "Google Sync", href: "#integrations" },
            { label: "Rituals", href: "#rituals" },
            { label: "Pricing", href: "#pricing" },
            { label: "Privacy Policy", to: "/privacy-policy" },
            { label: "Terms", to: "/terms" },
          ].map((l) =>
            l.to ? (
              <Link
                key={l.to}
                to={l.to}
                className="label-md text-on-surface-variant hover:text-primary transition-colors tracking-[0.14em]"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="label-md text-on-surface-variant hover:text-primary transition-colors tracking-[0.14em]"
              >
                {l.label}
              </a>
            ),
          )}
        </div>
        <button
          onClick={() =>
            document.getElementById("sanctuary")?.scrollIntoView({ behavior: "smooth" })
          }
          className="magnetic bg-primary text-on-primary px-6 py-2 rounded-full label-md tracking-[0.18em] hover:opacity-80 transition-all active:scale-95"
        >
          Explore Sanctuary
        </button>
      </div>
    </nav>
  );
};

/* ─── Hero ──────────────────────────────────────────────── */
const Hero = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from(textRef.current?.children || [], {
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 1.2,
          ease: "expo.out",
        })
        .from(
          imageRef.current,
          { scale: 1.06, opacity: 0, duration: 1.4, ease: "power2.out" },
          "-=1",
        )
        .from(
          planeRef.current,
          { x: 36, opacity: 0, duration: 0.9, ease: "power3.out" },
          "-=0.8",
        );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="page-sec relative px-4 md:px-8 bg-surface overflow-hidden"
      data-section="hero"
    >
      <SacredBg />
      <div className="relative z-10 max-w-screen-2xl mx-auto w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-10 pt-10 pb-8 lg:py-8">
        <div ref={textRef} className="lg:w-7/12 space-y-6">
          <div className="inline-flex items-center gap-3 bg-primary-container px-4 py-2 rounded-full">
            <span className="label-md text-primary tracking-[0.3em]">
              <RevealLabel text="NEEV · THE MODERN HEIRLOOM" />
            </span>
          </div>
          <h1 className="font-serif text-[2.25rem] sm:text-[3.25rem] md:text-[4.25rem] leading-[0.95] md:leading-[0.93] tracking-tight text-on-surface overflow-hidden">
            <span className="hero-word block">Build your family's</span>
            <span className="hero-word block shimmer-text">Foundation</span>
            <span className="hero-word block">with wisdom.</span>
          </h1>
          <p className="text-base text-on-surface-variant max-w-lg leading-relaxed font-light">
            An AI-powered digital sanctuary for the modern Indian family. Let
            Google, AI, and cultural wisdom work together—so{" "}
            <em className="font-serif text-on-surface">
              nothing is ever left behind.
            </em>
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              onClick={() =>
                document
                  .getElementById("sanctuary")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="magnetic bg-primary text-on-primary px-8 py-3.5 rounded-full label-md tracking-[0.2em] hover:opacity-90 transition-opacity active:scale-95"
            >
              Explore the Sanctuary
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("sanctuary")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-text group"
            >
              The Philosophy
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </button>
          </div>
          <div className="flex items-center gap-5 pt-2">
            <div className="flex -space-x-2.5">
              {[
                {
                  src: "/images/neev_role_mother_1774253680740.png",
                  fb: REMOTE.mother,
                },
                { src: "/images/neev_role_father.png", fb: REMOTE.father },
                { src: "/images/neev_role_elder.png", fb: REMOTE.elder },
              ].map(({ src, fb }, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.src !== fb) el.src = fb;
                  }}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ))}
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <span className="text-[9px] font-bold text-on-primary">+8</span>
              </div>
            </div>
            <div>
              <p className="label-md text-on-surface tracking-[0.12em]">
                1,000+ FAMILIES
              </p>
              <p className="text-[9px] text-on-surface-variant tracking-widest">
                ON THE WAITING LIST
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <span className="label-md text-on-surface-variant/50 tracking-widest">
              POWERED BY
            </span>
            {["Google AI", "Gemini", "Claude"].map((ai) => (
              <span
                key={ai}
                className="text-[10px] font-sans font-semibold tracking-widest bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-full"
              >
                {ai}
              </span>
            ))}
          </div>
        </div>
        <div ref={imageRef} className="w-full lg:w-[42%] shrink-0">
          <div className="relative tilted-img">
            <div className="aspect-[4/5] lg:aspect-auto lg:h-[62vh] rounded-3xl overflow-hidden bg-surface-container">
              <img
                src="/images/neev_role_elder_1774253697658.png"
                alt="Indian family at home"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.src !== REMOTE.familyHome) el.src = REMOTE.familyHome;
                }}
                className="w-full h-full object-cover parallax-img"
              />
              {/* Dark gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            {/* Title feature — outside overflow-hidden so it's never clipped */}
            <div className="absolute top-5 right-4 z-20 max-w-[55%]">
              <div className="glass rounded-2xl px-4 py-3">
                <p className="label-md text-primary tracking-[0.2em] mb-0.5">
                  THE FAMILY SANCTUARY
                </p>
                <p className="font-serif text-on-surface text-sm leading-snug">
                  Where every generation finds its voice
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Guardian Insight Card ──────────────────────────────── */
const GuardianInsight = () => (
  <div className="relative lg:absolute lg:bottom-24 lg:right-10 px-4 md:px-8 -mt-8 sm:-mt-12 lg:-mt-6 z-10 max-w-screen-2xl mx-auto w-full lg:w-auto">
    <div className="max-w-2xl lg:ml-auto">
      <div className="glass !bg-surface-container-low/95 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-soft">
        <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
          <img
            src="/maskable_icon.png"
            alt="Neev"
            className="w-6 h-6 object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="label-md text-primary tracking-[0.25em] mb-1">
            GUARDIAN AI · TODAY'S INSIGHT
          </p>
          <p className="font-serif text-sm text-on-surface leading-snug italic">
            "Your family's story is not just memories — it's the foundation your
            children will build upon."
          </p>
        </div>
        <div className="flex items-center gap-[3px] h-7 shrink-0">
          {[35, 60, 85, 45, 95, 65, 40, 80, 55, 90, 30, 70].map((h, i) => (
            <div
              key={i}
              className="wave-bar w-[2.5px] bg-primary rounded-full opacity-50"
              style={{ height: `${h}%`, animationDelay: `${i * 0.09}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ─── Philosophy ─────────────────────────────────────────── */
const Philosophy = () => (
  <section
    id="sanctuary"
    className="page-sec bg-surface-container-low px-4 md:px-8 py-12"
    data-section="philosophy"
  >
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-10 items-end mb-10">
        <div className="flex-1">
          <span className="label-md text-primary mb-4 block tracking-[0.25em]">
            <RevealLabel text="OUR ETHOS" />
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-on-surface leading-[1.0]">
            A Trusted Elder
            <br />
            <span className="text-sage-italic">in Digital Form.</span>
          </h2>
        </div>
        <div className="flex-1 max-w-md pb-2">
          <p className="text-sm text-on-surface-variant font-light leading-relaxed mb-5">
            Parenting is not a productivity problem. It is a presence problem.
            Neev does not try to make you faster — it tries to make you more{" "}
            <em className="font-serif text-on-surface">present</em>.
          </p>
          <div className="pl-5">
            <p className="font-serif italic text-base text-on-surface leading-[1.7] mb-2">
              "A family is not a static portrait, but a living breathing story
              that unfolds in seasons."
            </p>
            <p className="label-md text-primary tracking-[0.2em]">
              THE GUARDIAN AI
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: "ac_unit",
            bg: "bg-surface-container-lowest",
            iconBg: "bg-primary-container",
            iconColor: "text-primary",
            title: "The Calm Tone",
            desc: "A whisper of guidance during peaceful rhythms. Perfect for evening reflections and legacy journaling.",
            label: "ALWAYS AVAILABLE",
          },
          {
            icon: "notifications_active",
            bg: "bg-primary-container",
            iconBg: "bg-surface-container-lowest",
            iconColor: "text-primary",
            title: "The Alert Tone",
            desc: "Active vigilance when schedules shift or developmental milestones approach.",
            label: "PROACTIVE CARE",
          },
          {
            icon: "shield_with_heart",
            bg: "bg-[#e0deda]",
            iconBg: "bg-[#cec4c6]",
            iconColor: "text-tertiary",
            title: "Emergency Presence",
            desc: "Immediate, surgical focus when it matters most. Authoritative, fast, and compassionate.",
            label: "ALWAYS ON",
          },
        ].map((c, i) => (
          <div
            key={i}
            className={`p-9 ${c.bg} rounded-2xl flex flex-col gap-5 group card-hover`}
          >
            <div
              className={`w-12 h-12 ${c.iconBg} flex items-center justify-center rounded-xl`}
            >
              <span
                className={`material-symbols-outlined text-xl ${c.iconColor}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {c.icon}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-on-surface">{c.title}</h3>
              <p className="text-on-surface-variant leading-relaxed font-light text-sm">
                {c.desc}
              </p>
            </div>
            <span className="label-md text-primary/60 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-[9px]">
              {c.label} →
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Life Cycles — Horizontal Drag Carousel ────────────── */
const HERITAGE_STAGES = [
  {
    id: "expecting",
    icon: "pregnant_woman",
    label: "Expecting",
    title: "The First Breath",
    aiHint: "AI prepares prenatal routines",
    desc: "Neev prepares your foundational routines before the arrival — guided by tradition and AI.",
    img: "/images/neev_role_mother_1774253680740.png",
    remote: REMOTE.mother,
  },
  {
    id: "infancy",
    icon: "child_care",
    label: "Infancy",
    title: "Nurturing Growth",
    aiHint: "Guardian tracks feeds & sleep",
    desc: "Track feeds, sleep patterns, and vital milestones seamlessly across the entire care team.",
    img: "/images/neev_role_child.png",
    remote: REMOTE.child,
  },
  {
    id: "first-steps",
    icon: "footprint",
    label: "First Steps",
    title: "Expanding Worlds",
    aiHint: "Auto-journaled in the Vault",
    desc: "As they explore, Neev chronicles fleeting moments into your family vault automatically.",
    img: "/images/neev_role_child_1774253443291.png",
    remote: REMOTE.child,
  },
  {
    id: "schooling",
    icon: "school",
    label: "Schooling",
    title: "The Academic Inquiry",
    aiHint: "Gmail parsed, calendar synced",
    desc: "AI parses every school circular and email into a single unified family schedule.",
    img: "/images/neev_role_father.png",
    remote: REMOTE.schoolingKids,
  },
  {
    id: "studying",
    icon: "menu_book",
    label: "Studying",
    title: "Focused Learning",
    aiHint: "AI study planner active",
    desc: "Support late-night study sessions with AI-tailored learning routines and adaptive schedules.",
    img: "/images/neev_real_goals_1774253387547.png",
    remote: REMOTE.studyingStudent,
  },
  {
    id: "college",
    icon: "account_balance",
    label: "College",
    title: "Higher Education",
    aiHint: "Admission docs in Vault",
    desc: "Guiding the transition to campus life while maintaining deep familial bonds across any distance.",
    img: "/images/neev_studying_student.png",
    remote: REMOTE.collegeStudents,
  },
  {
    id: "career",
    icon: "work",
    label: "Career",
    title: "Entering the Workforce",
    aiHint: "Offer letter secured in Vault",
    desc: "The transition from academia to professional life. Guardian celebrates and archives the moment.",
    img: "/images/neev_role_mother.png",
    remote: REMOTE.newJob,
  },
  {
    id: "marriage",
    icon: "volunteer_activism",
    label: "Marriage",
    title: "Arranged Unity",
    aiHint: "Rituals & memories preserved",
    desc: "Sacred unions. Neev preserves the ceremonies, vows, and celebrations forever.",
    img: "/images/neev_real_connection_1774253553944.png",
    remote: REMOTE.marriage,
  },
  {
    id: "elder-support",
    icon: "diversity_3",
    label: "Elder Support",
    title: "Infinite Lineage",
    aiHint: "Guardian bridges generations",
    desc: "When roles reverse, support aging parents while passing the heirloom to the next generation.",
    img: "/images/neev_real_home_1774253423028.png",
    remote: REMOTE.elder,
  },
];

const LifeCycleTimeline = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartTranslate = useRef(0);
  const currentTranslate = useRef(0);
  const lastPointerX = useRef(0);
  const velocity = useRef(0);

  /* ── helpers ── */
  const getCardWidth = () => {
    const card = trackRef.current?.children[0] as HTMLElement;
    return card ? card.offsetWidth + 16 : 320; // 16 = gap (mr-4)
  };

  const clampIdx = (i: number) =>
    Math.max(0, Math.min(i, HERITAGE_STAGES.length - 1));

  const slideTo = useCallback((index: number, instant = false) => {
    const idx = clampIdx(index);
    const x = -idx * getCardWidth();
    currentTranslate.current = x;
    if (instant) {
      gsap.set(trackRef.current, { x });
    } else {
      gsap.to(trackRef.current, { x, duration: 0.55, ease: "power3.out" });
    }
    setActiveIndex(idx);
  }, []);

  /* ── pointer drag (mouse + touch) ── */
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    gsap.killTweensOf(trackRef.current);
    isDragging.current = true;
    dragStartX.current = e.clientX;
    lastPointerX.current = e.clientX;
    dragStartTranslate.current = currentTranslate.current;
    velocity.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    velocity.current = e.clientX - lastPointerX.current;
    lastPointerX.current = e.clientX;
    const dx = e.clientX - dragStartX.current;
    const newX = dragStartTranslate.current + dx;
    currentTranslate.current = newX;
    gsap.set(trackRef.current, { x: newX });
  }, []);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const cardW = getCardWidth();
    const rawIdx = -currentTranslate.current / cardW;
    let target: number;
    if (velocity.current < -4) target = Math.ceil(rawIdx);
    else if (velocity.current > 4) target = Math.floor(rawIdx);
    else target = Math.round(rawIdx);
    slideTo(target);
  }, [slideTo]);

  /* ── keyboard nav ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") slideTo(activeIndex - 1);
      if (e.key === "ArrowRight") slideTo(activeIndex + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, slideTo]);

  return (
    <section id="life-cycles" className="bg-surface py-12 pb-0">
      {/* ── Section header ── */}
      <div className="px-8 md:px-12 mb-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="mb-3">
              <span className="label-md text-primary tracking-[0.35em]">
                THE HERITAGE PATH
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-on-surface leading-tight">
              The Cycle of <em className="text-sage-italic">Growth</em>
            </h2>
            <p className="text-on-surface-variant font-light mt-3 text-sm max-w-xs leading-relaxed">
              Nine chapters. One unbroken lineage. Every milestone preserved
              with AI.
            </p>
          </div>

          {/* Arrow nav — desktop */}
          <div className="hidden md:flex items-center gap-2 shrink-0 mt-1">
            <button
              onClick={() => slideTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-container transition-all disabled:opacity-25"
              aria-label="Previous"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18 }}
              >
                arrow_back
              </span>
            </button>
            <button
              onClick={() => slideTo(activeIndex + 1)}
              disabled={activeIndex === HERITAGE_STAGES.length - 1}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-container transition-all disabled:opacity-25"
              aria-label="Next"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18 }}
              >
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Drag carousel ── */}
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ paddingLeft: "2rem", transform: "translateX(0px)" }}
        >
          {HERITAGE_STAGES.map((s, i) => (
            <div
              key={s.id}
              className="shrink-0 w-[78vw] md:w-[44vw] lg:w-[32vw] mr-4 last:mr-8 md:last:mr-12 rounded-3xl overflow-hidden bg-surface-container-low flex flex-col"
            >
              {/* Image — top 58% of card */}
              <div
                className="relative overflow-hidden flex-none"
                style={{ height: "min(44vw, 320px)" }}
              >
                <img
                  src={s.img}
                  alt={s.label}
                  draggable={false}
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.src !== s.remote) el.src = s.remote;
                  }}
                  className="w-full h-full object-cover"
                />
                {/* Seamless blend into card background */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface-container-low to-transparent" />
                {/* Chapter number — barely visible watermark */}
                <span
                  className="absolute top-4 right-5 font-serif text-on-surface/[0.08] select-none pointer-events-none leading-none"
                  style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Content panel — brand colors */}
              <div className="flex-1 flex flex-col p-5 pt-4 gap-3">
                {/* Icon + label row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-container rounded-xl flex items-center justify-center shrink-0">
                      <span
                        className="material-symbols-outlined text-primary"
                        style={{
                          fontVariationSettings: "'FILL' 1",
                          fontSize: "16px",
                        }}
                      >
                        {s.icon}
                      </span>
                    </div>
                    <span className="label-md text-primary tracking-[0.2em]">
                      {s.label.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[8px] bg-primary-container text-primary px-2.5 py-1 rounded-full font-sans font-semibold tracking-wide shrink-0">
                    {s.aiHint}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-serif text-on-surface leading-snug"
                  style={{ fontSize: "clamp(1.2rem, 2.8vw, 1.55rem)" }}
                >
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-on-surface-variant font-light text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
          {/* Right spacer */}
          <div className="shrink-0 w-8 md:w-12" />
        </div>
      </div>

      {/* ── Chapter counter ── */}
      <div className="px-8 md:px-12 mt-6 mb-12 flex items-center justify-between">
        <span className="label-md text-primary tracking-[0.2em]">
          {HERITAGE_STAGES[activeIndex].label.toUpperCase()}
        </span>
        <span
          className="font-serif text-on-surface-variant/60"
          style={{ fontSize: "0.875rem" }}
        >
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(HERITAGE_STAGES.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
};

const LifeCyclesBento = () => (
  <section className="py-12 px-4 md:px-8 bg-surface">
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="label-md text-primary tracking-[0.3em] mb-2 block">
            YOUR JOURNEY
          </span>
          <h2 className="font-serif text-4xl md:text-5xl">
            Tailored to <span className="text-sage-italic">Your Journey</span>
          </h2>
          <p className="text-on-surface-variant font-light mt-2 text-sm">
            From birth to legacy — every chapter preserved with AI.
          </p>
        </div>
        <button className="label-md text-primary flex items-center gap-2 hover:opacity-70 transition-opacity tracking-[0.15em] shrink-0">
          VIEW ALL{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        <div className="md:col-span-7 bg-tertiary-container rounded-3xl overflow-hidden group card-hover tilt-card">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 aspect-[4/5] overflow-hidden">
              <img
                src="/images/neev_real_guardian_1774253403460.png"
                alt="Expecting"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.src !== REMOTE.mother) el.src = REMOTE.mother;
                }}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-end">
              <span className="label-md text-on-tertiary-container/60 tracking-[0.25em] mb-2">
                PHASE I · EXPECTING
              </span>
              <h3 className="font-serif text-3xl text-on-tertiary-container mb-3">
                The Promise
              </h3>
              <p className="text-on-tertiary-container/80 font-light text-sm mb-5">
                Ayurvedic rhythms and prenatal tranquility. Neev prepares your
                foundation with AI-guided care.
              </p>
              <div className="p-4 bg-surface-container rounded-xl">
                <span className="text-[9px] tracking-widest text-primary label-md">
                  GUARDIAN AI
                </span>
                <p className="text-xs italic text-on-surface-variant mt-1">
                  "Your rhythmic breathing today will be his first lullaby."
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-5 bg-surface-container-high rounded-3xl overflow-hidden group card-hover tilt-card">
          <div className="aspect-video overflow-hidden">
            <img
              src="/images/neev_role_child.png"
              alt="School"
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src !== REMOTE.schoolingKids)
                  el.src = REMOTE.schoolingKids;
              }}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="p-8 space-y-2">
            <div className="flex items-center gap-2">
              <span className="label-md text-on-surface-variant/50 tracking-[0.25em]">
                PHASE IV
              </span>
              <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                Gmail · Calendar AI
              </span>
            </div>
            <h4 className="font-serif text-2xl text-on-surface">
              The Academic Inquiry
            </h4>
            <p className="text-on-surface-variant font-light text-sm">
              AI parses every school circular. Nothing slips through the cracks.
            </p>
          </div>
        </div>
        <div className="md:col-span-5 bg-primary-container rounded-3xl p-8 card-hover tilt-card">
          <span className="label-md text-on-primary-container/60 tracking-[0.25em] mb-5 block">
            PHASES V–VII
          </span>
          <h4 className="font-serif text-2xl text-on-primary-container mb-3">
            Study · College · Career
          </h4>
          <p className="text-on-primary-container/80 font-light text-sm mb-6">
            From textbooks to offer letters — every document, every milestone,
            secured in your Vault forever.
          </p>
          <div className="p-5 bg-surface-container-lowest rounded-2xl">
            <span className="font-serif text-base block mb-1">
              Vault · Education & Career
            </span>
            <p className="label-md text-on-surface-variant tracking-[0.15em] mb-3">
              OFFER LETTER PRESERVED
            </p>
            <div className="h-1.5 w-full bg-primary-container rounded-full overflow-hidden">
              <div className="h-full w-full bg-primary rounded-full" />
            </div>
          </div>
        </div>
        <div className="md:col-span-7 rounded-3xl overflow-hidden bg-surface-container card-hover">
          <div className="h-48 sm:h-64 overflow-hidden flex flex-row gap-4 sm:gap-12 rounded-3xl p-4 sm:p-12 pb-0 flex-1">
            <img
              src="/images/neev_real_goals.png"
              alt="Marriage"
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src !== REMOTE.marriage) el.src = REMOTE.marriage;
              }}
              className="w-full h-full object-center  parallax-img img-shadow rounded-3xl flex-1"
            />
            <img
              src="/images/neev_real_connection_1774253369481.png"
              alt="Marriage"
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src !== REMOTE.marriage) el.src = REMOTE.marriage;
              }}
              className="w-full h-full object-cover  parallax-img img-shadow rounded-3xl flex-1"
            />
            <img
              src="/images/neev_real_connection_1774253553944.png"
              alt="Marriage"
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src !== REMOTE.marriage) el.src = REMOTE.marriage;
              }}
              className="w-full h-full object-cover  parallax-img img-shadow rounded-3xl flex-1"
            />
          </div>
          <div className="p-8">
            <span className="label-md text-on-surface-variant/60 tracking-widest mb-2 block">
              PHASE VIII · MARRIAGE
            </span>
            <h4 className="font-serif text-3xl text-on-surface mb-2">
              Arranged Unity
            </h4>
            <p className="text-on-surface-variant max-w-sm font-light text-sm">
              Sacred ceremonies. Eternal bonds. The digital heirloom continues
              your voice for generations yet to come.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── The Village ────────────────────────────────────────── */
const TheVillage = () => (
  <section className="py-10 px-4 md:px-8 bg-surface-container-lowest">
    <div className="max-w-screen-2xl mx-auto space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="label-md text-primary tracking-[0.35em]">
          <RevealLabel text="SHARED LEGACY" />
        </span>
        <h2 className="font-serif text-4xl md:text-5xl">
          It takes a <span className="text-sage-italic">village</span>.
        </h2>
        <p className="text-base text-on-surface-variant font-light leading-relaxed">
          Neev is built for the entire family ecosystem—uniting fathers,
          mothers, grandparents, and children in a shared space of cultural
          wisdom and a healthy future.
        </p>
      </div>
      <div className="village-cards grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            src: "/images/neev_real_home.png",
            remote: REMOTE.elder,
            tag: "Heritage",
            title: "Cultural Roots",
            desc: "Grandparents seamlessly passing down ancestral stories and timeless values into the family vault.",
            offset: "",
          },
          {
            src: "/images/neev_role_father_1774253754421.png",
            remote: REMOTE.familyHome,
            tag: "Partnership",
            title: "Shared Parenting",
            desc: "Equitable involvement. Fathers and mothers co-piloting the daily rhythms together.",
            offset: "md:mt-12",
          },
          {
            src: "/images/neev_new_job.png",
            remote: REMOTE.familyTea,
            tag: "Tomorrow",
            title: "Healthy Future",
            desc: "Building a foundation of joy and holistic wellness for the whole family.",
            offset: "md:mt-24",
          },
        ].map((item, i) => (
          <div key={i} className={`space-y-0 tilt-card ${item.offset}`}>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src={item.src}
                alt={item.title}
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.src !== item.remote) el.src = item.remote;
                }}
                className="w-full h-full object-cover parallax-img"
              />
              {/* Title feature overlay */}
              <div className="absolute bottom-0 left-0 right-0 ">
                <div className="bg-surface-container/95 backdrop-blur-sm px-4 py-3">
                  <span className="label-md text-primary tracking-[0.2em] block mb-0.5">
                    {item.tag.toUpperCase()}
                  </span>
                  <h3 className="font-serif text-base text-on-surface leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-on-surface-variant font-light text-xs leading-relaxed mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Features ───────────────────────────────────────────── */
const Features = () => (
  <section className="py-12 px-4 md:px-8 relative overflow-hidden bg-surface">
    <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center gap-14">
      <div className="features-images w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative rounded-2xl overflow-hidden aspect-square">
          <img
            src="/images/neev_vault.png"
            alt="Legacy vault"
            onError={(e) => {
              const el = e.currentTarget;
              if (el.src !== REMOTE.vault) el.src = REMOTE.vault;
            }}
            className="w-full h-full object-cover parallax-img"
          />
          <div className="absolute  bottom-0 left-0 right-0">
            <div className="bg-surface-container/95 backdrop-blur-sm rounded-none px-3 py-2">
              <p className="label-md text-primary tracking-[0.18em]">
                LEGACY VAULT
              </p>
              <p className="font-serif text-xs text-on-surface mt-0.5">
                Encrypted family archive
              </p>
            </div>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden aspect-square sm:mt-8">
          <img
            src="/images/neev_role_elder_1774253476030.png"
            alt="Family gathering"
            onError={(e) => {
              const el = e.currentTarget;
              if (el.src !== REMOTE.father) el.src = REMOTE.father;
            }}
            className="w-full h-full object-cover parallax-img"
          />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-surface-container/95 backdrop-blur-sm px-3 py-2 rounded-none">
              <p className="label-md text-primary tracking-[0.18em]">
                ANCESTRAL WISDOM
              </p>
              <p className="font-serif text-xs text-on-surface mt-0.5">
                Stories preserved forever
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="features-text w-full lg:w-1/2">
        <span className="label-md text-primary mb-4 block tracking-[0.3em]">
          <RevealLabel text="THE NEEV LEDGER" />
        </span>
        <h2 className="font-serif text-4xl md:text-5xl mb-9 leading-[1.05]">
          Preserve <span className="text-sage-italic">every</span> breath,
          <br />
          every <span className="text-sage-italic">lesson</span>.
        </h2>
        <div className="space-y-8">
          {[
            {
              num: "01",
              title: "Automated Lineage Mapping",
              text: "Visualise your family tree as a blooming garden, showing connections across five centuries.",
            },
            {
              num: "02",
              title: "Ancestral Audio Preservation",
              text: "High-fidelity voice synthesis keeping the warmth of your family's storytellers alive forever.",
            },
            {
              num: "03",
              title: "Secure Cultural Archive",
              text: "Heritage documents, handwritten recipes, mantras, and family wisdom—encrypted and timeless.",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-5 group">
              <span className="font-serif text-lg italic text-primary/25 group-hover:text-primary/60 transition-colors shrink-0">
                {item.num}
              </span>
              <div>
                <h4 className="font-serif text-lg mb-1">{item.title}</h4>
                <p className="text-on-surface-variant font-light text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─── Tailored Guidance ──────────────────────────────────── */
const TailoredGuidance = () => (
  <section className="py-10 px-4 md:px-8 bg-surface-container-low">
    <div className="max-w-screen-2xl mx-auto">
      <div className="text-center mb-12">
        <span className="label-md text-primary tracking-[0.3em] mb-3 block">
          THE ARCHIVE
        </span>
        <h2 className="font-serif text-3xl">
          Living <span className="text-sage-italic">Heritage</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
        {[
          {
            img: REMOTE.leatherJournal,
            title: "The Journal",
            desc: "Digitally curated archival entries documenting every milestone with emotional context and cultural significance.",
          },
          {
            img: REMOTE.ancientDocs,
            title: "The Lineage Docs",
            desc: "Secure storage for heritage documents, health records, genealogical artifacts, and ancestral wisdom.",
            offset: "md:mt-8",
          },
          {
            img: REMOTE.ritualFlowers,
            title: "Living Rituals",
            desc: "Seasonal guidance on traditional celebrations, pujas, and personal growth rites.",
          },
        ].map((item, i) => (
          <div key={i} className={`space-y-4 ${item.offset}`}>
            <div className="rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover parallax-img"
              />
            </div>
            <h3 className="font-serif text-xl text-on-surface">{item.title}</h3>
            <p className="text-on-surface-variant font-light leading-relaxed text-sm">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AIGuardian = () => (
  <section
    id="guidance"
    className="page-sec bg-surface px-4 md:px-8 py-12 overflow-hidden"
    data-section="guardian"
  >
    <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
      {/* Left: Elder grandpa with laptop + voice card */}
      <div className="guardian-left w-full lg:w-[42%] order-2 lg:order-1 relative">
        <div className="absolute -top-4  -right-4 z-10 w-44 ">
          <div className="bg-surface rounded-md px-8 py-4 gap-2 flex flex-col">
            <p className="label-lg text-primary tracking-[0.2em]">
              AI GUARDIAN
            </p>
            <p className="font-serif text-md text-on-surface leading-snug">
              Your family's elder, always listening
            </p>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-surface-container">
          <img
            src="/images/neev_guardian_laptop.png"
            alt="Grandpa — your AI Guardian"
            onError={(e) => {
              const el = e.currentTarget;
              if (el.src !== REMOTE.guardianLaptop)
                el.src = REMOTE.guardianLaptop;
            }}
            className="w-full aspect-[3/4] object-cover object-top"
          />
          {/* Title feature overlay */}

          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="label-md text-primary tracking-[0.2em]">
                GUARDIAN VOICE ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-[3px] h-6 mb-2">
              {[20, 50, 75, 40, 90, 60, 30, 80, 50, 85, 25, 65].map((h, i) => (
                <div
                  key={i}
                  className="wave-bar flex-1 bg-primary rounded-full opacity-70"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.09}s` }}
                />
              ))}
            </div>
            <p className="font-serif italic text-on-surface text-sm leading-snug">
              "Rohan's piano is at 4pm. Dinner is protected. I've archived
              today's milestones."
            </p>
          </div>
        </div>
        <div className="mt-3 bg-primary-container px-4 py-1.5 rounded-full inline-block">
          <p className="label-md text-primary tracking-[0.15em]">
            GRANDPA · AI GUARDIAN
          </p>
        </div>
      </div>

      {/* Right: Copy + Chat */}
      <div className="guardian-right w-full lg:w-[58%] order-1 lg:order-2">
        <span className="label-md text-primary mb-4 block tracking-[0.25em]">
          GUARDIAN INTELLIGENCE
        </span>
        <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-6">
          Not a chatbot,
          <br />
          <span className="text-sage-italic">your family elder</span>
        </h2>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4 font-light">
          The Guardian unites Google AI, Gemini, and Claude into one wise family
          presence. It anticipates, remembers, and acts—so{" "}
          <strong className="font-medium text-on-surface">
            nothing is ever left behind
          </strong>
          .
        </p>
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {["Google AI", "Gemini", "Claude", "Google Calendar", "Gmail"].map(
            (s) => (
              <span
                key={s}
                className="text-[9px] font-sans font-bold tracking-widest bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-full"
              >
                {s}
              </span>
            ),
          )}
        </div>
        {/* Responsive Device Frame */}
        <div className="relative mx-auto mt-2 mb-4 overflow-hidden bg-white transition-all duration-300 w-[280px] sm:w-[320px] aspect-[9/19] rounded-[3rem] md:w-full md:aspect-auto md:max-w-xl md:rounded-2xl">
          {/* Mobile Phone Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[84px] h-6 bg-white rounded-full md:hidden z-20" />

          {/* MacOS Window Header (Desktop only) */}
          <div className="hidden md:flex bg-surface-container px-4 py-3 items-center gap-2 relative z-20">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <div className="absolute left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant/40 font-mono tracking-widest uppercase">
              Guardian Console
            </div>
          </div>

          {/* Screen Content */}
          <div className="relative flex flex-col h-full z-10 bg-surface-container-low">
            {/* Chat Header */}
            <div className="bg-primary px-5 pb-3.5 pt-10 md:pt-4 flex items-center gap-4 shrink-0 relative z-10">
              <img
                src="/maskable_icon.png"
                alt="Guardian"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.src !== REMOTE.elder) el.src = REMOTE.elder;
                }}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div>
                <p className="text-on-primary font-serif text-base mb-0.5 leading-none">
                  Grand · Guardian AI
                </p>
                <div className="flex items-center gap-1.5 opacity-80 mt-1">
                  <p className="text-[10px] font-mono font-serif text-white tracking-widest uppercase leading-none mt-0.5">
                    ACTIVE
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-5 md:p-6 space-y-4 flex-1 overflow-y-auto hide-scrollbar pb-6 bg-surface">
              <div className="bg-surface-container-low px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%]">
                <p className="text-[13px] md:text-sm text-on-surface-variant font-light leading-relaxed">
                  Did Rohan submit his college application?
                </p>
              </div>
              <div className="bg-primary px-4 py-3 rounded-2xl rounded-tr-none ml-auto max-w-[85%]">
                <p className="text-[13px] md:text-sm text-on-primary font-serif italic leading-relaxed">
                  "Yes—submitted on March 18th. Confirmation saved in Vault →
                  Education 2026. Deadline for the next university is April 10."
                </p>
              </div>
              <div className="bg-surface-container-low px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] mt-6">
                <p className="text-[13px] md:text-sm text-on-surface-variant font-light leading-relaxed">
                  What should I not forget today?
                </p>
              </div>
              <div className="bg-primary px-4 py-3 rounded-2xl rounded-tr-none ml-auto max-w-[85%]">
                <p className="text-[13px] md:text-sm text-on-primary font-serif italic leading-relaxed">
                  "Piano at 4pm. Wedding anniversary in 3 days—I've already
                  noted the ritual. Dinner is protected at 7pm."
                </p>
              </div>
            </div>

            {/* Chat Input */}
            <div className="bg-surface px-4 py-4 md:px-6 flex items-center gap-3 shrink-0">
              <div className="flex-1 bg-surface-container-low rounded-full px-5 py-3 text-xs md:text-sm text-on-surface-variant/40 tracking-wide">
                Ask your Guardian…
              </div>
              <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-on-primary text-sm">
                  arrow_upward
                </span>
              </button>
            </div>
          </div>
        </div>
        <ul className="space-y-4">
          {[
            {
              icon: "memory",
              title: "Contextual Memory",
              text: "Remembers allergies, preferences, school schedules, and every family milestone.",
            },
            {
              icon: "wb_sunny",
              title: "Morning Briefings",
              text: "Curated daily summaries from Google Calendar, Gmail, and Drive — delivered with calm clarity.",
            },
            {
              icon: "event_available",
              title: "Conflict Resolution",
              text: "Spots scheduling clashes before they become a crisis.",
            },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-primary text-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
              </div>
              <div>
                <p className="font-serif text-base text-on-surface">
                  {item.title}
                </p>
                <p className="text-xs text-on-surface-variant font-light leading-relaxed mt-0.5">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

/* ─── Personas ──────────────────────────────────────────── */
const Personas = () => {
  const [activeTab, setActiveTab] = React.useState("mother");
  const tabs = [
    { id: "mother", label: "FOR MOTHERS" },
    { id: "father", label: "FOR FATHERS" },
    { id: "grandparent", label: "FOR ELDERS" },
  ];
  const content: Record<
    string,
    { quote: string; text: string; img: string; remote: string }
  > = {
    mother: {
      quote: "The mental load is finally visible, and shared.",
      text: "Neev organizes the invisible labor of parenting. School notices are automatically parsed, vaccinations tracked, and the Guardian ensures nothing falls through.",
      img: "/images/neev_role_mother_1774253680740.png",
      remote: REMOTE.mother,
    },
    father: {
      quote: "I can finally be present without asking what needs doing.",
      text: "Gain immediate visibility into the family's rhythm. The Guardian briefs you on what matters today, so you can step in proactively and meaningfully.",
      img: "/images/neev_role_father.png",
      remote: REMOTE.father,
    },
    grandparent: {
      quote: "Connected to their growth, without the noise.",
      text: "A quiet, curated view of your grandchildren's milestones. No chaotic group chats—just the moments that matter.",
      img: "/images/neev_role_elder.png",
      remote: REMOTE.elder,
    },
  };
  return (
    <section className="py-10 bg-surface-container-low px-4 md:px-8 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        <div className="w-full lg:w-1/2">
          <span className="label-md text-primary mb-4 block tracking-[0.3em]">
            EVERY ROLE
          </span>
          <h2 className="font-serif text-3xl md:text-4xl leading-[1.05] mb-9">
            A sanctuary for
            <br />
            <span className="text-sage-italic">every generation</span>
          </h2>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0 mb-7">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-on-primary bg-surface-container text-on-surface-variant px-5 py-2.5 rounded-full transition-colors label-md tracking-[0.18em]"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="min-h-[160px] animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <p className="font-serif italic text-xl text-on-surface leading-tight mb-4">
                  "{content[tab.id].quote}"
                </p>
                <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                  {content[tab.id].text}
                </p>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden">
            <img
              key={activeTab}
              src={content[activeTab].img}
              alt={activeTab}
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src !== content[activeTab].remote)
                  el.src = content[activeTab].remote;
              }}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Guardian Quote ─────────────────────────────────────── */
const GuardianQuote = () => (
  <section
    className="page-sec bg-on-surface px-4 md:px-8 py-16"
    data-section="quote"
  >
    <div className="max-w-4xl mx-auto text-center">
      <blockquote className="font-serif text-2xl md:text-3xl italic text-surface leading-[1.4] mb-9">
        "We do not inherit the earth from our ancestors, we borrow it from our
        children. Neev is the bridge that ensures we return it with wisdom
        added."
      </blockquote>
      <cite className="label-md tracking-[0.4em] text-surface/40 not-italic">
        THE ELDER COUNSEL · GUARDIAN WISDOM
      </cite>
    </div>
  </section>
);

/* ─── Daily Rhythms ─────────────────────────────────────── */
const DailyRhythms = () => (
  <section className="py-10 px-4 md:px-8 bg-surface-container-low overflow-hidden">
    <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
      <div className="daily-rhythms-left space-y-8">
        <div>
          <span className="label-md text-primary tracking-[0.3em] mb-3 block">
            DAILY INTELLIGENCE
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-on-surface leading-tight">
            Mastering the
            <br />
            <span className="text-sage-italic">Daily Rhythm.</span>
          </h2>
        </div>
        <div className="space-y-6">
          {[
            {
              icon: "calendar_month",
              color: "bg-primary-container",
              textColor: "text-primary",
              title: "Synchronized Calendars",
              text: "Fragmented lives, united by a singular intelligence.",
            },
            {
              icon: "favorite",
              color: "bg-tertiary-container",
              textColor: "text-tertiary",
              title: "The Health Arc",
              text: "Tracking growth patterns, sleep cycles, and nutritional needs.",
            },
            {
              icon: "psychology",
              color: "bg-secondary-container",
              textColor: "text-secondary",
              title: "Cognitive Milestones",
              text: "AI-driven observation that notes emerging talents and developmental windows.",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div
                className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}
              >
                <span
                  className={`material-symbols-outlined ${item.textColor} text-base`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
              </div>
              <div>
                <h5 className="font-serif text-lg text-on-surface mb-0.5">
                  {item.title}
                </h5>
                <p className="text-on-surface-variant font-light text-xs leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="daily-rhythms-right space-y-4">
        <div className="bg-surface-container rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-serif text-base">Today's Presence</p>
              <p className="label-md text-on-surface-variant/40 tracking-widest mt-0.5">
                SURYA CYCLE · 10:45 AM
              </p>
            </div>
            <span className="material-symbols-outlined text-primary text-lg">
              analytics
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-14">
            {[3, 5, 4, 7, 5, 8, 6].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-700 hover:opacity-80 cursor-pointer ${i === 5 ? "bg-primary" : "bg-primary/20"}`}
                style={{ height: `${h * 10}px` }}
              />
            ))}
          </div>
          <p className="label-md text-on-surface-variant/40 tracking-[0.15em] mt-5 px-1">
            HARMONY INDEX · 98% OPTIMAL
          </p>
        </div>
        <div className="bg-surface-container-low/80 backdrop-blur-md rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-secondary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                notifications_active
              </span>
            </div>
            <span className="label-md text-secondary/70 tracking-widest">
              GUARDIAN NOTE
            </span>
          </div>
          <p className="font-serif text-lg text-on-surface leading-snug">
            "It's time for evening storytelling. The nursery lights have been
            dimmed."
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Integrations ──────────────────────────────────────── */
const Integrations = () => {
  const services = [
    {
      name: "Calendar",
      icon: <GoogleCalendarIcon className="w-8 h-8" />,
      bg: "bg-[#EFF3FF]",
      textColor: "text-[#4285F4]",
      desc: "Sync family events, school exams & rituals",
    },
    {
      name: "Tasks",
      icon: (
        <span className="material-symbols-outlined text-[#34A853] text-4xl">
          task_alt
        </span>
      ),
      bg: "bg-[#E8F5E9]",
      textColor: "text-[#34A853]",
      desc: "Coordinate household chores & medication lists",
    },
    {
      name: "Drive",
      icon: <GoogleDriveIcon className="w-8 h-8" />,
      bg: "bg-[#FFF8E1]",
      textColor: "text-[#FBBC04]",
      desc: "Vault documents, certificates & heirlooms",
    },
    {
      name: "Gmail",
      icon: <GoogleGmailIcon className="w-8 h-8" />,
      bg: "bg-[#FEF0EE]",
      textColor: "text-[#EA4335]",
      desc: "Digest school & community announcements",
    },
    {
      name: "Photos",
      icon: <GooglePhotosIcon className="w-8 h-8" />,
      bg: "bg-[#E8F5E9]",
      textColor: "text-[#34A853]",
      desc: "Curate multi-generational milestone albums",
    },
  ];
  return (
    <section
      id="integrations"
      className="py-20 bg-surface-container-lowest px-4 md:px-8 text-center overflow-hidden border-y border-outline-variant/20"
    >
      <div className="max-w-4xl mx-auto">
        <span className="label-md text-primary/80 mb-4 block tracking-[0.3em]">
          SEAMLESS HARMONY
        </span>
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-6 text-on-surface">
          Integrated with your
          <br />
          <span className="text-sage-italic">Google Ecosystem</span>
        </h2>
        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-12 font-light max-w-2xl mx-auto">
          Neev synchronizes with Google Calendar, Google Tasks, and Google Drive
          to automate your family's logistics—silently, securely, and gracefully.
        </p>
        <div className="integrations-icons grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 mb-12">
          {services.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-surface border border-outline-variant/30 hover:border-primary/40 transition-all duration-300 group hover:-translate-y-1"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center transition-all duration-300 group-hover:scale-105`}
              >
                {item.icon}
              </div>
              <span
                className={`label-md tracking-[0.15em] font-semibold ${item.textColor}`}
              >
                {item.name.toUpperCase()}
              </span>
              <p className="text-xs text-on-surface-variant leading-tight">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Google Compliance Limited Use Badge */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-4 rounded-2xl bg-surface-container-low border border-primary/20 text-xs text-on-surface-variant max-w-2xl">
          <span className="material-symbols-outlined text-primary text-xl shrink-0">
            verified_user
          </span>
          <p className="text-left leading-relaxed">
            <strong>Google API Policy Compliance:</strong> Neev adheres to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline font-medium"
            >
              Google API Services User Data Policy
            </a>
            , including Limited Use requirements. Your data is never sold, never
            used for ads, and never used to train AI models.{" "}
            <Link to="/privacy-policy" className="text-primary underline font-medium">
              Read our full Privacy Policy →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

/* ─── How It Works ──────────────────────────────────────── */
const HowItWorks = () => (
  <section className="bg-surface-container-low py-16 px-4 md:px-8">
    <div className="max-w-screen-2xl mx-auto">
      <div className="text-center mb-14">
        <span className="label-md text-primary mb-3 block tracking-[0.25em]">
          THE PROCESS
        </span>
        <h2 className="font-serif text-3xl">
          Simplicity by <span className="text-sage-italic">design</span>
        </h2>
      </div>
      <div className="how-it-works-steps grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        {[
          {
            num: "01",
            icon: "hub",
            title: "Seed the Data",
            text: "Input your family history, values, and routines into the secure Neev vault.",
          },
          {
            num: "02",
            icon: "psychology",
            title: "Attune the Guardian",
            text: "Our AI learns the unique emotional and cultural nuance of your household.",
          },
          {
            num: "03",
            icon: "eco",
            title: "Watch it Bloom",
            text: "Receive daily insights, predictive care, and long-term wisdom tailored to your lineage.",
          },
        ].map((step, i) => (
          <div
            key={i}
            className="relative z-10 flex flex-col items-center text-center group"
          >
            <div className="w-[88px] h-[88px] rounded-full bg-primary-container flex items-center justify-center mb-7 transition-colors duration-300 group-hover:bg-primary">
              <span className="material-symbols-outlined text-3xl text-primary group-hover:text-on-primary transition-colors">
                {step.icon}
              </span>
            </div>
            <h3 className="font-serif text-lg text-on-surface mb-2">
              {step.title}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed max-w-[220px] font-light">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Testimonials ──────────────────────────────────────── */
const Testimonials = () => (
  <section className="py-10 bg-surface px-4 md:px-8 overflow-hidden">
    <div className="max-w-screen-2xl mx-auto">
      <div className="text-center mb-12">
        <span className="label-md text-primary mb-3 block tracking-[0.25em]">
          <RevealLabel text="THE COMMUNITY" />
        </span>
        <h2 className="font-serif text-3xl">
          A quiet revolution in{" "}
          <span className="text-sage-italic">modern parenting</span>
        </h2>
      </div>
      <div className="testimonials-grid columns-1 md:columns-3 gap-5">
        {[
          {
            quote:
              "It feels like having a wise elder living with us. It doesn't nag. It just quietly ensures we don't drop the ball on what matters.",
            name: "Priya M.",
            role: "Mother of Two, Mumbai",
          },
          {
            quote:
              "The ritual guidance has brought calm back to our chaotic mornings. A true digital heirloom.",
            name: "David L.",
            role: "Father, Singapore",
          },
          {
            quote:
              "I used to feel guilty about missing school emails. Now the Guardian parses them and tells me exactly what I need.",
            name: "Rahul S.",
            role: "Working Father, Bengaluru",
          },
          {
            quote:
              "It caught a subtle health pattern in our daughter weeks before we noticed. The peace of mind is priceless.",
            name: "Priya K.",
            role: "Mother, London",
          },
          {
            quote:
              "家族のスケジュールが一つにまとまり、本当に助かっています。静かで、必要な時だけ教えてくれる。",
            name: "Yuki T.",
            role: "Tokyo",
          },
          {
            quote:
              "Connected to my grandchildren's milestones without the noise of group chats. Dignified and beautiful.",
            name: "Nalini A.",
            role: "Elder, Chennai",
          },
        ].map((t, i) => (
          <div
            key={i}
            className="break-inside-avoid bg-surface-container p-7 rounded-2xl mb-4"
          >
            <span className="font-serif text-4xl text-primary/20 leading-none block -mb-1">
              "
            </span>
            <p className="font-serif italic text-base text-on-surface leading-[1.6] mb-5">
              {t.quote}
            </p>
            <p className="label-md text-on-surface tracking-[0.12em]">
              {t.name.toUpperCase()}
            </p>
            <p className="text-[10px] text-on-surface-variant mt-0.5 tracking-wider">
              {t.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Social Proof ──────────────────────────────────────── */
const SocialProof = () => {
  const stats = [
    { to: 1000, suffix: "+", label: "Founding Families", icon: "groups" },
    {
      to: 50000,
      suffix: "+",
      label: "Milestones Preserved",
      icon: "bookmark_star",
    },
    {
      to: 12000,
      suffix: "+",
      label: "AI Insights Delivered",
      icon: "psychology",
    },
    { to: 8000, suffix: "+", label: "Cultural Moments", icon: "auto_awesome" },
  ];
  return (
    <section className="py-10 bg-surface-container-low px-4 md:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-14">
          <span className="label-md text-primary tracking-[0.25em] mb-3 block">
            <RevealLabel text="TRUSTED BY FAMILIES" />
          </span>
          <h2 className="font-serif text-3xl">
            A growing <span className="text-sage-italic">movement</span>
          </h2>
          <p className="text-on-surface-variant font-light text-sm mt-3 max-w-md mx-auto">
            Families across India and the diaspora are quietly building their
            digital sanctuaries with Neev.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-surface rounded-2xl p-7 text-center card-hover tilt-card"
            >
              <span className="material-symbols-outlined text-3xl text-primary/50 mb-3 block">
                {s.icon}
              </span>
              <p className="font-serif text-3xl text-on-surface mb-1">
                <CountUp to={s.to} suffix={s.suffix} />
              </p>
              <p className="text-xs text-on-surface-variant font-light tracking-wide uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-30">
          {["YourStory", "Inc42", "Economic Times", "TechCrunch India"].map(
            (name) => (
              <span
                key={name}
                className="label-md tracking-[0.2em] text-on-surface-variant"
              >
                {name.toUpperCase()}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

/* ─── Referral Program ──────────────────────────────────── */
const ReferralProgram = () => {
  const [copied, setCopied] = React.useState(false);
  const referralCode = "NEEV-FAMILY-2026";

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareUrl = "https://neev.app?ref=" + referralCode;
  const shareText =
    "Join Neev — the AI-guided family OS for modern Indian families. Preserve your cultural legacy, coordinate shared parenting, and connect generations. 🌿";

  const shareLinks = [
    {
      label: "WhatsApp",
      icon: "chat",
      color:
        "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary",
      href: `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    },
    {
      label: "Twitter",
      icon: "share",
      color:
        "bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "Email",
      icon: "mail",
      color:
        "bg-tertiary-container text-on-tertiary-container hover:bg-tertiary hover:text-on-tertiary",
      href: `mailto:?subject=${encodeURIComponent("Join Neev — The Family OS")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    },
  ];

  const tiers = [
    { count: 3, reward: "1 month free Premium", icon: "star" },
    {
      count: 5,
      reward: "3 months free + Legacy Badge",
      icon: "workspace_premium",
    },
    {
      count: 10,
      reward: "Lifetime Founding Family status",
      icon: "diamond",
    },
  ];

  return (
    <section className="py-16 bg-surface px-4 md:px-8" id="referral">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-14">
          <span className="label-md text-primary tracking-[0.25em] mb-3 block">
            GROW THE LINEAGE
          </span>
          <h2 className="font-serif text-3xl md:text-4xl">
            Invite your <span className="text-sage-italic">circle</span>
          </h2>
          <p className="text-on-surface-variant font-light text-sm mt-3 max-w-lg mx-auto">
            Every great family tree grows when you extend the invitation. Share
            Neev with the families who matter and unlock exclusive rewards.
          </p>
        </div>

        {/* Referral Code */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex items-center bg-surface-container rounded-full p-2 pl-6">
            <span className="text-sm font-mono text-on-surface tracking-widest grow">
              {referralCode}
            </span>
            <button
              onClick={copyCode}
              className={`px-6 py-2.5 rounded-full label-md tracking-[0.18em] transition-all active:scale-95 ${
                copied
                  ? "bg-primary text-on-primary"
                  : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary"
              }`}
            >
              {copied ? "COPIED!" : "COPY CODE"}
            </button>
          </div>
        </div>

        {/* 3-Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {[
            {
              step: "01",
              icon: "share",
              title: "Share Your Link",
              desc: "Send your unique referral code to family and friends via WhatsApp, email, or social.",
            },
            {
              step: "02",
              icon: "group_add",
              title: "They Join Neev",
              desc: "When they create an account using your code, they get a special welcome bonus.",
            },
            {
              step: "03",
              icon: "celebration",
              title: "Both Earn Rewards",
              desc: "You and your referral both unlock premium features. The more you share, the more you earn.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="text-center bg-surface-container-low p-8 rounded-2xl card-hover tilt-card"
            >
              <div className="w-16 h-16 rounded-full bg-primary-container mx-auto flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-2xl text-primary">
                  {s.icon}
                </span>
              </div>
              <h3 className="font-serif text-lg text-on-surface mb-2">
                {s.title}
              </h3>
              <p className="text-xs text-on-surface-variant font-light leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Reward Tiers */}
        <div className="max-w-2xl mx-auto mb-12">
          <h3 className="font-serif text-xl text-center mb-6">
            Reward <span className="text-sage-italic">Tiers</span>
          </h3>
          <div className="space-y-3">
            {tiers.map((t) => (
              <div
                key={t.count}
                className="flex items-center justify-between bg-surface-container-low px-7 py-5 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-xl text-primary">
                    {t.icon}
                  </span>
                  <span className="font-serif text-base text-on-surface">
                    {t.count} referrals
                  </span>
                </div>
                <span className="text-sm text-on-surface-variant font-light">
                  {t.reward}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {shareLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-sans transition-all ${s.color}`}
            >
              <span className="material-symbols-outlined text-base">
                {s.icon}
              </span>
              Share via {s.label}
            </a>
          ))}
          <button
            onClick={copyCode}
            className="flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-sans bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-base">
              content_copy
            </span>
            Copy Link
          </button>
        </div>
      </div>
    </section>
  );
};

/* ─── Share CTA (sticky) ────────────────────────────────── */
const SHARE_PALETTE = [
  {
    bg: "bg-primary",
    text: "text-on-primary",
    btn: "bg-on-primary/10 hover:bg-on-primary/20",
  },
  {
    bg: "bg-secondary",
    text: "text-on-secondary",
    btn: "bg-on-secondary/10 hover:bg-on-secondary/20",
  },
  {
    bg: "bg-on-surface",
    text: "text-surface",
    btn: "bg-surface/10 hover:bg-surface/20",
  },
  {
    bg: "bg-tertiary",
    text: "text-on-tertiary",
    btn: "bg-on-tertiary/10 hover:bg-on-tertiary/20",
  },
];

const ShareCTA = () => {
  const [dismissed, setDismissed] = React.useState(false);
  const [paletteIdx, setPaletteIdx] = React.useState(0);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const idx =
        Math.floor((y / Math.max(total, 1)) * SHARE_PALETTE.length) %
        SHARE_PALETTE.length;
      if (idx !== last) {
        last = idx;
        setPaletteIdx(idx);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const palette = SHARE_PALETTE[paletteIdx];
  if (dismissed) return null;

  const shareUrl = "https://neev.app";
  const shareText =
    "Neev — the AI-guided family OS for modern Indian families 🌿";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Neev — The Modern Indian Family OS",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 pointer-events-none">
      <div
        className={`max-w-xl mx-auto ${palette.bg} rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4 pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className={`material-symbols-outlined text-lg sm:text-xl ${palette.text} shrink-0`}>
            favorite
          </span>
          <p className={`text-[10px] sm:text-sm font-sans ${palette.text} truncate`}>
            Share <span className="font-serif italic">Neev</span> with your
            family
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-9 h-9 rounded-full ${palette.btn} flex items-center justify-center transition-colors`}
            aria-label="Share on WhatsApp"
          >
            <span
              className={`material-symbols-outlined text-base ${palette.text}`}
            >
              chat
            </span>
          </a>
          <button
            onClick={handleNativeShare}
            className={`w-9 h-9 rounded-full ${palette.btn} flex items-center justify-center transition-colors`}
            aria-label="Share link"
          >
            <span
              className={`material-symbols-outlined text-base ${palette.text}`}
            >
              share
            </span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className={`w-9 h-9 rounded-full ${palette.btn} flex items-center justify-center transition-colors`}
            aria-label="Dismiss"
          >
            <span
              className={`material-symbols-outlined text-base ${palette.text}`}
            >
              close
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Pricing ──────────────────────────────────────────── */
const Pricing = () => {
  const handleScroll = () =>
    document.getElementById("sanctuary")?.scrollIntoView({ behavior: "smooth" });
  return (
    <section
      id="pricing"
      className="py-10 px-4 md:px-8 overflow-hidden bg-surface-container-low"
    >
      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
        <div className="w-full lg:w-[26%]">
          <span className="label-md text-primary tracking-[0.3em]">
            INVESTMENT
          </span>
          <h2 className="font-serif text-3xl mt-4 mb-5">
            Securing the
            <br />
            <span className="text-sage-italic">Future</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed font-light text-sm mb-7">
            Choose the tier that fits your household. No contracts—only
            commitment to growth. Early-access families lock in their rate
            forever.
          </p>
          <div className="space-y-3">
            {["ANNUAL SAVINGS 40%", "CANCEL ANYTIME", "PRIVACY FIRST"].map(
              (l) => (
                <div
                  key={l}
                  className="flex items-center gap-3 label-md text-on-surface-variant tracking-[0.12em]"
                >
                  {l}
                </div>
              ),
            )}
          </div>
        </div>
        <div className="w-full lg:w-[74%] grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="bg-surface-container p-7 flex flex-col rounded-2xl h-full">
            <h5 className="label-md tracking-widest mb-7 text-on-surface-variant/50">
              SEED
            </h5>
            <div className="mb-7">
              <span className="text-3xl font-serif">Free</span>
            </div>
            <ul className="space-y-3 text-sm text-on-surface-variant mb-auto font-light">
              {["Calendar Sync", "2 Children", "Basic Guardian"].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleScroll}
              className="mt-8 label-md tracking-widest text-primary text-left w-fit hover:opacity-70 transition-opacity"
            >
              EXPLORE FREE →
            </button>
          </div>
          <div className="bg-on-surface text-surface p-7 flex flex-col rounded-2xl relative">
            <div className="mb-4 bg-primary text-on-primary label-md px-4 py-1.5 rounded-full tracking-[0.2em] inline-block self-start">
              FOUNDING RATE
            </div>
            <h5 className="label-md tracking-widest mb-7 text-surface/40">
              FAMILY
            </h5>
            <div className="mb-7">
              <span className="text-3xl font-serif">₹299</span>
              <span className="text-xs opacity-40 uppercase ml-2">/ month</span>
            </div>
            <ul className="space-y-3 text-sm text-surface/70 mb-auto font-light">
              {[
                "Unlimited Members",
                "Full AI Guardian",
                "Automated Logistics",
                "Milestone Predictive AI",
                "Heritage Documentation",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleScroll}
              className="mt-8 bg-primary text-on-primary px-6 py-3 w-full text-center label-md tracking-[0.2em] rounded-full hover:opacity-90 transition-opacity active:scale-95"
            >
              EXPLORE FAMILY
            </button>
          </div>
          <div className="bg-surface-container p-7 flex flex-col rounded-2xl h-full">
            <h5 className="label-md tracking-widest mb-7 text-on-surface-variant/50">
              PREMIUM
            </h5>
            <div className="mb-7">
              <span className="text-3xl font-serif">₹999</span>
              <span className="text-xs text-on-surface-variant opacity-40 uppercase ml-2">
                / month
              </span>
            </div>
            <ul className="space-y-3 text-sm text-on-surface-variant mb-auto font-light">
              {[
                "Concierge Support",
                "Heritage Archiving",
                "Custom AI Training",
                "Genetic Insights",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleScroll}
              className="mt-8 bg-primary text-on-primary px-6 py-3 w-full text-center label-md tracking-[0.2em] rounded-xl hover:opacity-90 transition-all active:scale-95"
            >
              ENTER SANCTUARY
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── FAQ ───────────────────────────────────────────────── */
const FAQ = () => (
  <section className="py-10 bg-surface px-4 md:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <span className="label-md text-primary tracking-[0.25em] mb-3 block">
          QUESTIONS
        </span>
        <h2 className="font-serif text-3xl">
          Frequently <span className="text-sage-italic">Asked</span>
        </h2>
      </div>
      <div className="space-y-0">
        {[
          {
            question:
              "How does Neev support traditional Indian joint families?",
            answer:
              "Neev is explicitly architected for the multi-generational Indian family. It includes tailored roles for Grandparents, Parents, and Children, allowing seamless synchronization of daily rhythms and cultural event planning across households.",
          },
          {
            question:
              "Can I store family recipes, mantras, and cultural wisdom?",
            answer:
              "Yes. The Legacy Vault is designed for passing down your Virasat (heritage). You can archive audio recordings of ancestral stories, handwritten family recipes, and essential family values to be preserved for generations.",
          },
          {
            question: "Is my family data private and secure?",
            answer:
              "Absolutely. Neev uses end-to-end encryption for all personal and cultural data. Your family's vault is yours alone—we never train AI models on your private information.",
          },
        ].map((faq, i) => (
          <div key={i} className="py-7 group">
            <h3 className="font-serif text-lg text-on-surface mb-2.5 group-hover:text-primary transition-colors">
              {faq.question}
            </h3>
            <p className="text-on-surface-variant leading-relaxed font-light text-sm">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Waitlist ───────────────────────────────────────────── */
const Waitlist = () => (
  <section className="px-4 md:px-8 py-14">
    <div className="waitlist-inner bg-on-surface max-w-screen-2xl mx-auto p-6 sm:p-10 md:p-16 text-center rounded-3xl">
      <span className="label-md text-surface/40 tracking-[0.5em]">
        THE FINAL STEP
      </span>
      <h2 className="text-3xl md:text-5xl font-serif text-surface mt-5 mb-4">
        Join the <em className="text-sage-italic">Founding 1,000</em>
      </h2>
      <p className="text-surface/50 max-w-xl mx-auto mb-10 text-sm font-light">
        We are selectively onboarding 1,000 families to shape the first
        generation of the digital lineage. Secure your place.
      </p>
      <form
        className="max-w-md mx-auto flex flex-col md:flex-row gap-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="bg-surface/10 text-surface text-[11px] uppercase tracking-widest p-4 rounded-full focus:outline-none grow placeholder:text-surface/25"
          placeholder="YOUR EMAIL ADDRESS"
          type="email"
        />
        <button className="magnetic bg-primary text-on-primary px-7 py-4 label-md tracking-[0.2em] rounded-full hover:opacity-90 transition-opacity active:scale-95 whitespace-nowrap">
          REQUEST ENTRY
        </button>
      </form>
      <p className="mt-7 label-md text-surface/20 tracking-[0.2em]">
        NO SPAM · ONLY ESSENTIAL UPDATES · PRIVACY FIRST
      </p>
    </div>
  </section>
);

/* ─── Setu Ecosystem Family Section ─────────────────────── */
const SetuEcosystemSection = () => (
  <section
    id="ecosystem"
    className="py-20 px-4 md:px-8 bg-surface-container-lowest border-t border-outline-variant/30"
  >
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <span className="label-md text-primary tracking-[0.25em] uppercase text-xs block mb-2 font-mono">
            THE SETU ECOSYSTEM FAMILY
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-on-surface">
            Part of a Unified Engineering Lineage
          </h2>
          <p className="text-on-surface-variant max-w-2xl mt-3 text-sm md:text-base font-light leading-relaxed">
            Neev is proudly created by <strong>Amit Chakraborty</strong> (<code>@devamitch</code>)
            alongside <strong>BlinkQuest</strong> and <strong>Setu</strong>. Three pillars
            built with uncompromised privacy, zero data brokers, and deep craft.
          </p>
        </div>
        <a
          href="https://devamit.co.in"
          target="_blank"
          rel="noreferrer"
          className="magnetic px-6 py-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-mono tracking-wider transition-all whitespace-nowrap"
        >
          Developer Portfolio (devamit.co.in) →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* BlinkQuest */}
        <div className="p-7 rounded-3xl bg-surface border border-outline-variant/30 flex flex-col justify-between space-y-6 hover:border-primary/50 transition-all group hover:-translate-y-1">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
              <span className="material-symbols-outlined text-2xl">visibility</span>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-semibold text-on-surface">
                BlinkQuest
              </h3>
              <p className="text-xs text-primary font-mono mt-0.5">
                Mindful Vision & Blink Wellness
              </p>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Eye-wellness app for Android using on-device MediaPipe vision.
              Camera-checked blink breaks and eye tracking games that protect vision
              during screen time. Camera frames never leave the phone.
            </p>
          </div>
          <a
            href="https://blinkquest.devamit.co.in"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono font-medium text-primary hover:underline flex items-center gap-1.5 pt-2"
          >
            Explore blinkquest.devamit.co.in ↗
          </a>
        </div>

        {/* Setu */}
        <div className="p-7 rounded-3xl bg-surface border border-outline-variant/30 flex flex-col justify-between space-y-6 hover:border-primary/50 transition-all group hover:-translate-y-1">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-[#F57F17]">
              <span className="material-symbols-outlined text-2xl">hub</span>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-semibold text-on-surface">
                Setu
              </h3>
              <p className="text-xs text-primary font-mono mt-0.5">
                Ecosystem Bridge & Identity
              </p>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Unified decentralized identity, verifiable family credentials, and
              private synchronization protocol connecting the entire ecosystem
              lineage.
            </p>
          </div>
          <a
            href="https://setu.devamit.co.in"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono font-medium text-primary hover:underline flex items-center gap-1.5 pt-2"
          >
            Explore setu.devamit.co.in ↗
          </a>
        </div>

        {/* Neev */}
        <div className="p-7 rounded-3xl bg-surface border border-primary/40 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:-translate-y-1 transition-all">
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-wider">
            Active App
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF3FF] flex items-center justify-center text-[#1565C0]">
              <span className="material-symbols-outlined text-2xl">
                nest_clock_farsight_analog
              </span>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-semibold text-on-surface">
                Neev
              </h3>
              <p className="text-xs text-primary font-mono mt-0.5">
                The Modern Indian Family OS
              </p>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Multi-generational sanctuary uniting Google Calendar, Tasks, and
              Drive to automate family logistics, guide parenting, and pass down
              cultural heirlooms.
            </p>
          </div>
          <a
            href="https://devamit.co.in"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono font-medium text-primary hover:underline flex items-center gap-1.5 pt-2"
          >
            Meet the Architect (devamit.co.in) →
          </a>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Footer ────────────────────────────────────────────── */
export const Footer = () => (
  <footer className="bg-surface-container-low pt-16 pb-8 px-4 md:px-8 border-t border-outline-variant/30">
    <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
      <div className="md:col-span-4 space-y-4">
        <Link to="/" className="text-3xl font-serif italic text-primary block">
          Neev
        </Link>
        <p className="text-on-surface-variant font-light leading-relaxed max-w-sm text-sm">
          A deeply rooted digital sanctuary to orchestrate modern Indian family
          life, preserve cultural wisdom, and coordinate shared parenting
          gracefully.
        </p>
        <p className="text-xs font-mono text-on-surface-variant/70">
          Crafted by <strong>Amit Chakraborty</strong> (<code>@devamitch</code>) · Setu Ecosystem Family
        </p>
        <p className="font-serif text-lg text-primary/50 italic pt-1">
          परिवार की नींव · Digital Sanctuary
        </p>
      </div>

      <div className="md:col-span-2 space-y-3">
        <h5 className="label-md text-primary tracking-[0.2em] text-xs">SANCTUARY</h5>
        <ul className="space-y-2.5 text-sm">
          {[
            { label: "The Philosophy", href: "/#sanctuary" },
            { label: "Life Cycles", href: "/#life-cycles" },
            { label: "Google Sync", href: "/#integrations" },
            { label: "AI Guidance", href: "/#guidance" },
          ].map((l, i) => (
            <li key={i}>
              <a
                href={l.href}
                className="text-on-surface-variant hover:text-primary transition-colors font-light text-sm"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-3 space-y-3">
        <h5 className="label-md text-primary tracking-[0.2em] text-xs">SETU ECOSYSTEM</h5>
        <ul className="space-y-2.5 text-sm">
          <li>
            <a
              href="https://blinkquest.devamit.co.in"
              target="_blank"
              rel="noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors font-light flex items-center gap-1.5"
            >
              <span>BlinkQuest (Vision Care)</span>
              <span className="text-xs opacity-60">↗</span>
            </a>
          </li>
          <li>
            <a
              href="https://setu.devamit.co.in"
              target="_blank"
              rel="noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors font-light flex items-center gap-1.5"
            >
              <span>Setu (Identity Bridge)</span>
              <span className="text-xs opacity-60">↗</span>
            </a>
          </li>
          <li>
            <a
              href="https://devamit.co.in"
              target="_blank"
              rel="noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors font-light"
            >
              Developer Portfolio (devamit.co.in)
            </a>
          </li>
        </ul>
      </div>

      <div className="md:col-span-3 space-y-3">
        <h5 className="label-md text-primary tracking-[0.2em] text-xs">
          LEGAL & VERIFICATION
        </h5>
        <ul className="space-y-2.5 text-sm">
          <li>
            <Link
              to="/privacy-policy"
              className="text-primary font-medium hover:underline flex items-center gap-1"
            >
              <span>Privacy Policy</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                Google Verified
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/terms"
              className="text-on-surface-variant hover:text-primary transition-colors font-light"
            >
              Terms of Service
            </Link>
          </li>
          <li>
            <a
              href="mailto:amit@devamit.co.in"
              className="text-on-surface-variant hover:text-primary transition-colors font-mono text-xs"
            >
              amit@devamit.co.in
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="max-w-screen-2xl mx-auto pt-6 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-on-surface-variant/60">
      <p>© 2026 NEEV · THE MODERN HEIRLOOM · AMIT CHAKRABORTY (@DEVAMITCH)</p>
      <div className="flex gap-6">
        <Link to="/privacy-policy" className="hover:text-primary transition-colors">
          PRIVACY POLICY
        </Link>
        <Link to="/terms" className="hover:text-primary transition-colors">
          TERMS OF SERVICE
        </Link>
      </div>
    </div>
  </footer>
);

/* ─── Main Page ─────────────────────────────────────────── */
export default function LandingPage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* ── Hero word reveal — runs on ALL screen sizes ── */
    const heroWords = document.querySelectorAll<HTMLElement>(".hero-word");
    if (heroWords.length) {
      gsap.from(heroWords, {
        yPercent: 105,
        opacity: 0,
        stagger: 0.16,
        duration: 1.1,
        ease: "expo.out",
        delay: 0.15,
      });
    }

    /* ── Universal section entrance (all screen sizes) ── */
    const fadeUpTargets = [
      { sel: ".page-sec", start: "top 88%", y: 28, dur: 1.4 },
      {
        sel: "#sanctuary .card-hover",
        start: "top 70%",
        y: 50,
        stagger: 0.14,
        dur: 1.1,
      },
      {
        sel: ".village-cards > div",
        start: "top 75%",
        y: 70,
        stagger: 0.18,
        dur: 1.3,
      },
      { sel: ".features-images", start: "top 78%", y: 0, x: -60, dur: 1.3 },
      {
        sel: ".features-text",
        start: "top 78%",
        y: 0,
        x: 60,
        dur: 1.3,
        delay: 0.1,
      },
      { sel: ".guardian-left", start: "top 72%", y: 0, x: -70, dur: 1.3 },
      {
        sel: ".guardian-right",
        start: "top 72%",
        y: 0,
        x: 70,
        dur: 1.3,
        delay: 0.1,
      },
      {
        sel: "#pricing .card-hover",
        start: "top 75%",
        y: 45,
        stagger: 0.13,
        dur: 1.1,
      },
      {
        sel: "#referral > div > *",
        start: "top 78%",
        y: 35,
        stagger: 0.1,
        dur: 1.1,
      },
      {
        sel: "[data-section='quote'] blockquote",
        start: "top 68%",
        y: 45,
        dur: 1.3,
      },
      {
        sel: ".testimonials-grid > div",
        start: "top 78%",
        y: 30,
        stagger: 0.07,
        dur: 1.0,
      },
      {
        sel: ".integrations-icons > div",
        start: "top 78%",
        y: 20,
        stagger: 0.08,
        dur: 0.9,
      },
      {
        sel: ".how-it-works-steps > div",
        start: "top 78%",
        y: 40,
        stagger: 0.15,
        dur: 1.1,
      },
      { sel: ".daily-rhythms-left", start: "top 78%", y: 0, x: -50, dur: 1.2 },
      {
        sel: ".daily-rhythms-right",
        start: "top 78%",
        y: 0,
        x: 50,
        dur: 1.2,
        delay: 0.1,
      },
      { sel: ".waitlist-inner", start: "top 82%", y: 30, dur: 1.2 },
    ];
    fadeUpTargets.forEach(
      ({ sel, start, y = 0, x = 0, stagger, dur, delay = 0 }) => {
        const els = document.querySelectorAll<HTMLElement>(sel);
        if (!els.length) return;
        gsap.from(stagger ? Array.from(els) : els[0], {
          scrollTrigger: {
            trigger: els[0],
            start,
            toggleActions: "play none none reverse",
          },
          ...(x !== 0 ? { x } : {}),
          ...(y !== 0 ? { y } : {}),
          opacity: 0,
          ...(stagger ? { stagger } : {}),
          duration: dur,
          ease: "expo.out",
          delay,
        });
      },
    );

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      /* ── Page-sec exit: blur + scale as section scrolls away ── */
      document.querySelectorAll<HTMLElement>(".page-sec").forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "bottom 30%",
          end: "bottom -15%",
          scrub: 1,
          onUpdate(self) {
            gsap.set(sec, {
              opacity: 1 - self.progress * 0.55,
              scale: 1 - self.progress * 0.025,
              filter: `blur(${self.progress * 3}px)`,
            });
          },
          onLeaveBack() {
            gsap.to(sec, {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.5,
              ease: "expo.out",
            });
          },
        });
      });

      /* ── Parallax on tagged images ── */
      document.querySelectorAll<HTMLElement>(".parallax-img").forEach((img) => {
        gsap.to(img, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest("section") || img,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });

      /* ── 3D tilt on .tilt-card ── */
      const tiltCleanup: (() => void)[] = [];
      document.querySelectorAll<HTMLElement>(".tilt-card").forEach((card) => {
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const rx = ((e.clientX - r.left) / r.width - 0.5) * 10;
          const ry = ((e.clientY - r.top) / r.height - 0.5) * -10;
          gsap.to(card, {
            rotateX: ry,
            rotateY: rx,
            transformPerspective: 1000,
            duration: 0.4,
            ease: "power2.out",
          });
        };
        const onLeave = () =>
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: "expo.out",
          });
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        tiltCleanup.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      /* ── Magnetic buttons — zone-radius approach (no jitter) ── */
      const ZONE = 90; // px radius around each button
      const magnetCleanup: (() => void)[] = [];
      document.querySelectorAll<HTMLElement>(".magnetic").forEach((btn) => {
        let inZone = false;
        const onDocMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < ZONE) {
            inZone = true;
            const pull = (1 - dist / ZONE) * 0.38;
            gsap.to(btn, {
              x: dx * pull,
              y: dy * pull,
              duration: 0.4,
              ease: "power2.out",
            });
          } else if (inZone) {
            inZone = false;
            gsap.to(btn, {
              x: 0,
              y: 0,
              duration: 0.7,
              ease: "elastic.out(1, 0.35)",
            });
          }
        };
        document.addEventListener("mousemove", onDocMove, { passive: true });
        magnetCleanup.push(() => {
          document.removeEventListener("mousemove", onDocMove);
          gsap.set(btn, { x: 0, y: 0 });
        });
      });

      return () => {
        tiltCleanup.forEach((fn) => fn());
        magnetCleanup.forEach((fn) => fn());
      };
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-surface">
      <div className="bg-[#EAF0EB] border-b border-[#4A5D4E]/20 py-2.5 px-4 text-center text-xs text-[#4A5D4E] font-medium z-[70] relative">
        Public Sanctuary Overview — Accessible to all users without authentication.{" "}
        <Link to="/privacy-policy" className="font-bold underline underline-offset-2">
          Read Google-Verified Privacy Policy →
        </Link>
        {" · "}
        <Link to="/overview" className="font-bold underline underline-offset-2">
          Open Product Specification →
        </Link>
      </div>
      {/* <CustomCursor /> */}
      <Navbar />
      <main className="pt-8">
        <Hero />
        <GuardianInsight />
        <Philosophy />
        <LifeCycleTimeline />
        <LifeCyclesBento />
        <TheVillage />
        <Features />
        <TailoredGuidance />
        <AIGuardian />
        <Personas />
        <GuardianQuote />
        <DailyRhythms />
        <Integrations />
        <HowItWorks />
        <Testimonials />
        <SocialProof />
        <Pricing />
        <FAQ />
        <ReferralProgram />
        <Waitlist />
        <SetuEcosystemSection />
      </main>
      <Footer />
      <ShareCTA />
    </div>
  );
}
