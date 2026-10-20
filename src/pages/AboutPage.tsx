import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PublicFooter, PublicNavbar } from "../components/public/PublicLayout";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-surface">
      <PublicNavbar />

      <main className="py-24 px-6 md:px-20 max-w-5xl mx-auto">
        {/* Hero */}
        <div className="mb-16 text-center md:text-left">
          <span className="label-md px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 tracking-widest uppercase text-xs inline-block mb-4">
            The Setu Ecosystem · Engineering & Vision
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-on-surface mb-6 leading-tight">
            Crafting Digital Sanctuaries <br />
            <em className="italic text-primary font-normal">
              Rooted in Culture & Privacy
            </em>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl leading-relaxed">
            Neev was created out of a simple observation: modern family life is
            fragmented across dozens of chat groups, spreadsheets, and calendar
            invites, while our deep ancestral wisdom and cultural rituals slip
            through the cracks.
          </p>
        </div>

        {/* Developer Bio Card */}
        <Card className="p-8 md:p-12 bg-surface-container-low border border-outline-variant/30 rounded-3xl mb-16 shadow-none">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center font-serif text-3xl md:text-5xl text-on-primary font-bold shadow-sm shrink-0">
              AC
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-primary font-mono block mb-1">
                  Founder & Principal Architect
                </span>
                <h2 className="font-serif text-3xl text-on-surface">
                  Amit Chakraborty
                </h2>
                <p className="text-sm text-on-surface-variant font-mono">
                  @devamitch · Lead Mobile & Web Engineer · Setu Ecosystem
                </p>
              </div>

              <p className="text-on-surface-variant leading-relaxed">
                Amit Chakraborty is a systems and mobile architect building
                human-centric software across Android, iOS, and Web. Driven by
                principles of zero-knowledge privacy, high-craft aesthetics,
                and Indian cultural grounding, Amit creates digital spaces that
                serve human well-being rather than advertising algorithms.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://devamit.co.in"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-surface border border-outline-variant/40 hover:border-primary text-xs font-mono tracking-wider text-on-surface transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">
                    language
                  </span>
                  devamit.co.in
                </a>
                <a
                  href="https://github.com/devamitch"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-surface border border-outline-variant/40 hover:border-primary text-xs font-mono tracking-wider text-on-surface transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">code</span>
                  github.com/devamitch
                </a>
                <a
                  href="https://linkedin.com/in/devamitch"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-surface border border-outline-variant/40 hover:border-primary text-xs font-mono tracking-wider text-on-surface transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">
                    group
                  </span>
                  LinkedIn
                </a>
                <a
                  href="mailto:amit@devamit.co.in"
                  className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-mono tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
                  amit@devamit.co.in
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* The Setu Ecosystem Family */}
        <div className="mb-20 space-y-8">
          <div>
            <span className="label-md text-primary tracking-[0.25em] uppercase text-xs block mb-2">
              The Setu Ecosystem Family
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-on-surface">
              Three Pillars of Human Well-Being
            </h2>
            <p className="text-on-surface-variant max-w-2xl mt-2">
              Neev, BlinkQuest, and Setu belong to the same unified engineering
              lineage—built with uncompromising security, zero ads, and respect for
              user sovereignty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* BlinkQuest */}
            <Card className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-none flex flex-col justify-between space-y-6 hover:border-primary/50 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                  <span className="material-symbols-outlined text-2xl">
                    visibility
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-on-surface font-semibold">
                    BlinkQuest
                  </h3>
                  <p className="text-xs text-primary font-mono mt-0.5">
                    Mindful Blink & Vision Wellness
                  </p>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  An eye-wellness application for Android using on-device
                  MediaPipe AI vision. Short mindful breaks, blink rate tracking,
                  and interactive games that protect eyes during long screen
                  hours. Camera frames never leave the phone.
                </p>
              </div>
              <a
                href="https://blinkquest.devamit.co.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono font-medium text-primary hover:underline flex items-center gap-1.5 pt-2"
              >
                Visit blinkquest.devamit.co.in →
              </a>
            </Card>

            {/* Setu */}
            <Card className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-none flex flex-col justify-between space-y-6 hover:border-primary/50 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF8E1] flex items-center justify-center text-[#F57F17]">
                  <span className="material-symbols-outlined text-2xl">
                    hub
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-on-surface font-semibold">
                    Setu
                  </h3>
                  <p className="text-xs text-primary font-mono mt-0.5">
                    Ecosystem Bridge & Identity
                  </p>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  The connective tissue across apps. Unified decentralized
                  identity, verifiable family credentials, and encrypted peer-to-peer
                  coordination without central tracking or data profiling.
                </p>
              </div>
              <a
                href="https://setu.devamit.co.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono font-medium text-primary hover:underline flex items-center gap-1.5 pt-2"
              >
                Visit setu.devamit.co.in →
              </a>
            </Card>

            {/* Neev */}
            <Card className="p-6 bg-surface-container-low border border-primary/40 rounded-2xl shadow-none flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-wider">
                Current App
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#EFF3FF] flex items-center justify-center text-[#1565C0]">
                  <span className="material-symbols-outlined text-2xl">
                    nest_clock_farsight_analog
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-on-surface font-semibold">
                    Neev
                  </h3>
                  <p className="text-xs text-primary font-mono mt-0.5">
                    The Modern Indian Family OS
                  </p>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  A sanctuary for the multi-generational household. Unites Google
                  Calendar and Google Tasks to synchronize family schedules,
                  orchestrates shared parenting, preserves generational recipes,
                  and passes down heirloom wisdom.
                </p>
              </div>
              <Link
                to="/"
                className="text-xs font-mono font-medium text-primary hover:underline flex items-center gap-1.5 pt-2"
              >
                Explore Sanctuary Features →
              </Link>
            </Card>
          </div>
        </div>

        {/* Architectural Principles */}
        <div className="space-y-6 border-t border-outline-variant/30 pt-12">
          <h2 className="font-serif text-3xl text-on-surface">
            Core Engineering Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-serif text-lg text-on-surface font-semibold">
                Privacy by Design
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Zero data broker partnerships. Zero advertising SDKs. End-to-end
                encryption for private records, with strict Google Limited Use
                compliance.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg text-on-surface font-semibold">
                Indian Cultural Grounding
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Designed specifically for joint families, honoring the roles of
                Elders (Dada-Dadi/Nana-Nani), Parents, and Children with bespoke
                interfaces and cultural rhythms.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg text-on-surface font-semibold">
                Sovereignty & Longevity
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Your family's memories and vault documents are yours alone. Export
                or delete your records whenever you choose with single-click
                simplicity.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
