'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FinancialInstitution, InstitutionType, financialInstitutions } from '@/lib/institutions';
import CategoryViewHeader from './category-view-header';
import SavingsFilter from './savings-filter';
import InstitutionCard from './institution-card';
import BankAccountPage from './bank-account-page';

interface SavingsViewProps {
  onBack: () => void;
}

export default function SavingsView({ onBack }: SavingsViewProps) {
  const [primaryFilter, setPrimaryFilter] = useState<InstitutionType | 'all'>('all');
  const [secondaryFilter, setSecondaryFilter] = useState<'all' | 'zero-balance' | 'standard-mab'>('all');
  const [selectedBank, setSelectedBank] = useState<FinancialInstitution | null>(null);

  const filteredInstitutions = financialInstitutions.filter((inst) => {
    if (primaryFilter !== 'all' && inst.type !== primaryFilter) return false;
    if (secondaryFilter === 'zero-balance' && !inst.hasZeroBalance) return false;
    return true;
  });

  return (
    <>
      {/* Savings header — hidden when a bank sub-page is active so its z-30 back
          button doesn't intercept taps meant for the bank page's own header */}
      {!selectedBank && (
        <CategoryViewHeader
          label="Savings Accounts"
          subtitle="Build Your Nest Egg"
          accentColor="#C9A96E"
          onBack={onBack}
        />
      )}

      <motion.div
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -32 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="pt-20 px-5 pb-8"
      >
        <SavingsFilter
          primaryFilter={primaryFilter}
          secondaryFilter={secondaryFilter}
          onPrimaryChange={setPrimaryFilter}
          onSecondaryChange={setSecondaryFilter}
        />

        <div className="space-y-3">
          {filteredInstitutions.map((institution, idx) => (
            <InstitutionCard
              key={institution.id}
              institution={institution}
              index={idx}
              onSelectInstitution={setSelectedBank}
            />
          ))}
        </div>

        {filteredInstitutions.length === 0 && (
          <div className="text-center py-16 text-white/25 font-body text-sm">
            No institutions match your filters
          </div>
        )}
      </motion.div>

      {/* Full-screen bank sub-page slides in over the list */}
      <AnimatePresence>
        {selectedBank && (
          <BankAccountPage
            institution={selectedBank}
            onBack={() => setSelectedBank(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
