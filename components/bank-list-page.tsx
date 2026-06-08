'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Product, ProductCategory } from '@/lib/products';
import CategoryProductCard from './category-product-card';
import ProductDetailPage from './product-detail-page';
import JargonBottomSheet from './jargon-bottom-sheet';

interface BankListPageProps {
  products: Product[];
  category: ProductCategory;
  accentColor: string;
  label: string;
  onBack: () => void;
}

interface BankGroup {
  lender: string;
  bankType: string;
  color: string;
  colorAccent: string;
  products: Product[];
}

function BankProductsPage({
  group,
  onBack,
}: {
  group: BankGroup;
  onBack: () => void;
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setTimeout(() => setSelectedTerm(null), 300);
  };

  const typeLabels: Record<string, string> = {
    public: 'Public Sector',
    private: 'Private Sector',
    sfb: 'Small Finance Bank',
    nbfc: 'NBFC',
  };

  return (
    <>
      <motion.div
        key="bank-products"
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
            background: 'rgba(7,10,18,0.90)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onBack}
            className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <ArrowLeft size={18} className="text-white/80" strokeWidth={2} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <p className="font-body text-[10px] tracking-widest uppercase text-white/25">
              {typeLabels[group.bankType] ?? group.bankType}
            </p>
            <p
              className="text-[15px] leading-tight truncate mt-0.5"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}
            >
              {group.lender}
            </p>
          </div>
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: group.colorAccent, boxShadow: `0 0 8px ${group.colorAccent}88` }}
          />
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
          {group.products.map((product, idx) => (
            <CategoryProductCard
              key={product.id}
              product={product}
              index={idx}
              onJargonClick={(term) => { setSelectedTerm(term); setIsSheetOpen(true); }}
              onDetailsClick={setSelectedProduct}
            />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

      <JargonBottomSheet
        term={selectedTerm}
        isOpen={isSheetOpen}
        onClose={handleSheetClose}
        onBackgroundChange={() => {}}
      />
    </>
  );
}

const categoryProductLabel: Record<string, string> = {
  fds: 'FD option',
  current: 'current account',
  creditcards: 'credit card',
  loans: 'loan',
  savings: 'savings account',
  govtschemes: 'scheme',
};

export default function BankListPage({
  products,
  category,
  accentColor,
  label,
  onBack,
}: BankListPageProps) {
  const [selectedGroup, setSelectedGroup] = useState<BankGroup | null>(null);

  const groups: BankGroup[] = [];
  const seen = new Map<string, number>();
  for (const p of products) {
    const idx = seen.get(p.lender);
    if (idx === undefined) {
      seen.set(p.lender, groups.length);
      groups.push({ lender: p.lender, bankType: p.bankType, color: p.color, colorAccent: p.colorAccent, products: [p] });
    } else {
      groups[idx].products.push(p);
    }
  }

  const singular = categoryProductLabel[category] ?? 'product';
  const plural = singular + 's';

  return (
    <>
      <motion.div
        key="bank-list"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
        className="fixed inset-0 bg-[#070A12] z-40 flex flex-col max-w-md mx-auto"
      >
        {/* Header */}
        <div
          className="flex-shrink-0 flex items-center gap-3 px-4 py-3"
          style={{
            background: 'rgba(7,10,18,0.90)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onBack}
            className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <ArrowLeft size={18} className="text-white/80" strokeWidth={2} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <p
              className="text-[15px] leading-tight truncate"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}
            >
              {label}
            </p>
            <p className="font-body text-[10px] mt-0.5" style={{ color: accentColor + 'bb' }}>
              {groups.length} institutions
            </p>
          </div>
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}88` }}
          />
        </div>

        {/* Bank cards */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 pb-24">
          {groups.map((group, idx) => (
            <motion.button
              key={group.lender}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, type: 'spring', stiffness: 280, damping: 28 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedGroup(group)}
              className="w-full rounded-2xl flex items-center gap-3 px-4 py-3 text-left"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${group.color}30`,
              }}
            >
              {/* Logo letter */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${group.color}20`, border: `1px solid ${group.color}35` }}
              >
                <span
                  className="text-[11px]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: group.colorAccent }}
                >
                  {group.lender.slice(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] leading-tight truncate"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.88)' }}
                >
                  {group.lender}
                </p>
                <p className="font-body text-[10px] mt-0.5" style={{ color: group.colorAccent + '99' }}>
                  {group.products.length} {group.products.length === 1 ? singular : plural}
                </p>
              </div>

              {/* Chevron */}
              <ChevronRight size={16} style={{ color: group.colorAccent + '80' }} className="flex-shrink-0" />
            </motion.button>
          ))}

          {groups.length === 0 && (
            <div className="text-center py-16 text-white/20 font-body text-sm">
              No institutions found
            </div>
          )}
        </div>
      </motion.div>

      {/* Drill into bank's products */}
      <AnimatePresence>
        {selectedGroup && (
          <BankProductsPage
            group={selectedGroup}
            onBack={() => setSelectedGroup(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
