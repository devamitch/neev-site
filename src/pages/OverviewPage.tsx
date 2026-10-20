import React from "react";
import { Link } from "react-router-dom";
import { PublicFooter, PublicNavbar } from "../components/public/PublicLayout";

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-surface">
      <div className="bg-[#EAF0EB] border-b border-[#4A5D4E]/20 py-2.5 px-4 text-center text-xs text-[#4A5D4E] font-medium">
        Public Product Showcase — Accessible to all users without authentication.{" "}
        <Link to="/privacy-policy" className="font-bold underline underline-offset-2">
          Read Google-Verified Privacy Policy →
        </Link>
      </div>

      <PublicNavbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-xs uppercase tracking-wider mb-4">
          <span className="material-symbols-outlined text-base">public</span>
          Open Access Product Specification
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-on-surface mb-4 leading-tight">
          Neev — The Complete Modern Indian Family OS
        </h1>

        <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed font-light mb-8 max-w-3xl">
          A private digital sanctuary engineered by <strong>Amit Chakraborty</strong>{" "}
          (<code>@devamitch</code>) for modern multi-generational families. Neev
          orchestrates shared parenting, harmonizes daily schedules with Google
          Calendar and Tasks, and preserves cultural legacy across generations.
        </p>

        {/* Public Notice Banner */}
        <div className="bg-surface border-2 border-primary/40 rounded-2xl p-6 md:p-8 mb-12 flex flex-col sm:flex-row items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div>
            <h2 className="font-serif text-xl text-on-surface font-semibold mb-1">
              Public Accessibility Notice (For Google Reviewers & Users)
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              This product overview, our homepage at{" "}
              <Link to="/" className="text-primary underline">
                neev.devamit.co.in
              </Link>
              , and our official{" "}
              <Link to="/privacy-policy" className="text-primary underline font-medium">
                Privacy Policy
              </Link>{" "}
              are 100% public. Users do <strong>not</strong> need to log in, create an
              account, or provide credentials to explore our application's
              functionality, understand our data handling practices, or review developer
              details.
            </p>
          </div>
        </div>

        {/* Feature Pillars */}
        <div className="mb-14">
          <h2 className="font-serif text-3xl text-on-surface mb-6 border-b border-outline-variant/30 pb-3">
            1. Core Features & Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#EFF3FF] text-[#4285F4] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">calendar_month</span>
              </div>
              <h3 className="font-serif text-xl text-on-surface font-semibold">
                Daily Rhythm Harmony
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Synchronizes family events across parents, elders, and children
                via two-way Google Calendar integration. Eliminates double-booking
                of pediatric visits, school exams, and cultural poojas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#E8F5E9] text-[#34A853] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">checklist</span>
              </div>
              <h3 className="font-serif text-xl text-on-surface font-semibold">
                Chore & Medicine Tasks
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Coordinates household duties, grocery runs, and elder medication
                reminders seamlessly with Google Tasks. Tasks can be delegated
                with clear family accountability.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">family_history</span>
              </div>
              <h3 className="font-serif text-xl text-on-surface font-semibold">
                The Legacy Vault
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                A secure digital heirloom for storing ancestral recipes, audio
                recordings of grandparents' stories, and essential family documents
                using private Google Drive backup.
              </p>
            </div>
          </div>
        </div>

        {/* Google OAuth Scopes & Transparency */}
        <div className="mb-14">
          <h2 className="font-serif text-3xl text-on-surface mb-6 border-b border-outline-variant/30 pb-3">
            2. Google OAuth Scopes & Data Usage
          </h2>
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl text-[#4285F4] shrink-0 mt-1">
                event
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-on-surface">
                  Google Calendar API
                </h3>
                <code className="text-xs text-primary font-mono block mb-1">
                  https://www.googleapis.com/auth/calendar
                </code>
                <p className="text-sm text-on-surface-variant">
                  Used to read and sync family events, pediatric visits, and
                  cultural rituals onto the family daily timeline.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl text-[#34A853] shrink-0 mt-1">
                task_alt
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-on-surface">
                  Google Tasks API
                </h3>
                <code className="text-xs text-primary font-mono block mb-1">
                  https://www.googleapis.com/auth/tasks
                </code>
                <p className="text-sm text-on-surface-variant">
                  Used to fetch, create, and complete shared family to-do lists,
                  groceries, and elder medicine reminders.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl text-[#1A73E8] shrink-0 mt-1">
                map
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-on-surface">
                  Google Maps Platform & Location Grounding
                </h3>
                <code className="text-xs text-primary font-mono block mb-1">
                  Places API, Directions, Maps Grounding
                </code>
                <p className="text-sm text-on-surface-variant">
                  Used for route navigation to pediatric visits, school commute coordination, and grounding AI Guardian recommendations with verified local facilities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl text-[#9334E8] shrink-0 mt-1">
                auto_awesome
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-on-surface">
                  Google AI & Gemini (Multimodal AI Guardian)
                </h3>
                <code className="text-xs text-primary font-mono block mb-1">
                  Gemini 2.5/3.1 Flash & Pro, Voice Audio, Vision
                </code>
                <p className="text-sm text-on-surface-variant">
                  Provides AI-guided parenting, cultural heritage storytelling, and family schedule optimization. User prompts are never used to train foundation models.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl text-[#FBBC04] shrink-0 mt-1">
                folder
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-on-surface">
                  Google Drive API (Read-only)
                </h3>
                <code className="text-xs text-primary font-mono block mb-1">
                  https://www.googleapis.com/auth/drive.readonly
                </code>
                <p className="text-sm text-on-surface-variant">
                  Used strictly upon user command to reference family documents
                  in the private Legacy Vault.
                </p>
              </div>
            </div>

            {/* Limited Use Commitment */}
            <div className="bg-primary/10 border border-primary/25 rounded-xl p-5 mt-6">
              <h4 className="font-serif text-base font-semibold text-primary mb-1">
                Google Limited Use Requirement Commitment
              </h4>
              <p className="text-xs text-on-surface leading-relaxed">
                Neev's use and transfer to any other app of information received
                from Google APIs adheres to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline font-bold"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements. Your data is never sold,
                never used for ads, and never used to train generalized AI models.
              </p>
            </div>
          </div>
        </div>

        {/* Setu Ecosystem & Developer Details */}
        <div className="mb-14">
          <h2 className="font-serif text-3xl text-on-surface mb-6 border-b border-outline-variant/30 pb-3">
            3. Developer & The Setu Ecosystem Family
          </h2>
          <div className="p-6 md:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary text-on-primary font-serif font-bold text-2xl flex items-center justify-center">
                AC
              </div>
              <div>
                <h3 className="font-serif text-2xl font-semibold text-on-surface">
                  Amit Chakraborty
                </h3>
                <p className="text-xs font-mono text-primary">
                  @devamitch · Lead Mobile & Web Engineer · Setu Ecosystem
                </p>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Neev is part of a deliberate ecosystem of human-first, privacy-driven
              software created by Amit Chakraborty. Brother projects include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-surface border border-outline-variant/20">
                <h4 className="font-serif text-base font-semibold text-on-surface">
                  BlinkQuest
                </h4>
                <p className="text-xs text-primary font-mono">
                  Mindful Eye Wellness (Android)
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Camera-checked blink breaks with on-device MediaPipe vision.
                </p>
                <a
                  href="https://blinkquest.devamit.co.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary underline mt-2 block font-mono"
                >
                  blinkquest.devamit.co.in ↗
                </a>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-outline-variant/20">
                <h4 className="font-serif text-base font-semibold text-on-surface">
                  Setu
                </h4>
                <p className="text-xs text-primary font-mono">
                  Decentralized Identity Bridge
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Unified identity and verifiable credentials for families.
                </p>
                <a
                  href="https://setu.devamit.co.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary underline mt-2 block font-mono"
                >
                  setu.devamit.co.in ↗
                </a>
              </div>
            </div>
            <div className="pt-4 border-t border-outline-variant/20 text-xs font-mono space-y-1">
              <p>
                <strong>Developer Site:</strong>{" "}
                <a
                  href="https://devamit.co.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  https://devamit.co.in
                </a>
              </p>
              <p>
                <strong>Contact Email:</strong>{" "}
                <a href="mailto:amit@devamit.co.in" className="text-primary underline">
                  amit@devamit.co.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
