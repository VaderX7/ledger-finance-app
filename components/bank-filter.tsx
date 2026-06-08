'use client';

import { motion } from 'framer-motion';
import { BankType } from '@/lib/products';

interface BankFilterProps {
  activeFilters: BankType[];
  onFilterChange: (filters: BankType[]) => void;
}

const bankTypes: Array<{ id: BankType; label: string; icon: string }> = [
  { id: 'public', label: 'Public', icon: '🏛️' },
  { id: 'private', label: 'Private', icon: '🏢' },
  { id: 'sfb', label: 'Small Finance', icon: '💰' },
  { id: 'nbfc', label: 'NBFC', icon: '📊' },
];

export default function BankFilter({ activeFilters, onFilterChange }: BankFilterProps) {
  const toggleFilter = (bankType: BankType) => {
    if (activeFilters.includes(bankType)) {
      onFilterChange(activeFilters.filter((f) => f !== bankType));
    } else {
      onFilterChange([...activeFilters, bankType]);
    }
  };

  const showAll = () => {
    if (activeFilters.length === 4) {
      onFilterChange([]);
    } else {
      onFilterChange(['public', 'private', 'sfb', 'nbfc']);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-5 px-1"
    >
      <div className="flex items-center justify-between mb-2">
        <p
          className="text-[10px] tracking-widest uppercase font-700 text-white/35"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
        >
          Filter by Bank Type
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={showAll}
          className="text-[10px] font-body font-medium text-[#C9A96E]/60 hover:text-[#C9A96E] transition-colors"
        >
          {activeFilters.length === 4 ? 'Clear' : 'All'}
        </motion.button>
      </div>
      <div className="flex flex-wrap gap-2">
        {bankTypes.map((bank) => {
          const isActive = activeFilters.includes(bank.id) || activeFilters.length === 0;

          return (
            <motion.button
              key={bank.id}
              onClick={() => toggleFilter(bank.id)}
              whileTap={{ scale: 0.94 }}
              className="px-3 py-1.5 rounded-lg font-body text-[10px] font-medium transition-all"
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
              <span>{bank.icon}</span>
              <span className="ml-1">{bank.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
