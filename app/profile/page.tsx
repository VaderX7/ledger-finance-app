'use client';

import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Bell, Globe, ChevronRight, Moon, HelpCircle, FileText, Info, LogOut, X, Check, Star, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/context/LanguageContext';
import { getFavourites, toggleFavourite, FavouriteItem } from '@/lib/favourites';
import { BANK_LOGO_MAP, LOGO_BG_MAP } from '@/components/product-category-view';
import ProductDetailPage from '@/components/product-detail-page';
import BankAccountPage from '@/components/bank-account-page';
import { getProducts } from '@/lib/data-fetcher';
import { Product } from '@/lib/products';
import { financialInstitutions, FinancialInstitution } from '@/lib/institutions';

function getFormattedBankType(bankType: string): string {
  if (!bankType) return '';
  const bt = bankType.toLowerCase();
  if (bt === 'sfb') return 'SFB';
  if (bt === 'nbfc') return 'NBFC';
  if (bt === 'payments') return 'Payments';
  return bt.charAt(0).toUpperCase() + bt.slice(1);
}

function formatMinBalance(balance: string | number | undefined): string {
  if (balance === undefined || balance === null) return '₹0';
  const balanceStr = String(balance).toLowerCase().trim();
  if (balanceStr === 'nil' || balanceStr === '0' || balanceStr === '₹0' || balanceStr === 'none') return '₹0';
  if (balanceStr.includes('k')) return balanceStr;
  
  const str = balanceStr.replace(/[,]/g, '');
  const match = str.match(/₹?\s*(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num >= 1000) {
      return `₹${Math.round(num / 1000)}k`;
    }
    return `₹${num}`;
  }
  return String(balance);
}

function getProductMetricHighlight(product: Product) {
  const cat = product.category;
  
  if (cat === 'savings') {
    const interestRate = String(product.metrics.interestRate || 'N/A');
    const rate = interestRate.match(/[\d.]+%/)?.[0] ?? interestRate;
    let minBal = String(product.metrics.minBalance || '₹0');
    if (product.id === 'hdfc-savings' || minBal === '₹10,000' || minBal === '10000') {
      minBal = '₹10k';
    } else {
      minBal = formatMinBalance(minBal);
    }
    return {
      value: rate,
      subtitle: `p.a. interest · ${minBal} min balance`
    };
  }
  
  if (cat === 'fds') {
    let yieldVal = String(product.metrics.baseYield || 'N/A');
    if (yieldVal.includes('-')) {
      yieldVal = yieldVal.split('-')[0].trim();
    }
    if (!yieldVal.endsWith('%') && yieldVal !== 'N/A') {
      yieldVal = `${yieldVal}%`;
    }
    const tenure = String(product.metrics.tenureRange || 'N/A');
    return {
      value: yieldVal,
      subtitle: `p.a. yield · ${tenure} tenure`
    };
  }
  
  if (cat === 'loans') {
    let rate = String(product.metrics.minRate || 'N/A');
    if (rate.includes('-')) {
      rate = rate.split('-')[0].trim();
    }
    const tenure = String(product.metrics.maxTenure || 'N/A');
    return {
      value: rate.endsWith('%') ? rate : `${rate}%`,
      subtitle: `p.a. starting rate · ${tenure} max tenure`
    };
  }
  
  if (cat === 'creditcards') {
    const joining = String(product.metrics.joiningFee || '₹0');
    const annual = String(product.metrics.annualFee || '₹0');
    return {
      value: joining,
      subtitle: `joining fee · ${annual} annual`
    };
  }
  
  if (cat === 'current') {
    let mab = String(product.metrics.monthlyAvgBalance || 'N/A');
    if (mab.includes('-')) {
      mab = mab.split('-')[0].trim();
    }
    const deposit = String(product.metrics.freeCashDeposit || 'N/A');
    return {
      value: mab,
      subtitle: `avg balance · ${deposit} free deposit`
    };
  }
  
  // Fallback
  const firstKey = Object.keys(product.metrics)[0];
  const firstVal = String(product.metrics[firstKey] || 'N/A');
  return {
    value: firstVal,
    subtitle: firstKey ? firstKey.replace(/([A-Z])/g, ' $1').toLowerCase() : 'primary metric'
  };
}

function formatLenderName(lender: string): string {
  if (!lender) return '';
  const lower = lender.toLowerCase();
  if (lower.includes('state bank of india')) return 'SBI';
  if (lower.includes('housing development') || lower.includes('hdfc')) return 'HDFC Bank';
  if (lower.includes('icici')) return 'ICICI Bank';
  if (lower.includes('axis')) return 'Axis Bank';
  if (lower.includes('equitas')) return 'Equitas Bank';
  if (lower.includes('bajaj')) return 'Bajaj Finserv';
  if (lower.includes('sidbi')) return 'SIDBI';
  if (lower.includes('mudra')) return 'Mudra Scheme';
  return lender;
}

type SettingItem = {
  key?: string;
  label: string;
  sub: string;
  icon: React.ElementType;
  toggle: boolean;
  defaultOn?: boolean;
};

function ToggleSwitch({ on, color }: { on: boolean; color: string }) {
  return (
    <div
      className="relative rounded-full transition-colors duration-300"
      style={{
        background: on ? `${color}55` : 'rgba(255,255,255,0.08)',
        width: 40, height: 22,
        border: on ? `1px solid ${color}66` : '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <motion.div
        animate={{ x: on ? 18 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute rounded-full"
        style={{ background: on ? color : 'rgba(255,255,255,0.3)', width: 17, height: 17, top: 2 }}
      />
    </div>
  );
}

function LanguageSelectSheet({
  isOpen,
  currentLang,
  onSelect,
  onClose,
  t,
}: {
  isOpen: boolean;
  currentLang: string;
  onSelect: (lang: any) => void;
  onClose: () => void;
  t: any;
}) {
  const options = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिंदी (Hindi)' },
    { id: 'hinglish', label: 'Hinglish' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 max-w-md mx-auto"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-[#0D1220] rounded-t-3xl z-50 overflow-hidden"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 -4px 40px rgba(0, 0, 0, 0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-1 rounded-full bg-white/10" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.88)',
                  fontSize: 15,
                }}
              >
                {t.language}
              </p>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 transition-all">
                <X size={18} className="text-white/40" />
              </button>
            </div>
            <div className="px-4 py-3 max-h-80 overflow-y-auto space-y-1 pb-8">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelect(opt.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-left"
                  style={{
                    background: currentLang === opt.id ? 'rgba(45, 212, 191, 0.08)' : 'transparent',
                    border: currentLang === opt.id ? '1px solid rgba(45, 212, 191, 0.15)' : '1px solid transparent',
                  }}
                >
                  <span
                    className="font-body text-[13px] font-semibold"
                    style={{ color: currentLang === opt.id ? '#2DD4BF' : 'rgba(255, 255, 255, 0.65)' }}
                  >
                    {opt.label}
                  </span>
                  {currentLang === opt.id && <Check size={14} className="text-[#2DD4BF]" />}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function ProfilePage() {
  const { lang, setLang, t } = useLang();
  const router = useRouter();
  const [isLangSheetOpen, setIsLangSheetOpen] = useState(false);
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
  const [showFavourites, setShowFavourites] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<FinancialInstitution | null>(null);
  const [removedFavId, setRemovedFavId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'bank' | 'savings' | 'current' | 'fds' | 'creditcards' | 'loans' | 'govtschemes' | 'insurance'>('all');

  useEffect(() => {
    setFavourites(getFavourites());
    getProducts().then(setAllProducts).catch(console.error);
  }, []);

  const handleRemoveFavourite = (id: string) => {
    const item = favourites.find(f => f.id === id);
    if (item) {
      toggleFavourite(item);
      setFavourites(getFavourites());
    }
  };

  const handleStarRemovalWithAnimation = (id: string) => {
    setRemovedFavId(id);
    setTimeout(() => {
      const item = favourites.find(f => f.id === id);
      if (item) {
        toggleFavourite(item);
        setFavourites(getFavourites());
      }
      setRemovedFavId(null);
    }, 300);
  };

  const filterPills: { id: typeof filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'bank', label: 'Banks' },
    { id: 'savings', label: 'Savings' },
    { id: 'current', label: 'Current' },
    { id: 'fds', label: 'FDs' },
    { id: 'creditcards', label: 'Credit Cards' },
    { id: 'loans', label: 'Loans' },
    { id: 'govtschemes', label: 'Schemes' },
    { id: 'insurance', label: 'Insurance' },
  ];

  const settings: { group: string; icon: any; color: string; items: SettingItem[] }[] = [
    {
      group: t.privacy,
      icon: Shield,
      color: '#C9A96E',
      items: [
        { label: t.anonymousMode, sub: t.anonymousModeSub, icon: EyeOff, toggle: true, defaultOn: true },
        { label: t.clearHistory, sub: t.clearHistorySub, icon: Eye, toggle: false },
      ],
    },
    {
      group: t.notifications,
      icon: Bell,
      color: '#38BDF8',
      items: [
        { label: t.rateAlerts, sub: t.rateAlertsSub, icon: Bell, toggle: true, defaultOn: false },
        { label: t.newSchemes, sub: t.newSchemesSub, icon: Globe, toggle: true, defaultOn: true },
      ],
    },
    {
      group: t.preferences,
      icon: Moon,
      color: '#2DD4BF',
      items: [
        { label: t.darkMode, sub: t.darkModeSub, icon: Moon, toggle: true, defaultOn: true },
        { key: 'language', label: t.language, sub: lang === 'hi' ? 'हिंदी (Hindi)' : lang === 'hinglish' ? 'Hinglish' : 'English', icon: Globe, toggle: false },
      ],
    },
    {
      group: t.support,
      icon: HelpCircle,
      color: '#FB7185',
      items: [
        { label: t.helpFAQ, sub: t.helpFAQSub, icon: HelpCircle, toggle: false },
        { label: t.privacyPolicy, sub: t.privacyPolicySub, icon: FileText, toggle: false },
        { label: t.aboutApp, sub: t.version, icon: Info, toggle: false },
      ],
    },
  ];

  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    settings.forEach((g) =>
      g.items.forEach((item: SettingItem) => {
        if (item.toggle) init[item.label] = item.defaultOn ?? false;
      })
    );
    return init;
  });

  const handleLogout = () => {
    localStorage.removeItem('ledger_setup_done');
    localStorage.removeItem('ledger_user');
    router.replace('/setup');
  };

  let savedName = '';
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('ledger_user') : null;
    if (raw) savedName = JSON.parse(raw)?.name ?? '';
  } catch {}

  return (
    <div className="min-h-screen bg-[#070A12] px-5 pt-14 pb-28">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <h1
          className="text-[28px] tracking-[-0.04em] text-white/95 mb-1"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
        >
          {t.profileTitle}
        </h1>
        <p className="font-body text-[13px] text-white/35">{t.profileSub}</p>
      </motion.div>

      {/* Identity card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl p-5 mb-7"
        style={{
          background: 'linear-gradient(135deg, rgba(201,169,110,0.1) 0%, rgba(13,18,32,0.95) 80%)',
          border: '1px solid rgba(201,169,110,0.2)',
        }}
      >
        <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full blur-3xl" style={{ background: 'rgba(201,169,110,0.06)' }} />
        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.25)' }}
          >
            {savedName ? (
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: '#C9A96E', fontSize: 22 }}>
                {savedName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <Shield size={26} style={{ color: '#C9A96E' }} strokeWidth={1.5} />
            )}
          </div>
          <div>
            <p
              className="text-[18px] text-white/90"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
            >
              {savedName || t.anonymousUser}
            </p>
            <p className="font-body text-[11px] text-white/40 mt-0.5">{t.noAccountNeeded}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
              <span className="font-body text-[10px] text-[#2DD4BF]">{t.fullyProtected}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* My Favourites settings row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl overflow-hidden mb-3"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <motion.button
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            setFavourites(getFavourites());
            setShowFavourites(true);
          }}
          className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,169,110,0.12)' }}
            >
              <Star size={14} style={{ color: '#C9A96E' }} strokeWidth={2} fill="#C9A96E" />
            </div>
            <div>
              <p className="text-[13px] text-white/75 font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                My Favourites
              </p>
              <p className="font-body text-[10px] text-white/28">View and manage your saved items</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-body"
              style={{
                background: 'rgba(201,169,110,0.2)',
                color: '#C9A96E',
                border: '1px solid rgba(201,169,110,0.3)',
              }}
            >
              {favourites.length}
            </span>
            <ChevronRight size={15} className="text-white/20" />
          </div>
        </motion.button>
      </motion.div>

      {/* Favourites Overlay Page */}
      <AnimatePresence>
        {showFavourites && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[60] bg-[#070A12] flex flex-col max-w-md mx-auto overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div
              className="flex-shrink-0 flex items-center gap-3 px-4 py-3"
              style={{
                background: 'rgba(7, 10, 18, 0.90)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setShowFavourites(false)}
                className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer"
                style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
              >
                <ArrowLeft size={18} className="text-white/80" strokeWidth={2} />
              </motion.button>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <p
                  className="text-[16px] font-extrabold"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'rgba(255,255,255,0.92)' }}
                >
                  My Favourites
                </p>
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-extrabold font-body"
                  style={{
                    background: 'rgba(201,169,110,0.2)',
                    color: '#C9A96E',
                    border: '1px solid rgba(201,169,110,0.3)',
                  }}
                >
                  {favourites.length}
                </span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-12 flex flex-col">
              {/* Horizontally scrollable filter pills */}
              {favourites.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-shrink-0">
                  {filterPills.map((pill) => {
                    const isActive = filter === pill.id;
                    return (
                      <button
                        key={pill.id}
                        onClick={() => setFilter(pill.id)}
                        className="px-3 py-1.5 rounded-full text-[10px] font-bold font-body whitespace-nowrap cursor-pointer transition-all border"
                        style={{
                          background: isActive ? 'rgba(201,169,110,0.18)' : 'rgba(255,255,255,0.05)',
                          color: isActive ? '#C9A96E' : 'rgba(255,255,255,0.4)',
                          borderColor: isActive ? 'rgba(201,169,110,0.3)' : 'rgba(255,255,255,0.06)',
                        }}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Favourites list */}
              {favourites.length > 0 && favourites.filter((item) => filter === 'all' || item.type === filter).length > 0 ? (
                <div className="space-y-3">
                  {favourites
                    .filter((item) => filter === 'all' || item.type === filter)
                    .map((item, idx) => {
                      const isBank = item.type === 'bank';
                      if (isBank) {
                        return (
                          <div key={item.id} className="relative group">
                            <motion.div
                              whileTap={{ scale: 0.985 }}
                              onClick={() => {
                                const inst = financialInstitutions.find(fi => fi.name === item.lender);
                                if (inst) {
                                  setSelectedInstitution(inst);
                                }
                              }}
                              className="overflow-hidden rounded-2xl p-4 border-l-[3px] flex items-center gap-3 cursor-pointer text-left"
                              style={{
                                background: `linear-gradient(135deg, ${item.color}12 0%, ${item.colorAccent}08 100%)`,
                                borderTop: `1px solid ${item.color}28`,
                                borderRight: `1px solid ${item.color}28`,
                                borderBottom: `1px solid ${item.color}28`,
                                borderLeftColor: item.color,
                              }}
                            >
                              {/* Logo */}
                              <div 
                                className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center p-[6px] overflow-hidden"
                                style={{
                                  background: LOGO_BG_MAP[item.lender] ?? '#FFFFFF',
                                  border: `1px solid ${item.color}40`,
                                  boxShadow: `0 0 10px ${item.color}35, 0 2px 8px rgba(0,0,0,0.15)`,
                                }}
                              >
                                <img
                                  src={`/logos/${BANK_LOGO_MAP[item.lender] || item.lender.toLowerCase().replace(/bank/gi, '').replace(/[^a-z0-9]/g, '').trim()}.png`}
                                  alt={`${item.lender} logo`}
                                  className="object-contain w-full h-full"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0 pr-8">
                                <h3 className="text-[15px] leading-tight text-white/95 truncate font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                  {item.lender}
                                </h3>
                                <p className="font-body text-[9px] text-[#C9A96E]/80 mt-1 font-semibold uppercase tracking-wider">
                                  Saved Bank
                                </p>
                              </div>
                            </motion.div>
                            
                            {/* Star Button outside the main clickable area */}
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleStarRemovalWithAnimation(item.id);
                              }}
                              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/30 cursor-pointer z-10"
                            >
                              <motion.div
                                animate={removedFavId === item.id ? { scale: [1, 1.4, 0] } : { scale: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Star size={14} className="text-[#C9A96E]" fill="#C9A96E" />
                              </motion.div>
                            </motion.button>
                          </div>
                        );
                      }

                      // Replicated Account Card
                      // Look up the full product if available
                      const fullProduct = allProducts.find((p) => p.id === item.id);
                      const productData = (fullProduct || {
                        id: item.id,
                        name: item.name,
                        lender: item.lender,
                        category: item.type as any,
                        description: 'Saved Account',
                        highlights: [],
                        documents: [],
                        color: item.color,
                        colorAccent: item.colorAccent,
                        portalUrl: '',
                        bankType: 'private' as any,
                        metrics: {},
                      }) as Product;

                      const isTopPick = productData.topPick || ['hdfc-savings', 'equitas-savings', 'hdfc-fd', 'icici-cc', 'mudra-shishu'].includes(productData.id);
                      const bankTypeLabel = getFormattedBankType(productData.bankType);
                      const isProtected = productData.category === 'savings' || productData.category === 'fds' || 
                                          (productData.highlights && productData.highlights.some(h => h.toLowerCase().includes('dicgc'))) || 
                                          (productData.description && productData.description.toLowerCase().includes('dicgc'));
                      const subtitleText = `${bankTypeLabel} · ${isProtected ? 'DICGC Protected' : 'RBI Registered'}`;
                      const metricHighlight = getProductMetricHighlight(productData);
                      const highlights = productData.highlights || [];

                      return (
                        <div key={item.id} className="relative group">
                          <motion.div
                            whileTap={{ scale: 0.985 }}
                            onClick={() => {
                              setSelectedProduct(productData);
                            }}
                            className="overflow-hidden rounded-2xl cursor-pointer p-4 flex flex-col justify-between text-left"
                            style={{
                              background: `linear-gradient(135deg, color-mix(in srgb, ${item.color} 22%, transparent) 0%, color-mix(in srgb, ${item.colorAccent} 8%, transparent) 100%), #0d1117`,
                              borderTop: `1px solid color-mix(in srgb, ${item.color} 50%, transparent)`,
                              borderRight: `1px solid color-mix(in srgb, ${item.color} 50%, transparent)`,
                              borderBottom: `1px solid color-mix(in srgb, ${item.color} 50%, transparent)`,
                              borderLeft: `6px solid ${item.color}`,
                              borderRadius: '16px',
                            }}
                          >
                            {/* Ambient glow */}
                            <div
                              className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{ background: `color-mix(in srgb, ${item.color} 14%, transparent)` }}
                            />

                            {/* Header Row */}
                            <div className="relative z-10 flex items-center justify-between gap-3">
                              {/* Left: Avatar + Bank Details */}
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Bank Avatar */}
                                <div
                                  className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center p-[6px] overflow-hidden"
                                  style={{
                                    background: LOGO_BG_MAP[item.lender] ?? '#FFFFFF',
                                    border: `1px solid color-mix(in srgb, ${item.color} 40%, transparent)`,
                                    boxShadow: `0 0 10px color-mix(in srgb, ${item.color} 35%, transparent), 0 2px 8px rgba(0,0,0,0.15)`,
                                  }}
                                >
                                  <img
                                    src={`/logos/${BANK_LOGO_MAP[item.lender] || item.lender.toLowerCase().replace(/bank/gi, '').replace(/[^a-z0-9]/g, '').trim()}.png`}
                                    alt={item.lender}
                                    className="w-full h-full object-contain"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                </div>
                                
                                {/* Bank Name + Subtitle */}
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[14px] font-bold text-white leading-tight truncate">
                                    {formatLenderName(item.lender)}
                                  </span>
                                  <span className="text-[11px] text-white/40 leading-tight mt-0.5 font-body">
                                    {subtitleText}
                                  </span>
                                </div>
                              </div>

                              {/* Right: Top Pick Badge */}
                              {isTopPick && (
                                <div 
                                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                                  style={{
                                    backgroundColor: 'rgba(0, 229, 255, 0.08)',
                                    color: '#00E5FF',
                                    border: '1px solid rgba(0, 229, 255, 0.25)',
                                  }}
                                >
                                  <span className="text-[10px] leading-none">★</span>
                                  <span>Top Pick</span>
                                </div>
                              )}
                            </div>

                            {/* Divider 1 */}
                            <div className="border-t border-white/[0.05] my-3" />

                            {/* Product Name */}
                            <div className="relative z-10">
                              <h3
                                className="text-[20px] font-bold text-white tracking-tight leading-snug pr-8"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                              >
                                {item.name}
                              </h3>
                            </div>

                            {/* Key Metric Highlight */}
                            <div className="relative z-10 flex items-baseline gap-2 mt-2.5">
                              <span 
                                className="text-[28px] font-bold leading-none tracking-tight"
                                style={{ color: item.color }}
                              >
                                {metricHighlight.value}
                              </span>
                              <span className="text-[12px] text-white/35 font-body">
                                {metricHighlight.subtitle}
                              </span>
                            </div>

                            {/* Divider 2 */}
                            {highlights.length > 0 && (
                              <div className="border-t border-white/[0.05] my-3" />
                            )}

                            {/* Tags Row */}
                            <div className="relative z-10 flex items-center justify-between gap-4">
                              {/* Highlights */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {highlights.slice(0, 3).map((h) => (
                                  <span
                                    key={h}
                                    className="px-2 py-0.5 rounded text-[10px] font-body text-white/40 bg-white/[0.02] border border-white/[0.08]"
                                  >
                                    {h}
                                  </span>
                                ))}
                              </div>
                              <button
                                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all duration-300 hover:bg-[#00E5FF]/10 flex-shrink-0"
                                style={{
                                  borderColor: 'rgba(0, 229, 255, 0.35)',
                                  color: '#00E5FF',
                                  background: 'transparent',
                                }}
                              >
                                <span>View details</span>
                                <span>→</span>
                              </button>
                            </div>
                          </motion.div>
                          
                          {/* Star Button outside the main clickable area */}
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleStarRemovalWithAnimation(item.id);
                            }}
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/30 cursor-pointer z-10"
                          >
                            <motion.div
                              animate={removedFavId === item.id ? { scale: [1, 1.4, 0] } : { scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Star size={14} className="text-[#C9A96E]" fill="#C9A96E" />
                            </motion.div>
                          </motion.button>
                        </div>
                      );
                    })}
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center flex-1">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/[0.02] border border-white/[0.05] mb-4">
                    <Star size={24} className="text-[#C9A96E]/40" style={{ color: '#C9A96E' }} />
                  </div>
                  <p className="text-[15px] text-white/60 font-semibold">
                    No favourites yet
                  </p>
                  <p className="font-body text-[12px] text-white/30 mt-1.5 max-w-[240px] leading-relaxed">
                    Tap the ★ on any bank or account to save it here
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedInstitution && (
          <BankAccountPage
            institution={selectedInstitution}
            onBack={() => setSelectedInstitution(null)}
          />
        )}
      </AnimatePresence>

      {/* Settings groups */}
      <div className="space-y-3">
        {settings.map((group, gi) => {
          const GroupIcon = group.icon;
          return (
            <motion.div
              key={group.group}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.09 + 0.22, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2.5 px-5 pt-4 pb-2">
                <GroupIcon size={13} style={{ color: group.color, opacity: 0.8 }} strokeWidth={2} />
                <span
                  className="text-[10px] tracking-widest uppercase"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: `${group.color}99` }}
                >
                  {group.group}
                </span>
              </div>
              <div className="pb-2">
                {group.items.map((item, ii) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        if (item.toggle) {
                          setToggles((t) => ({ ...t, [item.label]: !t[item.label] }));
                        } else if (item.key === 'language') {
                          setIsLangSheetOpen(true);
                        }
                      }}
                      className="w-full flex items-center justify-between px-5 py-3.5 transition-colors text-left"
                      style={{ borderTop: ii > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${group.color}12` }}
                        >
                          <ItemIcon size={14} style={{ color: group.color, opacity: 0.8 }} strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-[13px] text-white/75"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                            {item.label}
                          </p>
                          <p className="font-body text-[10px] text-white/28">{item.sub}</p>
                        </div>
                      </div>
                      {item.toggle ? (
                        <ToggleSwitch on={toggles[item.label] ?? false} color={group.color} />
                      ) : (
                        <ChevronRight size={15} className="text-white/20" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Logout button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-5"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5"
          style={{ background: 'rgba(251,113,133,0.07)', border: '1px solid rgba(251,113,133,0.18)' }}
        >
          <LogOut size={15} style={{ color: '#FB7185' }} strokeWidth={2} />
          <span
            className="text-[14px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: '#FB7185' }}
          >
            {t.logout}
          </span>
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="font-body text-center text-[10px] text-white/20 mt-6 mb-4 leading-relaxed"
      >
        {t.footerNote}
      </motion.p>

      <LanguageSelectSheet
        isOpen={isLangSheetOpen}
        currentLang={lang}
        onSelect={setLang}
        onClose={() => setIsLangSheetOpen(false)}
        t={t}
      />
    </div>
  );
}