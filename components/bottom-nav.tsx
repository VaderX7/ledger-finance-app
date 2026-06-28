'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';
import { Home, Search, Calculator, User } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { useEffect } from 'react';

const TAB_COLORS: Record<string, string> = {
  '/': '#C9A96E',
  '/search': '#00E5FF',
  '/tools': '#00F5A0',
  '/profile': '#8B5CF6',
};

const ease = [0.22, 1, 0.36, 1] as const;

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function NavTab({
  href,
  label,
  Icon,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  Icon: typeof Home;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const controls = useAnimation();

  useEffect(() => {
    if (isActive) {
      controls.start({
        scale: [1, 1.25, 1],
        transition: { duration: 0.3, ease: 'easeInOut' },
      });
    }
  }, [isActive, controls]);

  const color = TAB_COLORS[href] || '#C9A96E';
  const rgb = hexToRgb(color);

  return (
    <Link href={href} onClick={onClick} className="relative flex-1">
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-2 mx-1"
        animate={{
          backgroundColor: isActive ? `rgba(${rgb}, 0.12)` : 'rgba(0,0,0,0)',
          borderColor: isActive ? `rgba(${rgb}, 0.2)` : 'rgba(0,0,0,0)',
          boxShadow: isActive ? `0 0 16px rgba(${rgb}, 0.2)` : '0 0 0px rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.2, ease }}
        style={{
          border: '1px solid transparent',
        }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div animate={controls}>
          <Icon
            size={20}
            fill={isActive ? color : 'none'}
            strokeWidth={isActive ? 1.5 : 1.75}
            style={{
              color: isActive ? color : 'rgba(255,255,255,0.3)',
              transition: 'color 0.2s ease',
            }}
          />
        </motion.div>
        <motion.span
          className="text-[10px] font-body font-medium tracking-wide"
          animate={{
            y: isActive ? 0 : 0,
            opacity: isActive ? 1 : 1,
            color: isActive ? color : 'rgba(255,255,255,0.3)',
          }}
          transition={{ duration: 0.2, ease }}
        >
          {label}
        </motion.span>
      </motion.div>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLang();

  if (pathname === '/setup') return null;

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href === '/') {
      if (pathname === '/') {
        // do nothing
      } else {
        router.push(href);
      }
    } else if (pathname.startsWith(href) && pathname !== href) {
      router.back();
    } else {
      router.push(href);
    }
  };

  const navItems = [
    { href: '/', label: t.navHome, icon: Home },
    { href: '/search', label: t.navSearch, icon: Search },
    { href: '/tools', label: t.navTools ?? 'Tools', icon: Calculator },
    { href: '/profile', label: t.navProfile, icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 mx-auto max-w-md z-30"
      style={{
        background: 'rgba(7,10,18,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 -1px 32px rgba(0,0,0,0.6)',
      }}
    >
      {/* Top gold shimmer accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)',
        }}
      />
      {/* Top border */}
      <div
        className="absolute top-[2px] left-0 right-0 h-px"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      />

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.4 }}
        className="flex items-center justify-around px-2 pt-2 pb-safe"
        style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <NavTab
              key={item.href}
              href={item.href}
              label={item.label}
              Icon={Icon}
              isActive={isActive}
              onClick={(e) => handleNavClick(e, item.href)}
            />
          );
        })}
      </motion.div>
    </nav>
  );
}
