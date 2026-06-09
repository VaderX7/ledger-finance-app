'use client';

import { getJargonTermsInText } from '@/lib/products';
import { motion } from 'framer-motion';

export default function JargonText({
  text,
  onTermClick,
  className,
}: {
  text: string;
  onTermClick: (term: string) => void;
  className?: string;
}) {
  const safeText = String(text ?? '');
  const terms = getJargonTermsInText(safeText);

  if (terms.length === 0) {
    return <p className={className || 'font-body text-[11px] text-white/35 leading-relaxed'}>{safeText}</p>;
  }

  const segments: React.ReactNode[] = [];
  let lastEnd = 0;

  terms.forEach((term, i) => {
    if (term.start > lastEnd) {
      segments.push(safeText.substring(lastEnd, term.start));
    }

    segments.push(
      <motion.span
        key={`term-${i}`}
        onClick={() => onTermClick(term.term)}
        className="cursor-pointer transition-all"
        style={{
          borderBottom: '1px dashed rgba(201,169,110,0.7)',
          color: '#E4C98A',
          textDecoration: 'none',
          paddingBottom: '2px',
        }}
        whileHover={{ opacity: 1 }}
        whileTap={{ backgroundColor: 'rgba(201,169,110,0.15)' }}
      >
        {term.term}
      </motion.span>
    );

    lastEnd = term.end;
  });

  if (lastEnd < safeText.length) {
    segments.push(safeText.substring(lastEnd));
  }

  return <p className={className || 'font-body text-[11px] text-white/35 leading-relaxed'}>{segments}</p>;
}
