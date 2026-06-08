'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface CategoryViewHeaderProps {
  label: string;
  subtitle: string;
  accentColor: string;
  onBack: () => void;
}

export default function CategoryViewHeader({
  label,
  subtitle,
  accentColor,
  onBack,
}: CategoryViewHeaderProps) {
  return (
    <div
      className="fixed top-0 inset-x-0 mx-auto max-w-md z-30 flex items-center gap-3 px-4 py-3"
      style={{
        background: 'rgba(7, 10, 18, 0.85)',
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
          className="text-[16px] leading-tight truncate"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            color: 'rgba(255,255,255,0.92)',
          }}
        >
          {label}
        </p>
        <p className="font-body text-[10px] mt-0.5" style={{ color: accentColor + 'bb' }}>
          {subtitle}
        </p>
      </div>

      {/* Accent dot */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}88` }}
      />
    </div>
  );
}
