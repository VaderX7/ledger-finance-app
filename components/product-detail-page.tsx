'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/products';
import { ArrowLeft, ExternalLink, Shield, Gift, AlertCircle } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { TranslationKey } from '@/lib/i18n';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetailPage({ product, onBack }: ProductDetailPageProps) {
  const { t, lang } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);

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
        <div className="space-y-4">
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
        </div>
      );
    }

    if (product.category === 'creditcards') {
      return (
        <div className="space-y-4">
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
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      key="product-detail"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 340, damping: 34 }}
      className="fixed inset-0 bg-[#070A12] z-40 flex flex-col max-w-md mx-auto"
    >
      {/* Sticky header */}
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
          onClick={onBack}
          className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          <ArrowLeft size={18} className="text-white/80" strokeWidth={2} />
        </motion.button>

        <div className="flex-1 min-w-0">
          <p className="font-body text-[10px] tracking-widest uppercase text-white/25">
            {categoryLabels[product.category] ?? product.category}
          </p>
          <p
            className="text-[15px] leading-tight truncate mt-0.5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}
          >
            {product.name}
          </p>
        </div>

        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: product.colorAccent, boxShadow: `0 0 8px ${product.colorAccent}88` }}
        />
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-5 pb-10">
        {/* Lender + description */}
        <div>
          <p
            className="text-[11px] font-medium mb-1"
            style={{ color: product.colorAccent }}
          >
            {product.lender}
          </p>
          <p className="font-body text-[12px] text-white/50 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1.5">
          {product.highlights.map((h) => (
            <span
              key={h}
              className="px-2.5 py-1 rounded-lg font-body text-[10px] font-medium"
              style={{
                background: `${product.color}15`,
                border: `1px solid ${product.color}30`,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Key metrics */}
        <div
          className="p-4 rounded-xl space-y-2"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3
            className="text-[12px] text-white/80 mb-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            {t.keyDetails || "Key Details"}
          </h3>
          {Object.entries(product.metrics).map(([key, value]) => {
            const translatedVal = t[key as TranslationKey];
            const displayLabel = typeof translatedVal === 'string' ? translatedVal : key.replace(/([A-Z])/g, ' $1').trim();
            return (
              <div key={key} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                <p className="font-body text-[10px] text-white/35 capitalize">
                  {displayLabel}
                </p>
                <span
                  className="text-[11px]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: product.colorAccent }}
                >
                  {String(value)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Category-specific content */}
        {renderCategorySpecificContent()}

        {/* Documents */}
        <div>
          <p
            className="text-[12px] text-white/70 mb-2.5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            {t.requiredDocuments || "Required Documents"}
          </p>
          <div className="space-y-1">
            {product.documents.map((doc) => (
              <div
                key={doc}
                className="flex items-start gap-2 p-2 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <span className="text-[9px] font-bold flex-shrink-0 mt-0.5" style={{ color: product.colorAccent }}>✓</span>
                <span className="font-body text-[10px] text-white/45">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility */}
        {(product.minAge || product.minAnnualIncome || product.employmentTypes) && (
          <div>
            <p
              className="text-[12px] text-white/70 mb-2.5"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
            >
              {t.eligibility || "Eligibility"}
            </p>
            <div
              className="p-4 rounded-xl space-y-2"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {product.minAge && (
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-body text-white/35">{t.ageRange || "Age Range"}</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
                    {product.minAge}{product.maxAge ? `–${product.maxAge}` : '+'} {lang === 'hi' ? 'वर्ष' : lang === 'hinglish' ? 'saal' : 'yrs'}
                  </span>
                </div>
              )}
              {product.minAnnualIncome !== undefined && (
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-body text-white/35">{t.minAnnualIncome || "Min. Annual Income"}</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
                    {product.minAnnualIncome === 0 ? (t.noMinimum || "No minimum") : `₹${(product.minAnnualIncome / 100000).toFixed(1)}L`}
                  </span>
                </div>
              )}
              {product.employmentTypes && (
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-body text-white/35">{t.employment || "Employment"}</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
                    {product.employmentTypes.map(emp => emp.toLowerCase().includes('salaried') ? t.salaried : emp.toLowerCase().includes('self') ? t.selfEmployed : emp).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Anonymous note */}
        <div
          className="flex items-start gap-2.5 p-3.5 rounded-lg"
          style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.12)' }}
        >
          <AlertCircle size={13} style={{ color: '#38BDF8', marginTop: 2 }} className="flex-shrink-0" />
          <p className="font-body text-[10px] text-white/40 leading-relaxed">
            {t.anonymousComparisonNote || "This comparison is completely anonymous. No data is collected, stored, or shared with third parties."}
          </p>
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAccessPortal}
          className="w-full py-3.5 rounded-xl font-body text-[12px] font-semibold flex items-center justify-center gap-2.5 transition-all"
          style={{
            background: 'linear-gradient(135deg, #C9A96E 0%, #E4C98A 100%)',
            color: '#070A12',
          }}
        >
          {t.accessPortalAnonymously || "Access Official Portal Anonymously"}
          <ExternalLink size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}
