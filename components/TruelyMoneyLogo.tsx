'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface TruelyMoneyLogoProps {
  variant: 'hero' | 'corner' | 'done' | 'home';
  onDoneComplete?: () => void;
}

const SIZES = {
  hero: 80,
  corner: 32,
  done: 88,
  home: 32,
};

const RADII = {
  hero: 24,
  corner: 12,
  done: 28,
  home: 12,
};

const FONT_SIZES = {
  hero: 30,
  corner: 12,
  done: 34,
  home: 12,
};

export default function TruelyMoneyLogo({ variant, onDoneComplete }: TruelyMoneyLogoProps) {
  const controls = useAnimation();
  const size = SIZES[variant];
  const borderRadius = RADII[variant];
  const fontSize = FONT_SIZES[variant];

  useEffect(() => {
    if (variant === 'hero') {
      controls.start({
        y: [0, -10, 0],
        transition: {
          duration: 1.6,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      });
    } else if (variant === 'corner') {
      controls.start({
        y: [0, -4, 0],
        transition: {
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.4,
        },
      });
    } else if (variant === 'done') {
      controls.start({
        y: [0, -28, 0, -18, 0, -10, 0],
        scale: [1, 1.18, 1, 1.1, 1, 1.05, 1],
        transition: {
          duration: 1.4,
          ease: 'easeInOut',
        },
      }).then(() => {
        if (onDoneComplete) {
          onDoneComplete();
        }
      });
    } else {
      controls.stop();
      controls.set({ y: 0, scale: 1 });
    }
  }, [variant, controls, onDoneComplete]);

  return (
    <motion.div
      layoutId="ledger-logo-mark"
      layout
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      animate={controls}
      className="relative flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius,
        background: 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.08))',
        border: '1px solid rgba(201,169,110,0.25)',
        boxShadow: variant === 'hero' ? '0 0 60px rgba(201,169,110,0.14)' : variant === 'done' ? '0 0 80px rgba(201,169,110,0.22)' : 'none',
      }}
    >
      <img
        src="/logo.png"
        alt="Truely Money Logo"
        className="w-full h-full object-cover select-none pointer-events-none"
      />
      
      {(variant === 'hero' || variant === 'done') && (
        <motion.div
          animate={{ x: ['-120%', '220%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-y-0 w-1/3 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
            transform: 'skewX(-12deg)',
          }}
        />
      )}
    </motion.div>
  );
}
