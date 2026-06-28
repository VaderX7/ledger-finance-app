'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { fetchFDRates, TenureRate } from '@/lib/data-fetcher';

const PRODUCT_TO_FD_ID: Record<string, string> = {
  'sbi-fd': 'sbi_fd_001',
  'hdfc-fd': 'hdfc_fd_001',
  'equitas-fd': 'equitas_fd_001',
  'bajaj-fd': 'bajaj_fd_001',
  'icici-fd': 'icici_fd_001',
  'sbi_fd_001': 'sbi_fd_001',
  'hdfc_fd_001': 'hdfc_fd_001',
  'equitas_fd_001': 'equitas_fd_001',
  'bajaj_fd_001': 'bajaj_fd_001',
  'icici_fd_001': 'icici_fd_001',
};

interface FDTenureRatesProps {
  productId: string;
  accentColor?: string;
  hideHeader?: boolean;
}

export default function FDTenureRates({ productId, accentColor = '#C9A96E', hideHeader = false }: FDTenureRatesProps) {
  const [rates, setRates] = useState<TenureRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fdId = PRODUCT_TO_FD_ID[productId] || productId;

  useEffect(() => {
    let cancelled = false;
    fetchFDRates(fdId).then((data) => {
      if (!cancelled) {
        setRates(data);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setError(true);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [fdId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {!hideHeader && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full animate-pulse" style={{ background: `${accentColor}30` }} />
            <div className="h-3 w-40 rounded animate-pulse bg-white/10" />
          </div>
        )}
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 rounded-lg animate-pulse bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (error || rates.length === 0) return null;

  const maxGeneral = Math.max(...rates.map((r) => r.rate_general));
  const COLS = ['Tenure', 'General %', 'Senior %'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="space-y-3"
    >
      {!hideHeader && (
        <h3
          className="text-[13px] text-white/80 flex items-center gap-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
        >
          <TrendingUp size={14} style={{ color: accentColor }} />
          Tenure-wise Interest Rates
        </h3>
      )}

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10" style={{ background: 'rgba(7, 10, 18, 0.95)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {COLS.map((col, idx) => (
                  <th
                    key={col}
                    className={`px-2 py-2 text-[10px] uppercase tracking-wider font-semibold text-white/30 ${
                      idx === 0 ? 'w-[46%]' : 'w-[27%]'
                    }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rates.map((rate, idx) => {
                const isSpecial = rate.is_special_tenure === 'Yes';
                const isBest = rate.rate_general === maxGeneral;
                return (
                  <motion.tr
                    key={`${rate.fd_id}-${idx}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * idx, duration: 0.25 }}
                    style={{
                      borderBottom: idx < rates.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      background: isBest
                        ? 'rgba(34, 197, 94, 0.08)'
                        : isSpecial
                          ? `${accentColor}08`
                          : 'transparent',
                    }}
                  >
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1">
                        {isSpecial && <span className="text-[11px] flex-shrink-0">⭐</span>}
                        <span
                          className="text-[11px] font-medium truncate"
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            color: isBest ? '#22C55E' : 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {rate.tenure_label}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className="text-[11px] font-bold"
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          color: isBest ? '#22C55E' : accentColor,
                        }}
                      >
                        {rate.rate_general}%
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className="text-[11px] font-bold"
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          color: isBest ? '#22C55E' : '#2DD4BF',
                        }}
                      >
                        {rate.rate_senior}%
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
