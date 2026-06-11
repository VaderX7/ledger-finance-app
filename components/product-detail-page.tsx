'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/products';
import { 
  ArrowLeft, ExternalLink, Shield, Gift, AlertCircle, 
  TrendingUp, Wallet, CreditCard, Building2, Star, Coins,
  CircleDot, ChevronDown, UserCheck, FileText, Sparkles
} from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { TranslationKey } from '@/lib/i18n';
import { isFavourited, toggleFavourite } from '@/lib/favourites';
import JargonText from './jargon-text';
import JargonBottomSheet from './jargon-bottom-sheet';
import FDTenureRates from './fd-tenure-rates';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

const BANK_LOGO_MAP: Record<string, string> = {
  'State Bank of India': 'sbi',
  'Bank of Baroda': 'bob_public',
  'Bank of Baroda Limited': 'bob_public',
  'Bank of Baroda Ltd': 'bob_public',
  'Bank of India': 'boi_public',
  'Bank of India Limited': 'boi_public',
  'Bank of India Ltd': 'boi_public',
  'Bank of Maharashtra': 'bom_public',
  'Bank of Maharashtra Limited': 'bom_public',
  'Bank of Maharashtra Ltd': 'bom_public',
  'Canara Bank': 'canara_public',
  'Canara Bank Limited': 'canara_public',
  'Canara Bank Ltd': 'canara_public',
  'Central Bank of India': 'central_public',
  'Central Bank of India Limited': 'central_public',
  'Central Bank of India Ltd': 'central_public',
  'Indian Bank': 'indianbank_public',
  'Indian Bank Limited': 'indianbank_public',
  'Indian Bank Ltd': 'indianbank_public',
  'Indian Overseas Bank': 'iob_public',
  'Indian Overseas Bank Limited': 'iob_public',
  'Indian Overseas Bank Ltd': 'iob_public',
  'Punjab & Sind Bank': 'punjabsindbank_public',
  'Punjab & Sind Bank Limited': 'punjabsindbank_public',
  'Punjab & Sind Bank Ltd': 'punjabsindbank_public',
  'Punjab National Bank': 'pnb_public',
  'Punjab National Bank Limited': 'pnb_public',
  'Punjab National Bank Ltd': 'pnb_public',
  'UCO Bank': 'uco_public',
  'UCO Bank Limited': 'uco_public',
  'UCO Bank Ltd': 'uco_public',
  'Union Bank of India': 'ubi_public',
  'Union Bank of India Limited': 'ubi_public',
  'Union Bank of India Ltd': 'ubi_public',
  'Axis Bank': 'axis',
  'Axis Bank Limited': 'axis',
  'Bandhan Bank': 'bandhan',
  'CSB Bank': 'csb',
  'CSB Bank (formerly Catholic Syrian Bank)': 'csb',
  'City Union Bank': 'cub',
  'DCB Bank': 'dcb',
  'Dhanlaxmi Bank': 'dhanlaxmi',
  'Federal Bank': 'federal',
  'HDFC Bank': 'hdfc',
  'Housing Development Finance Corporation': 'hdfc',
  'ICICI Bank': 'icici',
  'ICICI Bank Limited': 'icici',
  'IDBI Bank': 'idbi',
  'IDFC FIRST Bank': 'idfc',
  'IDFC First Bank': 'idfc',
  'IDFC Bank': 'idfc',
  'IndusInd Bank': 'indusind',
  'Jammu & Kashmir Bank': 'j&k',
  'Karnataka Bank': 'karnataka',
  'Karur Vysya Bank': 'kvb',
  'Kotak Mahindra Bank': 'kmb',
  'Nainital Bank': 'nainital',
  'RBL Bank': 'rbl',
  'Tamilnad Mercantile Bank': 'tmb',
  'YES BANK': 'yesbank',
  'YES Bank': 'yesbank',
  'YES BANK ': 'yesbank',
  'South Indian Bank': 'sib',
  'AU Small Finance Bank': 'au_sfb',
  'Capital Small Finance Bank': 'capital_sfb',
  'Equitas Small Finance Bank': 'equitas_sfb',
  'ESAF Small Finance Bank': 'esaf_sfb',
  'Jana Small Finance Bank': 'jana_sfb',
  'North East Small Finance Bank': 'northeast_sfb',
  'Northeast Small Finance Bank': 'northeast_sfb',
  'Shivalik Small Finance Bank': 'shivalik_sfb',
  'Suryoday Small Finance Bank': 'suryoday_sfb',
  'Ujjivan Small Finance Bank': 'ujjivan_sfb',
  'Unity Small Finance Bank': 'unity_sfb',
  'Utkarsh Small Finance Bank': 'utkarsh_sfb',
  'Airtel Payments Bank': 'airtel_pb',
  'Fino Payments Bank': 'fino_pb',
  'Jio Payments Bank': 'jio_pb',
  'NSDL Payments Bank': 'nsdl_pb',
  'Paytm Payments Bank': 'paytm_pb'
};

const LOGO_BG_MAP: Record<string, string> = {
  'Bank of India': '#017dc5',
  'Bank of India Limited': '#017dc5',
  'Canara Bank': '#0069df',
  'Canara Bank Limited': '#0069df',
  'IDFC FIRST Bank': '#9e1d28',
  'IDFC First Bank': '#9e1d28',
  'YES BANK': '#004489',
  'YES Bank': '#004489',
  'AU Small Finance Bank': '#ee7025',
  'IDBI Bank': '#299a85',
  'Karur Vysya Bank': '#d1d01d',
  'South Indian Bank': '#c4171c',
  'Capital Small Finance Bank': '#d10e14',
  'Unity Small Finance Bank': '#fdc937',
};

const getBankInitials = (lender: string): string => {
  const nameUpper = lender.toUpperCase();
  if (nameUpper.includes('STATE BANK OF INDIA')) return 'SBI';
  if (nameUpper.includes('BANK OF BARODA')) return 'BOB';
  if (nameUpper.includes('BANK OF INDIA')) return 'BOI';
  if (nameUpper.includes('BANK OF MAHARASHTRA')) return 'BOM';
  if (nameUpper.includes('CENTRAL BANK OF INDIA')) return 'CBI';
  if (nameUpper.includes('PUNJAB & SIND')) return 'PSB';
  if (nameUpper.includes('PUNJAB NATIONAL')) return 'PNB';
  if (nameUpper.includes('UNION BANK OF INDIA')) return 'UBI';
  if (nameUpper.includes('INDIAN OVERSEAS')) return 'IOB';
  if (nameUpper.includes('JAMMU & KASHMIR')) return 'JKB';
  if (nameUpper.includes('KARUR VYSYA')) return 'KVB';
  if (nameUpper.includes('SOUTH INDIAN')) return 'SIB';
  if (nameUpper.includes('TAMILNAD MERCANTILE')) return 'TMB';
  if (nameUpper.includes('CITY UNION')) return 'CUB';
  if (nameUpper.includes('DHANLAXMI')) return 'DLB';
  if (nameUpper.includes('IDFC FIRST')) return 'IDFC';
  
  const cleanName = lender.replace(/bank/gi, '').trim();
  const words = cleanName.split(/[\s-]+/).filter(Boolean);
  if (words.length >= 2) {
    return words.slice(0, 3).map(w => w[0].toUpperCase()).join('');
  }
  return cleanName.substring(0, 4).toUpperCase();
};

const METRIC_LABEL_MAP: Record<string, string> = {
  interestRate: "Interest Rate",
  baseYield: "Annual Yield",
  minRate: "Interest Rate",
  minBalance: "Min. Balance",
  cardType: "Card Type",
  atmWithdrawals: "ATM Withdrawals",
  benefits: "Key Benefits",
  dicgcProtected: "DICGC Protection"
};

const getMetricIcon = (key: string, color: string) => {
  const style = { color };
  if (key === 'interestRate' || key === 'baseYield' || key === 'minRate') {
    return <TrendingUp size={15} style={style} className="flex-shrink-0" />;
  }
  if (key === 'minBalance' || key === 'monthlyAvgBalance') {
    return <Wallet size={15} style={style} className="flex-shrink-0" />;
  }
  if (key === 'cardType' || key === 'joiningFee' || key === 'annualFee') {
    return <CreditCard size={15} style={style} className="flex-shrink-0" />;
  }
  if (key === 'atmWithdrawals') {
    return <Building2 size={15} style={style} className="flex-shrink-0" />;
  }
  if (key === 'benefits' || key === 'milestoneRewards' || key === 'fuelSurcharge') {
    return <Star size={15} style={style} className="flex-shrink-0" />;
  }
  if (key === 'dicgcProtected') {
    return <Shield size={15} style={style} className="flex-shrink-0" />;
  }
  return <CircleDot size={15} style={style} className="flex-shrink-0" />;
};

export default function ProductDetailPage({ product, onBack }: ProductDetailPageProps) {
  const { t, lang } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [docsExpanded, setDocsExpanded] = useState(false);
  const [eligibilityExpanded, setEligibilityExpanded] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [jargonOpen, setJargonOpen] = useState(false);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});
  const [isFav, setIsFav] = useState(() => isFavourited(product.id));

  const handleTermClick = (term: string) => { setSelectedTerm(term); setJargonOpen(true); };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [product.id]);

  const handleAccessPortal = () => {
    const win = window.open(product.portalUrl, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
  };

  const categoryLabels: Record<string, string> = {
    savings: t.savingsLabel,
    current: t.currentLabel,
    fds: t.fdsLabel,
    creditcards: t.creditcardsLabel,
    loans: t.loansLabel,
    govtschemes: t.govtschemesLabel,
    insurance: t.insuranceLabel,
  };

  const renderCategorySpecificContent = () => {
    if (product.category === 'fds') {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="space-y-4"
        >
          <h3
            className="text-[13px] text-white/80 flex items-center gap-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            <Shield size={14} style={{ color: '#2DD4BF' }} />
            {t.dicgcSafetyBreakdown || "DICGC Safety Breakdown"}
          </h3>
          <div
            className="p-4 rounded-xl space-y-3"
            style={{ background: 'rgba(45, 212, 191, 0.08)', border: '1px solid rgba(45, 212, 191, 0.15)' }}
          >
            {[
              { label: t.insuredAmount || 'Insured Amount', detail: t.insuredAmountDetail || '₹5 Lakhs per depositor per bank' },
              { label: t.coverageIncludes || 'Coverage Includes', detail: t.coverageIncludesDetail || 'Principal + accrued interest up to maturity' },
              { label: t.protectedBy || 'Protected By', detail: t.protectedByDetail || 'Deposit Insurance & Credit Guarantee Corporation' },
            ].map(({ label, detail }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(45, 212, 191, 0.2)' }}>
                  <span className="text-[10px] font-bold text-[#2DD4BF]">✓</span>
                </div>
                <div>
                  <p className="font-body text-[11px] font-medium text-white/70">{label}</p>
                  <p className="font-body text-[10px] text-white/35 mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    if (product.category === 'creditcards') {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="space-y-4"
        >
          <h3
            className="text-[13px] text-white/80 flex items-center gap-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            <Gift size={14} style={{ color: '#FFA726' }} />
            {t.feeVsRewards || "Fee vs Rewards Milestone Matrix"}
          </h3>
          <div className="space-y-2">
            <div
              className="p-3 rounded-lg"
              style={{ background: 'rgba(251, 113, 133, 0.08)', border: '1px solid rgba(251, 113, 133, 0.12)' }}
            >
              <p className="font-body text-[10px] font-medium text-white/50 mb-1.5">{t.annualFees || "Annual Fees"}</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-body text-[10px] text-white/35">{t.joiningFee || "Joining Fee"}:</span>
                  <span className="text-[11px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FB7185' }}>
                    {String(product.metrics.joiningFee) || 'Nil'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-[10px] text-white/35">{t.annualFee || "Annual Fee"}:</span>
                  <span className="text-[11px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#FB7185' }}>
                    {String(product.metrics.annualFee) || 'Nil'}
                  </span>
                </div>
              </div>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ background: 'rgba(255, 167, 38, 0.08)', border: '1px solid rgba(255, 167, 38, 0.12)' }}
            >
              <p className="font-body text-[10px] font-medium text-white/50 mb-1.5">{t.milestoneRewards || "Milestone Rewards"}</p>
              <p className="font-body text-[10px] text-white/35">{String(product.metrics.milestoneRewards)}</p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.12)' }}
            >
              <p className="font-body text-[10px] font-medium text-white/50 mb-1.5">{t.fuelSurcharge || "Fuel Surcharge"}</p>
              <p className="text-[11px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#00E5FF' }}>
                {String(product.metrics.fuelSurcharge)}
              </p>
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  // Logo mapping
  const bankLogoId = BANK_LOGO_MAP[product.lender] || product.lender.toLowerCase().replace(/bank/gi, '').replace(/[^a-z0-9]/g, '').trim();
  const logoUrl = `/logos/${bankLogoId}.png`;

  // Hero interest rate helper
  const heroRateKey = product.category === 'savings' ? 'interestRate' :
                      product.category === 'fds' ? 'baseYield' :
                      product.category === 'loans' ? 'minRate' : '';
  const heroRateValue = heroRateKey ? String(product.metrics[heroRateKey] || '') : '';
  const displayHeroRate = heroRateValue.match(/[\d.]+%/)?.[0] ?? heroRateValue;

  // Split highlights cleanly
  const highlightsList = Array.isArray(product.highlights) 
    ? product.highlights 
    : String(product.highlights || '').split('|').map(h => h.trim()).filter(Boolean);
  const firstThreeHighlights = highlightsList.slice(0, 3);

  // Split documents cleanly
  const documentsList = Array.isArray(product.documents)
    ? product.documents
    : String(product.documents || '').split('|').map(d => d.trim()).filter(Boolean);

  return (
    <>
    <motion.div
      key="product-detail"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{
        x: { type: 'spring', stiffness: 340, damping: 34 },
        opacity: { type: 'spring', stiffness: 340, damping: 34 },
        scale: { type: 'spring', stiffness: 300, damping: 30 },
      }}
      className="fixed inset-0 z-[60] flex flex-col max-w-md mx-auto"
      style={{
        background: `linear-gradient(180deg, ${(product.color || '#C9A96E')}18 0%, transparent 100%), #070A12`,
      }}
    >
      {/* Sticky header */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-4 py-3"
        style={{
          background: `linear-gradient(180deg, ${(product.color || '#C9A96E')}18 0%, rgba(7, 10, 18, 0.90) 100%)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onBack}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-white/05 border border-white/08"
        >
          <ArrowLeft size={18} className="text-white/80" strokeWidth={2} />
        </motion.button>

        <div className="flex-1 min-w-0">
          <p 
            className="font-body text-[10px] tracking-widest uppercase font-bold"
            style={{ color: product.color || '#C9A96E' }}
          >
            {categoryLabels[product.category] ?? product.category}
          </p>
          <h1
            className="text-[22px] leading-tight font-bold text-white/95 tracking-tight truncate mt-0.5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {product.name}
          </h1>
        </div>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={async () => {
            const added = await toggleFavourite({
              id: product.id,
              type: product.category as any,
              lender: product.lender,
              name: product.name,
              color: product.color,
              colorAccent: product.colorAccent,
              savedAt: Date.now(),
            });
            setIsFav(added);
          }}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: isFav ? `${product.color}20` : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isFav ? `${product.color}40` : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          <Star
            size={16}
            style={{ color: isFav ? '#C9A96E' : 'rgba(255,255,255,0.4)' }}
            fill={isFav ? '#C9A96E' : 'none'}
            strokeWidth={2}
          />
        </motion.button>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-5 pb-28">
        
        {/* HERO SECTION: Logo, Lender name, Hero Interest Rate, description */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="space-y-4"
        >
          {/* Bank Row */}
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center p-[6px] overflow-hidden"
              style={{
                background: LOGO_BG_MAP[product.lender] ?? '#FFFFFF',
                border: `1px solid ${product.color || '#C9A96E'}40`,
                boxShadow: `0 0 10px ${product.color || '#C9A96E'}35, 0 2px 8px rgba(0,0,0,0.15)`,
              }}
            >
              {!(logoErrors[bankLogoId] || false) ? (
                <img
                  src={logoUrl}
                  alt={product.lender}
                  className="object-contain w-full h-full"
                  onError={() => {
                    setLogoErrors((prev) => ({ ...prev, [bankLogoId]: true }));
                  }}
                />
              ) : (
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center text-[8px] font-extrabold tracking-wider"
                  style={{ 
                    color: product.colorAccent || '#00F5A0', 
                    background: `${product.color || '#C9A96E'}15`
                  }}
                >
                  {getBankInitials(product.lender).substring(0, 2)}
                </div>
              )}
            </div>
            <span
              className="text-[12px] font-bold uppercase tracking-wide"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: product.color || '#C9A96E' }}
            >
              {product.lender}
            </span>
          </div>

          {/* Hero Interest Rate */}
          {displayHeroRate && (
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-white/30 font-body">
                {product.category === 'fds' ? 'Annual Yield' : 'Interest Rate'}
              </span>
              <span
                className="text-[32px] font-extrabold tracking-tight mt-0.5 leading-none"
                style={{
                  background: 'linear-gradient(135deg, #E4C98A 0%, #C9A96E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {displayHeroRate}
              </span>
            </div>
          )}

          {/* Description */}
          <JargonText text={String(product.description ?? '')} onTermClick={handleTermClick} className="font-body text-[13px] text-white/40 leading-relaxed" />
        </motion.div>

        {/* SECTION 2: Highlights scrollable row */}
        {firstThreeHighlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
          >
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {firstThreeHighlights.map((highlight) => (
                <span
                  key={highlight}
                  className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] flex-shrink-0 whitespace-nowrap inline-flex items-center"
                >
                  <JargonText text={String(highlight ?? '')} onTermClick={handleTermClick} className="text-[11px] text-white/60" />
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* SECTION 3: Key Details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="space-y-3"
        >
          <h3
            className="text-[12px] text-white/80 border-b border-white/[0.04] pb-2 font-bold"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {t.keyDetails || "Key Details"}
          </h3>
          
          {product.category === 'fds' ? (
            /* Compact 2-column grid for FD products */
            <div
              className="grid grid-cols-2 gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {Object.entries(product.metrics)
                .filter(([key]) => key !== heroRateKey && isNaN(Number(key)))
                .map(([key, value]) => {
                  const label = METRIC_LABEL_MAP[key] || key.replace(/([A-Z])/g, ' $1').trim();
                  return (
                    <div key={key} className="flex flex-col gap-0.5 px-2 py-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-white/30 font-semibold font-body">
                        {label}
                      </span>
                      <JargonText text={String(value ?? '')} onTermClick={handleTermClick} className="text-[12px] text-white/85 font-bold leading-tight" />
                    </div>
                  );
                })}
            </div>
          ) : (
            /* Card layout for non-FD products */
            <div className="space-y-2.5">
              {Object.entries(product.metrics)
                .filter(([key]) => key !== heroRateKey && key !== 'dicgcProtected' && isNaN(Number(key)))
                .map(([key, value]) => {
                  const label = METRIC_LABEL_MAP[key] || key.replace(/([A-Z])/g, ' $1').trim();
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07]"
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${product.color || '#C9A96E'}24` }}
                      >
                        {getMetricIcon(key, product.colorAccent || '#00F5A0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-[10px] uppercase tracking-wider text-white/30 font-semibold font-body">
                          {label}
                        </span>
                        <JargonText text={String(value ?? '')} onTermClick={handleTermClick} className="block text-[13px] text-white/85 font-medium mt-0.5 leading-relaxed font-display" />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* DICGC Special trust banner */}
          {product.category === 'savings' && product.metrics.dicgcProtected && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#00F5A0]/[0.06] border border-[#00F5A0]/0.15 mt-3">
              <Shield size={16} className="text-[#00F5A0] flex-shrink-0" />
              <span className="text-[11px] text-[#00F5A0] font-semibold leading-normal">
                Protected up to ₹5 Lakhs per depositor · DICGC Insured
              </span>
            </div>
          )}
        </motion.div>

        {/* SECTION 3.5: FD Tenure-wise Interest Rates */}
        {product.category === 'fds' && (
          <FDTenureRates productId={product.id} accentColor={product.colorAccent || product.color || '#C9A96E'} />
        )}

        {/* SECTION 4: Required Documents Accordion */}
        {documentsList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.4 }}
            className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.01]"
          >
            <button
              onClick={() => setDocsExpanded(!docsExpanded)}
              className="w-full flex items-center justify-between p-4 text-[12px] text-white/80 font-bold transition-all hover:bg-white/[0.02]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="flex items-center gap-2">
                <FileText size={14} style={{ color: product.colorAccent }} />
                {t.requiredDocuments || "Required Documents"}
              </span>
              <motion.div
                animate={{ rotate: docsExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-white/40" />
              </motion.div>
            </button>
            
            <motion.div
              initial={false}
              animate={{ height: docsExpanded ? 'auto' : 0, opacity: docsExpanded ? 1 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1 divide-y divide-white/[0.06]">
                {documentsList.map((doc, idx) => (
                  <div
                    key={doc + idx}
                    className="flex items-center gap-3 py-2.5"
                  >
                    <FileText size={14} style={{ color: product.colorAccent || '#C9A96E' }} className="flex-shrink-0" />
                    <JargonText text={String(doc ?? '')} onTermClick={handleTermClick} className="font-body text-[11px] text-white/70" />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* SECTION 5: Eligibility Section */}
        {(product.minAge || product.minAnnualIncome !== undefined || product.employmentTypes) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.01]"
          >
            <button
              onClick={() => setEligibilityExpanded(!eligibilityExpanded)}
              className="w-full flex items-center justify-between p-4 text-[12px] text-white/80 font-bold transition-all hover:bg-white/[0.02]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="flex items-center gap-2">
                <UserCheck size={14} style={{ color: product.colorAccent }} />
                {t.eligibility || "Eligibility"}
              </span>
              <motion.div
                animate={{ rotate: eligibilityExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-white/40" />
              </motion.div>
            </button>
            
            <motion.div
              initial={false}
              animate={{ height: eligibilityExpanded ? 'auto' : 0, opacity: eligibilityExpanded ? 1 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1 space-y-2">
                {product.minAge && (
                  <div className="flex items-center justify-between text-[10px] p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <span className="font-body text-white/35">{t.ageRange || "Age Range"}</span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
                      {product.minAge}{product.maxAge ? `–${product.maxAge}` : '+'} {lang === 'hi' ? 'वर्ष' : lang === 'hinglish' ? 'saal' : 'yrs'}
                    </span>
                  </div>
                )}
                {product.minAnnualIncome !== undefined && (
                  <div className="flex items-center justify-between text-[10px] p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <span className="font-body text-white/35">{t.minAnnualIncome || "Min. Annual Income"}</span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
                      {product.minAnnualIncome === 0 ? "No minimum income required" : `₹${(product.minAnnualIncome / 100000).toFixed(1)}L`}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[10px] p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <span className="font-body text-white/35">{t.employment || "Employment"}</span>
                  {(() => {
                    const rawEmp = product.employmentTypes;
                    const employmentArray = Array.isArray(rawEmp)
                      ? rawEmp
                      : typeof rawEmp === 'string'
                      ? (rawEmp as string).split('|').map(x => x.trim()).filter(Boolean)
                      : [];

                    const isEmpEmpty = employmentArray.length === 0 || 
                      employmentArray.includes('0') || 
                      employmentArray.includes('none') || 
                      employmentArray.includes('null') ||
                      employmentArray.includes('');

                    if (isEmpEmpty) {
                      return (
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
                          Open to all
                        </span>
                      );
                    }

                    return (
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {employmentArray.map((emp) => (
                          <span
                            key={emp}
                            className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-semibold text-white/70"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            {emp.toLowerCase().includes('salaried') 
                              ? 'Salaried' 
                              : emp.toLowerCase().includes('self') 
                              ? 'Self Employed' 
                              : emp}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* category specific render */}
        {renderCategorySpecificContent()}

        {/* Anonymous note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex items-start gap-2.5 p-3.5 rounded-lg"
          style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.12)' }}
        >
          <AlertCircle size={13} style={{ color: '#38BDF8', marginTop: 2 }} className="flex-shrink-0" />
          <p className="font-body text-[10px] text-white/40 leading-relaxed">
            {t.anonymousComparisonNote || "This comparison is completely anonymous. No data is collected, stored, or shared with third parties."}
          </p>
        </motion.div>
      </div>

      {/* Floating Bottom Bar containing the CTA */}
      <div
        className="flex-shrink-0 p-4 border-t"
        style={{
          background: 'rgba(7, 10, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: 'rgba(255, 255, 255, 0.06)',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAccessPortal}
          className="w-full py-3.5 rounded-xl font-body text-[12px] font-semibold flex items-center justify-center gap-2.5 transition-all shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${(product.color || '#C9A96E')} 0%, ${(product.colorAccent || '#00F5A0')} 100%)`,
            color: '#ffffff',
            boxShadow: `0 8px 28px ${(product.color || '#C9A96E')}40`,
          }}
        >
          {t.accessPortalAnonymously || "Access Official Portal Anonymously"}
          <ExternalLink size={14} />
        </motion.button>
      </div>
    </motion.div>

    <JargonBottomSheet
      term={selectedTerm}
      isOpen={jargonOpen}
      onClose={() => { setJargonOpen(false); setTimeout(() => setSelectedTerm(null), 300); }}
    />
    </>
  );
}
