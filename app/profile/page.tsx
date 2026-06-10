'use client';

import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Bell, Globe, ChevronRight, Moon, HelpCircle, FileText, Info, LogOut, X, Check, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/context/LanguageContext';
import { getFavourites, toggleFavourite, FavouriteItem } from '@/lib/favourites';
import { BANK_LOGO_MAP, LOGO_BG_MAP } from '@/components/product-category-view';

type SettingItem = {
  key?: string;
  label: string;
  sub: string;
  icon: React.ElementType;
  toggle: boolean;
  defaultOn?: boolean;
};

function ToggleSwitch({ on, color }: { on: boolean; color: string }) {
  return (
    <div
      className="relative rounded-full transition-colors duration-300"
      style={{
        background: on ? `${color}55` : 'rgba(255,255,255,0.08)',
        width: 40, height: 22,
        border: on ? `1px solid ${color}66` : '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <motion.div
        animate={{ x: on ? 18 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute rounded-full"
        style={{ background: on ? color : 'rgba(255,255,255,0.3)', width: 17, height: 17, top: 2 }}
      />
    </div>
  );
}

function LanguageSelectSheet({
  isOpen,
  currentLang,
  onSelect,
  onClose,
  t,
}: {
  isOpen: boolean;
  currentLang: string;
  onSelect: (lang: any) => void;
  onClose: () => void;
  t: any;
}) {
  const options = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिंदी (Hindi)' },
    { id: 'hinglish', label: 'Hinglish' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 max-w-md mx-auto"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-[#0D1220] rounded-t-3xl z-50 overflow-hidden"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 -4px 40px rgba(0, 0, 0, 0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-1 rounded-full bg-white/10" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.88)',
                  fontSize: 15,
                }}
              >
                {t.language}
              </p>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 transition-all">
                <X size={18} className="text-white/40" />
              </button>
            </div>
            <div className="px-4 py-3 max-h-80 overflow-y-auto space-y-1 pb-8">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelect(opt.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-left"
                  style={{
                    background: currentLang === opt.id ? 'rgba(45, 212, 191, 0.08)' : 'transparent',
                    border: currentLang === opt.id ? '1px solid rgba(45, 212, 191, 0.15)' : '1px solid transparent',
                  }}
                >
                  <span
                    className="font-body text-[13px] font-semibold"
                    style={{ color: currentLang === opt.id ? '#2DD4BF' : 'rgba(255, 255, 255, 0.65)' }}
                  >
                    {opt.label}
                  </span>
                  {currentLang === opt.id && <Check size={14} className="text-[#2DD4BF]" />}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function ProfilePage() {
  const { lang, setLang, t } = useLang();
  const router = useRouter();
  const [isLangSheetOpen, setIsLangSheetOpen] = useState(false);
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
  const [isFavsExpanded, setIsFavsExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'bank' | 'savings' | 'current' | 'fds' | 'creditcards' | 'loans' | 'govtschemes' | 'insurance'>('all');

  useEffect(() => {
    setFavourites(getFavourites());
  }, []);

  const handleRemoveFavourite = (id: string) => {
    const item = favourites.find(f => f.id === id);
    if (item) {
      toggleFavourite(item);
      setFavourites(getFavourites());
    }
  };

  const handleToggleExpand = () => {
    const next = !isFavsExpanded;
    setIsFavsExpanded(next);
    if (next) {
      setFavourites(getFavourites());
    }
  };

  const filterPills: { id: typeof filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'bank', label: 'Banks' },
    { id: 'savings', label: 'Savings' },
    { id: 'current', label: 'Current' },
    { id: 'fds', label: 'FDs' },
    { id: 'creditcards', label: 'Credit Cards' },
    { id: 'loans', label: 'Loans' },
    { id: 'govtschemes', label: 'Schemes' },
    { id: 'insurance', label: 'Insurance' },
  ];

  const settings: { group: string; icon: any; color: string; items: SettingItem[] }[] = [
    {
      group: t.privacy,
      icon: Shield,
      color: '#C9A96E',
      items: [
        { label: t.anonymousMode, sub: t.anonymousModeSub, icon: EyeOff, toggle: true, defaultOn: true },
        { label: t.clearHistory, sub: t.clearHistorySub, icon: Eye, toggle: false },
      ],
    },
    {
      group: t.notifications,
      icon: Bell,
      color: '#38BDF8',
      items: [
        { label: t.rateAlerts, sub: t.rateAlertsSub, icon: Bell, toggle: true, defaultOn: false },
        { label: t.newSchemes, sub: t.newSchemesSub, icon: Globe, toggle: true, defaultOn: true },
      ],
    },
    {
      group: t.preferences,
      icon: Moon,
      color: '#2DD4BF',
      items: [
        { label: t.darkMode, sub: t.darkModeSub, icon: Moon, toggle: true, defaultOn: true },
        { key: 'language', label: t.language, sub: lang === 'hi' ? 'हिंदी (Hindi)' : lang === 'hinglish' ? 'Hinglish' : 'English', icon: Globe, toggle: false },
      ],
    },
    {
      group: t.support,
      icon: HelpCircle,
      color: '#FB7185',
      items: [
        { label: t.helpFAQ, sub: t.helpFAQSub, icon: HelpCircle, toggle: false },
        { label: t.privacyPolicy, sub: t.privacyPolicySub, icon: FileText, toggle: false },
        { label: t.aboutApp, sub: t.version, icon: Info, toggle: false },
      ],
    },
  ];

  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    settings.forEach((g) =>
      g.items.forEach((item: SettingItem) => {
        if (item.toggle) init[item.label] = item.defaultOn ?? false;
      })
    );
    return init;
  });

  const handleLogout = () => {
    localStorage.removeItem('ledger_setup_done');
    localStorage.removeItem('ledger_user');
    router.replace('/setup');
  };

  let savedName = '';
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('ledger_user') : null;
    if (raw) savedName = JSON.parse(raw)?.name ?? '';
  } catch {}

  return (
    <div className="min-h-screen bg-[#070A12] px-5 pt-14 pb-28">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <h1
          className="text-[28px] tracking-[-0.04em] text-white/95 mb-1"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
        >
          {t.profileTitle}
        </h1>
        <p className="font-body text-[13px] text-white/35">{t.profileSub}</p>
      </motion.div>

      {/* Identity card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl p-5 mb-7"
        style={{
          background: 'linear-gradient(135deg, rgba(201,169,110,0.1) 0%, rgba(13,18,32,0.95) 80%)',
          border: '1px solid rgba(201,169,110,0.2)',
        }}
      >
        <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full blur-3xl" style={{ background: 'rgba(201,169,110,0.06)' }} />
        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.25)' }}
          >
            {savedName ? (
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: '#C9A96E', fontSize: 22 }}>
                {savedName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <Shield size={26} style={{ color: '#C9A96E' }} strokeWidth={1.5} />
            )}
          </div>
          <div>
            <p
              className="text-[18px] text-white/90"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
            >
              {savedName || t.anonymousUser}
            </p>
            <p className="font-body text-[11px] text-white/40 mt-0.5">{t.noAccountNeeded}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
              <span className="font-body text-[10px] text-[#2DD4BF]">{t.fullyProtected}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Favourites section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl overflow-hidden mb-7"
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Header Button */}
        <motion.button
          whileTap={{ scale: 0.99 }}
          onClick={handleToggleExpand}
          className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,169,110,0.15)' }}
            >
              <Star size={14} style={{ color: '#C9A96E' }} strokeWidth={2} fill="#C9A96E" />
            </div>
            <div>
              <p className="text-[14px] text-white/90" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                My Favourites
              </p>
              <p className="font-body text-[10px] text-white/30">Manage your saved institutions and accounts</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-body"
              style={{
                background: favourites.length > 0 ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.06)',
                color: favourites.length > 0 ? '#C9A96E' : 'rgba(255,255,255,0.4)',
                border: favourites.length > 0 ? '1px solid rgba(201,169,110,0.3)' : '1px solid transparent',
              }}
            >
              {favourites.length}
            </span>
            <ChevronRight
              size={15}
              className="text-white/20 transition-transform duration-200"
              style={{ transform: isFavsExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
            />
          </div>
        </motion.button>

        {/* Collapsible Content */}
        <AnimatePresence initial={false}>
          {isFavsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1 border-t border-white/[0.04] space-y-4">
                
                {/* Horizontally scrollable filter pills */}
                {favourites.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {filterPills.map((pill) => {
                      const isActive = filter === pill.id;
                      return (
                        <button
                          key={pill.id}
                          onClick={() => setFilter(pill.id)}
                          className="px-3 py-1.5 rounded-full text-[10px] font-bold font-body whitespace-nowrap cursor-pointer transition-all border"
                          style={{
                            background: isActive ? 'rgba(201,169,110,0.18)' : 'transparent',
                            color: isActive ? '#C9A96E' : 'rgba(255,255,255,0.4)',
                            borderColor: isActive ? 'rgba(201,169,110,0.3)' : 'rgba(255,255,255,0.06)',
                          }}
                        >
                          {pill.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* List of Favourited Items */}
                {favourites.length > 0 ? (
                  <div className="space-y-3">
                    {favourites
                      .filter((item) => filter === 'all' || item.type === filter)
                      .map((item) => {
                        const isBank = item.type === 'bank';
                        if (isBank) {
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="relative overflow-hidden rounded-2xl p-4 border-l-[3px] flex items-center gap-3"
                              style={{
                                background: `linear-gradient(135deg, ${item.color}12 0%, ${item.colorAccent}08 100%)`,
                                borderTop: `1px solid ${item.color}28`,
                                borderRight: `1px solid ${item.color}28`,
                                borderBottom: `1px solid ${item.color}28`,
                                borderLeftColor: item.color,
                              }}
                            >
                              {/* Logo */}
                              <div 
                                className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center p-[6px] overflow-hidden"
                                style={{
                                  background: LOGO_BG_MAP[item.lender] ?? '#FFFFFF',
                                  border: `1px solid ${item.color}40`,
                                  boxShadow: `0 0 10px ${item.color}35, 0 2px 8px rgba(0,0,0,0.15)`,
                                }}
                              >
                                <img
                                  src={`/logos/${BANK_LOGO_MAP[item.lender] || item.lender.toLowerCase().replace(/bank/gi, '').replace(/[^a-z0-9]/g, '').trim()}.png`}
                                  alt={`${item.lender} logo`}
                                  className="object-contain w-full h-full"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0 pr-8">
                                <h3 className="text-[15px] leading-tight text-white/95 truncate font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                  {item.lender}
                                </h3>
                                <p className="font-body text-[9px] text-[#C9A96E]/80 mt-1 font-semibold uppercase tracking-wider">
                                  Saved Bank
                                </p>
                              </div>
                              
                              {/* Star Button */}
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFavourite(item.id);
                                }}
                                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/30 cursor-pointer"
                              >
                                <Star size={14} className="text-[#C9A96E]" fill="#C9A96E" />
                              </motion.button>
                            </motion.div>
                          );
                        }

                        // Replicated Account Card
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative overflow-hidden rounded-2xl p-4 flex flex-col justify-between"
                            style={{
                              background: `linear-gradient(135deg, color-mix(in srgb, ${item.color} 22%, transparent) 0%, color-mix(in srgb, ${item.colorAccent} 8%, transparent) 100%), #0d1117`,
                              borderTop: `1px solid color-mix(in srgb, ${item.color} 50%, transparent)`,
                              borderRight: `1px solid color-mix(in srgb, ${item.color} 50%, transparent)`,
                              borderBottom: `1px solid color-mix(in srgb, ${item.color} 50%, transparent)`,
                              borderLeft: `6px solid ${item.color}`,
                            }}
                          >
                            {/* Header Row */}
                            <div className="flex items-center gap-3 min-w-0 pr-8">
                              {/* Logo */}
                              <div 
                                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center p-[6px] overflow-hidden"
                                style={{
                                  background: LOGO_BG_MAP[item.lender] ?? '#FFFFFF',
                                  border: `1px solid color-mix(in srgb, ${item.color} 40%, transparent)`,
                                  boxShadow: `0 0 10px color-mix(in srgb, ${item.color} 35%, transparent), 0 2px 8px rgba(0,0,0,0.15)`,
                                }}
                              >
                                <img
                                  src={`/logos/${BANK_LOGO_MAP[item.lender] || item.lender.toLowerCase().replace(/bank/gi, '').replace(/[^a-z0-9]/g, '').trim()}.png`}
                                  alt={item.lender}
                                  className="w-full h-full object-contain"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              </div>
                              
                              <div className="flex flex-col min-w-0">
                                <span className="text-[13px] font-bold text-white leading-tight truncate">
                                  {item.lender}
                                </span>
                                <span className="text-[10px] text-white/40 leading-tight mt-0.5 font-body uppercase tracking-wider font-semibold">
                                  {item.type}
                                </span>
                              </div>
                            </div>
                            
                            <div className="border-t border-white/[0.05] my-3" />
                            
                            <div>
                              <h3 className="text-[16px] font-bold text-white tracking-tight leading-snug pr-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {item.name}
                              </h3>
                            </div>
                            
                            {/* Star Button */}
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFavourite(item.id);
                                }}
                              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/30 cursor-pointer"
                            >
                              <Star size={14} className="text-[#C9A96E]" fill="#C9A96E" />
                            </motion.button>
                          </motion.div>
                        );
                      })}
                      
                    {favourites.filter((item) => filter === 'all' || item.type === filter).length === 0 && (
                      <div className="text-center py-8 text-white/25 font-body text-xs">
                        No saved items in this category
                      </div>
                    )}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/[0.05] mb-3">
                      <Star size={20} className="text-white/20" />
                    </div>
                    <p className="text-[13px] text-white/70 font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      No favourites yet
                    </p>
                    <p className="font-body text-[11px] text-white/35 mt-1 max-w-[240px] leading-relaxed">
                      Tap the ★ on any bank or account to save it here
                    </p>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Settings groups */}
      <div className="space-y-3">
        {settings.map((group, gi) => {
          const GroupIcon = group.icon;
          return (
            <motion.div
              key={group.group}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.09 + 0.22, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2.5 px-5 pt-4 pb-2">
                <GroupIcon size={13} style={{ color: group.color, opacity: 0.8 }} strokeWidth={2} />
                <span
                  className="text-[10px] tracking-widest uppercase"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: `${group.color}99` }}
                >
                  {group.group}
                </span>
              </div>
              <div className="pb-2">
                {group.items.map((item, ii) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        if (item.toggle) {
                          setToggles((t) => ({ ...t, [item.label]: !t[item.label] }));
                        } else if (item.key === 'language') {
                          setIsLangSheetOpen(true);
                        }
                      }}
                      className="w-full flex items-center justify-between px-5 py-3.5 transition-colors text-left"
                      style={{ borderTop: ii > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${group.color}12` }}
                        >
                          <ItemIcon size={14} style={{ color: group.color, opacity: 0.8 }} strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-[13px] text-white/75"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                            {item.label}
                          </p>
                          <p className="font-body text-[10px] text-white/28">{item.sub}</p>
                        </div>
                      </div>
                      {item.toggle ? (
                        <ToggleSwitch on={toggles[item.label] ?? false} color={group.color} />
                      ) : (
                        <ChevronRight size={15} className="text-white/20" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Logout button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-5"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5"
          style={{ background: 'rgba(251,113,133,0.07)', border: '1px solid rgba(251,113,133,0.18)' }}
        >
          <LogOut size={15} style={{ color: '#FB7185' }} strokeWidth={2} />
          <span
            className="text-[14px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: '#FB7185' }}
          >
            {t.logout}
          </span>
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="font-body text-center text-[10px] text-white/20 mt-6 mb-4 leading-relaxed"
      >
        {t.footerNote}
      </motion.p>

      <LanguageSelectSheet
        isOpen={isLangSheetOpen}
        currentLang={lang}
        onSelect={setLang}
        onClose={() => setIsLangSheetOpen(false)}
        t={t}
      />
    </div>
  );
}