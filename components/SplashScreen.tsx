'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isSplitting, setIsSplitting] = useState(false);

  useEffect(() => {
    // Split lines and fade out content at 1300ms
    const splitTimeout = setTimeout(() => {
      setIsSplitting(true);
    }, 1300);

    // Call onComplete at 1800ms
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => {
      clearTimeout(splitTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  const letters = ['T', 'R', 'U', 'E', 'L', 'Y', ' ', 'M', 'O', 'N', 'E', 'Y'];

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#070A12] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(201, 169, 110, 0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(201, 169, 110, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        animation: 'gridMove 10s linear infinite',
      }}
    >
      <style jsx global>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
      `}</style>

      {/* Top half: Logo box */}
      <div className="relative flex flex-col items-center mb-6">
        {/* Subtle gold glow orb behind L logo */}
        <motion.div
          initial={{ width: 120, height: 120, opacity: 0 }}
          animate={{ 
            width: [120, 200, 200], 
            height: [120, 200, 200], 
            opacity: [0, 0.4, 0] 
          }}
          transition={{ 
            delay: 1.1, 
            duration: 0.4, 
            times: [0, 0.5, 1], 
            ease: 'easeInOut' 
          }}
          className="absolute pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201, 169, 110, 0.25), transparent)',
            filter: 'blur(24px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
          }}
        />

        {/* L Mark Box */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={isSplitting ? { opacity: 0, transition: { duration: 0.3 } } : { y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
          className="relative flex items-center justify-center w-[72px] h-[72px] rounded-2xl z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.08))',
            border: '1px solid rgba(201,169,110,0.3)',
          }}
        >
          <span 
            className="text-[28px] font-extrabold text-transparent bg-clip-text"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              backgroundImage: 'linear-gradient(135deg, #C9A96E, #E4C98A, #C9A96E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            T
          </span>
        </motion.div>
      </div>

      {/* Horizontal split line */}
      <div className="w-full flex items-center justify-center h-px overflow-visible relative">
        {/* Left half container */}
        <div className="w-1/2 flex justify-end">
          <motion.div
            initial={{ width: '0%' }}
            animate={isSplitting ? { x: '-100vw', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } : { width: '60%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent, #C9A96E, #E4C98A)',
            }}
          />
        </div>
        {/* Right half container */}
        <div className="w-1/2 flex justify-start">
          <motion.div
            initial={{ width: '0%' }}
            animate={isSplitting ? { x: '100vw', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } : { width: '60%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-[1px]"
            style={{
              background: 'linear-gradient(90deg, #E4C98A, #C9A96E, transparent)',
            }}
          />
        </div>
      </div>

      {/* Bottom half: Text & Tagline */}
      <div className="flex flex-col items-center">
        {/* LEDGER text staggered fade-in */}
        <div className="flex items-center justify-center mt-6 mb-2">
          {letters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={isSplitting ? { opacity: 0, transition: { duration: 0.3 } } : { opacity: 1 }}
              transition={{ 
                delay: 0.5 + index * 0.06, 
                duration: 0.3 
              }}
              className="text-[32px] font-extrabold text-white/92 tracking-[0.25em]"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                marginRight: index === letters.length - 1 ? '-0.25em' : '0',
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isSplitting ? { opacity: 0, transition: { duration: 0.3 } } : { opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          className="text-[11px] font-body text-[#C9A96E]"
          style={{
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginRight: '-0.3em',
          }}
        >
          Know Your Finance
        </motion.p>
      </div>
    </div>
  );
}
