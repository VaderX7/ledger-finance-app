'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, X, ChevronRight, SlidersHorizontal, Check } from 'lucide-react';
import { Product, ProductCategory } from '@/lib/products';
import { getProducts } from '@/lib/data-fetcher';
import { BANK_LOGO_MAP, getOverriddenColor, LOGO_BG_MAP } from './product-category-view';
import CategoryProductCard from './category-product-card';
import ProductDetailPage from './product-detail-page';
import JargonBottomSheet from './jargon-bottom-sheet';

interface BankBrowserPageProps {
  onBack: () => void;
}

interface BankGroup {
  lender: string;
  bankType: string;
  color: string;
  colorAccent: string;
  products: Product[];
}

const BANK_TYPE_LABELS: Record<string, string> = {
  public: 'PUBLIC',
  private: 'PRIVATE',
  sfb: 'SMALL FINANCE',
  payments: 'PAYMENTS BANK',
  nbfc: 'NBFC',
};

const BANK_TYPE_FILTERS: { label: string; value: string | null }[] = [
  { label: 'All', value: null },
  { label: 'Public Sector', value: 'public' },
  { label: 'Private Sector', value: 'private' },
  { label: 'Small Finance', value: 'sfb' },
  { label: 'Payments Bank', value: 'payments' },
  { label: 'NBFC', value: 'nbfc' },
];

const CATEGORY_COLORS: Record<string, string> = {
  savings: '#C9A96E',
  current: '#00E5FF',
  fds: '#00F5A0',
  creditcards: '#2DD4BF',
  loans: '#FB7185',
  govtschemes: '#FF9933',
  insurance: '#00D4AA',
};

const CATEGORY_LABELS: Record<string, string> = {
  savings: 'Savings',
  current: 'Current',
  fds: 'FDs',
  creditcards: 'Credit Cards',
  loans: 'Loans',
  govtschemes: 'Govt Schemes',
  insurance: 'Insurance',
};

const ALL_CATEGORIES: ProductCategory[] = ['savings', 'current', 'fds', 'creditcards', 'loans', 'govtschemes', 'insurance'];

function getBankInitials(lender: string): string {
  const n = lender.toUpperCase();
  if (n.includes('STATE BANK OF INDIA')) return 'SBI';
  if (n.includes('BANK OF BARODA')) return 'BOB';
  if (n.includes('BANK OF INDIA')) return 'BOI';
  if (n.includes('BANK OF MAHARASHTRA')) return 'BOM';
  if (n.includes('CENTRAL BANK OF INDIA')) return 'CBI';
  if (n.includes('PUNJAB & SIND')) return 'PSB';
  if (n.includes('PUNJAB NATIONAL')) return 'PNB';
  if (n.includes('UNION BANK OF INDIA')) return 'UBI';
  if (n.includes('INDIAN OVERSEAS')) return 'IOB';
  if (n.includes('JAMMU & KASHMIR')) return 'JKB';
  if (n.includes('KARUR VYSYA')) return 'KVB';
  if (n.includes('SOUTH INDIAN')) return 'SIB';
  if (n.includes('TAMILNAD MERCANTILE')) return 'TMB';
  if (n.includes('CITY UNION')) return 'CUB';
  if (n.includes('DHANLAXMI')) return 'DLB';
  if (n.includes('IDFC FIRST')) return 'IDFC';
  const clean = lender.replace(/bank/gi, '').trim();
  const words = clean.split(/[\s-]+/).filter(Boolean);
  if (words.length >= 2) return words.slice(0, 3).map(w => w[0].toUpperCase()).join('');
  return clean.substring(0, 4).toUpperCase();
}

function getLogoUrl(lender: string): string {
  const id = BANK_LOGO_MAP[lender] || lender.toLowerCase().replace(/bank/gi, '').replace(/[^a-z0-9]/g, '').trim();
  return `/logos/${id}.png`;
}

function getLogoId(lender: string): string {
  return BANK_LOGO_MAP[lender] || lender.toLowerCase().replace(/bank/gi, '').replace(/[^a-z0-9]/g, '').trim();
}

const BankLogo = memo(function BankLogo({ lender, color, colorAccent, size = 40 }: { lender: string; color: string; colorAccent: string; size?: number }) {
  const [error, setError] = useState(false);
  const logoId = getLogoId(lender);
  const logoUrl = `/logos/${logoId}.png`;

  if (error) {
    return (
      <div
        className="rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, #3f3f46, #18181b)`,
        }}
      >
        <span
          className="leading-none"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: colorAccent, fontSize: size * 0.3 }}
        >
          {lender.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{ width: size, height: size, padding: size * 0.2, background: LOGO_BG_MAP[lender] ?? '#FFFFFF' }}
    >
      <img
        src={logoUrl}
        alt={`${lender} logo`}
        className="max-w-full max-h-full object-contain"
        loading="lazy"
        onError={() => setError(true)}
      />
    </div>
  );
});

const BankCard = memo(function BankCard({ bank, onClick }: { bank: BankGroup; onClick: () => void }) {
  const categories = useMemo(() => Array.from(new Set(bank.products.map(p => p.category))), [bank.products]);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full rounded-2xl text-left overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, ${bank.color}15, ${bank.colorAccent}08)`,
        border: `1px solid ${bank.color}25`,
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: bank.color }} />
      <div className="flex items-center gap-3 px-4 py-3.5 pl-5">
        <BankLogo lender={bank.lender} color={bank.color} colorAccent={bank.colorAccent} />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] leading-tight truncate font-bold text-white/92" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {bank.lender}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
              style={{ background: `${bank.color}18`, color: bank.colorAccent, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {BANK_TYPE_LABELS[bank.bankType] || bank.bankType.toUpperCase()}
            </span>
            <span className="text-[10px] text-white/35 font-body">
              {bank.products.length} products
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
            {categories.map(cat => (
              <span
                key={cat}
                className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                style={{ background: `${CATEGORY_COLORS[cat]}15`, color: CATEGORY_COLORS[cat], fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {CATEGORY_LABELS[cat]}
              </span>
            ))}
          </div>
        </div>
        <ChevronRight size={16} style={{ color: bank.colorAccent + '80' }} className="flex-shrink-0" />
      </div>
    </motion.button>
  );
});

function BankDetailPage({ bank, onBack }: { bank: BankGroup; onBack: () => void }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ProductCategory[]>([...ALL_CATEGORIES]);

  const filteredProducts = useMemo(() => {
    if (activeFilters.length === ALL_CATEGORIES.length) return bank.products;
    return bank.products.filter(p => activeFilters.includes(p.category));
  }, [bank.products, activeFilters]);

  const toggleFilter = useCallback((cat: ProductCategory) => {
    setActiveFilters(prev => {
      const has = prev.includes(cat);
      if (has && prev.length > 1) {
        return prev.filter(c => c !== cat);
      }
      if (!has) {
        return [...prev, cat];
      }
      return prev;
    });
  }, []);

  const selectAll = useCallback(() => {
    setActiveFilters([...ALL_CATEGORIES]);
  }, []);

  const bankCategories = useMemo(() => {
    return ALL_CATEGORIES.filter(cat => bank.products.some(p => p.category === cat));
  }, [bank.products]);

  return (
    <motion.div
      key="bank-detail"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 340, damping: 34 }}
      className="fixed inset-0 bg-[#070A12] z-[55] flex flex-col max-w-md mx-auto"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-4 py-3"
        style={{
          background: `linear-gradient(180deg, ${bank.color}18 0%, rgba(7, 10, 18, 0.90) 100%)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onBack}
          className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <ArrowLeft size={18} className="text-white/80" strokeWidth={2} />
        </motion.button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <BankLogo lender={bank.lender} color={bank.color} colorAccent={bank.colorAccent} size={32} />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold leading-tight truncate text-white/95" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {bank.lender}
            </p>
            <p className="text-[10px] text-white/40 font-body mt-0.5">
              {filteredProducts.length} products
            </p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setFilterOpen(true)}
          className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <SlidersHorizontal size={16} className="text-white/80" strokeWidth={2} />
        </motion.button>
      </div>

      {/* Inline category chips */}
      <div className="flex-shrink-0 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={selectAll}
          className="px-3 py-1.5 rounded-full text-[10px] font-bold flex-shrink-0 transition-all"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: activeFilters.length === ALL_CATEGORIES.length ? '#C9A96E20' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${activeFilters.length === ALL_CATEGORIES.length ? '#C9A96E50' : 'rgba(255,255,255,0.08)'}`,
            color: activeFilters.length === ALL_CATEGORIES.length ? '#C9A96E' : 'rgba(255,255,255,0.4)',
          }}
        >
          All
        </motion.button>
        {bankCategories.map(cat => {
          const active = activeFilters.includes(cat);
          const color = CATEGORY_COLORS[cat];
          return (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.92 }}
              onClick={() => toggleFilter(cat)}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold flex-shrink-0 transition-all"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: active ? `${color}20` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${active ? `${color}50` : 'rgba(255,255,255,0.08)'}`,
                color: active ? color : 'rgba(255,255,255,0.4)',
              }}
            >
              {CATEGORY_LABELS[cat]}
            </motion.button>
          );
        })}
      </div>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {filteredProducts.map((product, idx) => (
          <div key={product.id} className="relative">
            <div
              className="absolute top-11 right-3 z-10 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider"
              style={{
                background: `${CATEGORY_COLORS[product.category]}20`,
                border: `1px solid ${CATEGORY_COLORS[product.category]}40`,
                color: CATEGORY_COLORS[product.category],
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {CATEGORY_LABELS[product.category]}
            </div>
            <CategoryProductCard
              product={product}
              index={idx}
              onJargonClick={(term) => { setSelectedTerm(term); setIsSheetOpen(true); }}
              onDetailsClick={setSelectedProduct}
            />
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-white/20 font-body text-sm">
            No products in selected categories
          </div>
        )}
      </div>

      {/* Filter bottom sheet */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[58] bg-black/60"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed bottom-0 left-0 right-0 z-[59] max-w-md mx-auto rounded-t-3xl"
              style={{ background: '#0D1120', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none' }}
            >
              <div className="px-5 pt-4 pb-8">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[15px] font-bold text-white/90" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Filter by Category
                  </h3>
                  <motion.button whileTap={{ scale: 0.88 }} onClick={() => setFilterOpen(false)}>
                    <X size={18} className="text-white/40" />
                  </motion.button>
                </div>
                <div className="space-y-2">
                  {ALL_CATEGORIES.map(cat => {
                    const active = activeFilters.includes(cat);
                    const color = CATEGORY_COLORS[cat];
                    return (
                      <motion.button
                        key={cat}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleFilter(cat)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                        style={{
                          background: active ? `${color}12` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${active ? `${color}35` : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{
                            background: active ? color : 'rgba(255,255,255,0.08)',
                            border: `1px solid ${active ? color : 'rgba(255,255,255,0.15)'}`,
                          }}
                        >
                          {active && <Check size={12} className="text-white" strokeWidth={3} />}
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span
                          className="text-[13px] font-semibold"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}
                        >
                          {CATEGORY_LABELS[cat]}
                        </span>
                        <span className="ml-auto text-[10px] text-white/30 font-body">
                          {bank.products.filter(p => p.category === cat).length}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product detail page (Level 3) */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

      <JargonBottomSheet
        term={selectedTerm}
        isOpen={isSheetOpen}
        onClose={() => { setIsSheetOpen(false); setTimeout(() => setSelectedTerm(null), 300); }}
      />
    </motion.div>
  );
}

export default function BankBrowserPage({ onBack }: BankBrowserPageProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<BankGroup | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const products = await getProducts();
        if (!cancelled) setAllProducts(products);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const bankGroups = useMemo(() => {
    const groups: BankGroup[] = [];
    const seen = new Map<string, number>();
    for (const p of allProducts) {
      const color = getOverriddenColor(p.lender, 'color', p.color);
      const colorAccent = getOverriddenColor(p.lender, 'colorAccent', p.colorAccent);
      const overridden = { ...p, color, colorAccent };
      const idx = seen.get(p.lender);
      if (idx === undefined) {
        seen.set(p.lender, groups.length);
        groups.push({ lender: p.lender, bankType: p.bankType, color, colorAccent, products: [overridden] });
      } else {
        groups[idx].products.push(overridden);
      }
    }
    return groups;
  }, [allProducts]);

  const filteredBanks = useMemo(() => {
    let result = bankGroups;
    if (activeFilter) {
      result = result.filter(b => b.bankType === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b => b.lender.toLowerCase().includes(q));
    }
    return result;
  }, [bankGroups, activeFilter, search]);

  return (
    <>
      <motion.div
        key="bank-browser"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
        className="fixed inset-0 bg-[#070A12] z-[50] flex flex-col max-w-md mx-auto"
      >
        {/* Header */}
        <div
          className="flex-shrink-0 flex items-center gap-3 px-4 py-3"
          style={{
            background: 'rgba(7,10,18,0.90)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onBack}
            className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <ArrowLeft size={18} className="text-white/80" strokeWidth={2} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] leading-tight truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}>
              Browse by Bank
            </p>
            <p className="font-body text-[10px] mt-0.5" style={{ color: '#C9A96Ebb' }}>
              {bankGroups.length} banks
            </p>
          </div>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#C9A96E', boxShadow: '0 0 8px #C9A96E88' }} />
        </div>

        {/* Search */}
        <div className="flex-shrink-0 px-4 pt-3 pb-2">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Search size={15} className="text-white/30 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search banks..."
              className="flex-1 bg-transparent text-[13px] text-white/80 placeholder:text-white/25 outline-none font-body"
            />
            {search && (
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => setSearch('')}>
                <X size={14} className="text-white/30" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex-shrink-0 px-4 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {BANK_TYPE_FILTERS.map(f => {
            const active = activeFilter === f.value;
            return (
              <motion.button
                key={f.label}
                whileTap={{ scale: 0.92 }}
                onClick={() => setActiveFilter(f.value)}
                className="px-3.5 py-1.5 rounded-full text-[10px] font-bold flex-shrink-0 transition-all"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  background: active ? '#C9A96E20' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${active ? '#C9A96E50' : 'rgba(255,255,255,0.08)'}`,
                  color: active ? '#C9A96E' : 'rgba(255,255,255,0.4)',
                }}
              >
                {f.label}
              </motion.button>
            );
          })}
        </div>

        {/* Bank list */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {loading ? (
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              {filteredBanks.map((bank) => (
                <BankCard key={bank.lender} bank={bank} onClick={() => setSelectedBank(bank)} />
              ))}
              {filteredBanks.length === 0 && (
                <div className="text-center py-16 text-white/20 font-body text-sm">No banks found</div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Bank detail (Level 2) — rendered as sibling, not nested */}
      <AnimatePresence>
        {selectedBank && (
          <BankDetailPage
            bank={selectedBank}
            onBack={() => setSelectedBank(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
