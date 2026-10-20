import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  GoogleCalendarIcon,
  GoogleDriveIcon,
  GoogleGmailIcon,
  GooglePhotosIcon,
} from "../components/GoogleIcons";
import { PublicFooter, PublicNavbar } from "../components/public/PublicLayout";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-surface">
      <PublicNavbar />

      <main className="py-24 px-6 md:px-20 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="label-md px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 tracking-widest uppercase text-xs">
              Official Legal Document
            </span>
            <span className="text-xs text-on-surface-variant font-mono">
              Last Updated: October 2026
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-on-surface mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            How <strong>Neev</strong> ("The Modern Indian Family OS", available at{" "}
            <a
              href="https://neev.devamit.co.in"
              className="text-primary underline underline-offset-4"
            >
              https://neev.devamit.co.in
            </a>
            ) protects your family sanctuary, collects and handles Google user data,
            and enforces privacy by design.
          </p>
        </div>

        <div className="space-y-12 text-on-surface-variant leading-relaxed">
          {/* Section 1: Introduction & App Identity */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-on-surface border-b border-outline-variant/30 pb-2">
              1. Application Identity & Stewardship
            </h2>
            <p>
              <strong>Neev</strong> is a privacy-first family operating system and
              digital sanctuary engineered to coordinate shared parenting,
              orchestrate daily multi-generational family rhythms, and archive
              cultural legacy.
            </p>
            <p>
              Neev is created and maintained by independent engineer{" "}
              <strong>Amit Chakraborty</strong> (developer handle:{" "}
              <code>devamitch</code>), and is an integral pillar of the{" "}
              <strong>Setu Ecosystem Family</strong> (encompassing{" "}
              <a
                href="https://blinkquest.devamit.co.in"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4"
              >
                BlinkQuest
              </a>
              ,{" "}
              <a
                href="https://setu.devamit.co.in"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Setu
              </a>
              , and{" "}
              <a
                href="https://neev.devamit.co.in"
                className="text-primary underline underline-offset-4"
              >
                Neev
              </a>
              ).
            </p>
            <p>
              For any privacy, security, or data governance questions, you can
              reach our dedicated developer contact at{" "}
              <a
                href="mailto:amit@devamit.co.in"
                className="text-primary font-medium underline underline-offset-4"
              >
                amit@devamit.co.in
              </a>
              .
            </p>
          </section>

          {/* Section 2: Full Specification of Services & Data Collection */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-on-surface border-b border-outline-variant/30 pb-2">
              2. Full Specification of Services & Data Collection
            </h2>
            <p>
              Neev connects with authorized third-party and Google APIs strictly to deliver user-facing features that you explicitly configure. Below is an exhaustive breakdown of all services used, data accessed, purpose of use, and retention policies:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {/* Google Maps */}
              <Card className="p-5 bg-surface-container-low border border-outline-variant/30 shadow-none space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#1A73E8] text-2xl">
                      map
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-on-surface font-semibold">
                      Google Maps Platform & Location
                    </h3>
                    <code className="text-[11px] text-primary">
                      Geolocation, Maps Grounding, Places API
                    </code>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant">
                  <strong>Data:</strong> Ephemeral latitude/longitude coordinates and address queries.<br />
                  <strong>Purpose:</strong> Route navigation to pediatric clinics, family event venues, school commute coordination, and grounding AI Guardian recommendations with verified local facilities.<br />
                  <strong>Retention:</strong> Ephemeral. Geolocation is processed in real time and never tracked in background or sold.
                </p>
              </Card>

              {/* Google AI / Gemini */}
              <Card className="p-5 bg-surface-container-low border border-outline-variant/30 shadow-none space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F3E8FD] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#9334E8] text-2xl">
                      auto_awesome
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-on-surface font-semibold">
                      Google AI & Gemini (Multimodal Guardian)
                    </h3>
                    <code className="text-[11px] text-primary">
                      Gemini 2.5/3.1 Flash & Pro, Voice TTS, Vision
                    </code>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant">
                  <strong>Data:</strong> User guidance queries, voice recordings, and uploaded images for cultural/homework assistance.<br />
                  <strong>Purpose:</strong> Powering personalized parenting guidance, Sanskrit/Hindi cultural storytelling, and milestone tracking.<br />
                  <strong>Zero Training:</strong> Prompts and family data are <strong>NEVER used to train generalized AI models</strong>.
                </p>
              </Card>

              {/* Google Calendar */}
              <Card className="p-5 bg-surface-container-low border border-outline-variant/30 shadow-none space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EFF3FF] flex items-center justify-center">
                    <GoogleCalendarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-on-surface font-semibold">
                      Google Calendar API
                    </h3>
                    <code className="text-[11px] text-primary">
                      .../auth/calendar
                    </code>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant">
                  <strong>Data:</strong> Calendar event titles, descriptions, dates/times, and attendees.<br />
                  <strong>Purpose:</strong> Harmonizing household rituals, children's exams, pediatrician appointments, and family celebrations into one unified rhythm.
                </p>
              </Card>

              {/* Google Tasks */}
              <Card className="p-5 bg-surface-container-low border border-outline-variant/30 shadow-none space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#34A853] text-2xl">
                      task_alt
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-on-surface font-semibold">
                      Google Tasks API
                    </h3>
                    <code className="text-[11px] text-primary">
                      .../auth/tasks
                    </code>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant">
                  <strong>Data:</strong> Task titles, due dates, and completion status.<br />
                  <strong>Purpose:</strong> Synchronizing shared household tasks, grocery lists, medicine reminders, and parenting responsibilities between Google Tasks and Neev.
                </p>
              </Card>

              {/* Google Drive */}
              <Card className="p-5 bg-surface-container-low border border-outline-variant/30 shadow-none space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8E1] flex items-center justify-center">
                    <GoogleDriveIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-on-surface font-semibold">
                      Google Drive API
                    </h3>
                    <code className="text-[11px] text-primary">
                      .../auth/drive.readonly
                    </code>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant">
                  <strong>Data:</strong> Metadata and file contents of user-selected family documents.<br />
                  <strong>Purpose:</strong> Safely referencing essential family records, birth certificates, and cultural heirlooms in the private Legacy Vault.
                </p>
              </Card>

              {/* Gmail API */}
              <Card className="p-5 bg-surface-container-low border border-outline-variant/30 shadow-none space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FCE8E6] flex items-center justify-center">
                    <GoogleGmailIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-on-surface font-semibold">
                      Gmail Integration
                    </h3>
                    <code className="text-[11px] text-primary">
                      .../auth/gmail.readonly
                    </code>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant">
                  <strong>Data:</strong> Headers and text of school circulars and clinic confirmations.<br />
                  <strong>Purpose:</strong> Automatically surfacing school fee deadlines, parent-teacher meetings, and pediatric visits into the family calendar.
                </p>
              </Card>

              {/* Google Photos */}
              <Card className="p-5 bg-surface-container-low border border-outline-variant/30 shadow-none space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEECEB] flex items-center justify-center">
                    <GooglePhotosIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-on-surface font-semibold">
                      Google Photos API
                    </h3>
                    <code className="text-[11px] text-primary">
                      .../auth/photoslibrary.readonly
                    </code>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant">
                  <strong>Data:</strong> Photo media items explicitly chosen by the family.<br />
                  <strong>Purpose:</strong> Creating shared generational milestone albums, festival memories, and cultural memory timelines.
                </p>
              </Card>

              {/* Profile & Identity */}
              <Card className="p-5 bg-surface-container-low border border-outline-variant/30 shadow-none space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EFF3FF] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#4285F4] text-2xl">
                      account_circle
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-on-surface font-semibold">
                      Profile & Identity (OAuth 2.0)
                    </h3>
                    <code className="text-[11px] text-primary">
                      openid, userinfo.profile, userinfo.email
                    </code>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant">
                  <strong>Data:</strong> Name, verified email address, Google account ID, and avatar.<br />
                  <strong>Purpose:</strong> Account authentication and assigning stewardship roles (Mother, Father, Elder, Child).
                </p>
              </Card>
            </div>
          </section>

          {/* Section 3: Google Limited Use Requirement - CRITICAL FOR GOOGLE AUDIT */}
          <section className="space-y-4 bg-primary/5 p-6 rounded-2xl border border-primary/20">
            <h2 className="font-serif text-2xl text-primary font-semibold">
              3. Google API Services User Data Policy Compliance (Limited Use)
            </h2>
            <p className="text-on-surface font-medium">
              Neev’s use and transfer to any other app of information received from
              Google APIs will adhere to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline font-bold"
              >
                Google API Services User Data Policy
              </a>
              , including the <strong>Limited Use</strong> requirements.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-on-surface-variant">
              <li>
                <strong>No Advertising:</strong> We never use or transfer Google
                user data to serve advertisements, retarget users, or sell to
                third-party data brokers.
              </li>
              <li>
                <strong>No Model Training:</strong> We never use Google user data
                to train generalized or foundational AI/ML models.
              </li>
              <li>
                <strong>Strict Human Privacy:</strong> Human employees, contractors,
                or operators are strictly prohibited from reading or inspecting your
                Google user data, except where you have provided explicit written
                consent for technical troubleshooting, or when required by
                applicable law.
              </li>
              <li>
                <strong>Direct User-Facing Purpose:</strong> All data fetched via
                Google APIs is used exclusively to display and manage your family
                schedules, tasks, and vault entries directly within the Neev app.
              </li>
            </ul>
          </section>

          {/* Section 4: Data Storage, Encryption & Security */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-on-surface border-b border-outline-variant/30 pb-2">
              4. Data Storage, Encryption & Token Security
            </h2>
            <p>
              Your family's peace of mind requires military-grade data protection:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Encryption in Transit:</strong> All communications between
                your device, Google APIs, and Neev services are encrypted using
                TLS 1.3 with modern cipher suites.
              </li>
              <li>
                <strong>Encryption at Rest:</strong> All stored records are
                encrypted using AES-256 encryption.
              </li>
              <li>
                <strong>Token Protection:</strong> OAuth 2.0 access and refresh
                tokens are securely stored with cryptographic isolation. Tokens
                are never exposed in public logs or client-side global namespaces.
              </li>
              <li>
                <strong>Minimal Retention:</strong> Cached calendar events and
                tasks are refreshed on demand and retained only as long as your
                account remains active.
              </li>
            </ul>
          </section>

          {/* Section 5: Data Retention, Deletion & Revocation */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-on-surface border-b border-outline-variant/30 pb-2">
              5. Data Deletion & Revoking Permissions
            </h2>
            <p>
              You maintain 100% sovereignty over your family's data. You have the
              right to disconnect Google services or delete your account at any
              moment:
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <h3 className="font-serif text-base text-on-surface font-semibold mb-1">
                  Option A: Disconnect Google Services in App
                </h3>
                <p className="text-sm">
                  Navigate to <strong>Settings ➔ Google Services ➔ Disconnect</strong>{" "}
                  within Neev. This immediately invalidates cached tokens and halts
                  any synchronization.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <h3 className="font-serif text-base text-on-surface font-semibold mb-1">
                  Option B: Complete Account & Data Erasure
                </h3>
                <p className="text-sm">
                  To permanently delete your Neev account, family vault data, and
                  associated profile, click <strong>"Delete Sanctuary Account"</strong>{" "}
                  under Settings, or email{" "}
                  <a
                    href="mailto:amit@devamit.co.in"
                    className="text-primary underline"
                  >
                    amit@devamit.co.in
                  </a>{" "}
                  with the subject <em>"Delete My Neev Account"</em>. All personal
                  and synced data will be permanently purged within 30 days.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <h3 className="font-serif text-base text-on-surface font-semibold mb-1">
                  Option C: Revoke Access via Google Security
                </h3>
                <p className="text-sm">
                  You can immediately revoke Neev's access to your Google Account at
                  any time from your official Google dashboard:{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    https://myaccount.google.com/permissions
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Children's Privacy */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-on-surface border-b border-outline-variant/30 pb-2">
              6. Protection of Children & Minors
            </h2>
            <p>
              Because Neev is an Indian family operating system designed for
              multi-generational households, children's profiles are strictly
              governed by parent and elder stewards.
            </p>
            <p>
              Neev complies with COPPA (Children’s Online Privacy Protection Act)
              and India’s Digital Personal Data Protection Act (DPDP). Children
              cannot connect Google Accounts directly; any child-related calendar
              or task entries are created and managed by authorized guardians.
            </p>
          </section>

          {/* Section 7: Developer Contact & Ecosystem */}
          <section className="space-y-4 border-t border-outline-variant/30 pt-8">
            <h2 className="font-serif text-2xl text-on-surface">
              7. Contact & Ecosystem Attribution
            </h2>
            <p>
              Neev is proudly developed as part of the{" "}
              <strong>Setu Ecosystem Family</strong> by:
            </p>
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-serif text-xl text-primary font-bold">
                  AC
                </div>
                <div>
                  <h3 className="text-lg font-serif font-semibold text-on-surface">
                    Amit Chakraborty
                  </h3>
                  <p className="text-xs text-primary font-mono">
                    Lead Mobile & Web Engineer · Setu Ecosystem
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm pt-2">
                <p>
                  <strong>Direct Email:</strong>{" "}
                  <a
                    href="mailto:amit@devamit.co.in"
                    className="text-primary underline"
                  >
                    amit@devamit.co.in
                  </a>
                </p>
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
                  <strong>GitHub:</strong>{" "}
                  <a
                    href="https://github.com/devamitch"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    github.com/devamitch
                  </a>
                </p>
                <p>
                  <strong>Sister Apps:</strong>{" "}
                  <a
                    href="https://blinkquest.devamit.co.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    BlinkQuest
                  </a>{" "}
                  ·{" "}
                  <a
                    href="https://setu.devamit.co.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    Setu
                  </a>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 text-sm">
              <Link
                to="/terms"
                className="text-primary hover:underline font-medium"
              >
                ← View Terms of Service
              </Link>
              <Link to="/" className="text-primary hover:underline font-medium">
                Return to Neev Home →
              </Link>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
