'use client';

import { motion } from 'framer-motion';
import { Product } from '@/lib/products';
import { ChevronRight } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { TranslationKey } from '@/lib/i18n';

interface CategoryProductCardProps {
  product: Product;
  index: number;
  onJargonClick: (term: string) => void;
  onDetailsClick: (product: Product) => void;
}

function getReadableColor(hexColor: string) {
  if (!hexColor || !hexColor.startsWith('#')) return 'rgba(255, 255, 255, 0.9)';
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6 && hex.length !== 3) return 'rgba(255, 255, 255, 0.9)';
  
  let r = 0, g = 0, b = 0;
  if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16);
    g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
    b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
  }
  
  // relative luminance calculation
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // if too dark, blend with 65% white to make it a readable pastel tone
  if (luminance < 0.45) {
    const lr = Math.round(r + (255 - r) * 0.65);
    const lg = Math.round(g + (255 - g) * 0.65);
    const lb = Math.round(b + (255 - b) * 0.65);
    return `rgb(${lr}, ${lg}, ${lb})`;
  }
  return hexColor;
}

export default function CategoryProductCard({
  product,
  index,
  onDetailsClick,
}: CategoryProductCardProps) {
  const { t } = useLang();
  const isReturnsCategory = product.category === 'savings' || product.category === 'fds';
  const accentColor = isReturnsCategory ? '#00F5A0' : '#00E5FF';
  const metricEntries = Object.entries(product.metrics).slice(0, 3);
  const readableLenderColor = getReadableColor(product.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: index * 0.05 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onDetailsClick(product)}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{
        background: 'linear-gradient(135deg, rgba(15,21,35,0.97) 0%, rgba(13,18,32,0.92) 100%)',
        border: `1px solid ${product.color}30`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `${product.color}14` }}
      />

      {/* Bank name header stripe */}
      <div
        className="relative z-10 flex items-center justify-between px-4 py-2"
        style={{
          borderBottom: `1px solid ${product.color}20`,
          background: `${product.color}0c`,
          borderLeft: `3px solid ${product.color}`,
        }}
      >
        <span
          className="font-body text-[10px] font-bold tracking-wide uppercase truncate"
          style={{ color: readableLenderColor }}
        >
          {product.lender}
        </span>
        <span
          className="text-[9px] font-body ml-2 flex-shrink-0 px-1.5 py-0.5 rounded"
          style={{ color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)' }}
        >
          {product.bankType.toUpperCase()}
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-4 pt-3 pb-4">
        {/* Product name + chevron */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3
            className="text-[15px] leading-snug"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}
          >
            {product.name}
          </h3>
          <ChevronRight size={16} style={{ color: product.color + '80' }} className="flex-shrink-0 mt-0.5" />
        </div>

        {/* Key metrics — inline grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {metricEntries.map(([key, value]) => {
            const translatedVal = t[key as TranslationKey];
            const displayLabel = typeof translatedVal === 'string' ? translatedVal : key.replace(/([A-Z])/g, ' $1').trim();
            return (
              <div
                key={key}
                className="rounded-lg px-2 py-2"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <p className="font-body text-[9px] text-white/30 mb-0.5 capitalize leading-tight">
                  {displayLabel}
                </p>
                <p
                  className="text-[11px] leading-tight"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: accentColor }}
                >
                  {String(value)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Highlights pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.highlights.slice(0, 3).map((h) => (
            <span
              key={h}
              className="px-2 py-0.5 rounded-md text-[9px] font-body text-white/40"
              style={{ background: `${product.color}10`, border: `1px solid ${product.color}1e` }}
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
