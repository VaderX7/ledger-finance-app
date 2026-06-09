'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronRight, PiggyBank, FileText, TrendingUp, CreditCard, Landmark, Flag, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCategory } from '@/lib/products';
import ProductCategoryView from '@/components/product-category-view';
import { useLang } from '@/context/LanguageContext';
import { getGreeting } from '@/lib/i18n';
import LedgerLogo from '@/components/LedgerLogo';
import { getProductsByCategory } from '@/lib/data-fetcher';

type AppView = 'home' | ProductCategory;

export default function HomePage() {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [ready, setReady] = useState(false);
  const [userName, setUserName] = useState('');
  const [counts, setCounts] = useState<Record<ProductCategory, number | null>>({
    savings: null,
    current: null,
    fds: null,
    creditcards: null,
    loans: null,
    govtschemes: null,
    insurance: null,
  });
  const router = useRouter();
  const { t, lang } = useLang();

  useEffect(() => {
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

    // Fetch product counts dynamically for all categories
    const loadCounts = async () => {
      const categories: ProductCategory[] = ['savings', 'current', 'fds', 'creditcards', 'loans', 'govtschemes', 'insurance'];
      try {
        const fetchedCounts = await Promise.all(
          categories.map(async (cat) => {
            try {
              const list = await getProductsByCategory(cat);
              return { cat, count: list.length };
            } catch {
              return { cat, count: 0 };
            }
          })
        );
        const countsMap = { ...counts };
        fetchedCounts.forEach(({ cat, count }) => {
          countsMap[cat] = count;
        });
        setCounts(countsMap);
      } catch (err) {
        console.error('Failed to load counts:', err);
      }
    };
    loadCounts();
  }, [router]);

  if (!ready) return null;

  const categoryCards = [
    { id: 'savings' as ProductCategory, label: t.savingsLabel, subtitle: t.savingsSub, color: '#C9A96E', accentColor: '#E4C98A', description: t.savingsDesc, icon: PiggyBank },
    { id: 'current' as ProductCategory, label: t.currentLabel, subtitle: t.currentSub, color: '#00E5FF', accentColor: '#38BDF8', description: t.currentDesc, icon: FileText },
    { id: 'fds' as ProductCategory, label: t.fdsLabel, subtitle: t.fdsSub, color: '#00F5A0', accentColor: '#2DD4BF', description: t.fdsDesc, icon: TrendingUp },
    { id: 'creditcards' as ProductCategory, label: t.creditcardsLabel, subtitle: t.creditcardsSub, color: '#2DD4BF', accentColor: '#00E5FF', description: t.creditcardsDesc, icon: CreditCard },
    { id: 'loans' as ProductCategory, label: t.loansLabel, subtitle: t.loansSub, color: '#FB7185', accentColor: '#F97316', description: t.loansDesc, icon: Landmark },
    { id: 'govtschemes' as ProductCategory, label: t.govtschemesLabel, subtitle: t.govtschemesSub, color: '#FF9933', accentColor: '#FFB347', description: t.govtschemesDesc, icon: Flag },
    { id: 'insurance' as ProductCategory, label: t.insuranceLabel, subtitle: t.insuranceSub, color: '#00D4AA', accentColor: '#2DD4BF', description: t.insuranceDesc, icon: Shield },
  ];

  return (
    <AnimatePresence mode="wait">
      {activeView === 'home' ? (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen bg-[#070A12] px-5 pt-14"
        >
          {/* Top bar */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-2.5">
              <LedgerLogo variant="home" />
              <span
                className="text-sm text-white/80"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
              >
                LEDGER
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

            {/* Big greeting headline */}
            <h1
              className="text-[34px] leading-[1.1] tracking-[-0.04em] text-white/95 mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
            >
              {userName ? (
                <>
                  {/* e.g. "Good Evening," */}
                  {getGreeting(lang).split(',')[0]},{' '}
                  <br />
                  {/* Name in gold */}
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

          {/* Section heading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] tracking-widest uppercase text-white/25 mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            {t.selectCategory}
          </motion.p>

          {/* Category cards */}
          <div className="grid grid-cols-1 gap-3.5 mb-12">
            {categoryCards.map((card, index) => {
              const IconComponent = card.icon;
              const productCount = counts[card.id];
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.22 + index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ 
                    scale: 1.015,
                    border: `1px solid ${card.color}55`,
                    background: `linear-gradient(135deg, ${card.color}24 0%, ${card.accentColor}12 100%)`,
                    boxShadow: `0 10px 30px -10px ${card.color}18`,
                  }}
                  onClick={() => setActiveView(card.id)}
                  className="relative overflow-hidden rounded-2xl py-3.5 px-5 text-left flex items-center gap-4 transition-all w-full"
                  style={{
                    background: `linear-gradient(135deg, ${card.color}16 0%, ${card.accentColor}0a 100%)`,
                    border: `1px solid ${card.color}25`,
                    boxShadow: `0 4px 24px -10px ${card.color}05`,
                  }}
                >
                  {/* Left Icon inside color-coded squircle container */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${card.color}12`,
                      border: `1px solid ${card.color}35`,
                    }}
                  >
                    <IconComponent size={22} style={{ color: card.color }} strokeWidth={2} />
                  </div>

                  {/* Text Details with proper spacing and font sizes */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3
                      className="text-[15px] leading-tight font-bold"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'rgba(255,255,255,0.92)' }}
                    >
                      {card.label}
                    </h3>
                    <p className="font-body text-[11px] mt-0.5 font-medium" style={{ color: card.color }}>
                      {card.subtitle}
                    </p>
                    <span className="font-body text-[10px] mt-1 block text-white/50">
                      {productCount !== null ? `${productCount}+ options` : 'Comparing rates...'}
                    </span>
                  </div>

                  {/* Clean Right Chevron aligned with spacing */}
                  <div className="flex items-center justify-center flex-shrink-0 ml-auto pl-2">
                    <ChevronRight size={18} style={{ color: card.color }} className="opacity-80" strokeWidth={2.5} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={activeView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="min-h-screen bg-[#070A12]"
        >
          <ProductCategoryView
            category={activeView}
            onBack={() => setActiveView('home')}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}