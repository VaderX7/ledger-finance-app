'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductCategory } from '@/lib/products';
import { BankType } from '@/lib/products';
import { getProductsByCategory } from '@/lib/data-fetcher';
import CategoryViewHeader from './category-view-header';
import CategoryProductCard from './category-product-card';
import JargonBottomSheet from './jargon-bottom-sheet';
import ProductDetailPage from './product-detail-page';
import { Search, X, ChevronDown, Check } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { TranslationKey } from '@/lib/i18n';

const bankTypeFilters: Array<{ id: BankType | 'all'; labelKey: 'all' | 'publicSector' | 'privateSector' | 'smallFinance' | 'nbfc' }> = [
  { id: 'all', labelKey: 'all' },
  { id: 'public', labelKey: 'publicSector' },
  { id: 'private', labelKey: 'privateSector' },
  { id: 'sfb', labelKey: 'smallFinance' },
  { id: 'nbfc', labelKey: 'nbfc' },
];

const categoryMeta: Record<
  ProductCategory,
  { labelKey: 'savingsLabel' | 'currentLabel' | 'fdsLabel' | 'creditcardsLabel' | 'loansLabel' | 'govtschemesLabel' | 'insuranceLabel';
    subtitleKey: 'savingsSub' | 'currentSub' | 'fdsSub' | 'creditcardsSub' | 'loansSub' | 'govtschemesSub' | 'insuranceSub';
    accentColor: string }
> = {
  savings:     { labelKey: 'savingsLabel',     subtitleKey: 'savingsSub',     accentColor: '#C9A96E' },
  current:     { labelKey: 'currentLabel',     subtitleKey: 'currentSub',     accentColor: '#00E5FF' },
  fds:         { labelKey: 'fdsLabel',         subtitleKey: 'fdsSub',         accentColor: '#00F5A0' },
  creditcards: { labelKey: 'creditcardsLabel', subtitleKey: 'creditcardsSub', accentColor: '#2DD4BF' },
  loans:       { labelKey: 'loansLabel',       subtitleKey: 'loansSub',       accentColor: '#FB7185' },
  govtschemes: { labelKey: 'govtschemesLabel', subtitleKey: 'govtschemesSub', accentColor: '#FF9933' },
  insurance:   { labelKey: 'insuranceLabel',   subtitleKey: 'insuranceSub',   accentColor: '#00D4AA' },
};

// Bottom sheet for selecting a value from a list
function SelectSheet({
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  title: string;
  options: string[];
  selected: string | null;
  onSelect: (v: string | null) => void;
  onClose: () => void;
}) {
  const { t } = useLang();
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-[#0D1220] rounded-t-3xl z-50 overflow-hidden"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 -4px 40px rgba(0,0,0,0.6)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-8 h-1 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.88)', fontSize: 15 }}>
            {title}
          </p>
          <button onClick={onClose}>
            <X size={18} className="text-white/40" />
          </button>
        </div>
        <div className="px-4 py-3 max-h-80 overflow-y-auto space-y-1 pb-8">
          <button
            onClick={() => { onSelect(null); onClose(); }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
            style={{ background: selected === null ? 'rgba(255,255,255,0.06)' : 'transparent' }}
          >
            <span className="font-body text-[13px] text-white/55">{t.showAll}</span>
            {selected === null && <Check size={14} className="text-white/60" />}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onSelect(opt); onClose(); }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
              style={{ background: selected === opt ? 'rgba(255,255,255,0.06)' : 'transparent' }}
            >
              <span className="font-body text-[13px] text-white/75">{opt}</span>
              {selected === opt && <Check size={14} className="text-white/60" />}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface ProductCategoryViewProps {
  category: ProductCategory;
  onBack: () => void;
}

export default function ProductCategoryView({ category, onBack }: ProductCategoryViewProps) {
  const { t, lang } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [bankFilter, setBankFilter] = useState<BankType | 'all'>('all');
  const [searchText, setSearchText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Institution popup filter
  const [showBankPopup, setShowBankPopup] = useState(false);
  const [bankPopupFilter, setBankPopupFilter] = useState<string | null>(null);

  // Credit card / loan type filter
  const [showTypePopup, setShowTypePopup] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const meta = categoryMeta[category];
  const label = t[meta.labelKey];
  const subtitle = t[meta.subtitleKey];
  const showDualFilters = category === 'creditcards' || category === 'loans' || category === 'insurance';

  useEffect(() => {
    setLoading(true);
    setAllProducts([]);
    setSearchText('');
    setBankFilter('all');
    setBankPopupFilter(null);
    setTypeFilter(null);
    setSelectedProduct(null);
    getProductsByCategory(category)
      .then(setAllProducts)
      .finally(() => setLoading(false));
    // scroll to top
    window.scrollTo(0, 0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [category]);

  // Derive available lenders and types from loaded products
  const availableLenders = Array.from(new Set(allProducts.map((p) => p.lender))).sort();
  const availableTypes = (() => {
    if (category === 'creditcards') {
      return Array.from(new Set(allProducts.map((p) => String(p.metrics.eligibilityIncome ?? '')).filter(Boolean)));
    }
    if (category === 'loans') {
      // Derive type from product name keywords
      const types = new Set<string>();
      allProducts.forEach((p) => {
        if (p.name.toLowerCase().includes('personal')) types.add('Personal Loan');
        else if (p.name.toLowerCase().includes('home')) types.add('Home Loan');
        else if (p.name.toLowerCase().includes('car') || p.name.toLowerCase().includes('auto')) types.add('Car Loan');
        else if (p.name.toLowerCase().includes('mudra') || p.name.toLowerCase().includes('business')) types.add('Business Loan');
        else if (p.name.toLowerCase().includes('education') || p.name.toLowerCase().includes('student')) types.add('Education Loan');
        else types.add('Other');
      });
      return Array.from(types).sort();
    }
    if (category === 'insurance') {
      const types = new Set<string>();
      allProducts.forEach((p) => {
        const n = p.name.toLowerCase();
        if (n.includes('health') || n.includes('medical')) types.add('Health Insurance');
        else if (n.includes('term') || n.includes('life')) types.add('Term / Life Insurance');
        else if (n.includes('motor') || n.includes('car') || n.includes('vehicle') || n.includes('auto')) types.add('Motor Insurance');
        else if (n.includes('travel')) types.add('Travel Insurance');
        else if (n.includes('home') || n.includes('property') || n.includes('house')) types.add('Home Insurance');
        else if (n.includes('ulip') || n.includes('unit')) types.add('ULIP');
        else if (n.includes('pension') || n.includes('annuity') || n.includes('retirement')) types.add('Pension / Annuity');
        else if (n.includes('accident') || n.includes('personal accident')) types.add('Personal Accident');
        else types.add('Other');
      });
      return Array.from(types).sort();
    }
    return [];
  })();

  const getLoanType = (p: Product): string => {
    const n = p.name.toLowerCase();
    if (n.includes('personal')) return 'Personal Loan';
    if (n.includes('home')) return 'Home Loan';
    if (n.includes('car') || n.includes('auto')) return 'Car Loan';
    if (n.includes('mudra') || n.includes('business')) return 'Business Loan';
    if (n.includes('education') || n.includes('student')) return 'Education Loan';
    return 'Other';
  };

  const getInsuranceType = (p: Product): string => {
    const n = p.name.toLowerCase();
    if (n.includes('health') || n.includes('medical')) return 'Health Insurance';
    if (n.includes('term') || n.includes('life')) return 'Term / Life Insurance';
    if (n.includes('motor') || n.includes('car') || n.includes('vehicle') || n.includes('auto')) return 'Motor Insurance';
    if (n.includes('travel')) return 'Travel Insurance';
    if (n.includes('home') || n.includes('property') || n.includes('house')) return 'Home Insurance';
    if (n.includes('ulip') || n.includes('unit')) return 'ULIP';
    if (n.includes('pension') || n.includes('annuity') || n.includes('retirement')) return 'Pension / Annuity';
    if (n.includes('accident') || n.includes('personal accident')) return 'Personal Accident';
    return 'Other';
  };

  const filtered = allProducts.filter((p) => {
    if (bankFilter !== 'all' && p.bankType !== bankFilter) return false;
    if (bankPopupFilter && p.lender !== bankPopupFilter) return false;
    if (typeFilter) {
      if (category === 'creditcards' && String(p.metrics.eligibilityIncome) !== typeFilter) return false;
      if (category === 'loans' && getLoanType(p) !== typeFilter) return false;
      if (category === 'insurance' && getInsuranceType(p) !== typeFilter) return false;
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.lender.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setTimeout(() => setSelectedTerm(null), 300);
  };

  const activeFilterCount = (bankPopupFilter ? 1 : 0) + (typeFilter ? 1 : 0);

  return (
    <>
      {!selectedProduct && (
        <CategoryViewHeader
          label={label}
          subtitle={subtitle}
          accentColor={meta.accentColor}
          onBack={onBack}
        />
      )}

      <div ref={scrollRef} className="pt-16 px-4 pb-28">
        {/* Search bar — always first below header */}
        <div className="sticky top-16 z-20 py-2" style={{ background: 'rgba(7,10,18,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={lang === 'hi' ? `${label} खोजें…` : lang === 'hinglish' ? `${label} search karein…` : `Search ${label.toLowerCase()}…`}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl font-body text-[12px] outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.78)',
              }}
            />
            {searchText && (
              <button onClick={() => setSearchText('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
              </button>
            )}
          </div>
        </div>

        {/* Institution type filter pills */}
        <div className="mb-3 mt-2">
          <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
            {t.institutionType}
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
            {bankTypeFilters.map((f) => {
              const isActive = bankFilter === f.id;
              return (
                <motion.button
                  key={f.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setBankFilter(f.id as BankType | 'all')}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg font-body text-[10px] font-medium whitespace-nowrap transition-all"
                  style={{
                    background: isActive ? `${meta.accentColor}18` : 'rgba(255,255,255,0.03)',
                    border: isActive ? `1px solid ${meta.accentColor}44` : '1px solid rgba(255,255,255,0.06)',
                    color: isActive ? meta.accentColor : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {t[f.labelKey]}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Browse by Institution + dual type filters */}
        {!loading && allProducts.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {/* Browse by Institution */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowBankPopup(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-[10px] font-medium transition-all"
              style={{
                background: bankPopupFilter ? `${meta.accentColor}18` : 'rgba(255,255,255,0.04)',
                border: bankPopupFilter ? `1px solid ${meta.accentColor}44` : '1px solid rgba(255,255,255,0.08)',
                color: bankPopupFilter ? meta.accentColor : 'rgba(255,255,255,0.45)',
              }}
            >
              {bankPopupFilter ?? t.filterByBank}
              <ChevronDown size={11} />
            </motion.button>

            {/* Type filter — only for creditcards and loans */}
            {showDualFilters && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowTypePopup(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-[10px] font-medium transition-all"
                style={{
                  background: typeFilter ? `${meta.accentColor}18` : 'rgba(255,255,255,0.04)',
                  border: typeFilter ? `1px solid ${meta.accentColor}44` : '1px solid rgba(255,255,255,0.08)',
                  color: typeFilter ? meta.accentColor : 'rgba(255,255,255,0.45)',
                }}
              >
                {typeFilter ?? (category === 'loans' ? t.filterByType : category === 'insurance' ? t.filterByType : t.filterByIncome)}
                <ChevronDown size={11} />
              </motion.button>
            )}

            {/* Clear all active filters */}
            {activeFilterCount > 0 && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => { setBankPopupFilter(null); setTypeFilter(null); }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-body text-[10px] font-medium"
                style={{ background: 'rgba(251,113,133,0.10)', border: '1px solid rgba(251,113,133,0.25)', color: '#FB7185' }}
              >
                <X size={10} /> {activeFilterCount > 1 ? t.clearAll : t.clear}
              </motion.button>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-3 mt-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        )}

        {/* Product cards */}
        {!loading && (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, idx) => (
                <CategoryProductCard
                  key={product.id}
                  product={product}
                  index={idx}
                  onJargonClick={(term) => { setSelectedTerm(term); setIsSheetOpen(true); }}
                  onDetailsClick={setSelectedProduct}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-white/25 font-body text-sm">
            {t.noProductsMatch}
          </div>
        )}
      </div>

      {/* Full-screen product detail */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* Bank popup sheet */}
      {showBankPopup && (
        <SelectSheet
          title={t.filterByBank}
          options={availableLenders}
          selected={bankPopupFilter}
          onSelect={setBankPopupFilter}
          onClose={() => setShowBankPopup(false)}
        />
      )}

      {/* Type popup sheet */}
      {showTypePopup && (
        <SelectSheet
          title={category === 'loans' ? (lang === 'hi' ? 'ऋण प्रकार द्वारा फ़िल्टर करें' : lang === 'hinglish' ? 'Loan Type se Filter Karo' : 'Filter by Loan Type') : category === 'insurance' ? (lang === 'hi' ? 'बीमा प्रकार द्वारा फ़िल्टर करें' : lang === 'hinglish' ? 'Insurance Type se Filter Karo' : 'Filter by Insurance Type') : (lang === 'hi' ? 'आय पात्रता द्वारा फ़िल्टर करें' : lang === 'hinglish' ? 'Income Eligibility se Filter Karo' : 'Filter by Income Eligibility')}
          options={availableTypes}
          selected={typeFilter}
          onSelect={setTypeFilter}
          onClose={() => setShowTypePopup(false)}
        />
      )}

      <JargonBottomSheet
        term={selectedTerm}
        isOpen={isSheetOpen}
        onClose={handleSheetClose}
        onBackgroundChange={() => {}}
      />
    </>
  );
}