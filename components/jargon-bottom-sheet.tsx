'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { jargonDefinitions } from '@/lib/products';
import { useLang } from '@/context/LanguageContext';

interface JargonBottomSheetProps {
  term: string | null;
  isOpen: boolean;
  onClose: () => void;
  onBackgroundChange?: (scale: number, opacity: number) => void;
}

export default function JargonBottomSheet({
  term,
  isOpen,
  onClose,
  onBackgroundChange,
}: JargonBottomSheetProps) {
  const { lang, t } = useLang();

  const definition = term ? jargonDefinitions[term] : null;
  const jargonLang = lang === 'hi' ? 'hi' : 'en';
  const content = definition ? definition[jargonLang] : '';

  useEffect(() => {
    if (isOpen) {
      onBackgroundChange?.(0.96, 0.5);
    } else {
      onBackgroundChange?.(1, 1);
    }
  }, [isOpen, onBackgroundChange]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[61]"
          />

          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 32,
              mass: 0.9,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            dragMomentum={false}
            onDragEnd={(_, info) => { if (info.offset.y > 80) { onClose(); } }}
            className="fixed bottom-0 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-md bg-[#0D1220] z-[70] rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 -4px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-8 h-1 rounded-full bg-white/10" />
            </div>

            {/* Header */}
            <div className="relative px-5 pt-2 pb-4 flex items-center justify-between border-b border-white/[0.06] flex-shrink-0">
              <div className="flex-1">
                <p className="font-body text-[10px] tracking-widest uppercase text-white/25 mb-1">
                  Financial Term
                </p>
                <h2
                  className="text-[24px] leading-snug"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #E4C98A, #C9A96E)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {term}
                </h2>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ml-4"
                style={{ background: 'rgba(255, 255, 255, 0.08)' }}
              >
                <X size={16} className="text-white/50" />
              </motion.button>
            </div>

            {/* Content */}
            <motion.div
              key={jargonLang}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="px-5 py-5 overflow-y-auto flex-1"
            >
              <p className="font-body text-[13px] text-white/60 leading-relaxed">{content}</p>

              {/* Accent line */}
              <div
                className="mt-4 h-px"
                style={{
                  background: 'linear-gradient(90deg, #00E5FF, transparent)',
                  opacity: 0.3,
                }}
              />

              {/* Footer message */}
              <p className="font-body text-[10px] text-white/25 mt-4 text-center italic">
                Now you&apos;re informed. Keep learning.
              </p>
            </motion.div>

            {/* Bottom padding for safe area */}
            <div className="h-6" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
