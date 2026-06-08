'use client';

import { motion } from 'framer-motion';
import { InstitutionType } from '@/lib/institutions';

interface SavingsFilterProps {
  primaryFilter: InstitutionType | 'all';
  secondaryFilter: 'all' | 'zero-balance' | 'standard-mab';
  onPrimaryChange: (filter: InstitutionType | 'all') => void;
  onSecondaryChange: (filter: 'all' | 'zero-balance' | 'standard-mab') => void;
}

const primaryFilters: Array<{ id: InstitutionType | 'all'; label: string; emoji: string }> = [
  { id: 'all', label: 'All', emoji: '🏦' },
  { id: 'public', label: 'Public Sector', emoji: '🏛️' },
  { id: 'private', label: 'Private Sector', emoji: '🏢' },
  { id: 'sfb', label: 'Small Finance', emoji: '💰' },
  { id: 'payments', label: 'Payments Banks', emoji: '📱' },
  { id: 'rrb', label: 'Regional Rural', emoji: '🌾' },
  { id: 'foreign', label: 'Foreign Banks', emoji: '🌍' },
];

const secondaryFilters: Array<{ id: 'all' | 'zero-balance' | 'standard-mab'; label: string }> = [
  { id: 'all', label: 'All Account Types' },
  { id: 'zero-balance', label: 'Zero Balance Profiles' },
  { id: 'standard-mab', label: 'Standard Minimum Balance' },
];

export default function SavingsFilter({
  primaryFilter,
  secondaryFilter,
  onPrimaryChange,
  onSecondaryChange,
}: SavingsFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 space-y-3"
    >
      {/* Primary Filter Level */}
      <div>
        <p
          className="text-[10px] tracking-widest uppercase font-700 text-white/35 mb-2.5"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
        >
          Institution Type
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
          {primaryFilters.map((filter) => {
            const isActive = primaryFilter === filter.id;
            return (
              <motion.button
                key={filter.id}
                onClick={() => onPrimaryChange(filter.id)}
                whileTap={{ scale: 0.94 }}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg font-body text-[10px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap"
                style={{
                  background: isActive
                    ? 'rgba(201, 169, 110, 0.12)'
                    : 'rgba(255,255,255,0.03)',
                  border: isActive
                    ? '1px solid rgba(201, 169, 110, 0.25)'
                    : '1px solid rgba(255,255,255,0.06)',
                  color: isActive ? '#C9A96E' : 'rgba(255,255,255,0.3)',
                }}
              >
                <span>{filter.emoji}</span>
                <span>{filter.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filter Level */}
      <div>
        <p
          className="text-[10px] tracking-widest uppercase font-700 text-white/35 mb-2.5"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
        >
          Account Criteria
        </p>
        <div className="flex gap-2 flex-wrap">
          {secondaryFilters.map((filter) => {
            const isActive = secondaryFilter === filter.id;
            return (
              <motion.button
                key={filter.id}
                onClick={() => onSecondaryChange(filter.id)}
                whileTap={{ scale: 0.94 }}
                className="px-3 py-1.5 rounded-lg font-body text-[10px] font-medium transition-all"
                style={{
                  background: isActive
                    ? 'rgba(56, 189, 248, 0.12)'
                    : 'rgba(255,255,255,0.03)',
                  border: isActive
                    ? '1px solid rgba(56, 189, 248, 0.25)'
                    : '1px solid rgba(255,255,255,0.06)',
                  color: isActive ? '#38BDF8' : 'rgba(255,255,255,0.3)',
                }}
              >
                {filter.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
