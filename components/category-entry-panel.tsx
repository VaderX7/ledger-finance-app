'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ProductCategory } from '@/lib/products';
import { CreditCard, PiggyBank, Landmark, TrendingUp, FileText, Flag, Shield } from 'lucide-react';

interface CategoryEntryPanelProps {
  activeCategory: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
}

const categoryButtons: Array<{
  id: ProductCategory;
  label: string;
  subtitle: string;
  icon: any;
  color: string;
  accentColor: string;
}> = [
  {
    id: 'savings',
    label: 'Savings Accounts',
    subtitle: 'Build Your Nest Egg',
    icon: PiggyBank,
    color: '#2C3E50',
    accentColor: '#C9A96E',
  },
  {
    id: 'current',
    label: 'Current Accounts',
    subtitle: 'Business Banking',
    icon: FileText,
    color: '#1565C0',
    accentColor: '#00E5FF',
  },
  {
    id: 'fds',
    label: 'Fixed Deposits',
    subtitle: 'Guaranteed Returns',
    icon: TrendingUp,
    color: '#FF6B6B',
    accentColor: '#00F5A0',
  },
  {
    id: 'creditcards',
    label: 'Credit Cards',
    subtitle: 'Rewards & Benefits',
    icon: CreditCard,
    color: '#FFA726',
    accentColor: '#2DD4BF',
  },
  {
    id: 'loans',
    label: 'Loans',
    subtitle: 'Quick Funding',
    icon: Landmark,
    color: '#AB47BC',
    accentColor: '#FB7185',
  },
  {
    id: 'govtschemes',
    label: 'Government Schemes',
    subtitle: 'For Every Indian',
    icon: Flag,
    color: '#7C3A00',
    accentColor: '#FF9933',
  },
  {
    id: 'insurance',
    label: 'Insurance',
    subtitle: 'Protect What Matters',
    icon: Shield,
    color: '#004D40',
    accentColor: '#00D4AA',
  },
];

export default function CategoryEntryPanel({ activeCategory, onCategoryChange }: CategoryEntryPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 gap-4 mb-8"
    >
      {categoryButtons.map((btn, index) => {
        const Icon = btn.icon;
        const isActive = activeCategory === btn.id;

        return (
          <motion.button
            key={btn.id}
            initial={{ opacity: 0, scale: 0.92, x: -16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 25,
              delay: index * 0.08,
            }}
            onClick={() => onCategoryChange(btn.id)}
            whileTap={{ scale: 0.96 }}
            className="relative overflow-hidden rounded-2xl p-5 text-left transition-all"
            style={{
              background: isActive
                ? `linear-gradient(135deg, ${btn.color}25 0%, ${btn.accentColor}15 100%)`
                : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
              border: isActive
                ? `1.5px solid ${btn.color}44`
                : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Animated background for active state */}
            {isActive && (
              <motion.div
                layoutId="active-category-bg"
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `radial-gradient(circle at 100% 0%, ${btn.color}08, transparent)`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4">
              {/* Icon Container */}
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${btn.color}18`,
                  border: `1px solid ${btn.color}33`,
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Icon
                  size={24}
                  style={{
                    color: isActive ? btn.color : btn.accentColor,
                    transition: 'color 0.3s',
                  }}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>

              {/* Text Content */}
              <div className="flex-1">
                <h3
                  className="text-[15px] font-700 tracking-tight leading-tight"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    color: isActive ? btn.color : 'rgba(255,255,255,0.85)',
                    transition: 'color 0.3s',
                  }}
                >
                  {btn.label}
                </h3>
                <p
                  className="font-body text-[11px] mt-0.5"
                  style={{
                    color: isActive ? btn.accentColor : 'rgba(255,255,255,0.35)',
                    transition: 'color 0.3s',
                  }}
                >
                  {btn.subtitle}
                </p>
              </div>

              {/* Active Indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: btn.accentColor }}
                  >
                    <span className="text-[10px] font-bold text-black">✓</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom accent line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{
                background: isActive
                  ? `linear-gradient(90deg, transparent, ${btn.color}60, transparent)`
                  : 'transparent',
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        );
      })}
    </motion.div>
  );
}
