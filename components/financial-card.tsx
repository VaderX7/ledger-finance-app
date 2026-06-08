'use client';

import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface FinancialCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accentColor: string;
  accentDim: string;
  stat: string;
  statLabel: string;
  badge?: string;
  delay?: number;
  index: number;
}

export default function FinancialCard({
  title,
  subtitle,
  icon: Icon,
  accentColor,
  accentDim,
  stat,
  statLabel,
  badge,
  index,
}: FinancialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 24,
        delay: 0.15 + index * 0.08,
      }}
      whileTap={{ scale: 0.975 }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        background: `linear-gradient(135deg, rgba(13,18,32,0.95) 0%, rgba(15,21,35,0.9) 100%)`,
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60"
        style={{ background: accentDim }}
      />

      {/* Top row */}
      <div className="relative z-10 p-5 pb-0 flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: accentDim, border: `1px solid ${accentColor}22` }}
        >
          <Icon size={18} style={{ color: accentColor }} strokeWidth={1.75} />
        </div>
        {badge && (
          <span
            className="text-[9px] font-body font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{ background: accentDim, color: accentColor, border: `1px solid ${accentColor}33` }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 p-5 pt-4">
        <h3
          className="font-display text-[15px] font-700 tracking-tight text-white/90 mb-0.5 leading-snug"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
        >
          {title}
        </h3>
        <p className="font-body text-[11px] text-white/38 leading-relaxed mb-4">
          {subtitle}
        </p>

        {/* Stat */}
        <div className="flex items-end justify-between">
          <div>
            <span
              className="font-display text-2xl font-800 tracking-tighter leading-none"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                color: accentColor,
              }}
            >
              {stat}
            </span>
            <p className="font-body text-[10px] text-white/30 mt-0.5 tracking-wide">{statLabel}</p>
          </div>
          <motion.div
            whileHover={{ x: 3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: accentDim }}
          >
            <ArrowRight size={13} style={{ color: accentColor }} />
          </motion.div>
        </div>
      </div>

      {/* Bottom line accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
        }}
      />
    </motion.div>
  );
}
