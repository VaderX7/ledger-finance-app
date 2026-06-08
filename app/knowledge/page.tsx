'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronRight, Percent, TrendingUp, Shield, Info } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

export default function KnowledgePage() {
  const [openSection, setOpenSection] = useState<number | null>(0);
  const { t } = useLang();

  const articles = [
    {
      category: t.loans,
      color: '#C9A96E',
      icon: Percent,
      items: [
        { title: 'How are personal loan interest rates calculated?', summary: 'Understanding reducing balance vs flat rate methods and how lenders assess your profile.', readTime: '4 min' },
        { title: 'CIBIL score impact on loan eligibility', summary: 'Why 750+ matters and what lenders look at beyond just the score.', readTime: '3 min' },
        { title: 'Secured vs unsecured loans explained', summary: 'Trade-offs between collateral-backed and clean loan products.', readTime: '5 min' },
      ],
    },
    {
      category: t.fds,
      color: '#2DD4BF',
      icon: TrendingUp,
      items: [
        { title: 'FD vs Debt Mutual Funds: which wins?', summary: 'Tax-adjusted returns comparison over 1, 3, and 5 year horizons.', readTime: '6 min' },
        { title: 'DICGC insurance on bank deposits', summary: 'What the ₹5 lakh guarantee covers and its limitations.', readTime: '3 min' },
      ],
    },
    {
      category: t.govtschemes,
      color: '#FB7185',
      icon: Shield,
      items: [
        { title: 'Complete guide to PM Mudra Yojana', summary: 'Shishu, Kishore, Tarun — eligibility, application, and disbursement.', readTime: '7 min' },
        { title: 'Atal Pension Yojana: all you need to know', summary: 'Guaranteed pension options, contribution tables, and exit terms.', readTime: '5 min' },
        { title: 'PM Kisan Samman Nidhi: who qualifies?', summary: 'Land holding criteria, exclusions, and how to check payment status.', readTime: '4 min' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#070A12] px-5 pt-14 pb-28">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <h1 className="text-[28px] tracking-[-0.04em] text-white/95 mb-1"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
          {t.knowledgeTitle}
        </h1>
        <p className="font-body text-[13px] text-white/35">{t.knowledgeSub}</p>
      </motion.div>

      {/* Featured banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl p-5 mb-7"
        style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(45,212,191,0.06))', border: '1px solid rgba(56,189,248,0.18)' }}
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl" style={{ background: 'rgba(56,189,248,0.1)' }} />
        <div className="relative z-10 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(56,189,248,0.15)' }}>
            <BookOpen size={17} style={{ color: '#38BDF8' }} strokeWidth={1.75} />
          </div>
          <div>
            <span className="font-body text-[9px] tracking-widest uppercase text-[#38BDF8]/60">{t.featured}</span>
            <h2 className="text-[15px] text-white/90 leading-snug mt-0.5"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
              {t.featuredTitle}
            </h2>
            <p className="font-body text-[11px] text-white/40 mt-1.5 leading-relaxed">{t.featuredSub}</p>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-6"
        style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.12)' }}
      >
        <Info size={13} style={{ color: '#C9A96E', opacity: 0.7, marginTop: 1 }} className="flex-shrink-0" />
        <p className="font-body text-[10.5px] text-white/35 leading-relaxed">{t.disclaimer}</p>
      </motion.div>

      {/* Accordion */}
      <div className="space-y-3">
        {articles.map((section, i) => {
          const Icon = section.icon;
          const isOpen = openSection === i;
          return (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button onClick={() => setOpenSection(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${section.color}18` }}>
                    <Icon size={17} style={{ color: section.color }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[14px] text-white/85"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                      {section.category}
                    </p>
                    <p className="font-body text-[10px] text-white/30">{section.items.length} {t.articles}</p>
                  </div>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={16} className="text-white/30" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-5 pb-4 space-y-1 border-t border-white/[0.05] pt-3">
                      {section.items.map((article) => (
                        <motion.div key={article.title} whileTap={{ scale: 0.99 }}
                          className="flex items-start justify-between gap-3 p-3.5 rounded-xl cursor-pointer"
                          style={{ background: 'rgba(255,255,255,0.025)' }}>
                          <div className="flex-1">
                            <p className="text-[12px] text-white/75 leading-snug mb-1"
                              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                              {article.title}
                            </p>
                            <p className="font-body text-[10.5px] text-white/32 leading-relaxed">{article.summary}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <span className="font-body text-[9px] text-white/25">{article.readTime}</span>
                            <ChevronRight size={12} style={{ color: section.color, opacity: 0.7 }} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}