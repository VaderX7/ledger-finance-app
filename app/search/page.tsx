'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowUpRight, ChevronRight, PiggyBank, FileText, TrendingUp, CreditCard, Landmark, Flag, Shield } from 'lucide-react';
import { Product, ProductCategory } from '@/lib/products';
import { getProducts, getProductsByCategory } from '@/lib/data-fetcher';
import { useLang } from '@/context/LanguageContext';
import ProductCategoryView from '@/components/product-category-view';
import BankBrowserPage from '@/components/bank-browser-page';

type SearchView = 'search' | ProductCategory | 'banks';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<ProductCategory, number | null>>({
    savings: null, current: null, fds: null, creditcards: null,
    loans: null, govtschemes: null, insurance: null,
  });
  const [activeView, setActiveView] = useState<SearchView>('search');
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLang();

  const categoryMeta: Record<ProductCategory, { label: string; subtitle: string; color: string; accentColor: string; icon: any }> = {
    savings:     { label: t.savingsLabel,     subtitle: t.savingsSub,     color: '#C9A96E', accentColor: '#E4C98A', icon: PiggyBank },
    current:     { label: t.currentLabel,     subtitle: t.currentSub,     color: '#00E5FF', accentColor: '#38BDF8', icon: FileText },
    fds:         { label: t.fdsLabel,         subtitle: t.fdsSub,         color: '#00F5A0', accentColor: '#2DD4BF', icon: TrendingUp },
    creditcards: { label: t.creditcardsLabel, subtitle: t.creditcardsSub, color: '#2DD4BF', accentColor: '#00E5FF', icon: CreditCard },
    loans:       { label: t.loansLabel,       subtitle: t.loansSub,       color: '#FB7185', accentColor: '#F97316', icon: Landmark },
    govtschemes: { label: t.govtschemesLabel, subtitle: t.govtschemesSub, color: '#FF9933', accentColor: '#FFB347', icon: Flag },
    insurance:   { label: t.insuranceLabel,   subtitle: t.insuranceSub,   color: '#00D4AA', accentColor: '#2DD4BF', icon: Shield },
  };

  const categoryCards = [
    { id: 'savings' as ProductCategory, ...categoryMeta.savings },
    { id: 'current' as ProductCategory, ...categoryMeta.current },
    { id: 'fds' as ProductCategory, ...categoryMeta.fds },
    { id: 'creditcards' as ProductCategory, ...categoryMeta.creditcards },
    { id: 'loans' as ProductCategory, ...categoryMeta.loans },
    { id: 'govtschemes' as ProductCategory, ...categoryMeta.govtschemes },
    { id: 'insurance' as ProductCategory, ...categoryMeta.insurance },
  ];

  useEffect(() => {
    getProducts().then(setAllProducts).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const loadCounts = async () => {
      const categories: ProductCategory[] = ['savings', 'current', 'fds', 'creditcards', 'loans', 'govtschemes', 'insurance'];
      try {
        const fetchedCounts = await Promise.all(
          categories.map(async (cat) => {
            try { const list = await getProductsByCategory(cat); return { cat, count: list.length }; }
            catch { return { cat, count: 0 }; }
          })
        );
        const countsMap = { ...counts };
        fetchedCounts.forEach(({ cat, count }) => { countsMap[cat] = count; });
        setCounts(countsMap);
      } catch (err) { console.error('Failed to load counts:', err); }
    };
    loadCounts();
  }, []);


  const filtered = allProducts.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.lender.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.highlights.some((h) => h.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const getPrimaryMetric = (p: Product): { label: string; value: string } | null => {
    const m = p.metrics;
    if (m.interestRate) return { label: 'Rate', value: String(m.interestRate) };
    if (m.baseYield) return { label: 'Yield', value: String(m.baseYield) };
    if (m.minRate) return { label: 'Rate from', value: String(m.minRate) };
    if (m.joiningFee !== undefined) return { label: 'Joining', value: String(m.joiningFee) };
    if (m.monthlyAvgBalance) return { label: 'MAB', value: String(m.monthlyAvgBalance) };
    return null;
  };

  const showEmpty = !loading && query.trim() && filtered.length === 0;
  const showPrompt = !loading && !query.trim();

  return (
    <AnimatePresence mode="wait">
      {activeView === 'search' ? (
        <motion.div
          key="search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen bg-[#070A12] px-5 pt-14 pb-28"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <h1
              className="text-[28px] tracking-[-0.04em] text-white/95 mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
            >
              {t.searchTitle}
            </h1>
            <p className="font-body text-[13px] text-white/35">
              {loading ? t.searchLoading : t.searchSub(allProducts.length)}
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative mb-6"
          >
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              strokeWidth={1.5}
              style={{ color: focused ? '#C9A96E' : 'rgba(255,255,255,0.3)' }}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-10 py-3.5 rounded-xl font-body text-[13px] text-white/80 placeholder-white/25 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid #C9A96E',
                boxShadow: focused ? '0 0 12px rgba(201,169,110,0.45), 0 0 24px rgba(201,169,110,0.15)' : 'none',
              }}
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(201,169,110,0.08)' }} />
              ))}
            </div>
          )}

          {/* Search results */}
          {!loading && query.trim() && (
            <>
              {!showEmpty && (
                <p className="font-body text-[10px] text-white/25 mb-3">
                  {t.results(filtered.length)}
                  {query.trim() ? ` for "${query}"` : ''}
                </p>
              )}
              <div className="space-y-2.5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((item, i) => {
                    const meta = categoryMeta[item.category];
                    const Icon = meta.icon;
                    const metric = getPrimaryMetric(item);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: Math.min(i * 0.03, 0.2), duration: 0.25 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex items-center justify-between p-4 rounded-xl cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${meta.color}18` }}>
                            <Icon size={16} style={{ color: meta.color }} strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] text-white/80 truncate"
                              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                              {item.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-body text-[9px] px-1.5 py-0.5 rounded-md"
                                style={{ background: `${meta.color}18`, color: meta.color }}>
                                {meta.label}
                              </span>
                              <span className="font-body text-[10px] text-white/30 truncate">{item.lender}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {metric && (
                            <span className="text-[12px] tracking-tight"
                              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: meta.color }}>
                              {metric.value}
                            </span>
                          )}
                          <ArrowUpRight size={13} className="text-white/20" />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}

          {showEmpty && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <p className="text-white/20 font-body text-sm mb-1">{t.noResults(query)}</p>
              <p className="text-white/12 font-body text-xs">{t.noResultsSub}</p>
            </motion.div>
          )}

          {/* Browse by Bank + Category cards (shown when no search active) */}
          {showPrompt && !loading && (
            <>
              {/* Browse by Bank — prominent umbrella card */}
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView('banks')}
                className="w-full relative overflow-hidden rounded-2xl p-5 text-left mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,169,110,0.18) 0%, rgba(228,201,138,0.08) 100%)',
                  border: '1px solid rgba(201,169,110,0.35)',
                  boxShadow: '0 8px 32px rgba(201,169,110,0.12)',
                }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1 }}
                  className="absolute inset-y-0 w-1/3 skew-x-12 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Bank icon grid */}
                    <div className="grid grid-cols-2 gap-1 w-10 h-10 flex-shrink-0">
                      {['#ED232A', '#00B4EF', '#B12B30', '#007A3D'].map((c) => (
                        <div key={c} className="rounded-md" style={{ background: c, opacity: 0.9 }} />
                      ))}
                    </div>
                    <div>
                      <p
                        className="text-[11px] uppercase tracking-widest font-bold mb-0.5"
                        style={{ color: '#C9A96E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        EXPLORE
                      </p>
                      <h3
                        className="text-[20px] tracking-tight text-white/95"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
                      >
                        Browse by Bank
                      </h3>
                      <p
                        className="text-[11px] text-white/35 mt-0.5"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        50+ banks · All products in one place
                      </p>
                    </div>
                  </div>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.25)' }}
                  >
                    <ChevronRight size={16} style={{ color: '#C9A96E' }} strokeWidth={2.5} />
                  </div>
                </div>
              </motion.button>

              {/* Section heading — product type */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[10px] tracking-widest uppercase text-white/25 mb-4"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                OR BROWSE BY PRODUCT TYPE
              </motion.p>

              {/* Category cards */}
              <div className="grid grid-cols-1 gap-3.5">
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
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${card.color}12`, border: `1px solid ${card.color}35` }}
                      >
                        <IconComponent size={22} style={{ color: card.color }} strokeWidth={2} />
                      </div>
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
                      <div className="flex items-center justify-center flex-shrink-0 ml-auto pl-2">
                        <ChevronRight size={18} style={{ color: card.color }} className="opacity-80" strokeWidth={2.5} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      ) : activeView === 'banks' ? (
        <motion.div
          key="banks"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="min-h-screen bg-[#070A12]"
        >
          <BankBrowserPage onBack={() => setActiveView('search')} />
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
            onBack={() => setActiveView('search')}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
