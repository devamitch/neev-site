import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out'
      });
    });

    return () => ctx.revert();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-surface flex flex-col md:flex-row items-stretch selection:bg-primary-container selection:text-on-surface">
      {/* Left side Form */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-16 lg:p-24 relative overflow-hidden">
        <div ref={cardRef} className="w-full max-w-md mx-auto">
          <Card className="bg-surface-container rounded-2xl p-8 md:p-12">
            <CardContent className="p-0 space-y-8">
              {/* Brand */}
              <div className="flex items-center justify-center gap-2">
                <img src="/maskable_icon.png" className="w-9 h-9 rounded-xl" alt="Neev" />
                <span className="text-2xl font-serif italic text-primary tracking-widest leading-none">Neev</span>
              </div>

            <div className="space-y-3 text-center">
              <h2 className="font-serif text-on-surface" style={{ fontSize: "clamp(2rem, 3vw, 2.8rem)" }}>Forgot Password?</h2>
              <p className="text-on-surface-variant font-sans font-light leading-relaxed">No worries, we'll send you reset instructions to your family email.</p>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-md font-sans">
                {error}
              </div>
            )}

            {success ? (
              <div className="space-y-6 text-center">
                <div className="p-6 bg-primary-container text-on-primary-container rounded-xl font-sans">
                  <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="font-medium">Check your inbox</p>
                  <p className="text-sm opacity-80 mt-2">We've sent password reset instructions to {email}</p>
                </div>
                <Button 
                  onClick={() => navigate('/signin')}
                  className="w-full h-14 bg-primary text-on-primary hover:bg-primary/90 rounded-md text-lg font-sans transition-all"
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="label-md text-on-surface-variant">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
                    <Input 
                      id="email"
                      type="email"
                      placeholder="arjun@legacy.com"
                      className="bg-surface-container-low border-none h-14 pl-12 rounded-md focus:bg-surface-container-highest transition-colors font-sans"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-primary text-on-primary hover:bg-primary/90 rounded-md text-lg font-sans transition-all active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Reset Password'}
                </Button>

                <Link 
                  to="/signin" 
                  className="flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-sans font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="hidden md:flex flex-1 relative bg-surface-container-low items-center justify-center p-12 overflow-hidden">
        <div className="aspect-4/5 w-full max-w-sm rounded-2xl overflow-hidden">
          <img
            src="/images/neev_real_security.png"
            alt="Family Security"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
