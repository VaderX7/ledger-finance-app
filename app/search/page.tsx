'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowUpRight, ChevronRight, PiggyBank, FileText, TrendingUp, CreditCard, Landmark, Flag, Shield, Sparkles, Brain, BarChart2, Calculator, AlertCircle } from 'lucide-react';
import { products, Product, ProductCategory } from '@/lib/products';
import { getProducts, getProductsByCategory } from '@/lib/data-fetcher';
import { useLang } from '@/context/LanguageContext';
import ProductCategoryView from '@/components/product-category-view';
import ProductDetailPage from '@/components/product-detail-page';
import BankBrowserPage from '@/components/bank-browser-page';

type SearchView = 'search' | ProductCategory | 'banks';

type ToolId = 'ai-advisor' | 'sip' | 'emi' | 'fd' | 'eligibility' | 'ccpayoff' | 'fdtax';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<ProductCategory, number | null>>({
    savings: null, current: null, fds: null, creditcards: null,
    loans: null, govtschemes: null, insurance: null,
  });
  const [activeView, setActiveView] = useState<SearchView>('search');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLang();

  const categoryMeta: Record<ProductCategory, { label: string; subtitle: string; color: string; accentColor: string; icon: any }> = {
    savings:     { label: t.savingsLabel,     subtitle: t.savingsSub,     color: '#C9A96E', accentColor: '#E4C98A', icon: PiggyBank },
    current:     { label: t.currentLabel,     subtitle: t.currentSub,     color: '#00E5FF', accentColor: '#38BDF8', icon: FileText },
    fds:         { label: t.fdsLabel,         subtitle: t.fdsSub,         color: '#00F5A0', accentColor: '#2DD4BF', icon: TrendingUp },
    creditcards: { label: t.creditcardsLabel, subtitle: t.creditcardsSub, color: '#2DD4BF', accentColor: '#00E5FF', icon: CreditCard },
    loans:       { label: t.loansLabel,       subtitle: t.loansSub,       color: '#FB7185', accentColor: '#F97316', icon: Landmark },
    govtschemes: { label: t.govtschemesLabel, subtitle: t.govtschemesSub, color: '#FF9933', accentColor: '#FFB347', icon: Flag },
    insurance:   { label: t.insuranceLabel,   subtitle: t.insuranceSub,   color: '#00D4AA', accentColor: '#2DD4BF', icon: Shield },
  };

  const categoryCards = [
    { id: 'savings' as ProductCategory, ...categoryMeta.savings },
    { id: 'current' as ProductCategory, ...categoryMeta.current },
    { id: 'fds' as ProductCategory, ...categoryMeta.fds },
    { id: 'creditcards' as ProductCategory, ...categoryMeta.creditcards },
    { id: 'loans' as ProductCategory, ...categoryMeta.loans },
    { id: 'govtschemes' as ProductCategory, ...categoryMeta.govtschemes },
    { id: 'insurance' as ProductCategory, ...categoryMeta.insurance },
  ];

  useEffect(() => {
    getProducts().then(setAllProducts).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const loadCounts = async () => {
      const categories: ProductCategory[] = ['savings', 'current', 'fds', 'creditcards', 'loans', 'govtschemes', 'insurance'];
      try {
        const fetchedCounts = await Promise.all(
          categories.map(async (cat) => {
            try { const list = await getProductsByCategory(cat); return { cat, count: list.length }; }
            catch { return { cat, count: 0 }; }
          })
        );
        const countsMap = { ...counts };
        fetchedCounts.forEach(({ cat, count }) => { countsMap[cat] = count; });
        setCounts(countsMap);
      } catch (err) { console.error('Failed to load counts:', err); }
    };
    loadCounts();
  }, []);

// ── Tool helpers (inlined from tools page) ──────────────────────────────────

function toolFormatINR(n: number): string {
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
        <ResultBox label={t.maturityAmount} value={toolFormatINR(maturity)} accent="#00F5A0" />
        <ResultBox label={t.totalInvested} value={toolFormatINR(invested)} accent="#C9A96E" />
      </div>
      <ResultBox label={t.estimatedGains} value={toolFormatINR(gains)} accent="#2DD4BF" />
    </div>
  );
}

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
      <ResultBox label={t.monthlyEMI} value={toolFormatINR(emi)} accent="#FB7185" />
      <div className="grid grid-cols-2 gap-2.5">
        <ResultBox label={t.totalPayment} value={toolFormatINR(total)} accent="#C9A96E" />
        <ResultBox label={t.totalInterest} value={toolFormatINR(interest)} accent="#FF9933" />
      </div>
    </div>
  );
}

function FDCalculator() {
  const { t, lang } = useLang();
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('7.5');
  const [years, setYears] = useState('3');

  const P = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const tVal = parseFloat(years) || 0;
  const n = 4;

  const maturity = P * Math.pow(1 + r / n, n * tVal);
  const interest = maturity - P;

  return (
    <div className="space-y-4">
      <InputField label={t.principalAmount} value={principal} onChange={setPrincipal} prefix="₹" placeholder="100000" />
      <InputField label={t.annualInterestRate} value={rate} onChange={setRate} suffix="% p.a." placeholder="7.5" />
      <InputField label={t.tenure} value={years} onChange={setYears} suffix={lang === 'hi' ? 'वर्ष' : lang === 'hinglish' ? 'saal' : 'years'} placeholder="3" />
      <ResultBox label={t.maturityAmount} value={toolFormatINR(maturity)} accent="#00F5A0" />
      <div className="grid grid-cols-2 gap-2.5">
        <ResultBox label={t.principal} value={toolFormatINR(P)} accent="#C9A96E" />
        <ResultBox label={t.interestEarned} value={toolFormatINR(interest)} accent="#2DD4BF" />
      </div>
    </div>
  );
}

function TaxOnFD() {
  const { t } = useLang();
  const [interest, setInterest] = useState('75000');
  const [slab, setSlab] = useState('30');

  const grossInterest = parseFloat(interest) || 0;
  const taxRate = parseFloat(slab) || 0;
  const tds = grossInterest * 0.10;
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
      <ResultBox label={t.postTaxReturns} value={toolFormatINR(postTax)} accent="#00F5A0" />
      <div className="grid grid-cols-2 gap-2.5">
        <ResultBox label={t.tdsDeducted} value={toolFormatINR(tds)} accent="#C9A96E" />
        <ResultBox label={t.totalTaxLiability} value={toolFormatINR(totalTax)} accent="#FB7185" />
      </div>
      {additionalTax > 0 && (
        <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.18)' }}>
          <p className="font-body text-[11px] text-white/45 leading-relaxed">
            {t.additionalTaxNote(toolFormatINR(additionalTax))}
          </p>
        </div>
      )}
    </div>
  );
}

function AIAdvisorTool() {
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
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <span className="font-body text-[9px] uppercase tracking-wider text-white/30">{t.profileSummary}</span>
            <span className="font-body text-[9.5px] text-white/60 truncate max-w-[220px]">
              {t.customDescriptionInput}
            </span>
          </div>

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

                    <h4 className="text-[17px] leading-tight text-white/95 mb-1"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
                      {product.name}
                    </h4>
                    <p className="font-body text-[11px] text-white/35 mb-3">
                      {lang === 'hi' ? `${product.lender} द्वारा` : lang === 'hinglish' ? `${product.lender} ke dwara` : `By ${product.lender}`}
                    </p>

                    <div className="pl-4 py-3 my-1 border-l-[3px] border-purple-500/60 bg-purple-500/[0.07] rounded-r-xl">
                      <p className="font-body text-[11.5px] text-white/65 leading-relaxed">
                        {rec.matchReason}
                      </p>
                    </div>

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

const toolConfig: { id: ToolId; label: string; desc: string; icon: any; color: string; component: React.FC }[] = [
  { id: 'ai-advisor', label: 'AI Advisor', desc: 'Get personalized advice', icon: Sparkles, color: '#A855F7', component: AIAdvisorTool },
  { id: 'sip', label: 'SIP Calculator', desc: 'Plan your investments', icon: TrendingUp, color: '#00F5A0', component: SIPCalculator },
  { id: 'emi', label: 'EMI Calculator', desc: 'Calculate loan EMIs', icon: Landmark, color: '#FB7185', component: EMICalculator },
  { id: 'fd', label: 'FD Calculator', desc: 'Fixed deposit returns', icon: PiggyBank, color: '#C9A96E', component: FDCalculator },
  { id: 'fdtax', label: 'Tax on FD', desc: 'Tax on FD interest', icon: Calculator, color: '#FF9933', component: TaxOnFD },
];


  const filtered = allProducts.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.lender.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.highlights.some((h) => h.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const getPrimaryMetric = (p: Product): { label: string; value: string } | null => {
    const m = p.metrics;
    if (m.interestRate) return { label: 'Rate', value: String(m.interestRate) };
    if (m.baseYield) return { label: 'Yield', value: String(m.baseYield) };
    if (m.minRate) return { label: 'Rate from', value: String(m.minRate) };
    if (m.joiningFee !== undefined) return { label: 'Joining', value: String(m.joiningFee) };
    if (m.monthlyAvgBalance) return { label: 'MAB', value: String(m.monthlyAvgBalance) };
    return null;
  };

  const showEmpty = !loading && query.trim() && filtered.length === 0;
  const showPrompt = !loading && !query.trim();

  return (
    <AnimatePresence mode="wait">
      {activeTool ? (
        <motion.div
          key={`tool-${activeTool}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen bg-[#070A12] px-5 pt-14 pb-28"
        >
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
                {toolConfig.find((tc) => tc.id === activeTool)?.label ?? ''}
              </p>
              <p className="font-body text-[11px] text-white/30">
                {toolConfig.find((tc) => tc.id === activeTool)?.desc ?? ''}
              </p>
            </div>
          </div>

          {activeTool === 'ai-advisor' ? (
            <div>{toolConfig.find((tc) => tc.id === activeTool) && (() => {
              const Comp = toolConfig.find((tc) => tc.id === activeTool)!.component;
              return <Comp />;
            })()}</div>
          ) : (
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {toolConfig.find((tc) => tc.id === activeTool) && (() => {
                const Comp = toolConfig.find((tc) => tc.id === activeTool)!.component;
                return <Comp />;
              })()}
            </div>
          )}
        </motion.div>
      ) : activeView === 'search' ? (
        <motion.div
          key="search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen bg-[#070A12] px-5 pt-14 pb-28 relative overflow-hidden"
        >
          {/* Page color orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.85, 1, 0.85],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              opacity: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              delay: 1.2,
            }}
            className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: 420,
              height: 420,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #00E5FF28 0%, transparent 70%)',
              filter: 'blur(60px)',
              zIndex: 0,
              top: -40,
            }}
          />

          <div className="relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <h1
              className="text-[28px] tracking-[-0.04em] text-white/95 mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
            >
              {t.searchTitle}
            </h1>
            <p className="font-body text-[13px] text-white/35">
              {loading ? t.searchLoading : t.searchSub(allProducts.length)}
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative mb-6"
          >
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              strokeWidth={1.5}
              style={{ color: focused ? '#C9A96E' : 'rgba(255,255,255,0.3)' }}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-10 py-3.5 rounded-xl font-body text-[13px] text-white/80 placeholder-white/25 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid #C9A96E',
                boxShadow: focused ? '0 0 12px rgba(201,169,110,0.45), 0 0 24px rgba(201,169,110,0.15)' : 'none',
              }}
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(201,169,110,0.08)' }} />
              ))}
            </div>
          )}

          {/* Search results */}
          {!loading && query.trim() && (
            <>
              {!showEmpty && (
                <p className="font-body text-[10px] text-white/25 mb-3">
                  {t.results(filtered.length)}
                  {query.trim() ? ` for "${query}"` : ''}
                </p>
              )}
              <div className="space-y-2.5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((item, i) => {
                    const meta = categoryMeta[item.category];
                    const Icon = meta.icon;
                    const metric = getPrimaryMetric(item);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: Math.min(i * 0.03, 0.2), duration: 0.25 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex items-center justify-between p-4 rounded-xl cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${meta.color}18` }}>
                            <Icon size={16} style={{ color: meta.color }} strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] text-white/80 truncate"
                              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                              {item.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-body text-[9px] px-1.5 py-0.5 rounded-md"
                                style={{ background: `${meta.color}18`, color: meta.color }}>
                                {meta.label}
                              </span>
                              <span className="font-body text-[10px] text-white/30 truncate">{item.lender}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {metric && (
                            <span className="text-[12px] tracking-tight"
                              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: meta.color }}>
                              {metric.value}
                            </span>
                          )}
                          <ArrowUpRight size={13} className="text-white/20" />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}

          {showEmpty && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <p className="text-white/20 font-body text-sm mb-1">{t.noResults(query)}</p>
              <p className="text-white/12 font-body text-xs">{t.noResultsSub}</p>
            </motion.div>
          )}

          {/* Browse by Bank + Category cards (shown when no search active) */}
          {showPrompt && !loading && (
            <>
              {/* Browse by Bank — prominent umbrella card */}
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView('banks')}
                className="w-full relative overflow-hidden rounded-2xl p-5 text-left mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,169,110,0.18) 0%, rgba(228,201,138,0.08) 100%)',
                  border: '1px solid rgba(201,169,110,0.35)',
                  boxShadow: '0 8px 32px rgba(201,169,110,0.12)',
                }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1 }}
                  className="absolute inset-y-0 w-1/3 skew-x-12 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Bank icon grid */}
                    <div className="grid grid-cols-2 gap-1 w-10 h-10 flex-shrink-0">
                      {['#ED232A', '#00B4EF', '#B12B30', '#007A3D'].map((c) => (
                        <div key={c} className="rounded-md" style={{ background: c, opacity: 0.9 }} />
                      ))}
                    </div>
                    <div>
                      <p
                        className="text-[11px] uppercase tracking-widest font-bold mb-0.5"
                        style={{ color: '#C9A96E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        EXPLORE
                      </p>
                      <h3
                        className="text-[20px] tracking-tight text-white/95"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
                      >
                        Browse by Bank
                      </h3>
                      <p
                        className="text-[11px] text-white/35 mt-0.5"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        50+ banks · All products in one place
                      </p>
                    </div>
                  </div>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.25)' }}
                  >
                    <ChevronRight size={16} style={{ color: '#C9A96E' }} strokeWidth={2.5} />
                  </div>
                </div>
              </motion.button>

              {/* AI Financial Advisor — hero card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.38 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTool('ai-advisor')}
                className="w-full relative overflow-hidden rounded-2xl p-5 text-left mb-6 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(99,102,241,0.08) 100%)',
                    border: '1px solid rgba(139,92,246,0.35)',
                    boxShadow: '0 8px 32px rgba(139,92,246,0.12)',
                  }}
                >
                    {/* Shimmer sweep */}
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1.5 }}
                      className="absolute inset-y-0 w-1/3 skew-x-12 pointer-events-none"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(139,92,246,0.20)', border: '1px solid rgba(139,92,246,0.35)' }}
                      >
                        <Brain size={20} style={{ color: '#A78BFA' }} strokeWidth={2} />
                      </div>
                      <div>
                        <p
                          className="text-[11px] uppercase tracking-widest font-bold mb-0.5"
                          style={{ color: '#A78BFA', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          AI POWERED
                        </p>
                        <h3
                          className="text-[20px] tracking-tight text-white/95"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
                        >
                          AI Financial Advisor
                        </h3>
                        <p
                          className="text-[11px] text-white/35 mt-0.5"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          Ask anything about your finances, get personalized advice
                        </p>
                      </div>
                    </div>
                    <div
                      className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg flex items-center gap-1"
                      style={{ background: 'rgba(139,92,246,0.20)', border: '1px solid rgba(139,92,246,0.35)' }}
                    >
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: '#A78BFA', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        Try Now
                      </span>
                      <span className="text-[10px]" style={{ color: '#A78BFA' }}>→</span>
                    </div>
                  </motion.div>

              {/* Section heading — product type */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[10px] tracking-widest uppercase text-white/25 mb-4"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                OR BROWSE BY PRODUCT TYPE
              </motion.p>

              {/* Category cards */}
              <div className="grid grid-cols-1 gap-3.5">
                {categoryCards.map((card, index) => {
                  const IconComponent = card.icon;
                  const productCount = counts[card.id];
                  return (
                    <motion.button
                      key={card.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.22 + index * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      whileHover={{
                        scale: 1.015,
                        border: `1px solid ${card.color}55`,
                        background: `linear-gradient(135deg, ${card.color}24 0%, ${card.accentColor}12 100%)`,
                        boxShadow: `0 10px 30px -10px ${card.color}18`,
                      }}
                      onClick={() => setActiveView(card.id)}
                      className="relative overflow-hidden rounded-2xl py-3.5 px-5 text-left flex items-center gap-4 transition-all w-full"
                      style={{
                        background: `linear-gradient(135deg, ${card.color}16 0%, ${card.accentColor}0a 100%)`,
                        border: `1px solid ${card.color}25`,
                        boxShadow: `0 4px 24px -10px ${card.color}05`,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${card.color}12`, border: `1px solid ${card.color}35` }}
                      >
                        <IconComponent size={22} style={{ color: card.color }} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3
                          className="text-[15px] leading-tight font-bold"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'rgba(255,255,255,0.92)' }}
                        >
                          {card.label}
                        </h3>
                        <p className="font-body text-[11px] mt-0.5 font-medium" style={{ color: card.color }}>
                          {card.subtitle}
                        </p>
                        <span className="font-body text-[10px] mt-1 block text-white/50">
                          {productCount !== null ? `${productCount}+ options` : 'Comparing rates...'}
                        </span>
                      </div>
                      <div className="flex items-center justify-center flex-shrink-0 ml-auto pl-2">
                        <ChevronRight size={18} style={{ color: card.color }} className="opacity-80" strokeWidth={2.5} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Financial Calculators */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[10px] tracking-widest uppercase text-white/25 mb-4 mt-8"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                FINANCIAL CALCULATORS
              </motion.p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'SIP Calculator', desc: 'Plan your investments', icon: TrendingUp, color: '#00F5A0', id: 'sip' as ToolId },
                  { label: 'EMI Calculator', desc: 'Calculate loan EMIs', icon: Landmark, color: '#FB7185', id: 'emi' as ToolId },
                  { label: 'FD Calculator', desc: 'Fixed deposit returns', icon: PiggyBank, color: '#C9A96E', id: 'fd' as ToolId },
                  { label: 'Tax on FD', desc: 'Tax on FD interest', icon: Calculator, color: '#FF9933', id: 'fdtax' as ToolId },
                ].map((tool, i) => (
                    <motion.button
                      key={tool.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.65 + i * 0.05 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveTool(tool.id)}
                      className="relative overflow-hidden rounded-2xl p-4 text-left w-full"
                      style={{
                        background: `linear-gradient(135deg, ${tool.color}10 0%, ${tool.color}06 100%)`,
                        border: `1px solid ${tool.color}25`,
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5"
                        style={{ background: `${tool.color}18` }}
                      >
                        <tool.icon size={16} style={{ color: tool.color }} strokeWidth={1.75} />
                      </div>
                      <p
                        className="text-[13px] leading-tight mb-0.5"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}
                      >
                        {tool.label}
                      </p>
                      <p className="font-body text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.30)' }}>
                        {tool.desc}
                      </p>
                      <div
                        className="absolute bottom-0 left-0 right-0 h-px"
                        style={{ background: `linear-gradient(90deg, transparent, ${tool.color}50, transparent)` }}
                      />
                    </motion.button>
                ))}
              </div>
            </>
          )}
          </div>
        </motion.div>
      ) : activeView === 'banks' ? (
        <motion.div
          key="banks"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="min-h-screen bg-[#070A12]"
        >
          <BankBrowserPage onBack={() => setActiveView('search')} />
        </motion.div>
      ) : (
        <motion.div
          key={activeView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="min-h-screen bg-[#070A12]"
        >
          <ProductCategoryView
            category={activeView}
            onBack={() => setActiveView('search')}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
