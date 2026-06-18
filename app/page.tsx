'use client';

import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/context/LanguageContext';
import { getGreeting } from '@/lib/i18n';
import TruelyMoneyLogo from '@/components/TruelyMoneyLogo';
import SplashScreen from '@/components/SplashScreen';

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false);
  const [ready, setReady] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const { t, lang } = useLang();

  useEffect(() => {
    const shown = sessionStorage.getItem('splash_shown');
    if (shown === 'true') setSplashDone(true);
  }, []);

  useEffect(() => {
    if (!splashDone) return;

    const done = localStorage.getItem('ledger_setup_done');
    if (!done) {
      router.replace('/setup');
      return;
    }
    try {
      const raw = localStorage.getItem('ledger_user');
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.name) setUserName(user.name.trim());
      }
    } catch { }
    setReady(true);
  }, [splashDone, router]);

  if (!splashDone) {
    return (
      <SplashScreen
        onComplete={() => {
          sessionStorage.setItem('splash_shown', 'true');
          setSplashDone(true);
        }}
      />
    );
  }

  if (!ready) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#070A12] px-5 pt-14 relative overflow-hidden"
    >
      {/* Page color orb */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.85, 1, 0.85],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          opacity: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          delay: 1.2,
        }}
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #C9A96E28 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
          top: -40,
        }}
      />

      <div className="relative z-10">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-2.5">
          <TruelyMoneyLogo variant="home" />
          <span
            className="text-base text-white tracking-widest"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
          >
            Truely Money
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Bell size={16} className="text-white/50" strokeWidth={1.5} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
        </motion.button>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="mb-8"
      >
        <p className="font-body text-xs font-medium tracking-[0.18em] uppercase text-white/30 mb-3">
          {t.financialIntelligence}
        </p>

        <h1
          className="text-[34px] leading-[1.1] tracking-[-0.04em] text-white/95 mb-4"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
        >
          {userName ? (
            <>
              {getGreeting(lang).split(',')[0]},{' '}
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #E4C98A 0%, #C9A96E 50%, #A87D46 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: '#C9A96E'
                }}
              >
                {userName}.
              </span>
            </>
          ) : (
            <>
              {t.heroTitle}{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #E4C98A 0%, #C9A96E 50%, #A87D46 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: '#C9A96E'
                }}
              >
                {t.heroGold}
              </span>
            </>
          )}
        </h1>

        <p className="font-body text-[13px] leading-relaxed text-white/40 max-w-[280px]">
          {t.heroSub}
        </p>
      </motion.div>
      </div>
    </motion.div>
  );
}
