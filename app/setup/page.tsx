'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Check,
  Globe,
  User,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import LedgerLogo from '@/components/LedgerLogo';

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 'splash' | 'google' | 'name' | 'language' | 'done';

interface UserProfile {
  name: string;
  language: 'en' | 'hi' | 'hinglish';
  googleConnected: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GOLD = '#C9A96E';
const GOLD_LIGHT = '#E4C98A';
const GOLD_DIM = 'rgba(201,169,110,0.15)';
const GOLD_BORDER = 'rgba(201,169,110,0.25)';
const BG = '#070A12';
const SURFACE = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';

const LANGUAGES = [
  { id: 'en' as const,       label: 'English',  sub: 'English interface',    flag: '🇬🇧' },
  { id: 'hi' as const,       label: 'हिन्दी',    sub: 'Hindi interface',       flag: '🇮🇳' },
  { id: 'hinglish' as const, label: 'Hinglish', sub: 'Hindi + English mix',   flag: '✨' },
];

// ─── Spring configs ───────────────────────────────────────────────────────────

const spring = { type: 'spring' as const, stiffness: 260, damping: 28 };
const easeOut = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

// ─── Sub-components ───────────────────────────────────────────────────────────

function GoldOrb({ size, opacity, x, y, delay = 0 }: { size: number; opacity: number; x: string; y: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity, scale: 1 }}
      transition={{ duration: 1.8, delay, ease: 'easeOut' }}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${GOLD}33 0%, transparent 70%)`,
        filter: 'blur(32px)',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 20 : 6,
            opacity: i <= current ? 1 : 0.25,
            background: i === current ? GOLD : 'rgba(255,255,255,0.4)',
          }}
          transition={spring}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={easeOut}
      whileTap={{ scale: 0.9 }}
      onClick={onBack}
      className="w-9 h-9 rounded-xl flex items-center justify-center"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <ArrowLeft size={16} className="text-white/50" strokeWidth={1.8} />
    </motion.button>
  );
}

function CornerLogoBar({
  current,
  total,
  onBack,
  rightSlot,
}: {
  current: number;
  total: number;
  onBack: () => void;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-10 w-full relative z-30">
      <div className="w-12">
        <BackButton onBack={onBack} />
      </div>
      <div className="flex-1 flex justify-center">
        <LedgerLogo variant="corner" />
      </div>
      <div className="flex items-center justify-end gap-3 w-28">
        <StepDots current={current} total={total} />
        {rightSlot}
      </div>
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function SplashStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center relative overflow-hidden">
      <GoldOrb size={320} opacity={0.45} x="50%" y="40%" delay={0.2} />
      <GoldOrb size={180} opacity={0.25} x="15%" y="70%" delay={0.5} />
      <GoldOrb size={140} opacity={0.2}  x="85%" y="20%" delay={0.7} />

      {/* Logo mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="mb-8 relative"
      >
        <LedgerLogo variant="hero" />
      </motion.div>

      {/* Wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        className="mb-4"
      >
        <h1
          className="text-[42px] tracking-[-0.05em] leading-none mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: 'rgba(255,255,255,0.95)' }}
        >
          LEDGER
        </h1>
        <p
          className="text-[11px] tracking-[0.28em] uppercase"
          style={{ color: GOLD, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
        >
          Know Your Finance
        </p>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.52 }}
        className="text-[14px] leading-relaxed text-white/35 max-w-[240px] mb-14"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Compare 100+ Indian financial products — privately, instantly.
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
        whileTap={{ scale: 0.96 }}
        onClick={onNext}
        className="relative w-full max-w-[280px] py-4 rounded-2xl flex items-center justify-center gap-2.5 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${GOLD} 0%, #A87D46 100%)`,
          boxShadow: `0 8px 32px ${GOLD}40`,
        }}
      >
        {/* Shimmer */}
        <motion.div
          animate={{ x: ['−100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 1.5 }}
          className="absolute inset-y-0 w-1/3 skew-x-12"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
        />
        <span
          className="text-[15px] relative z-10"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#1a0f00' }}
        >
          Get Started
        </span>
        <ChevronRight size={16} strokeWidth={2.5} className="relative z-10" style={{ color: '#1a0f00' }} />
      </motion.button>

      {/* Trust badge */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-5 text-[11px] text-white/20"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        🔒 No personal data stored, ever.
      </motion.p>
    </div>
  );
}

function GoogleStep({ onNext, onBack, onSkip }: { onNext: () => void; onBack: () => void; onSkip: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleGoogle = () => {
    setLoading(true);
    // In production: signIn('google') from next-auth
    // import { signIn } from 'next-auth/react';
    // signIn('google', { callbackUrl: '/setup?step=name' });
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1400);
  };

  return (
    <div className="flex flex-col min-h-screen px-6 pt-14 pb-10 relative overflow-hidden">
      <GoldOrb size={260} opacity={0.3} x="80%" y="15%" delay={0} />

      <CornerLogoBar
        current={0}
        total={3}
        onBack={onBack}
        rightSlot={
          <button
            onClick={onSkip}
            className="text-[12px] text-white/30 ml-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}
          >
            Skip
          </button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={easeOut}
        className="mb-10"
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}` }}
        >
          <Sparkles size={20} style={{ color: GOLD }} strokeWidth={1.5} />
        </div>
        <h2
          className="text-[28px] leading-tight tracking-[-0.03em] text-white/95 mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
        >
          Save your progress
        </h2>
        <p className="text-[13px] text-white/35 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Sign in with Google to track subscriptions, save favourites, and get personalised rate alerts — all anonymously.
        </p>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...easeOut, delay: 0.15 }}
        className="space-y-3 mb-10"
      >
        {[
          { icon: '🔔', label: 'Rate alerts', sub: 'Get notified when FD rates change' },
          { icon: '⭐', label: 'Saved products', sub: 'Bookmark products across devices' },
          { icon: '🛡️', label: 'Still anonymous', sub: 'We never sell or share your data' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...easeOut, delay: 0.2 + i * 0.08 }}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <span className="text-xl">{item.icon}</span>
            <div>
              <p className="text-[13px] text-white/80" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{item.label}</p>
              <p className="text-[11px] text-white/30" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Google button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...easeOut, delay: 0.4 }}
        className="mt-auto space-y-3"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-800"
            />
          ) : (
            <>
              {/* Google G SVG */}
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8.1h-7.4v2.89h4.26c-.39 2-2.15 3.07-4.26 3.07a4.67 4.67 0 0 1 0-9.33c1.17 0 2.22.4 3.05 1.07l2.09-2.1A8 8 0 1 0 9 17a7.82 7.82 0 0 0 8-7.9 7.17 7.17 0 0 0-.49-1Z"/>
                <path fill="#34A853" d="m2.74 9-2.09 1.57A8 8 0 0 0 9 17l2.5-1.94A4.68 4.68 0 0 1 9 14.06 4.67 4.67 0 0 1 4.67 9Z"/>
                <path fill="#FBBC05" d="M4.67 9A4.63 4.63 0 0 1 6.36 5.4L4.27 3.3A8 8 0 0 0 1 9l1.74 1.57Z"/>
                <path fill="#EA4335" d="M9 3.94a4.57 4.57 0 0 1 3.05 1.07l2.09-2.1A8 8 0 0 0 9 1a8 8 0 0 0-4.73 2.3l2.09 2.1A4.58 4.58 0 0 1 9 3.94Z"/>
              </svg>
              <span className="text-[14px] text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                Continue with Google
              </span>
            </>
          )}
        </motion.button>

        <button
          onClick={onSkip}
          className="w-full py-3 text-[13px] text-white/25 text-center"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Continue without signing in
        </button>
      </motion.div>
    </div>
  );
}

function NameStep({ onNext, onBack, profile, setProfile }: {
  onNext: () => void;
  onBack: () => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}) {
  const [focused, setFocused] = useState(false);
  const valid = profile.name.trim().length >= 2;

  return (
    <div className="flex flex-col min-h-screen px-6 pt-14 pb-10 relative overflow-hidden">
      <GoldOrb size={220} opacity={0.28} x="20%" y="75%" delay={0} />

      <CornerLogoBar
        current={1}
        total={3}
        onBack={onBack}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={easeOut}
        className="mb-10"
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}` }}
        >
          <User size={20} style={{ color: GOLD }} strokeWidth={1.5} />
        </div>
        <h2
          className="text-[28px] leading-tight tracking-[-0.03em] text-white/95 mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
        >
          What should we call you?
        </h2>
        <p className="text-[13px] text-white/35 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Just your first name is fine. This stays on your device.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...easeOut, delay: 0.15 }}
        className="mb-6"
      >
        <motion.div
          animate={{
            borderColor: focused ? GOLD_BORDER : BORDER,
            boxShadow: focused ? `0 0 0 3px ${GOLD}18` : '0 0 0 0px transparent',
          }}
          transition={{ duration: 0.2 }}
          className="relative rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
        >
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Arjun, Priya, Rahul…"
            autoFocus
            className="w-full bg-transparent outline-none text-white/90 placeholder-white/20 px-5 py-4 text-[17px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
          />
          <AnimatePresence>
            {valid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: GOLD_DIM }}
              >
                <Check size={12} style={{ color: GOLD }} strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {profile.name.length > 0 && !valid && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-[11px] text-white/25 px-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Enter at least 2 characters
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Preview greeting */}
      <AnimatePresence>
        {valid && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="px-4 py-3 rounded-xl mb-8"
            style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}` }}
          >
            <p className="text-[13px]" style={{ color: GOLD, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
              👋 Hello, {profile.name.trim()}! Ready to explore India's best financial products?
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={!valid}
          animate={{ opacity: valid ? 1 : 0.35 }}
          transition={{ duration: 0.2 }}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
          style={{
            background: valid ? `linear-gradient(135deg, ${GOLD}, #A87D46)` : SURFACE,
            border: valid ? 'none' : `1px solid ${BORDER}`,
          }}
        >
          <span
            className="text-[15px]"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              color: valid ? '#1a0f00' : 'rgba(255,255,255,0.25)',
            }}
          >
            Continue
          </span>
          <ChevronRight size={16} strokeWidth={2.5} style={{ color: valid ? '#1a0f00' : 'rgba(255,255,255,0.25)' }} />
        </motion.button>
      </div>
    </div>
  );
}

function LanguageStep({ onNext, onBack, profile, setProfile }: {
  onNext: () => void;
  onBack: () => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}) {
  return (
    <div className="flex flex-col min-h-screen px-6 pt-14 pb-10 relative overflow-hidden">
      <GoldOrb size={200} opacity={0.25} x="85%" y="60%" delay={0} />

      <CornerLogoBar
        current={2}
        total={3}
        onBack={onBack}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={easeOut}
        className="mb-10"
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}` }}
        >
          <Globe size={20} style={{ color: GOLD }} strokeWidth={1.5} />
        </div>
        <h2
          className="text-[28px] leading-tight tracking-[-0.03em] text-white/95 mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
        >
          Choose your language
        </h2>
        <p className="text-[13px] text-white/35 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          We'll show financial terms and tips in your preferred language.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...easeOut, delay: 0.15 }}
        className="space-y-3 mb-10"
      >
        {LANGUAGES.map((lang, i) => {
          const selected = profile.language === lang.id;
          return (
            <motion.button
              key={lang.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...easeOut, delay: 0.15 + i * 0.09 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setProfile((p) => ({ ...p, language: lang.id }))}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all"
              style={{
                background: selected ? GOLD_DIM : SURFACE,
                border: `1px solid ${selected ? GOLD_BORDER : BORDER}`,
              }}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1">
                <p
                  className="text-[15px]"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    color: selected ? GOLD : 'rgba(255,255,255,0.85)',
                  }}
                >
                  {lang.label}
                </p>
                <p
                  className="text-[11px] mt-0.5"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: selected ? `${GOLD}99` : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {lang.sub}
                </p>
              </div>
              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={spring}
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: GOLD }}
                  >
                    <Check size={12} strokeWidth={3} style={{ color: '#1a0f00' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-auto">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${GOLD}, #A87D46)`, boxShadow: `0 8px 28px ${GOLD}35` }}
        >
          <span
            className="text-[15px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#1a0f00' }}
          >
            Let's go
          </span>
          <ChevronRight size={16} strokeWidth={2.5} style={{ color: '#1a0f00' }} />
        </motion.button>
      </div>
    </div>
  );
}

function DoneStep({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const { setLang } = useLang();
  const [celebrationDone, setCelebrationDone] = useState(false);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('ledger_setup_done', 'true');
    localStorage.setItem('ledger_user', JSON.stringify(profile));
    setLang(profile.language);

    const timer = setTimeout(() => {
      router.replace('/');
    }, 2800);
    return () => clearTimeout(timer);
  }, [profile, router, setLang]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center relative overflow-hidden">
      <GoldOrb size={300} opacity={0.5} x="50%" y="45%" delay={0} />
      <GoldOrb size={160} opacity={0.3} x="10%" y="20%" delay={0.3} />
      <GoldOrb size={120} opacity={0.2} x="90%" y="75%" delay={0.5} />

      {/* Animated checkmark replacement */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
        className="mb-8 relative flex items-center justify-center animate-glow"
      >
        <LedgerLogo variant="done" onDoneComplete={() => setCelebrationDone(true)} />
        {celebrationDone && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 88,
              height: 88,
              border: `2px solid ${GOLD}`,
            }}
          />
        )}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...easeOut, delay: 0.45 }}
        className="text-[30px] tracking-[-0.04em] mb-3"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: 'rgba(255,255,255,0.95)' }}
      >
        You're all set{profile.name ? `, ${profile.name.trim()}` : ''}!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...easeOut, delay: 0.58 }}
        className="text-[13px] text-white/35 max-w-[240px] mb-10"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        LEDGER is ready. Explore savings, FDs, loans and more — all anonymously.
      </motion.p>

      {/* Animated loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-40 h-1 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.4, delay: 0.75, ease: 'easeInOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})` }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-4 text-[11px] text-white/20"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Taking you to the app…
      </motion.p>
    </div>
  );
}

// ─── Step order & navigation ──────────────────────────────────────────────────

const STEP_ORDER: Step[] = ['splash', 'google', 'name', 'language', 'done'];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SetupPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    language: 'en',
    googleConnected: false,
  });

  // Skip setup if already done
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const done = localStorage.getItem('ledger_setup_done');
      if (done === 'true') router.replace('/');
    }
  }, [router]);

  const currentStep = STEP_ORDER[stepIndex];
  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEP_ORDER.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -40 },
  };
  const pageTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  return (
    <div className="min-h-screen bg-[#070A12] relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(201,169,110,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(201,169,110,0.025) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-md mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-screen"
          >
            {currentStep === 'splash' && (
              <SplashStep onNext={goNext} />
            )}
            {currentStep === 'google' && (
              <GoogleStep
                onNext={() => {
                  setProfile((p) => ({ ...p, googleConnected: true }));
                  goNext();
                }}
                onBack={goBack}
                onSkip={goNext}
              />
            )}
            {currentStep === 'name' && (
              <NameStep
                onNext={goNext}
                onBack={goBack}
                profile={profile}
                setProfile={setProfile}
              />
            )}
            {currentStep === 'language' && (
              <LanguageStep
                onNext={goNext}
                onBack={goBack}
                profile={profile}
                setProfile={setProfile}
              />
            )}
            {currentStep === 'done' && (
              <DoneStep profile={profile} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}