'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductCategory, BankType, filterProductsByUserProfile } from '@/lib/products';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import CategoryProductCard from './category-product-card';

interface CategoryProductFeedProps {
  category: ProductCategory;
  onJargonClick: (term: string) => void;
  onDetailsClick: (product: Product) => void;
  userProfile?: { monthlyIncome: number; age: number; employmentType: 'salaried' | 'self-employed' };
  bankFilters: BankType[];
}

export default function CategoryProductFeed({
  category,
  onJargonClick,
  onDetailsClick,
  userProfile,
  bankFilters,
}: CategoryProductFeedProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  let displayProducts: Product[] = [];

  if (userProfile) {
    displayProducts = filterProductsByUserProfile(userProfile, category, bankFilters);
  }

  const shown = isExpanded ? displayProducts : displayProducts.slice(0, 2);

  if (displayProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 text-white/25 font-body text-sm"
      >
        No products match your filters
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {shown.map((product, i) => (
            <CategoryProductCard
              key={product.id}
              product={product}
              index={i}
              onJargonClick={onJargonClick}
              onDetailsClick={onDetailsClick}
            />
          ))}
        </AnimatePresence>
      </div>

      {displayProducts.length > 2 && (
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-3 py-3 rounded-xl font-body text-[12px] font-medium transition-all flex items-center justify-center gap-2"
          style={{
            background: 'rgba(201, 169, 110, 0.1)',
            border: '1px solid rgba(201, 169, 110, 0.2)',
            color: '#C9A96E',
          }}
        >
          {isExpanded ? (
            <>
              Show less
              <ChevronLeft size={14} />
            </>
          ) : (
            <>
              View {displayProducts.length - 2} more
              <ChevronRight size={14} />
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
