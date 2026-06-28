'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';
import { X, ExternalLink, Shield, Gift, AlertCircle } from 'lucide-react';
import JargonText from '@/components/jargon-text';
import JargonBottomSheet from '@/components/jargon-bottom-sheet';
import FDTenureRates from './fd-tenure-rates';

interface DetailPanelProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetailPanel({ product, isOpen, onClose }: DetailPanelProps) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [jargonOpen, setJargonOpen] = useState(false);


  const handleAccessPortal = () => {
    const win = window.open(product.portalUrl, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
  };

  const renderCategorySpecificContent = () => {
    if (product.category === 'fds') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3
            className="text-[13px] font-700 text-white/80 flex items-center gap-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            <Shield size={14} style={{ color: '#2DD4BF' }} />
            DICGC Safety Breakdown
          </h3>
          <div
            className="p-4 rounded-lg space-y-3"
            style={{ background: 'rgba(45, 212, 191, 0.08)', border: '1px solid rgba(45, 212, 191, 0.15)' }}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(45, 212, 191, 0.2)' }}>
                <span className="text-[10px] font-bold text-[#2DD4BF]">✓</span>
              </div>
              <div>
                <p className="font-body text-[11px] font-medium text-white/70">Insured Amount</p>
                <p className="font-body text-[10px] text-white/35 mt-0.5">₹5 Lakhs per depositor per bank</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(45, 212, 191, 0.2)' }}>
                <span className="text-[10px] font-bold text-[#2DD4BF]">✓</span>
              </div>
              <div>
                <p className="font-body text-[11px] font-medium text-white/70">Coverage Includes</p>
                <p className="font-body text-[10px] text-white/35 mt-0.5">Principal + accrued interest up to maturity</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(45, 212, 191, 0.2)' }}>
                <span className="text-[10px] font-bold text-[#2DD4BF]">✓</span>
              </div>
              <div>
                <p className="font-body text-[11px] font-medium text-white/70">Protected By</p>
                <p className="font-body text-[10px] text-white/35 mt-0.5">Deposit Insurance & Credit Guarantee Corporation</p>
              </div>
            </div>
          </div>

          <FDTenureRates productId={product.id} accentColor={product.colorAccent || product.color || '#C9A96E'} />
        </motion.div>
      );
    }

    if (product.category === 'creditcards') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3
            className="text-[13px] font-700 text-white/80 flex items-center gap-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            <Gift size={14} style={{ color: '#FFA726' }} />
            Fee vs Rewards Milestone Matrix
          </h3>
          <div className="space-y-2">
            {/* Fees */}
            <div
              className="p-3 rounded-lg"
              style={{ background: 'rgba(251, 113, 133, 0.08)', border: '1px solid rgba(251, 113, 133, 0.12)' }}
            >
              <p className="font-body text-[10px] font-medium text-white/50 mb-1.5">Annual Fees</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-body text-[10px] text-white/35">Joining Fee:</span>
                  <JargonText
                    text={String(product.metrics.joiningFee ?? 'Nil')}
                    onTermClick={(term) => { setSelectedTerm(term); setJargonOpen(true); }}
                    className="font-700 text-[11px] text-right"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-[10px] text-white/35">Annual Fee:</span>
                  <JargonText
                    text={String(product.metrics.annualFee ?? 'Nil')}
                    onTermClick={(term) => { setSelectedTerm(term); setJargonOpen(true); }}
                    className="font-700 text-[11px] text-right"
                  />
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div
              className="p-3 rounded-lg"
              style={{ background: 'rgba(255, 167, 38, 0.08)', border: '1px solid rgba(255, 167, 38, 0.12)' }}
            >
              <p className="font-body text-[10px] font-medium text-white/50 mb-1.5">Milestone Rewards</p>
              <JargonText
                text={String(product.metrics.milestoneRewards ?? '')}
                onTermClick={(term) => { setSelectedTerm(term); setJargonOpen(true); }}
                className="font-body text-[10px] text-white/35"
              />
            </div>

            {/* Fuel Surcharge */}
            <div
              className="p-3 rounded-lg"
              style={{ background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.12)' }}
            >
              <p className="font-body text-[10px] font-medium text-white/50 mb-1.5">Fuel Surcharge</p>
              <JargonText
                text={String(product.metrics.fuelSurcharge ?? '')}
                onTermClick={(term) => { setSelectedTerm(term); setJargonOpen(true); }}
                className="font-700 text-[11px]"
              />
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
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
            className="fixed bottom-0 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-md bg-[#0D1220] z-50 rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
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
            <div className="relative px-5 pt-2 pb-4 flex items-center justify-between border-b border-white/[0.06] flex-shrink-0">
              <div className="flex-1">
                <p className="font-body text-[10px] tracking-widest uppercase text-white/25 mb-1">
                  {product.category}
                </p>
                <h2
                  className="text-[20px] text-white/95 leading-snug"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
                >
                  {product.name}
                </h2>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ml-4"
                style={{ background: 'rgba(255, 255, 255, 0.08)' }}
              >
                <X size={16} className="text-white/50" />
              </motion.button>
            </div>

            {/* Content */}
            <motion.div
              className="px-5 py-5 space-y-5 overflow-y-auto flex-1 custom-scrollbar"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Product Description */}
              <JargonText
                text={product.description}
                onTermClick={(term) => { setSelectedTerm(term); setJargonOpen(true); }}
              />

              {/* Highlights */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.highlights.map((h) => (
                  <span
                    key={h}
                    className="px-2.5 py-1 rounded-md text-[10px] font-body inline-flex items-center"
                    style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)', color: '#E4C98A' }}
                  >
                    <JargonText
                      text={h}
                      onTermClick={(term) => { setSelectedTerm(term); setJargonOpen(true); }}
                      className="text-[10px] leading-normal"
                    />
                  </span>
                ))}
              </div>

              {/* Metrics Summary */}
              <div
                className="p-4 rounded-xl space-y-2"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <h3
                  className="text-[12px] font-700 text-white/80"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
                >
                  Key Details
                </h3>
                {Object.entries(product.metrics).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                    <p className="font-body text-[10px] text-white/35 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <JargonText
                      text={String(value)}
                      onTermClick={(term) => { setSelectedTerm(term); setJargonOpen(true); }}
                      className="font-700 text-[11px] text-right"
                    />
                  </div>
                ))}
              </div>

              {/* Category-Specific Content */}
              {renderCategorySpecificContent()}

              {/* Documents */}
              <div>
                <p
                  className="text-[12px] font-700 text-white/70 mb-2.5"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
                >
                  Required Documents
                </p>
                <div className="space-y-1">
                  {product.documents.map((doc, i) => (
                    <motion.div
                      key={doc}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2 p-2 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.02)' }}
                    >
                      <span className="text-[#C9A96E] text-[9px] font-bold flex-shrink-0 mt-0.5">✓</span>
                      <JargonText
                        text={doc}
                        onTermClick={(term) => { setSelectedTerm(term); setJargonOpen(true); }}
                        className="font-body text-[10px] text-white/45"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Anonymous Access Note */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-2.5 p-3.5 rounded-lg"
                style={{
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.12)',
                }}
              >
                <AlertCircle size={13} style={{ color: '#38BDF8', marginTop: 2 }} className="flex-shrink-0" />
                <p className="font-body text-[10px] text-white/40 leading-relaxed">
                  This comparison is completely anonymous. No data is collected, stored, or shared with third parties.
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAccessPortal}
                className="w-full py-3.5 rounded-xl font-body text-[12px] font-semibold flex items-center justify-center gap-2.5 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #C9A96E 0%, #E4C98A 100%)',
                  color: '#070A12',
                }}
              >
                Access Official Portal Anonymously
                <ExternalLink size={14} />
              </motion.button>

              {/* Bottom padding */}
              <div className="h-4" />
            </motion.div>
          </motion.div>
        </>
      )}

      <JargonBottomSheet
        term={selectedTerm}
        isOpen={jargonOpen}
        onClose={() => { setJargonOpen(false); setTimeout(() => setSelectedTerm(null), 300); }}

      />
    </AnimatePresence>
  );
}
