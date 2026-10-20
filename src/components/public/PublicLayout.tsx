import React from "react";
import { Link } from "react-router-dom";

export const PublicNavbar: React.FC = () => {
  return (
    <nav className="w-full bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 md:px-8 py-3.5 max-w-screen-2xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-85 transition-opacity"
          aria-label="Neev Home"
        >
          <img
            src="/maskable_icon.png"
            className="w-8 h-8 rounded-lg"
            alt="Neev Logo"
          />
          <span className="text-xl font-semibold font-serif italic text-primary tracking-widest leading-none">
            Neev
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-8">
          <Link
            to="/#sanctuary"
            className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-mono"
          >
            Philosophy
          </Link>
          <Link
            to="/#integrations"
            className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-mono"
          >
            Google Sync
          </Link>
          <Link
            to="/privacy-policy"
            className="text-xs uppercase tracking-widest text-primary font-semibold font-mono"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-mono"
          >
            Terms
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="bg-primary text-on-primary px-5 py-2 rounded-full text-xs font-mono tracking-wider hover:opacity-90 transition-opacity"
          >
            Explore Neev
          </Link>
        </div>
      </div>
    </nav>
  );
};

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-surface-container-low pt-16 pb-10 px-4 md:px-8 border-t border-outline-variant/30 mt-20">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
        <div className="md:col-span-4 space-y-3">
          <Link to="/" className="text-3xl font-serif italic text-primary block">
            Neev
          </Link>
          <p className="text-on-surface-variant font-light leading-relaxed max-w-sm text-sm">
            A private digital sanctuary to orchestrate modern Indian family
            life, preserve cultural wisdom, and coordinate shared parenting
            gracefully.
          </p>
          <p className="text-xs font-mono text-on-surface-variant/70">
            Crafted by <strong>Amit Chakraborty</strong> (<code>@devamitch</code>) · Setu Ecosystem Family
          </p>
          <p className="font-serif text-base text-primary/60 italic pt-1">
            परिवार की नींव · The Complete Modern Indian Family OS
          </p>
        </div>

        <div className="md:col-span-2 space-y-3">
          <h5 className="text-xs font-mono tracking-[0.2em] text-primary uppercase font-bold">
            Sanctuary
          </h5>
          <ul className="space-y-2 text-sm font-light text-on-surface-variant">
            <li>
              <Link to="/#sanctuary" className="hover:text-primary transition-colors">
                The Philosophy
              </Link>
            </li>
            <li>
              <Link to="/#life-cycles" className="hover:text-primary transition-colors">
                Life Cycles
              </Link>
            </li>
            <li>
              <Link to="/#integrations" className="hover:text-primary transition-colors">
                Google Sync
              </Link>
            </li>
            <li>
              <Link to="/#guidance" className="hover:text-primary transition-colors">
                AI Guidance
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h5 className="text-xs font-mono tracking-[0.2em] text-primary uppercase font-bold">
            Setu Ecosystem
          </h5>
          <ul className="space-y-2 text-sm font-light text-on-surface-variant">
            <li>
              <a
                href="https://blinkquest.devamit.co.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-1.5"
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
                className="hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <span>Setu (Identity Bridge)</span>
                <span className="text-xs opacity-60">↗</span>
              </a>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">
                About Amit Chakraborty (@devamitch)
              </Link>
            </li>
            <li>
              <a
                href="https://devamit.co.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
              >
                Developer Site (devamit.co.in)
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h5 className="text-xs font-mono tracking-[0.2em] text-primary uppercase font-bold">
            Legal & Support
          </h5>
          <ul className="space-y-2 text-sm font-light text-on-surface-variant">
            <li>
              <Link
                to="/privacy-policy"
                className="text-primary font-medium hover:underline flex items-center gap-1.5"
              >
                <span>Privacy Policy</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  Google Verified
                </span>
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact Developer
              </Link>
            </li>
            <li>
              <a
                href="mailto:amit@devamit.co.in"
                className="hover:text-primary transition-colors font-mono text-xs"
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
};
