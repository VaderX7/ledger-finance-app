'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, CreditCard, PiggyBank, Landmark, Calculator, BarChart2, Sparkles, Brain, AlertCircle } from 'lucide-react';
import { products, Product } from '@/lib/products';
import ProductDetailPage from '@/components/product-detail-page';
import { useLang } from '@/context/LanguageContext';
import { TranslationKey } from '@/lib/i18n';
import { useSearchParams } from 'next/navigation';

// ── Shared helpers ──────────────────────────────────────────────────────────

function formatINR(n: number): string {
  if (isNaN(n) || !isFinite(n)) return '—';
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function InputField({
  label, value, onChange, prefix, suffix, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; suffix?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="font-body text-[10px] uppercase tracking-widest text-white/35 mb-1.5 block"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-body text-[13px] text-white/40">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? '0'}
          className="w-full py-3 rounded-xl font-body text-[14px] text-white/85 outline-none"
          style={{
            paddingLeft: prefix ? '2rem' : '1rem',
            paddingRight: suffix ? '3rem' : '1rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}
        />
        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-body text-[11px] text-white/35">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function ResultBox({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl px-4 py-3.5" style={{ background: `${accent}12`, border: `1px solid ${accent}28` }}>
      <p className="font-body text-[10px] uppercase tracking-widest mb-1" style={{ color: `${accent}99` }}>{label}</p>
      <p className="text-[22px] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: accent }}>
        {value}
      </p>
    </div>
  );
}

// ── Tool: SIP Calculator ────────────────────────────────────────────────────
function SIPCalculator() {
  const { t, lang } = useLang();
  const [monthly, setMonthly] = useState('5000');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('10');

  const m = parseFloat(monthly) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseFloat(years) || 0) * 12;

  const maturity = r > 0 ? m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : m * n;
  const invested = m * n;
  const gains = maturity - invested;

  return (
    <div className="space-y-4">
      <InputField label={t.monthlyInvestment} value={monthly} onChange={setMonthly} prefix="₹" placeholder="5000" />
      <InputField label={t.expectedReturn} value={rate} onChange={setRate} suffix="% p.a." placeholder="12" />
      <InputField label={t.investmentPeriod} value={years} onChange={setYears} suffix={lang === 'hi' ? 'वर्ष' : lang === 'hinglish' ? 'saal' : 'years'} placeholder="10" />
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <ResultBox label={t.maturityAmount} value={formatINR(maturity)} accent="#00F5A0" />
        <ResultBox label={t.totalInvested} value={formatINR(invested)} accent="#C9A96E" />
      </div>
      <ResultBox label={t.estimatedGains} value={formatINR(gains)} accent="#2DD4BF" />
    </div>
  );
}

// ── Tool: EMI Calculator ────────────────────────────────────────────────────
function EMICalculator() {
  const { t, lang } = useLang();
  const [loan, setLoan] = useState('500000');
  const [rate, setRate] = useState('10.5');
  const [tenure, setTenure] = useState('5');

  const P = parseFloat(loan) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseFloat(tenure) || 0) * 12;

  const emi = r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n;
  const total = emi * n;
  const interest = total - P;

  return (
    <div className="space-y-4">
      <InputField label={t.loanAmount} value={loan} onChange={setLoan} prefix="₹" placeholder="500000" />
      <InputField label={t.annualInterestRate} value={rate} onChange={setRate} suffix="% p.a." placeholder="10.5" />
      <InputField label={t.loanTenure} value={tenure} onChange={setTenure} suffix={lang === 'hi' ? 'वर्ष' : lang === 'hinglish' ? 'saal' : 'years'} placeholder="5" />
      <ResultBox label={t.monthlyEMI} value={formatINR(emi)} accent="#FB7185" />
      <div className="grid grid-cols-2 gap-2.5">
        <ResultBox label={t.totalPayment} value={formatINR(total)} accent="#C9A96E" />
        <ResultBox label={t.totalInterest} value={formatINR(interest)} accent="#FF9933" />
      </div>
    </div>
  );
}

// ── Tool: FD Maturity Calculator ────────────────────────────────────────────
function FDCalculator() {
  const { t, lang } = useLang();
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('7.5');
  const [years, setYears] = useState('3');

  const P = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const tVal = parseFloat(years) || 0;
  const n = 4; // quarterly compounding

  const maturity = P * Math.pow(1 + r / n, n * tVal);
  const interest = maturity - P;

  return (
    <div className="space-y-4">
      <InputField label={t.principalAmount} value={principal} onChange={setPrincipal} prefix="₹" placeholder="100000" />
      <InputField label={t.annualInterestRate} value={rate} onChange={setRate} suffix="% p.a." placeholder="7.5" />
      <InputField label={t.tenure} value={years} onChange={setYears} suffix={lang === 'hi' ? 'वर्ष' : lang === 'hinglish' ? 'saal' : 'years'} placeholder="3" />
      <ResultBox label={t.maturityAmount} value={formatINR(maturity)} accent="#00F5A0" />
      <div className="grid grid-cols-2 gap-2.5">
        <ResultBox label={t.principal} value={formatINR(P)} accent="#C9A96E" />
        <ResultBox label={t.interestEarned} value={formatINR(interest)} accent="#2DD4BF" />
      </div>
    </div>
  );
}

// ── Tool: Loan Eligibility ───────────────────────────────────────────────────
function LoanEligibility() {
  const { t, lang } = useLang();
  const [salary, setSalary] = useState('60000');
  const [expenses, setExpenses] = useState('20000');
  const [rate, setRate] = useState('10.5');
  const [tenure, setTenure] = useState('5');

  const net = (parseFloat(salary) || 0) - (parseFloat(expenses) || 0);
  const emiCapacity = net * 0.5; // 50% FOIR
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseFloat(tenure) || 0) * 12;

  const maxLoan = r > 0
    ? emiCapacity * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)))
    : emiCapacity * n;

  return (
    <div className="space-y-4">
      <InputField label={t.monthlySalary} value={salary} onChange={setSalary} prefix="₹" placeholder="60000" />
      <InputField label={t.monthlyExpenses} value={expenses} onChange={setExpenses} prefix="₹" placeholder="20000" />
      <InputField label={t.expectedInterestRate} value={rate} onChange={setRate} suffix="% p.a." placeholder="10.5" />
      <InputField label={t.loanTenure} value={tenure} onChange={setTenure} suffix={lang === 'hi' ? 'वर्ष' : lang === 'hinglish' ? 'saal' : 'years'} placeholder="5" />
      <ResultBox label={t.maxLoanEligibility} value={formatINR(maxLoan)} accent="#00E5FF" />
      <div className="grid grid-cols-2 gap-2.5">
        <ResultBox label={t.netMonthlyIncome} value={formatINR(net)} accent="#C9A96E" />
        <ResultBox label={t.emiCapacity} value={formatINR(emiCapacity)} accent="#FB7185" />
      </div>
    </div>
  );
}

// ── Tool: Credit Card Payoff ─────────────────────────────────────────────────
function CreditCardPayoff() {
  const { t, lang } = useLang();
  const [outstanding, setOutstanding] = useState('50000');
  const [minPayment, setMinPayment] = useState('2500');
  const [rate, setRate] = useState('42');

  const balance = parseFloat(outstanding) || 0;
  const payment = parseFloat(minPayment) || 0;
  const monthlyRate = (parseFloat(rate) || 0) / 100 / 12;

  let months = 0;
  let totalPaid = 0;
  let b = balance;
  if (payment > 0 && monthlyRate > 0) {
    while (b > 0 && months < 600) {
      const interest = b * monthlyRate;
      const principal = payment - interest;
      if (principal <= 0) { months = 9999; break; }
      b -= principal;
      totalPaid += payment;
      months++;
    }
    if (b > 0 && months < 600) totalPaid += b;
  }

  const interestPaid = totalPaid - balance;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  const yLabel = lang === 'hi' ? 'वर्ष' : lang === 'hinglish' ? 'saal' : 'y';
  const mLabel = lang === 'hi' ? 'महीने' : lang === 'hinglish' ? 'mahine' : 'm';

  const timeStr = months >= 9999
    ? t.neverIncrease
    : `${years > 0 ? `${years}${yLabel} ` : ''}${remMonths}${mLabel}`;

  return (
    <div className="space-y-4">
      <InputField label={t.outstandingBalance} value={outstanding} onChange={setOutstanding} prefix="₹" placeholder="50000" />
      <InputField label={t.monthlyPayment} value={minPayment} onChange={setMinPayment} prefix="₹" placeholder="2500" />
      <InputField label={t.annualInterestRate} value={rate} onChange={setRate} suffix="% p.a." placeholder="42" />
      <ResultBox label={t.timeToPayOff} value={timeStr} accent="#2DD4BF" />
      <div className="grid grid-cols-2 gap-2.5">
        <ResultBox label={t.totalPayment} value={months < 9999 ? formatINR(totalPaid) : '—'} accent="#C9A96E" />
        <ResultBox label={t.interestPaid} value={months < 9999 ? formatINR(interestPaid) : '—'} accent="#FB7185" />
      </div>
    </div>
  );
}

// ── Tool: Tax on FD ──────────────────────────────────────────────────────────
function TaxOnFD() {
  const { t } = useLang();
  const [interest, setInterest] = useState('75000');
  const [slab, setSlab] = useState('30');

  const grossInterest = parseFloat(interest) || 0;
  const taxRate = parseFloat(slab) || 0;
  const tds = grossInterest * 0.10; // TDS at 10%
  const totalTax = grossInterest * (taxRate / 100);
  const additionalTax = Math.max(0, totalTax - tds);
  const postTax = grossInterest - totalTax;

  const slabs = [
    { label: t.nilSlab, value: '0' },
    { label: t.slab5, value: '5' },
    { label: t.slab20, value: '20' },
    { label: t.slab30, value: '30' },
  ];

  return (
    <div className="space-y-4">
      <InputField label={t.fdInterestEarned} value={interest} onChange={setInterest} prefix="₹" placeholder="75000" />
      <div>
        <label className="font-body text-[10px] uppercase tracking-widest text-white/35 mb-1.5 block"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
          {t.incomeTaxSlab}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {slabs.map((s) => (
            <button
              key={s.value}
              onClick={() => setSlab(s.value)}
              className="py-2.5 px-3 rounded-xl font-body text-[11px] text-left transition-all"
              style={{
                background: slab === s.value ? 'rgba(255,153,51,0.15)' : 'rgba(255,255,255,0.04)',
                border: slab === s.value ? '1px solid rgba(255,153,51,0.40)' : '1px solid rgba(255,255,255,0.08)',
                color: slab === s.value ? '#FF9933' : 'rgba(255,255,255,0.50)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <ResultBox label={t.postTaxReturns} value={formatINR(postTax)} accent="#00F5A0" />
      <div className="grid grid-cols-2 gap-2.5">
        <ResultBox label={t.tdsDeducted} value={formatINR(tds)} accent="#C9A96E" />
        <ResultBox label={t.totalTaxLiability} value={formatINR(totalTax)} accent="#FB7185" />
      </div>
      {additionalTax > 0 && (
        <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.18)' }}>
          <p className="font-body text-[11px] text-white/45 leading-relaxed">
            {t.additionalTaxNote(formatINR(additionalTax))}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Tool: AI Advisor ─────────────────────────────────────────────────────────
function AIAdvisor() {
  const { t, lang } = useLang();
  const [step, setStep] = useState<'form' | 'loading' | 'results'>('form');
  const [customPrompt, setCustomPrompt] = useState('');
  const [recommendations, setRecommendations] = useState<Array<{ productId: string; matchReason: string; estimatedValue: string; product: Product }>>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleGetAdvice = async () => {
    setError('');
    if (!customPrompt.trim()) {
      setError(lang === 'hi'
        ? 'कृपया बताएं आपको किस तरह की वित्तीय सलाह चाहिए।'
        : lang === 'hinglish'
        ? 'Please batao aapko kis tarah ki financial advice chahiye.'
        : 'Please describe what kind of financial advice you need.');
      return;
    }

    setStep('loading');
    try {
      const response = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customPrompt, language: lang }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setRecommendations(data.recommendations || []);
      setStep('results');
    } catch (err: any) {
      console.error(err);
      setError(err.message || (lang === 'hi'
        ? 'AI सलाहकार से कनेक्ट करने में विफल। कृपया अपनी API कुंजी जांचें।'
        : lang === 'hinglish'
        ? 'AI agent se connect nahi ho paya. Please apni API key check karein.'
        : 'Failed to connect to the AI agent. Please check your API key.'));
      setStep('form');
    }
  };

  if (selectedProduct) {
    return (
      <ProductDetailPage
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="space-y-5">
      {step === 'form' && (
        <div className="space-y-4">
          <p className="font-body text-[11px] text-white/50 leading-relaxed">
            {t.aiAdvisorCustomDesc}
          </p>

          {error && (
            <div className="p-3.5 rounded-xl flex items-start gap-2.5 bg-red-500/10 border border-red-500/20">
              <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="font-body text-[10px] text-red-300/80 leading-relaxed">{error}</p>
            </div>
          )}

          <div>
            <label className="font-body text-[10px] uppercase tracking-widest text-white/35 mb-1.5 block"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
              {t.describeFinancialSituation}
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={5}
              placeholder={t.customPromptPlaceholder}
              className="w-full p-4 rounded-xl font-body text-[13px] text-white/85 outline-none resize-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                lineHeight: '1.6',
              }}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleGetAdvice}
            className="w-full py-3.5 mt-2 rounded-xl font-body text-[12px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.25)',
            }}
          >
            <Sparkles size={14} />
            {t.askGeminiAdvisor}
          </motion.button>
        </div>
      )}

      {step === 'loading' && (
        <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="w-16 h-16 rounded-full border border-dashed border-purple-500/50 flex items-center justify-center"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain size={26} className="text-purple-400 animate-pulse" />
            </div>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-white/90" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t.aiAdvisorMatching}
            </p>
            <p className="font-body text-[10.5px] text-white/40 max-w-[220px] mx-auto mt-1 leading-relaxed">
              {t.aiAdvisorLoadingDesc}
            </p>
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="space-y-4">
          {/* Summary badge */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <span className="font-body text-[9px] uppercase tracking-wider text-white/30">{t.profileSummary}</span>
            <span className="font-body text-[9.5px] text-white/60 truncate max-w-[220px]">
              {t.customDescriptionInput}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1 -mx-1 px-1">
            {[
              { id: 'all', label: t.all },
              { id: 'savings', label: t.savings },
              { id: 'current', label: t.current },
              { id: 'fds', label: t.fds },
              { id: 'loans', label: t.loans },
              { id: 'creditcards', label: t.cards },
              { id: 'govtschemes', label: t.govtschemes },
              { id: 'insurance', label: t.insurance },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full font-body text-[10px] font-semibold transition-all cursor-pointer"
                style={{
                  background: selectedFilter === cat.id ? 'rgba(168, 85, 247, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                  border: selectedFilter === cat.id ? '1px solid rgba(168, 85, 247, 0.40)' : '1px solid rgba(255, 255, 255, 0.06)',
                  color: selectedFilter === cat.id ? '#C084FC' : 'rgba(255, 255, 255, 0.45)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {recommendations.length === 0 ? (
            <div className="py-8 text-center">
              <p className="font-body text-[11px] text-white/40">{t.noMatchesFound}</p>
              <button
                onClick={() => { setStep('form'); setSelectedFilter('all'); }}
                className="mt-3 px-4 py-2 rounded-xl font-body text-[10px] text-white/60 border border-white/10 cursor-pointer"
              >
                {t.goBack}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {(() => {
                const filteredRecs = selectedFilter === 'all'
                  ? recommendations
                  : recommendations.filter((rec) => rec.product?.category === selectedFilter);

                if (filteredRecs.length === 0) {
                  return (
                    <div className="py-8 text-center border border-white/[0.04] rounded-2xl bg-white/[0.01]">
                      <p className="font-body text-[11px] text-white/40">{t.noRecommendations}</p>
                    </div>
                  );
                }

                return filteredRecs.map((rec, i) => {
                  const product = rec.product;
                  if (!product) return null;

                  const catLabels: Record<string, string> = {
                    savings: t.savingsLabel,
                    current: t.currentLabel,
                    fds: t.fdsLabel,
                    creditcards: t.creditcardsLabel,
                    loans: t.loansLabel,
                    govtschemes: t.govtschemesLabel,
                    insurance: t.insuranceLabel,
                  };

                return (
                  <motion.div
                    key={rec.productId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedProduct(product)}
                    className="rounded-2xl p-5 text-left border cursor-pointer transition-all"
                    style={{
                      borderColor: `${product.color}30`,
                      background: `linear-gradient(135deg, ${product.color}10 0%, ${product.colorAccent}05 100%)`,
                    }}
                  >
                    {/* Category + Estimated Value */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-body text-[10px] uppercase tracking-wider text-white/35">
                        {catLabels[product.category] || product.category}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-lg font-body text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: `${product.color}20`, color: product.colorAccent }}
                      >
                        {rec.estimatedValue}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h4 className="text-[17px] leading-tight text-white/95 mb-1"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
                      {product.name}
                    </h4>
                    <p className="font-body text-[11px] text-white/35 mb-3">
                      {lang === 'hi' ? `${product.lender} द्वारा` : lang === 'hinglish' ? `${product.lender} ke dwara` : `By ${product.lender}`}
                    </p>

                    {/* AI Summary — the key insight */}
                    <div className="pl-4 py-3 my-1 border-l-[3px] border-purple-500/60 bg-purple-500/[0.07] rounded-r-xl">
                      <p className="font-body text-[11.5px] text-white/65 leading-relaxed">
                        {rec.matchReason}
                      </p>
                    </div>

                    {/* Tap to view */}
                    <div className="flex items-center justify-end mt-3 pt-2 border-t border-white/[0.05]">
                      <span className="font-body text-[11px] font-semibold text-purple-400 flex items-center gap-1">
                        {lang === 'hi' ? 'पूरी जानकारी देखें' : lang === 'hinglish' ? 'Full details dekho' : 'View full details'}
                        <span className="text-[13px]">→</span>
                      </span>
                    </div>
                  </motion.div>
                );
              });
          })()}

              <button
                onClick={() => { setStep('form'); setSelectedFilter('all'); }}
                className="w-full py-3 rounded-xl font-body text-[11px] text-white/50 hover:text-white/70 text-center transition-all bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] cursor-pointer"
              >
                {lang === 'hi' ? 'नया प्रॉम्प्ट आज़माएं' : lang === 'hinglish' ? 'Naya prompt try karo' : 'Try Another Prompt'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Tool registry ────────────────────────────────────────────────────────────
const toolConfig = [
  {
    id: 'ai-advisor',
    labelKey: 'aiAdvisorLabel' as const,
    descKey: 'aiAdvisorDesc' as const,
    icon: Sparkles,
    color: '#A855F7',
    component: AIAdvisor,
  },
  {
    id: 'sip',
    labelKey: 'sipLabel' as const,
    descKey: 'sipDesc' as const,
    icon: TrendingUp,
    color: '#00F5A0',
    component: SIPCalculator,
  },
  {
    id: 'emi',
    labelKey: 'emiLabel' as const,
    descKey: 'emiDesc' as const,
    icon: Landmark,
    color: '#FB7185',
    component: EMICalculator,
  },
  {
    id: 'fd',
    labelKey: 'fdLabel' as const,
    descKey: 'fdDesc' as const,
    icon: PiggyBank,
    color: '#C9A96E',
    component: FDCalculator,
  },
  {
    id: 'eligibility',
    labelKey: 'eligibilityLabel' as const,
    descKey: 'eligibilityDesc' as const,
    icon: BarChart2,
    color: '#00E5FF',
    component: LoanEligibility,
  },
  {
    id: 'ccpayoff',
    labelKey: 'ccpayoffLabel' as const,
    descKey: 'ccpayoffDesc' as const,
    icon: CreditCard,
    color: '#2DD4BF',
    component: CreditCardPayoff,
  },
  {
    id: 'fdtax',
    labelKey: 'fdtaxLabel' as const,
    descKey: 'fdtaxDesc' as const,
    icon: Calculator,
    color: '#FF9933',
    component: TaxOnFD,
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const searchParams = useSearchParams();
  const initialTool = searchParams.get('tool');
  const [activeTool, setActiveTool] = useState<string | null>(
    initialTool && toolConfig.some((tc) => tc.id === initialTool) ? initialTool : null
  );
  const { t } = useLang();
  const tool = toolConfig.find((t) => t.id === activeTool);

  return (
    <div className="min-h-screen bg-[#070A12] px-5 pt-14 pb-28">
      {/* Header */}
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
          {t.toolsTitle}
        </h1>
        <p className="font-body text-[13px] text-white/35">{t.toolsSub}</p>
      </motion.div>

      {/* Tool grid */}
      <AnimatePresence mode="wait">
        {!activeTool ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            {toolConfig.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.06 + i * 0.07 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveTool(item.id)}
                  className="relative overflow-hidden rounded-2xl p-4 text-left"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}10 0%, ${item.color}06 100%)`,
                    border: `1px solid ${item.color}25`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${item.color}18` }}
                  >
                    <Icon size={18} style={{ color: item.color }} strokeWidth={1.75} />
                  </div>
                  <p
                    className="text-[13px] leading-tight mb-1"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}
                  >
                    {t[item.labelKey]}
                  </p>
                  <p className="font-body text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.30)' }}>
                    {t[item.descKey]}
                  </p>
                  {/* Bottom accent */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${item.color}50, transparent)` }}
                  />
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Back button + tool header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setActiveTool(null)}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <span className="text-white/60 text-lg leading-none">←</span>
              </button>
              <div>
                <p
                  className="text-[17px] text-white/90"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
                >
                  {tool ? t[tool.labelKey] : ''}
                </p>
                <p className="font-body text-[11px] text-white/30">{tool ? t[tool.descKey] : ''}</p>
              </div>
            </div>

            {/* Tool content */}
            {activeTool === 'ai-advisor' ? (
              <div>{tool && <tool.component />}</div>
            ) : (
              <div
                className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {tool && <tool.component />}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}