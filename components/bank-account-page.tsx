'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Shield, Zap, ExternalLink } from 'lucide-react';
import { FinancialInstitution } from '@/lib/institutions';
import JargonBottomSheet from './jargon-bottom-sheet';
import JargonText from './jargon-text';
import { useState, useEffect } from 'react';
import { getProductsByCategory } from '@/lib/data-fetcher';
import { getOverriddenColor } from './product-category-view';

interface BankAccountPageProps {
  institution: FinancialInstitution;
  onBack: () => void;
}

interface AccountVariant {
  id: string;
  name: string;
  bankId: string;
  type: string;
  minimumBalance: string;
  interestRate: string;
  features: string[];
  jargonTerms: string[];
  specialization: string;
  documentation: string[];
  eligibility: string[];
  ageEligibility: { min: number; max?: number; description?: string };
  color: string;
  colorAccent: string;
}

function AccountDetailPage({ account, institution, onBack, onTermClick }: { account: AccountVariant; institution: FinancialInstitution; onBack: () => void; onTermClick: (term: string) => void }) {
  return (
    <motion.div
      key="account-detail"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 340, damping: 34 }}
      className="fixed inset-0 bg-[#070A12] z-50 flex flex-col max-w-md mx-auto"
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
          onClick={onBack}
          className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
        >
          <ArrowLeft size={18} className="text-white/80" strokeWidth={2} />
        </motion.button>
        <div className="flex-1 min-w-0">
          <p className="font-body text-[10px] tracking-widest uppercase text-white/25">{institution.name}</p>
          <p
            className="text-[15px] leading-tight truncate mt-0.5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}
          >
            {account.name}
          </p>
        </div>
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: account.colorAccent, boxShadow: `0 0 8px ${account.colorAccent}88` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 pb-10">
        {/* Key metrics */}
        <div
          className="p-4 rounded-xl space-y-2"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3
            className="text-[12px] text-white/80 mb-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            Account Details
          </h3>
          <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
            <span className="font-body text-[10px] text-white/35">Minimum Balance</span>
            <JargonText
              text={account.minimumBalance}
              onTermClick={onTermClick}
              className="text-[11px] text-right"
            />
          </div>
          {account.interestRate && (
            <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
              <span className="font-body text-[10px] text-white/35">Interest Rate</span>
              <JargonText
                text={account.interestRate}
                onTermClick={onTermClick}
                className="text-[11px] text-right"
              />
            </div>
          )}
          <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
            <span className="font-body text-[10px] text-white/35">Age Eligibility</span>
            <span className="text-[11px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
              {account.ageEligibility.description ||
                `${account.ageEligibility.min}${account.ageEligibility.max ? `–${account.ageEligibility.max}` : '+'} yrs`}
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="font-body text-[10px] text-white/35">Account Type</span>
            <span className="text-[11px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
              {account.type}
            </span>
          </div>
        </div>

        {/* Features */}
        {account.features.length > 0 && (
          <div>
            <p
              className="text-[12px] text-white/70 mb-2.5"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
            >
              Key Features
            </p>
            <div className="space-y-1.5">
              {account.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-2 p-2.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.025)' }}
                >
                  <Star size={10} style={{ color: account.colorAccent, marginTop: 2 }} className="flex-shrink-0" />
                  <JargonText
                    text={feature}
                    onTermClick={onTermClick}
                    className="font-body text-[10px] text-white/55"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentation */}
        {account.documentation.length > 0 && (
          <div>
            <p
              className="text-[12px] text-white/70 mb-2.5"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
            >
              Required Documents
            </p>
            <div className="space-y-1">
              {account.documentation.map((doc) => (
                <div
                  key={doc}
                  className="flex items-start gap-2 p-2 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <span className="text-[9px] font-bold flex-shrink-0 mt-0.5" style={{ color: account.colorAccent }}>✓</span>
                  <JargonText
                    text={doc}
                    onTermClick={onTermClick}
                    className="font-body text-[10px] text-white/45"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            const win = window.open(institution.logoUrl ?? '#', '_blank', 'noopener,noreferrer');
            if (win) win.opener = null;
          }}
          className="w-full py-3.5 rounded-xl font-body text-[12px] font-semibold flex items-center justify-center gap-2.5 transition-all"
          style={{
            background: 'linear-gradient(135deg, #C9A96E 0%, #E4C98A 100%)',
            color: '#070A12',
          }}
        >
          Visit Official Portal
          <ExternalLink size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function BankAccountPage({ institution, onBack }: BankAccountPageProps) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [bgScale, setBgScale] = useState(1);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [accountVariants, setAccountVariants] = useState<AccountVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<AccountVariant | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProductsByCategory('savings').then(products => {
      const filtered = products.filter(p => p.lender === institution.name);
      const mapped = filtered.map(p => {
        const color = getOverriddenColor(p.lender, 'color', p.color);
        const colorAccent = getOverriddenColor(p.lender, 'colorAccent', p.colorAccent);
        return {
          id: p.id,
          name: p.name,
          bankId: institution.id,
          type: 'regular',
          minimumBalance: String(p.metrics?.minBalance ?? 'Contact bank'),
          interestRate: String(p.metrics?.interestRate ?? ''),
          features: p.highlights ?? [],
          jargonTerms: [],
          specialization: '',
          documentation: p.documents ?? [],
          eligibility: [],
          ageEligibility: { min: p.minAge ?? 18 },
          color,
          colorAccent,
        };
      });
      setAccountVariants(mapped);
      setLoading(false);
    });
  }, [institution.name, institution.id]);

  const handleTermClick = (term: string) => {
    setSelectedTerm(term);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setTimeout(() => setSelectedTerm(null), 300);
  };

  const typeLabels: Record<string, string> = {
    public: 'Public Sector Bank',
    private: 'Private Sector Bank',
    sfb: 'Small Finance Bank',
    payments: 'Payments Bank',
    rrb: 'Regional Rural Bank',
    foreign: 'Foreign Bank',
  };

  return (
    <>
      <motion.div
        key="bank-page"
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
            <p
              className="text-[15px] leading-tight truncate"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}
            >
              {institution.name}
            </p>
            <p className="font-body text-[10px] mt-0.5" style={{ color: institution.colorAccent + 'bb' }}>
              {typeLabels[institution.type]}
            </p>
          </div>

          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: institution.colorAccent, boxShadow: `0 0 8px ${institution.colorAccent}88` }}
          />
        </div>

        {/* Scrollable account list */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 pb-32">
          {loading ? (
            <>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ background: `${institution?.color || '#C9A96E'}12`, border: `1px solid ${institution?.color || '#C9A96E'}22` }}
                >
                  <div className="px-4 py-3 flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 rounded bg-white/10 w-2/3" />
                      <div className="h-2 rounded bg-white/06 w-1/3" />
                    </div>
                    <div className="h-2.5 w-10 rounded bg-white/10" />
                  </div>
                  <div className="px-4 py-3 space-y-2.5">
                    <div className="flex justify-between">
                      <div className="h-2 w-24 rounded bg-white/07" />
                      <div className="h-2 w-16 rounded bg-white/10" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-2 w-20 rounded bg-white/07" />
                      <div className="h-2 w-14 rounded bg-white/10" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-2 w-22 rounded bg-white/07" />
                      <div className="h-2 w-12 rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {accountVariants.map((account, idx) => {
                const displayRate = account.interestRate.match(/[\d.]+%/)?.[0] ?? account.interestRate;
                return (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, type: 'spring', stiffness: 260, damping: 26 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAccount(account)}
                    className="rounded-2xl overflow-hidden cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    {/* Card header stripe */}
                    <div
                      className="px-4 py-3 flex items-center gap-2.5"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: `${account.colorAccent}08` }}
                    >
                      <Star size={13} style={{ color: account.colorAccent }} className="flex-shrink-0" strokeWidth={2} />
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-[13px] leading-snug truncate"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.88)' }}
                        >
                          {account.name}
                        </h3>
                        {account.specialization && (
                          <p className="font-body text-[9px] mt-0.5" style={{ color: account.colorAccent + '99' }}>
                            {account.specialization}
                          </p>
                        )}
                      </div>
                      {account.interestRate && (
                        <span
                          className="flex-shrink-0 text-[10px] font-body font-semibold"
                          style={{ color: account.colorAccent }}
                        >
                          {displayRate}
                        </span>
                      )}
                    </div>

                    {/* Key metrics */}
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex items-start justify-between text-[10px]">
                        <span className="text-white/35 font-body">Minimum Balance</span>
                        <span
                          className="text-right ml-4 text-white/70"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
                        >
                          {account.minimumBalance}
                        </span>
                      </div>

                      {account.interestRate && (
                        <div className="flex items-start justify-between text-[10px]">
                          <span className="text-white/35 font-body">Interest Rate</span>
                          <span
                            className="text-right ml-4"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: account.colorAccent }}
                          >
                            {displayRate}
                          </span>
                        </div>
                      )}

                    <div className="flex items-start justify-between text-[10px]">
                      <span className="text-white/35 font-body">Age Eligibility</span>
                      <span
                        className="text-right ml-4 text-white/60"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}
                      >
                        {account.ageEligibility.description ||
                          `${account.ageEligibility.min}${account.ageEligibility.max ? `–${account.ageEligibility.max}` : '+'} yrs`}
                      </span>
                    </div>
                  </div>

                  {/* Tap hint */}
                  <div
                    className="px-4 py-2 flex items-center justify-end"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <span className="font-body text-[9px]" style={{ color: account.colorAccent + '80' }}>
                      Tap to view details →
                    </span>
                  </div>
                </motion.div>
              );
            })}

              {/* RRB note */}
              {institution.type === 'rrb' && (
                <div
                  className="p-3 rounded-xl flex items-start gap-2"
                  style={{ background: 'rgba(56, 189, 248, 0.07)', border: '1px solid rgba(56, 189, 248, 0.14)' }}
                >
                  <Shield size={12} style={{ color: '#38BDF8', marginTop: 2 }} className="flex-shrink-0" />
                  <p className="font-body text-[9px] text-white/35 leading-relaxed">
                    +37 other regional banking entities operate across India with similar offerings adapted to local communities.
                  </p>
                </div>
              )}

              {accountVariants.length === 0 && (
                <div className="text-center py-16 text-white/20 font-body text-sm">
                  Detailed account profiles coming soon
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Full-screen account detail page */}
      <AnimatePresence>
        {selectedAccount && (
          <AccountDetailPage
            account={selectedAccount}
            institution={institution}
            onBack={() => setSelectedAccount(null)}
            onTermClick={handleTermClick}
          />
        )}
      </AnimatePresence>

      <JargonBottomSheet
        term={selectedTerm}
        isOpen={isSheetOpen}
        onClose={handleSheetClose}
        onBackgroundChange={(scale, opacity) => { setBgScale(scale); setBgOpacity(opacity); }}
      />
    </>
  );
}
