import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function NotFoundPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center selection:bg-primary-container selection:text-on-surface overflow-hidden relative">
      {/* Decorative ambient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-primary/8 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Brand */}
        <Link
          to={user ? '/dashboard' : '/'}
          className="flex items-center gap-2 mb-10 hover:opacity-80 transition-opacity"
        >
          <img src="/maskable_icon.png" className="w-8 h-8 rounded-lg" alt="Neev" />
          <span className="text-xl font-serif italic text-primary tracking-widest leading-none">Neev</span>
        </Link>
        {/* Giant muted 404 */}
        <p
          aria-hidden="true"
          className="font-serif text-[120px] md:text-[180px] leading-none font-bold text-on-surface/5 select-none mb-[-20px] md:mb-[-30px]"
        >
          404
        </p>

        <span className="label-md text-primary tracking-[0.3em] uppercase text-xs mb-4 block">
          Page Not Found
        </span>

        <h1 className="font-serif text-4xl md:text-6xl text-on-surface mb-5 leading-tight">
          Looks like you're{' '}
          <em className="italic text-primary">lost</em>
        </h1>

        <p className="font-sans font-light text-on-surface-variant text-base md:text-lg max-w-md mb-10 leading-relaxed">
          The page you're looking for might have been moved, renamed, or never
          existed. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-primary text-on-primary px-8 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/"
              className="bg-primary text-on-primary px-8 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Return Home
            </Link>
          )}
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 rounded-xl text-sm font-medium border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface active:scale-95 transition-all"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
