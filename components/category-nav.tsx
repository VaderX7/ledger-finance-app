'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ProductCategory } from '@/lib/products';
import { CreditCard, PiggyBank, Landmark, TrendingUp, FileText, Flag, Shield } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

interface CategoryNavProps {
  activeCategory: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
}

const categories: Array<{ id: ProductCategory; label: string; icon: any; color: string }> = [
  { id: 'savings', label: 'Savings', icon: PiggyBank, color: '#C9A96E' },
  { id: 'loans', label: 'Loans', icon: Landmark, color: '#38BDF8' },
  { id: 'current', label: 'Current Acc', icon: FileText, color: '#2DD4BF' },
  { id: 'fds', label: 'Fixed Deposits', icon: TrendingUp, color: '#FB7185' },
  { id: 'creditcards', label: 'Credit Cards', icon: CreditCard, color: '#FFA726' },
  { id: 'govtschemes', label: 'Govt Schemes', icon: Flag, color: '#FF9933' },
  { id: 'insurance', label: 'Insurance', icon: Shield, color: '#00D4AA' },
];

export default function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;

    const checkScroll = () => {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    return () => container.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const amount = 200;
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-6"
    >
      {/* Left arrow */}
      <AnimatePresence>
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(90deg, #070A12 60%, transparent)' }}
          >
            <span className="text-white/30 text-lg">‹</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scrollable container */}
      <div
        ref={scrollContainer}
        className="flex gap-2 overflow-x-auto scrollbar-hidden px-2 md:px-8"
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 px-4 py-2.5 rounded-full flex items-center gap-2 transition-all relative"
              style={{
                background: isActive
                  ? `${cat.color}22`
                  : 'rgba(255,255,255,0.04)',
                border: isActive
                  ? `1.5px solid ${cat.color}55`
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'transparent',
                    border: `1.5px solid ${cat.color}55`,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={16}
                style={{
                  color: isActive ? cat.color : 'rgba(255,255,255,0.35)',
                  transition: 'color 0.2s',
                }}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className="font-body text-[12px] font-semibold whitespace-nowrap"
                style={{
                  color: isActive ? cat.color : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.2s',
                }}
              >
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Right arrow */}
      <AnimatePresence>
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(270deg, #070A12 60%, transparent)' }}
          >
            <span className="text-white/30 text-lg">›</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
