'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Search, Wallet, User } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLang();

  // Hide nav on setup page
  if (pathname === '/setup') return null;

  const navItems = [
    { href: '/', label: t.navHome, icon: Home },
    { href: '/search', label: t.navSearch, icon: Search },
    { href: '/myfinance', label: t.navMyFinance ?? 'My Finance', icon: Wallet },
    { href: '/profile', label: t.navProfile, icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 mx-auto max-w-md z-30"
      style={{
        background: 'rgba(7, 10, 18, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 -1px 32px rgba(0,0,0,0.6)',
      }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.4 }}
        className="flex items-center justify-around px-2 pt-2 pb-safe"
        style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className="relative flex-1">
              <div className="flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all duration-200 group">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(201, 169, 110, 0.07)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <div className="relative z-10">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={`transition-all duration-200 ${isActive ? 'text-[#C9A96E]' : 'text-white/30 group-hover:text-white/50'}`}
                  />
                </div>
                <span
                  className={`relative z-10 text-[10px] font-body font-medium tracking-wide transition-all duration-200 ${isActive ? 'text-[#C9A96E]' : 'text-white/25 group-hover:text-white/45'}`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                    style={{ background: '#C9A96E', boxShadow: '0 0 6px #C9A96E88' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}
