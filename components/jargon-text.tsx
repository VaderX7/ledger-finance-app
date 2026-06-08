'use client';

import { Product, getJargonTermsInText, jargonDefinitions } from '@/lib/products';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function JargonText({
  text,
  onTermClick,
}: {
  text: string;
  onTermClick: (term: string) => void;
}) {
  const terms = getJargonTermsInText(text);

  if (terms.length === 0) {
    return <p className="font-body text-[11px] text-white/35 leading-relaxed">{text}</p>;
  }

  const segments: React.ReactNode[] = [];
  let lastEnd = 0;

  terms.forEach((term, i) => {
    if (term.start > lastEnd) {
      segments.push(text.substring(lastEnd, term.start));
    }

    segments.push(
      <motion.span
        key={`term-${i}`}
        onClick={() => onTermClick(term.term)}
        className="cursor-pointer transition-all hover:opacity-100"
        style={{
          borderBottom: '1px dashed #00E5FF',
          color: 'inherit',
          opacity: 0.85,
          textDecoration: 'none',
        }}
        whileHover={{ opacity: 1, textDecoration: 'underline' }}
      >
        {term.term}
      </motion.span>
    );

    lastEnd = term.end;
  });

  if (lastEnd < text.length) {
    segments.push(text.substring(lastEnd));
  }

  return <p className="font-body text-[11px] text-white/35 leading-relaxed">{segments}</p>;
}
