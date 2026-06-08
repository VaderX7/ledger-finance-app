'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FinancialInstitution, SavingsAccountVariant } from '@/lib/institutions';
import { X, Zap, Star, Shield } from 'lucide-react';
import JargonText from './jargon-text';

interface AccountProfilerModalProps {
  institution: FinancialInstitution | null;
  accountVariants: SavingsAccountVariant[];
  isOpen: boolean;
  onClose: () => void;
  onJargonClick: (term: string) => void;
}

export default function AccountProfilerModal({
  institution,
  accountVariants,
  isOpen,
  onClose,
  onJargonClick,
}: AccountProfilerModalProps) {
  if (!institution) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
            transition={{ duration: 0.2 }}
          />

          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.4,
            }}
            className="fixed bottom-0 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-md bg-[#0D1220] z-50 rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 -4px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-8 h-1 rounded-full bg-white/10" />
            </div>

            {/* Header */}
            <div className="px-5 py-4 bg-[#0D1220] border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
              <div className="flex-1">
                <p className="font-body text-[10px] tracking-widest uppercase text-white/25 mb-1">
                  Account Profiles
                </p>
                <h2
                  className="text-[20px] text-white/95 leading-snug"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
                >
                  {institution.name}
                </h2>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255, 255, 255, 0.08)' }}
              >
                <X size={16} className="text-white/50" />
              </motion.button>
            </div>

            {/* Account Variants */}
            <div className="px-5 py-5 space-y-3 overflow-y-auto flex-1">
              {accountVariants.map((account, idx) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Account Name */}
                  <div className="flex items-start gap-2 mb-2">
                    <Star size={13} style={{ color: institution.colorAccent, marginTop: 2 }} className="flex-shrink-0" />
                    <div className="flex-1">
                      <h3
                        className="text-[12px] font-700 text-white/80"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
                      >
                        {account.name}
                      </h3>
                      {account.specialization && (
                        <p className="text-[9px] text-white/25 mt-0.5">• {account.specialization}</p>
                      )}
                    </div>
                  </div>

                  {/* Key Details */}
                  <div className="space-y-1.5 mb-3 pl-5">
                    <div className="flex items-start justify-between text-[10px]">
                      <span className="text-white/35">Minimum Balance:</span>
                      <span
                        className="font-600 text-white/60"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
                      >
                        {account.minimumBalance}
                      </span>
                    </div>
                    {account.interestRate && (
                      <div className="flex items-start justify-between text-[10px]">
                        <span className="text-white/35">Interest Rate:</span>
                        <span
                          className="font-600"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: institution.colorAccent }}
                        >
                          {account.interestRate}
                        </span>
                      </div>
                    )}
                    <div className="flex items-start justify-between text-[10px]">
                      <span className="text-white/35">Age Eligibility:</span>
                      <span className="text-white/60">
                        {account.ageEligibility.min}
                        {account.ageEligibility.max ? `–${account.ageEligibility.max}` : '+'} years
                      </span>
                    </div>
                  </div>

                  {/* Features (collapsible) */}
                  <details className="group">
                    <summary className="cursor-pointer font-body text-[10px] font-medium text-white/40 hover:text-white/60 transition-colors">
                      ▶ {account.features.length} Key Features
                    </summary>
                    <div className="mt-2 pl-5 space-y-1 text-[9px] text-white/30">
                      {account.features.map((feature) => (
                        <div key={feature} className="flex gap-2">
                          <span className="text-white/25 flex-shrink-0">•</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </details>

                  {/* Jargon Terms */}
                  {account.jargonTerms.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {account.jargonTerms.map((term) => (
                        <motion.button
                          key={term}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onJargonClick(term)}
                          className="px-1.5 py-0.5 rounded text-[8px] font-body font-medium cursor-pointer transition-all"
                          style={{
                            background: `${institution.colorAccent}15`,
                            border: `1px dashed ${institution.colorAccent}44`,
                            color: institution.colorAccent,
                          }}
                        >
                          {term}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Regional Rural Banks Note */}
            {institution.type === 'rrb' && (
              <div className="mx-5 mb-5 p-3 rounded-lg flex items-start gap-2" style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                <Shield size={12} style={{ color: '#38BDF8', marginTop: 2 }} className="flex-shrink-0" />
                <p className="font-body text-[9px] text-white/40 leading-relaxed">
                  +37 other regional banking entities operate across India with similar offerings adapted to local communities.
                </p>
              </div>
            )}

            {/* Bottom padding */}
            <div className="h-6" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
