import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PublicFooter, PublicNavbar } from "../components/public/PublicLayout";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-surface">
      <PublicNavbar />

      <main className="py-24 px-6 md:px-20 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="label-md px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 tracking-widest uppercase text-xs">
              Terms of Agreement
            </span>
            <span className="text-xs text-on-surface-variant font-mono">
              Last Updated: October 2026
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-on-surface mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Please read these terms carefully before accessing or using{" "}
            <strong>Neev</strong> (available at{" "}
            <a
              href="https://neev.devamit.co.in"
              className="text-primary underline underline-offset-4"
            >
              https://neev.devamit.co.in
            </a>
            ).
          </p>
        </div>

        <div className="space-y-10 text-on-surface-variant leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-on-surface border-b border-outline-variant/30 pb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or using the Neev web application, mobile
              app, or any associated service provided by Amit Chakraborty
              ("Developer", "we", "us"), you agree to be bound by these Terms of
              Service and our{" "}
              <Link to="/privacy-policy" className="text-primary underline">
                Privacy Policy
              </Link>
              . If you disagree with any portion of these terms, please refrain from
              using our platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-on-surface border-b border-outline-variant/30 pb-2">
              2. Stewardship & Family Roles
            </h2>
            <p>
              Neev is designed around multi-generational family structures.
              Accounts are created by family stewards who can invite spouses,
              grandparents, and children.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Steward Responsibility:</strong> You are responsible for
                safeguarding your credentials and authorizing family members into
                your sanctuary realm.
              </li>
              <li>
                <strong>Accurate Information:</strong> You agree to provide true,
                accurate, and up-to-date information when registering.
              </li>
              <li>
                <strong>Respectful Environment:</strong> You agree not to upload
                harmful, infringing, or malicious content to the Family Vault.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-on-surface border-b border-outline-variant/30 pb-2">
              3. Google Services & Third-Party Integrations
            </h2>
            <p>
              When you opt-in to link your Google Account with Neev:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Neev accesses Google Calendar, Google Tasks, and Google Drive solely
                to provide family schedule synchronization and document storage as
                requested by you.
              </li>
              <li>
                You may disconnect Google services or revoke permissions at any time
                via app settings or through Google Account Security.
              </li>
              <li>
                Our handling of Google data strictly adheres to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  Google API Services User Data Policy
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-on-surface border-b border-outline-variant/30 pb-2">
              4. The AI Guardian & Advice Disclaimers
            </h2>
            <p>
              The Neev AI Guardian is an intelligent assistant built to provide
              scheduling suggestions, parenting routine ideas, and cultural
              context.
            </p>
            <Card className="p-4 bg-surface-container-low border border-outline-variant/30 text-sm">
              <strong>Disclaimer:</strong> The AI Guardian is not a licensed medical
              practitioner, legal counsel, or financial advisor. Always consult
              qualified healthcare professionals for pediatric emergencies, medical
              diagnoses, or specialized legal guidance.
            </Card>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-on-surface border-b border-outline-variant/30 pb-2">
              5. Intellectual Property & Family Data Ownership
            </h2>
            <p>
              <strong>You own 100% of your family data.</strong> Your ancestral
              recipes, audio recordings, family photos, and notes stored in the
              Legacy Vault remain your exclusive property. Neev does not claim any
              ownership or license over your personal memories.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-on-surface border-b border-outline-variant/30 pb-2">
              6. Termination & Deletion
            </h2>
            <p>
              You may terminate your account at any time. Upon account deletion,
              your family vault, synced tasks, and cached tokens will be permanently
              purged within 30 days.
            </p>
          </section>

          <section className="space-y-3 border-t border-outline-variant/30 pt-6">
            <h2 className="font-serif text-2xl text-on-surface">
              7. Governing Law & Developer Contact
            </h2>
            <p>
              These Terms are governed by the laws of India. For any inquiries,
              disputes, or notices, contact:
            </p>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-sm space-y-1">
              <p>
                <strong>Developer:</strong> Amit Chakraborty (<code>devamitch</code>)
              </p>
              <p>
                <strong>Ecosystem:</strong> Setu Ecosystem Family (BlinkQuest, Setu,
                Neev)
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:amit@devamit.co.in"
                  className="text-primary underline"
                >
                  amit@devamit.co.in
                </a>
              </p>
              <p>
                <strong>Web:</strong>{" "}
                <a
                  href="https://devamit.co.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  https://devamit.co.in
                </a>
              </p>
            </div>

            <div className="flex justify-between items-center pt-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-primary hover:underline font-medium"
              >
                ← View Privacy Policy
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
