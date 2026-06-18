'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, ChevronRight, PiggyBank, Landmark, CreditCard, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/context/LanguageContext';
import { getGreeting } from '@/lib/i18n';
import TruelyMoneyLogo from '@/components/TruelyMoneyLogo';
import SplashScreen from '@/components/SplashScreen';
import { getRecentlyViewed, RecentlyViewedItem } from '@/lib/recently-viewed';
import { getFavourites, FavouriteItem } from '@/lib/favourites';
import { getHomeContent, HomeContent } from '@/lib/home-content';
import { getProducts } from '@/lib/data-fetcher';

const getTipCategoryColor = (cat: string) => {
  const map: Record<string, string> = {
    savings: '#C9A96E',
    loans: '#FB7185',
    investment: '#00E5FF',
    general: '#8B5CF6',
    tax: '#00F5A0'
  };
  return map[cat] ?? '#C9A96E';
};

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false);
  const [ready, setReady] = useState(false);
  const [userName, setUserName] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [bestRates, setBestRates] = useState({ savings: 'N/A', fd: 'N/A', loan: 'N/A' });
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

    setRecentlyViewed(getRecentlyViewed());
    setFavourites(getFavourites());

    try {
      const raw = localStorage.getItem('ledger_user');
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.name) setUserName(user.name.trim());
      }
    } catch {}

    // Get daily Gemini content
    getHomeContent()
      .then(setHomeContent)
      .catch((err) => {
        console.error('Error fetching daily AI content:', err);
        setHomeContent(null);
      })
      .finally(() => setContentLoading(false));

    // Get best rates
    getProducts()
      .then((products) => {
        // extract savings
        const savingsProducts = products.filter((p) => p.category === 'savings');
        const savingsRates = savingsProducts
          .map((p) => parseFloat(String(p.metrics.interestRate ?? '0').match(/[\d.]+/)?.[0] ?? '0'))
          .filter((r) => r > 0 && r < 20);
        const bestSavings = savingsRates.length > 0 ? Math.max(...savingsRates) : 0;

        // extract fds
        const fdProducts = products.filter((p) => p.category === 'fds');
        const fdRates = fdProducts
          .map((p) => parseFloat(String(p.metrics.baseYield ?? '0').match(/[\d.]+/)?.[0] ?? '0'))
          .filter((r) => r > 0 && r < 20);
        const bestFD = fdRates.length > 0 ? Math.max(...fdRates) : 0;

        // extract loans (lowest rate is best)
        const loanProducts = products.filter((p) => p.category === 'loans');
        const loanRates = loanProducts
          .map((p) => parseFloat(String(p.metrics.minRate ?? '999').match(/[\d.]+/)?.[0] ?? '999'))
          .filter((r) => r > 0 && r < 50);
        const lowestLoan = loanRates.length > 0 ? Math.min(...loanRates) : 0;

        setBestRates({
          savings: bestSavings > 0 ? `${bestSavings}%` : 'N/A',
          fd: bestFD > 0 ? `${bestFD}%` : 'N/A',
          loan: lowestLoan > 0 ? `${lowestLoan}%` : 'N/A',
        });
      })
      .catch((err) => {
        console.error('Error getting rates:', err);
      });

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
      className="min-h-screen bg-[#070A12] px-5 pt-14 pb-28 relative overflow-hidden"
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

      <div className="relative z-10 space-y-6">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between"
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
            onClick={() => router.push('/profile')}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Bell size={16} className="text-white/50" strokeWidth={1.5} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
          </motion.button>
        </motion.div>

        {/* Hero greeting */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
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
                {getGreeting(lang, userName).split(',')[0]},{' '}
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

        {/* Section 1 — Today's Best Rates */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.05))',
            border: '1px solid rgba(201,169,110,0.25)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#C9A96E]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              TODAY'S BEST RATES
            </p>
            <p className="text-[10px] text-white/25">Live from 50+ banks</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Best Savings', value: bestRates.savings, color: '#C9A96E', icon: '🏦' },
              { label: 'Best FD', value: bestRates.fd, color: '#00F5A0', icon: '📈' },
              { label: 'Lowest Loan', value: bestRates.loan, color: '#FB7185', icon: '🏠' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-[18px] font-extrabold" style={{ color: item.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {item.value}
                </p>
                <p className="text-[9px] text-white/35 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          {/* Gemini rate insight */}
          {homeContent?.rateInsight && (
            <p className="text-[11px] text-white/40 mt-3 pt-3 border-t border-white/[0.06] italic">
              💡 {homeContent.rateInsight}
            </p>
          )}
        </motion.div>

        {/* Section 2 — Quick Access Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>QUICK ACCESS</p>
            <button onClick={() => router.push('/search')} className="text-[11px] text-[#C9A96E] font-semibold">View all</button>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { id: 'savings', label: 'Savings', color: '#C9A96E', icon: PiggyBank },
              { id: 'loans', label: 'Loans', color: '#FB7185', icon: Landmark },
              { id: 'creditcards', label: 'Cards', color: '#2DD4BF', icon: CreditCard },
              { id: 'insurance', label: 'Insurance', color: '#00D4AA', icon: Shield },
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => router.push(`/search?category=${cat.id}`)}
                  className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl cursor-pointer w-full"
                  style={{
                    background: `${cat.color}12`,
                    border: `1px solid ${cat.color}28`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${cat.color}18` }}
                  >
                    <Icon size={18} style={{ color: cat.color }} strokeWidth={1.75} />
                  </div>
                  <span className="text-[10px] text-white/70 whitespace-nowrap" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                    {cat.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Section 3 — Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>RECENTLY VIEWED</p>
              <button onClick={() => router.push('/search')} className="text-[11px] text-[#C9A96E] font-semibold">See all</button>
            </div>
            <div className="space-y-2">
              {recentlyViewed.slice(0, 3).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{ background: `${item.color}10`, border: `1px solid ${item.color}20` }}
                >
                  <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ background: `${item.color}20`, color: item.colorAccent }}>
                    {item.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-white/85 font-semibold truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.name}</p>
                    <p className="text-[11px] text-white/35 truncate">{item.lender}</p>
                  </div>
                  <ChevronRight size={14} className="text-white/25 flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4 — My Favourites Quick Access */}
        {favourites.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>MY FAVOURITES</p>
              <button onClick={() => router.push('/profile')} className="text-[11px] text-[#C9A96E] font-semibold">View all</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hidden">
              {favourites.slice(0, 6).map((fav, i) => (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  onClick={() => router.push('/profile')}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${fav.color}15`, border: `1px solid ${fav.color}30`, boxShadow: `0 0 12px ${fav.color}25` }}
                  >
                    <span className="text-[11px] font-bold text-white/60">
                      {fav.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[9px] text-white/35 text-center max-w-[48px] truncate">{fav.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5 — Daily Financial Tip */}
        <div>
          {contentLoading && (
            <div className="rounded-2xl p-4 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="h-3 w-24 rounded bg-white/10 mb-3" />
              <div className="h-4 w-40 rounded bg-white/10 mb-2" />
              <div className="h-3 w-full rounded bg-white/08 mb-1" />
              <div className="h-3 w-3/4 rounded bg-white/08" />
            </div>
          )}

          {homeContent?.tip && !contentLoading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">💡</span>
                <p className="text-[10px] uppercase tracking-widest text-white/35 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>DAILY TIP</p>
                <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: getTipCategoryColor(homeContent.tip.category) + '20', color: getTipCategoryColor(homeContent.tip.category) }}>
                  {homeContent.tip.category.toUpperCase()}
                </span>
              </div>
              <h3 className="text-[14px] text-white/90 font-bold mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {homeContent.tip.title}
              </h3>
              <p className="text-[12px] text-white/45 leading-relaxed font-body">
                {homeContent.tip.body}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
