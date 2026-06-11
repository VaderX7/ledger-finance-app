'use client';

import { motion } from 'framer-motion';
import { FinancialInstitution } from '@/lib/institutions';
import { ArrowRight, Badge, Zap } from 'lucide-react';
import { LOGO_BG_MAP } from './product-category-view';

interface InstitutionCardProps {
  institution: FinancialInstitution;
  index: number;
  onSelectInstitution: (institution: FinancialInstitution) => void;
}

export default function InstitutionCard({
  institution,
  index,
  onSelectInstitution,
}: InstitutionCardProps) {
  const typeLabels: Record<string, string> = {
    public: 'Public Sector Bank',
    private: 'Private Sector Bank',
    sfb: 'Small Finance Bank',
    payments: 'Payments Bank',
    rrb: 'Regional Rural Bank',
    foreign: 'Foreign Bank',
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 24,
        delay: index * 0.06,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectInstitution(institution)}
      className="relative overflow-hidden rounded-2xl p-5 text-left group w-full transition-all"
      style={{
        background: 'linear-gradient(135deg, rgba(15,21,35,0.95) 0%, rgba(13,18,32,0.9) 100%)',
      }}
    >
      {/* Metallic gradient border */}
      <div
        className="absolute inset-0 rounded-2xl p-px pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${institution.color}40, ${institution.colorAccent}20, transparent)`,
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15,21,35,0.95) 0%, rgba(13,18,32,0.9) 100%)',
          }}
        />
      </div>

      {/* Ambient glow on hover */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `${institution.color}18` }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {/* Logo */}
            {institution.logoUrl ? (
              <div
                className="w-12 h-12 rounded-xl p-2 flex items-center justify-center overflow-hidden shrink-0 mb-3"
                style={{ background: LOGO_BG_MAP[institution.name] ?? '#FFFFFF' }}
              >
                <img
                  src={institution.logoUrl}
                  alt={institution.name}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0 mb-3"
                style={{ background: `linear-gradient(135deg, #3f3f46, #18181b)` }}
              >
                <span
                  className="text-[12px] leading-none"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: institution.colorAccent }}
                >
                  {institution.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            {/* Title & Category */}
            <h3
              className="text-[15px] font-700 tracking-tight leading-snug text-white/90"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
            >
              {institution.name}
            </h3>
            <p
              className="text-[10px] text-white/35 mt-1"
              style={{ color: `${institution.color}99` }}
            >
              {typeLabels[institution.type]}
            </p>
          </div>

          {/* Arrow Indicator */}
          <motion.div
            whileHover={{ x: 4, y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${institution.colorAccent}18` }}
          >
            <ArrowRight size={14} style={{ color: institution.colorAccent }} strokeWidth={2} />
          </motion.div>
        </div>

        {/* Tagline */}
        <p className="font-body text-[11px] text-white/40 mb-3 line-clamp-1">
          {institution.tagline}
        </p>

        {/* Account Types Badge */}
        <div className="flex items-center gap-2 mb-3">
          <Badge size={12} className="text-white/30" strokeWidth={1.5} />
          <span
            className="text-[10px] font-600 text-white/50"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
          >
            {institution.savingsAccountVariants.length} Account Types
          </span>
        </div>

        {/* Zero Balance Badge */}
        {institution.hasZeroBalance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
            style={{ background: `${institution.colorAccent}15`, border: `1px solid ${institution.colorAccent}33` }}
          >
            <Zap size={12} style={{ color: institution.colorAccent }} strokeWidth={2} />
            <span
              className="text-[9px] font-600 text-white/70"
              style={{ color: institution.colorAccent }}
            >
              Zero Balance Available
            </span>
          </motion.div>
        )}

        {/* Disclaimer if present */}
        {institution.disclaimer && (
          <div className="mt-2 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/15">
            <p className="font-body text-[8px] text-yellow-600/60">{institution.disclaimer}</p>
          </div>
        )}
      </div>
    </motion.button>
  );
}
