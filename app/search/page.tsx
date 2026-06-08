'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowUpRight, PiggyBank, CreditCard, Landmark, TrendingUp, FileText, Flag, Shield } from 'lucide-react';
import { Product, ProductCategory } from '@/lib/products';
import { getProducts } from '@/lib/data-fetcher';
import { useLang } from '@/context/LanguageContext';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLang();

  const categoryMeta: Record<ProductCategory, { label: string; color: string; icon: any }> = {
    savings:     { label: t.savings,     color: '#C9A96E', icon: PiggyBank },
    current:     { label: t.current,     color: '#00E5FF', icon: FileText },
    fds:         { label: t.fds,         color: '#00F5A0', icon: TrendingUp },
    creditcards: { label: t.creditcards, color: '#2DD4BF', icon: CreditCard },
    loans:       { label: t.loans,       color: '#FB7185', icon: Landmark },
    govtschemes: { label: t.govtschemes, color: '#FF9933', icon: Flag },
    insurance:   { label: t.insurance,   color: '#00D4AA', icon: Shield },
  };

  const categoryOrder: ProductCategory[] = ['savings', 'fds', 'loans', 'creditcards', 'current', 'govtschemes', 'insurance'];

  useEffect(() => {
    getProducts().then(setAllProducts).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const filtered = allProducts.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
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
  const showPrompt = !loading && !query.trim() && activeCategory === 'all';

  return (
    <div className="min-h-screen bg-[#070A12] px-5 pt-14 pb-28">
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative mb-4"
      >
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" strokeWidth={1.5} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-11 pr-10 py-3.5 rounded-xl font-body text-[13px] text-white/80 placeholder-white/25 outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
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

      {/* Category pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18 }}
        className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1 mb-6"
      >
        <button
          onClick={() => setActiveCategory('all')}
          className="flex-shrink-0 px-3.5 py-1.5 rounded-xl text-[11px] font-body font-medium transition-all"
          style={{
            background: activeCategory === 'all' ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.04)',
            border: activeCategory === 'all' ? '1px solid rgba(201,169,110,0.35)' : '1px solid rgba(255,255,255,0.07)',
            color: activeCategory === 'all' ? '#C9A96E' : 'rgba(255,255,255,0.45)',
          }}
        >
          {t.all}
        </button>
        {categoryOrder.map((cat) => {
          const meta = categoryMeta[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-xl text-[11px] font-body font-medium transition-all"
              style={{
                background: isActive ? `${meta.color}18` : 'rgba(255,255,255,0.04)',
                border: isActive ? `1px solid ${meta.color}44` : '1px solid rgba(255,255,255,0.07)',
                color: isActive ? meta.color : 'rgba(255,255,255,0.45)',
              }}
            >
              {meta.label}
            </button>
          );
        })}
      </motion.div>

      {loading && (
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      )}

      {showPrompt && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <p className="text-[10px] tracking-widest uppercase text-white/20 mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
            {t.browseByCategory}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {categoryOrder.map((cat) => {
              const meta = categoryMeta[cat];
              const Icon = meta.icon;
              const count = allProducts.filter(p => p.category === cat).length;
              return (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(cat)}
                  className="flex items-center gap-3 p-3.5 rounded-xl text-left"
                  style={{ background: `${meta.color}0d`, border: `1px solid ${meta.color}22` }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${meta.color}18` }}>
                    <Icon size={15} style={{ color: meta.color }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[12px] text-white/80"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                      {meta.label}
                    </p>
                    <p className="font-body text-[9px] text-white/30">{count} {t.products}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {!loading && (query.trim() || activeCategory !== 'all') && (
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
    </div>
  );
}