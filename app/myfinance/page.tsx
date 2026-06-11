'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  PenLine,
  Sparkles,
  Pencil,
  Trash2,
  Plus,
  X,
  ChevronRight,
  Landmark,
  TrendingUp,
  Building2,
  CircleDollarSign,
  FileText,
  Shield,
  Briefcase,
  Home,
  Gem,
  CreditCard,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  CalendarClock,
  AlertTriangle,
  Banknote,
  Receipt,
} from 'lucide-react';
import {
  getProfile,
  saveProfile,
  addEntry,
  updateEntry,
  deleteEntry,
  formatINR,
  getTotalAssets,
  getTotalLiabilities,
  getNetWorth,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type UserFinancialProfile,
  type FinancialEntry,
  type EntryCategory,
} from '@/lib/financial-profile';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

const ALL_CATEGORIES: EntryCategory[] = [
  'savings_account',
  'current_account',
  'fd',
  'loan',
  'investment',
  'property',
  'asset',
  'liability',
  'income',
  'expense',
  'insurance',
  'other',
];

const CATEGORY_ICONS: Record<EntryCategory, React.ReactNode> = {
  savings_account: <PiggyBank size={16} />,
  current_account: <Landmark size={16} />,
  fd: <Shield size={16} />,
  loan: <CreditCard size={16} />,
  investment: <TrendingUp size={16} />,
  property: <Home size={16} />,
  asset: <Gem size={16} />,
  liability: <Receipt size={16} />,
  income: <Banknote size={16} />,
  expense: <CircleDollarSign size={16} />,
  insurance: <Shield size={16} />,
  other: <Briefcase size={16} />,
};

function CategoryIcon({ category, size = 16 }: { category: EntryCategory; size?: number }) {
  const icons: Record<EntryCategory, React.ReactNode> = {
    savings_account: <PiggyBank size={size} />,
    current_account: <Landmark size={size} />,
    fd: <Shield size={size} />,
    loan: <CreditCard size={size} />,
    investment: <TrendingUp size={size} />,
    property: <Home size={size} />,
    asset: <Gem size={size} />,
    liability: <Receipt size={size} />,
    income: <Banknote size={size} />,
    expense: <CircleDollarSign size={size} />,
    insurance: <Shield size={size} />,
    other: <Briefcase size={size} />,
  };
  return <span style={{ color: CATEGORY_COLORS[category] }}>{icons[category]}</span>;
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function MyFinancePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'entries'>('dashboard');
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [addScreenTab, setAddScreenTab] = useState<'manual' | 'ai'>('manual');
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserFinancialProfile | null>(null);
  const [filterCategory, setFilterCategory] = useState<EntryCategory | 'all'>('all');
  const [manualStep, setManualStep] = useState<1 | 2>(1);
  const [selectedCategory, setSelectedCategory] = useState<EntryCategory | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editEntry, setEditEntry] = useState<FinancialEntry | null>(null);
  const [cloudMessage, setCloudMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string; entry?: FinancialEntry }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<FinancialEntry | null>(null);
  const { user, signIn } = useAuth();

  useEffect(() => {
    setProfile(getProfile());
    setMounted(true);
  }, []);

  const refreshProfile = useCallback(() => setProfile(getProfile()), []);

  const entries = profile?.entries ?? [];

  const filteredEntries = useMemo(() => {
    if (filterCategory === 'all') return entries;
    return entries.filter((e) => e.category === filterCategory);
  }, [entries, filterCategory]);

  const usedCategories = useMemo(() => {
    const cats = new Set(entries.map((e) => e.category));
    return ALL_CATEGORIES.filter((c) => cats.has(c));
  }, [entries]);

  const groupedEntries = useMemo(() => {
    const groups: Record<string, FinancialEntry[]> = {};
    for (const entry of filteredEntries) {
      if (!groups[entry.category]) groups[entry.category] = [];
      groups[entry.category].push(entry);
    }
    return groups;
  }, [filteredEntries]);

  const alerts = useMemo(() => {
    return entries.filter((e) => {
      if (!e.endDate) return false;
      const days = daysUntil(e.endDate);
      return days >= 0 && days <= 30;
    });
  }, [entries]);

  const recentEntries = useMemo(() => {
    return [...entries].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
  }, [entries]);

  const fdCount = entries.filter((e) => e.category === 'fd').length;
  const fdTotal = entries.filter((e) => e.category === 'fd').reduce((s, e) => s + (e.amount ?? 0), 0);
  const loanCount = entries.filter((e) => e.category === 'loan').length;
  const loanTotal = entries.filter((e) => e.category === 'loan').reduce((s, e) => s + (e.amount ?? 0), 0);
  const investCount = entries.filter((e) => e.category === 'investment').length;
  const investTotal = entries.filter((e) => e.category === 'investment').reduce((s, e) => s + (e.amount ?? 0), 0);
  const monthlyIncome = entries.filter((e) => e.category === 'income').reduce((s, e) => s + (e.amount ?? 0), 0);

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#C9A96E] border-t-transparent animate-spin" />
      </div>
    );
  }

  const handlePrivacyToggle = (mode: 'local' | 'cloud') => {
    if (mode === 'cloud') {
      if (!auth.currentUser) {
        setCloudMessage('Sign in to enable cloud sync');
        setTimeout(() => setCloudMessage(''), 3000);
        return;
      }
    }
    profile.privacyMode = mode;
    saveProfile(profile);
    refreshProfile();
  };

  const openEditSheet = (entry: FinancialEntry) => {
    setEditEntry(entry);
    setSelectedCategory(entry.category);
    setFormData({
      title: entry.title || '',
      institution: entry.institution || '',
      notes: entry.notes || '',
      amount: entry.amount?.toString() || '',
      interestRate: entry.interestRate?.toString() || '',
      startDate: entry.startDate || '',
      endDate: entry.endDate || '',
      metadata_type: (entry.metadata?.type as string) || '',
      metadata_value: (entry.metadata?.value as string) || '',
      metadata_location: (entry.metadata?.location as string) || '',
      metadata_emi: (entry.metadata?.emi as string) || '',
      metadata_coverage: (entry.metadata?.coverage as string) || '',
      metadata_description: (entry.metadata?.description as string) || '',
    });
    setManualStep(2);
    setAddScreenTab('manual');
    setShowAddSheet(true);
  };

  const handleSaveEntry = () => {
    if (!formData.title || !selectedCategory) return;

    const metadata: Record<string, string | number | boolean> = {};
    if (formData.metadata_type) metadata.type = formData.metadata_type;
    if (formData.metadata_value) metadata.value = formData.metadata_value;
    if (formData.metadata_location) metadata.location = formData.metadata_location;
    if (formData.metadata_emi) metadata.emi = formData.metadata_emi;
    if (formData.metadata_coverage) metadata.coverage = formData.metadata_coverage;
    if (formData.metadata_description) metadata.description = formData.metadata_description;

    if (editEntry) {
      updateEntry(editEntry.id, {
        title: formData.title,
        institution: formData.institution || undefined,
        notes: formData.notes || undefined,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      });
    } else {
      addEntry({
        id: Date.now().toString(),
        category: selectedCategory,
        title: formData.title,
        institution: formData.institution || undefined,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        notes: formData.notes || undefined,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    refreshProfile();
    setShowAddSheet(false);
    setManualStep(1);
    setSelectedCategory(null);
    setFormData({});
    setEditEntry(null);
  };

  const resetSheet = () => {
    setShowAddSheet(false);
    setShowAddSheet(false);
    setAddScreenTab('manual');
    setManualStep(1);
    setSelectedCategory(null);
    setFormData({});
    setEditEntry(null);
  };

  const callGemini = async (userMessage: string) => {
    setChatLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const systemPrompt = `You are a financial data extractor for LEDGER, an Indian personal finance app.
Extract financial entry data from user input in ANY language (English, Hindi, Hinglish, or mix).
ALWAYS return a valid JSON object — never fail, never return empty.
If information is missing, use null for that field.
Create a reasonable title if not explicitly provided.
Return ONLY the raw JSON object, no markdown, no explanation, no backticks.

JSON schema:
{
  "category": one of [savings_account, current_account, fd, loan, investment, property, asset, liability, income, expense, insurance, other],
  "title": string (create a descriptive title if not given),
  "institution": string or null,
  "amount": number in full INR (1 lakh=100000, 1 crore=10000000, "1L"=100000, "12lakh"=1200000) or null,
  "interestRate": number as percentage (7% = 7, not 0.07) or null,
  "startDate": "YYYY-MM-DD" or null,
  "endDate": "YYYY-MM-DD" or null,
  "notes": string or null,
  "metadata": {}
}

Examples:
"fd of 1lakh at 8%" → {"category":"fd","title":"Fixed Deposit","institution":null,"amount":100000,"interestRate":8,"startDate":null,"endDate":null,"notes":null,"metadata":{}}
"mera ghar hai 50 lakh ka" → {"category":"property","title":"My House","institution":null,"amount":5000000,"interestRate":null,"startDate":null,"endDate":null,"notes":null,"metadata":{}}
"salary 85k" → {"category":"income","title":"Monthly Salary","institution":null,"amount":85000,"interestRate":null,"startDate":null,"endDate":null,"notes":null,"metadata":{}}`;

    try {
      console.log('API Key exists:', !!process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      console.log('Sending to Gemini:', userMessage);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\nUser input: ' + userMessage }] }],
          }),
        }
      );

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Full Gemini response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error('Gemini API error:', data);
        setChatMessages((prev) => [...prev, { role: 'ai', text: `API Error ${response.status}: ${data?.error?.message ?? 'Unknown error'}` }]);
        setChatLoading(false);
        return;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      console.log('Gemini text response:', text);

      const jsonMatch = text.replace(/```json/gi, '').replace(/```/g, '').trim().match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response: ' + text);
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('Parsed entry:', parsed);

      const entry: FinancialEntry = {
        id: '',
        category: parsed.category ?? 'other',
        title: parsed.title ?? 'Untitled',
        institution: parsed.institution ?? undefined,
        amount: parsed.amount ?? undefined,
        interestRate: parsed.interestRate ?? undefined,
        startDate: parsed.startDate ?? undefined,
        endDate: parsed.endDate ?? undefined,
        notes: parsed.notes ?? undefined,
        metadata: parsed.metadata ?? {},
        createdAt: 0,
        updatedAt: 0,
      };
      setPendingEntry(entry);
      setChatMessages((prev) => [...prev, { role: 'ai', text: 'Here is what I extracted:', entry }]);
    } catch (err) {
      console.error('Full error:', err);
      setChatMessages((prev) => [...prev, { role: 'ai', text: `Error: ${err instanceof Error ? err.message : String(err)}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const renderFormFields = () => {
    if (!selectedCategory) return null;

    const inputCls =
      'w-full bg-[rgba(255,255,255,0.05)] rounded-xl px-4 py-3 text-[14px] text-white/90 placeholder:text-white/25 outline-none focus:shadow-[0_0_0_2px_rgba(201,169,110,0.3)]';

    const commonFields = (
      <>
        <div>
          <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Title *</label>
          <input
            className={inputCls}
            placeholder="e.g. SBI Savings"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Institution</label>
          <input
            className={inputCls}
            placeholder="e.g. SBI, HDFC"
            value={formData.institution || ''}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          />
        </div>
      </>
    );

    const notesField = (
      <div>
        <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Notes</label>
        <textarea
          className={`${inputCls} min-h-[60px] resize-none`}
          placeholder="Any additional notes..."
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
    );

    switch (selectedCategory) {
      case 'fd':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Amount (₹)</label>
              <input type="number" className={inputCls} placeholder="500000" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Interest Rate (%)</label>
              <input type="number" step="0.1" className={inputCls} placeholder="7.5" value={formData.interestRate || ''} onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Start Date</label>
                <input type="date" className={inputCls} value={formData.startDate || ''} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Maturity Date</label>
                <input type="date" className={inputCls} value={formData.endDate || ''} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>
            {notesField}
          </>
        );

      case 'loan':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Loan Amount (₹)</label>
              <input type="number" className={inputCls} placeholder="1000000" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">EMI Amount (₹)</label>
              <input type="number" className={inputCls} placeholder="12000" value={formData.metadata_emi || ''} onChange={(e) => setFormData({ ...formData, metadata_emi: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Interest Rate (%)</label>
              <input type="number" step="0.1" className={inputCls} placeholder="8.5" value={formData.interestRate || ''} onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Start Date</label>
                <input type="date" className={inputCls} value={formData.startDate || ''} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">End Date</label>
                <input type="date" className={inputCls} value={formData.endDate || ''} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>
            {notesField}
          </>
        );

      case 'savings_account':
      case 'current_account':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Current Balance (₹)</label>
              <input type="number" className={inputCls} placeholder="250000" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            {notesField}
          </>
        );

      case 'investment':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Amount Invested (₹)</label>
              <input type="number" className={inputCls} placeholder="500000" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Current Value (₹)</label>
              <input type="number" className={inputCls} placeholder="620000" value={formData.metadata_value || ''} onChange={(e) => setFormData({ ...formData, metadata_value: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Investment Type</label>
              <input className={inputCls} placeholder="e.g. Mutual Fund, Stock" value={formData.metadata_type || ''} onChange={(e) => setFormData({ ...formData, metadata_type: e.target.value })} />
            </div>
            {notesField}
          </>
        );

      case 'property':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Current Value (₹)</label>
              <input type="number" className={inputCls} placeholder="5000000" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Purchase Price (₹)</label>
              <input type="number" className={inputCls} placeholder="3500000" value={formData.metadata_value || ''} onChange={(e) => setFormData({ ...formData, metadata_value: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Location</label>
              <input className={inputCls} placeholder="e.g. Bangalore" value={formData.metadata_location || ''} onChange={(e) => setFormData({ ...formData, metadata_location: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Purchase Date</label>
              <input type="date" className={inputCls} value={formData.startDate || ''} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
            </div>
            {notesField}
          </>
        );

      case 'asset':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Current Value (₹)</label>
              <input type="number" className={inputCls} placeholder="100000" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Description</label>
              <input className={inputCls} placeholder="e.g. Gold Jewellery" value={formData.metadata_description || ''} onChange={(e) => setFormData({ ...formData, metadata_description: e.target.value })} />
            </div>
            {notesField}
          </>
        );

      case 'liability':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Amount Owed (₹)</label>
              <input type="number" className={inputCls} placeholder="50000" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            {notesField}
          </>
        );

      case 'income':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Monthly Amount (₹)</label>
              <input type="number" className={inputCls} placeholder="80000" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Income Type</label>
              <select
                className={inputCls}
                value={formData.metadata_type || ''}
                onChange={(e) => setFormData({ ...formData, metadata_type: e.target.value })}
              >
                <option value="">Select type</option>
                <option value="Salary">Salary</option>
                <option value="Business">Business</option>
                <option value="Rental">Rental</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {notesField}
          </>
        );

      case 'expense':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Monthly Amount (₹)</label>
              <input type="number" className={inputCls} placeholder="25000" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Expense Type</label>
              <input className={inputCls} placeholder="e.g. Rent, Groceries" value={formData.metadata_type || ''} onChange={(e) => setFormData({ ...formData, metadata_type: e.target.value })} />
            </div>
            {notesField}
          </>
        );

      case 'insurance':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Premium Amount (₹)</label>
              <input type="number" className={inputCls} placeholder="24000" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Coverage Amount (₹)</label>
              <input type="number" className={inputCls} placeholder="5000000" value={formData.metadata_coverage || ''} onChange={(e) => setFormData({ ...formData, metadata_coverage: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Expiry Date</label>
              <input type="date" className={inputCls} value={formData.endDate || ''} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
            </div>
            {notesField}
          </>
        );

      default:
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">Amount (₹)</label>
              <input type="number" className={inputCls} placeholder="0" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            {notesField}
          </>
        );
    }
  };

  /* ────────────── OVERVIEW TAB ────────────── */
  const renderOverview = () => {
    if (entries.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(201,169,110,0.10)', border: '1px solid rgba(201,169,110,0.25)' }}
          >
            <Wallet size={28} style={{ color: '#C9A96E' }} strokeWidth={1.75} />
          </div>
          <h2
            className="text-[18px] text-white/80 mb-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            Your financial picture starts here
          </h2>
          <p className="font-body text-[13px] text-white/35 max-w-[240px] mb-6">
            Add your first entry to see your net worth and track your finances
          </p>
          <button
            onClick={() => setActiveTab('entries')}
            className="px-6 py-2.5 rounded-full text-[13px] font-semibold text-[#070A12]"
            style={{ background: 'linear-gradient(135deg, #C9A96E, #A88B5A)' }}
          >
            Add First Entry
          </button>
        </motion.div>
      );
    }

    return (
      <div className="space-y-5">
        {/* Net Worth Hero */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,110,0.18), rgba(201,169,110,0.08))',
            border: '1px solid rgba(201,169,110,0.3)',
          }}
        >
          <p className="text-[10px] uppercase tracking-widest text-[#C9A96E] font-semibold mb-2">
            NET WORTH
          </p>
          <p
            className="text-[36px] font-extrabold mb-3"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'linear-gradient(135deg, #C9A96E, #E8D5A3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {formatINR(getNetWorth(entries))}
          </p>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-[rgba(0,245,160,0.1)] text-[#00F5A0]">
              <ArrowUpRight size={12} /> Assets: {formatINR(getTotalAssets(entries))}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-[rgba(251,113,133,0.1)] text-[#FB7185]">
              <ArrowDownRight size={12} /> Liabilities: {formatINR(getTotalLiabilities(entries))}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'FDs', count: fdCount, value: fdTotal, color: CATEGORY_COLORS.fd, icon: <Shield size={16} style={{ color: CATEGORY_COLORS.fd }} /> },
            { label: 'Loans', count: loanCount, value: loanTotal, color: CATEGORY_COLORS.loan, icon: <CreditCard size={16} style={{ color: CATEGORY_COLORS.loan }} /> },
            { label: 'Investments', count: investCount, value: investTotal, color: CATEGORY_COLORS.investment, icon: <TrendingUp size={16} style={{ color: CATEGORY_COLORS.investment }} /> },
            { label: 'Monthly Income', count: null, value: monthlyIncome, color: CATEGORY_COLORS.income, icon: <Banknote size={16} style={{ color: CATEGORY_COLORS.income }} /> },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-3"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                {stat.icon}
                <span className="text-[11px] text-white/40">{stat.label}</span>
              </div>
              <p className="text-[16px] font-bold text-white/90">
                {stat.value > 0 ? formatINR(stat.value) : '—'}
              </p>
              {stat.count !== null && (
                <p className="text-[10px] text-white/25 mt-0.5">{stat.count} {stat.count === 1 ? 'entry' : 'entries'}</p>
              )}
            </div>
          ))}
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-2">UPCOMING</p>
            <div className="space-y-2">
              {alerts.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: 'rgba(255,153,51,0.08)', border: '1px solid rgba(255,153,51,0.2)' }}
                >
                  <AlertTriangle size={16} className="text-[#FF9933] shrink-0" />
                  <p className="text-[12px] text-white/60">
                    <span className="font-semibold text-white/80">{entry.title}</span>{' '}
                    matures on {formatDate(entry.endDate!)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">RECENT ENTRIES</p>
              <button
                onClick={() => setActiveTab('entries')}
                className="text-[11px] text-[#C9A96E] font-semibold"
              >
                View all →
              </button>
            </div>
            <div className="space-y-2">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{
                    background: `${CATEGORY_COLORS[entry.category]}10`,
                    borderLeft: `4px solid ${CATEGORY_COLORS[entry.category]}`,
                  }}
                >
                  <CategoryIcon category={entry.category} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white/90 truncate">{entry.title}</p>
                    {entry.institution && (
                      <p className="text-[11px] text-white/35 truncate">{entry.institution}</p>
                    )}
                  </div>
                  {entry.amount != null && (
                    <p className="text-[14px] font-bold shrink-0" style={{ color: CATEGORY_COLORS[entry.category] }}>
                      {formatINR(entry.amount)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Google Sign-in Card */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl flex items-center gap-4"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-white/80" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Save your data to cloud
              </p>
              <p className="text-[11px] text-white/35 mt-0.5">
                Sign in to sync across devices and never lose your entries
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={signIn}
              className="flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.95)' }}
            >
              <svg width="16" height="16" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8.1h-7.4v2.89h4.26c-.39 2-2.15 3.07-4.26 3.07a4.67 4.67 0 0 1 0-9.33c1.17 0 2.22.4 3.05 1.07l2.09-2.1A8 8 0 1 0 9 17a7.82 7.82 0 0 0 8-7.9 7.17 7.17 0 0 0-.49-1Z"/>
                <path fill="#34A853" d="m2.74 9-2.09 1.57A8 8 0 0 0 9 17l2.5-1.94A4.68 4.68 0 0 1 9 14.06 4.67 4.67 0 0 1 4.67 9Z"/>
                <path fill="#FBBC05" d="M4.67 9A4.63 4.63 0 0 1 6.36 5.4L4.27 3.3A8 8 0 0 0 1 9l1.74 1.57Z"/>
                <path fill="#EA4335" d="M9 3.94a4.57 4.57 0 0 1 3.05 1.07l2.09-2.1A8 8 0 0 0 9 1a8 8 0 0 0-4.73 2.3l2.09 2.1A4.58 4.58 0 0 1 9 3.94Z"/>
              </svg>
              <span className="text-[12px] font-bold text-gray-800">Sign in</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    );
  };

  /* ────────────── ENTRIES TAB ────────────── */
  const renderEntries = () => (
    <div className="space-y-4">
      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1 -mx-1 px-1">
        <button
          onClick={() => setFilterCategory('all')}
          className={`shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
            filterCategory === 'all' ? 'text-[#070A12]' : 'text-white/40'
          }`}
          style={{
            background: filterCategory === 'all'
              ? 'linear-gradient(135deg, #C9A96E, #A88B5A)'
              : 'rgba(255,255,255,0.05)',
          }}
        >
          All
        </button>
        {usedCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
              filterCategory === cat ? 'text-[#070A12]' : 'text-white/40'
            }`}
            style={{
              background: filterCategory === cat
                ? CATEGORY_COLORS[cat]
                : 'rgba(255,255,255,0.05)',
            }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Grouped Entries */}
      {filteredEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText size={32} className="text-white/15 mb-3" />
          <p className="text-[14px] text-white/35">No entries found</p>
        </div>
      ) : (
        Object.entries(groupedEntries).map(([cat, catEntries]) => {
          const category = cat as EntryCategory;
          const groupTotal = catEntries.reduce((s, e) => s + (e.amount ?? 0), 0);
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CategoryIcon category={category} />
                  <span className="text-[13px] font-semibold text-white/70">
                    {CATEGORY_LABELS[category]}
                  </span>
                </div>
                <span className="text-[13px] font-bold" style={{ color: CATEGORY_COLORS[category] }}>
                  {formatINR(groupTotal)}
                </span>
              </div>
              <div className="space-y-2">
                {catEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="relative rounded-2xl p-4"
                    style={{
                      background: `${CATEGORY_COLORS[entry.category]}10`,
                      borderLeft: `4px solid ${CATEGORY_COLORS[entry.category]}`,
                    }}
                  >
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      <button
                        onClick={() => openEditSheet(entry)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                      >
                        <Pencil size={13} className="text-white/50" />
                      </button>
                      {deleteConfirmId === entry.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              deleteEntry(entry.id);
                              refreshProfile();
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 rounded-lg text-[10px] font-semibold text-white bg-[#FB7185]"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded-lg text-[10px] font-semibold text-white/50 bg-[rgba(255,255,255,0.06)]"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(entry.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                        >
                          <Trash2 size={13} className="text-white/50" />
                        </button>
                      )}
                    </div>

                    {/* Entry Content */}
                    <div className="pr-16">
                      <p className="text-[14px] font-semibold text-white/90">{entry.title}</p>
                      {entry.institution && (
                        <p className="text-[12px] text-white/40">{entry.institution}</p>
                      )}
                    </div>

                    {entry.amount != null && (
                      <p className="text-[18px] font-bold mt-1" style={{ color: CATEGORY_COLORS[entry.category] }}>
                        {formatINR(entry.amount)}
                      </p>
                    )}

                    {entry.interestRate != null && (
                      <p className="text-[12px] text-white/40 mt-0.5">{entry.interestRate}% p.a.</p>
                    )}

                    {(entry.startDate || entry.endDate) && (
                      <p className="text-[11px] text-white/30 mt-1">
                        {entry.startDate ? formatDate(entry.startDate) : '—'}
                        {entry.endDate ? ` → ${formatDate(entry.endDate)}` : ''}
                      </p>
                    )}

                    {entry.notes && (
                      <p className="text-[11px] text-white/30 italic mt-1 truncate">{entry.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  /* ────────────── AI CHAT HELPERS ────────────── */
  const examplePrompts = [
    'SBI FD of 2 lakhs at 7.1% maturing March 2026',
    'HDFC home loan 45 lakhs at 8.5% EMI 42000',
    'Monthly salary 85000 from TCS',
    'Invested 50000 in Nifty 50 index fund',
    'LIC policy premium 12000 per year coverage 10 lakhs',
  ];

  const handleChatSubmit = (text?: string) => {
    const msg = text ?? chatInput.trim();
    if (!msg || chatLoading) return;
    setChatMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setChatInput('');
    callGemini(msg);
  };

  /* ────────────── MAIN RENDER ────────────── */
  return (
    <div className="min-h-screen bg-[#070A12] px-5 pt-14 pb-28 relative overflow-hidden">
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
          background: 'radial-gradient(circle, #00F5A028 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
          top: -40,
        }}
      />

      {/* Gold Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,169,110,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
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
            My Finance
          </h1>
          <p className="font-body text-[13px] text-white/35">Your personal financial overview</p>
        </motion.div>

        {/* Tab Bar */}
        <div className="flex mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {['Dashboard', 'Entries'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase() as 'dashboard' | 'entries')}
              className="flex-1 py-3 text-[14px] font-semibold transition-all relative"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: activeTab === tab.toLowerCase() ? '#C9A96E' : 'rgba(255,255,255,0.3)',
              }}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                  style={{ background: '#C9A96E' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderOverview()}
        {activeTab === 'entries' && (
          <>
            {renderEntries()}
            {/* FAB Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { setAddScreenTab('manual'); setShowAddSheet(true); }}
              className="fixed bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center z-50"
              style={{
                background: 'linear-gradient(135deg, #C9A96E, #A87D46)',
                boxShadow: '0 8px 24px rgba(201,169,110,0.4)',
              }}
            >
              <Plus size={24} style={{ color: '#1a0f00' }} strokeWidth={2.5} />
            </motion.button>
          </>
        )}
      </div>

      {/* Add Entry Screen */}
      <AnimatePresence>
        {showAddSheet && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="fixed inset-0 z-[70] bg-[#070A12] flex flex-col"
          >
            {/* Purple orb glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Header */}
            <div className="relative flex items-center gap-3 px-4 pt-14 pb-0">
              <button
                onClick={resetSheet}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.06)]"
              >
                <X size={16} className="text-white/60" />
              </button>
              <h2
                className="text-[16px] font-bold text-white/90 flex-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Add Entry
              </h2>
            </div>

            {/* Tab Bar */}
            <div className="relative flex px-4 mt-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {(['manual', 'ai'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setAddScreenTab(tab)}
                  className="flex-1 py-3 text-[13px] font-semibold transition-all relative"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: addScreenTab === tab ? '#C9A96E' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {tab === 'manual' ? 'ADD MANUALLY' : 'ADD WITH AI'}
                  {addScreenTab === tab && (
                    <motion.div
                      layoutId="add-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                      style={{ background: '#C9A96E' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Swipeable Content */}
            <div
              className="w-full flex-1 overflow-hidden"
              onTouchStart={(e) => {
                (e.currentTarget as any)._touchStartX = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const startX = (e.currentTarget as any)._touchStartX;
                if (startX === undefined) return;
                const diff = e.changedTouches[0].clientX - startX;
                if (Math.abs(diff) > 60) {
                  if (diff < 0 && addScreenTab === 'manual') {
                    setAddScreenTab('ai');
                  } else if (diff > 0 && addScreenTab === 'ai') {
                    setAddScreenTab('manual');
                  }
                }
              }}
            >
              <motion.div
                className="flex h-full"
                animate={{ x: addScreenTab === 'manual' ? '0%' : '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {/* Manual Tab */}
                <div className="w-full h-full shrink-0 overflow-y-auto px-5 py-5 scrollbar-hidden">
                  {/* Step 1: Category Picker */}
                  {manualStep === 1 && !editEntry && (
                    <div className="space-y-4">
                      <p className="text-[12px] text-white/30 text-center">What are you adding?</p>
                      <div className="grid grid-cols-3 gap-2">
                        {ALL_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setManualStep(2);
                            }}
                            className="flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all hover:bg-[rgba(255,255,255,0.06)]"
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            <CategoryIcon category={cat} size={20} />
                            <span className="text-[10px] text-white/50 font-medium text-center leading-tight">
                              {CATEGORY_LABELS[cat]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Form */}
                  {(manualStep === 2 || editEntry) && selectedCategory && (
                    <div className="space-y-4">
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-xl"
                        style={{
                          background: `${CATEGORY_COLORS[selectedCategory]}15`,
                          border: `1px solid ${CATEGORY_COLORS[selectedCategory]}30`,
                        }}
                      >
                        <CategoryIcon category={selectedCategory} />
                        <span className="text-[12px] font-semibold" style={{ color: CATEGORY_COLORS[selectedCategory] }}>
                          {CATEGORY_LABELS[selectedCategory]}
                        </span>
                        {!editEntry && (
                          <button
                            onClick={() => {
                              setManualStep(1);
                              setSelectedCategory(null);
                            }}
                            className="ml-auto text-[11px] text-white/30"
                          >
                            Change
                          </button>
                        )}
                      </div>

                      {renderFormFields()}

                      <button
                        onClick={() => {
                          handleSaveEntry();
                          setManualStep(1);
                          setSelectedCategory(null);
                        }}
                        disabled={!formData.title}
                        className="w-full py-3 rounded-xl text-[14px] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          background: formData.title
                            ? 'linear-gradient(135deg, #C9A96E, #A88B5A)'
                            : 'rgba(201,169,110,0.2)',
                          color: '#070A12',
                        }}
                      >
                        {editEntry ? 'Update Entry' : 'Save Entry'}
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Tab */}
                <div className="w-full h-full shrink-0 flex flex-col">
                  {/* Chat area */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hidden">
                    {chatMessages.length === 0 && (
                      <div className="space-y-4 pt-8">
                        <p className="text-[12px] text-white/30 text-center">Try saying...</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {examplePrompts.map((prompt) => (
                            <button
                              key={prompt}
                              onClick={() => handleChatSubmit(prompt)}
                              className="px-3 py-2 rounded-xl text-[12px] text-white/60 text-left transition-colors hover:bg-[rgba(139,92,246,0.12)]"
                              style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.06)',
                              }}
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'user' ? (
                          <div
                            className="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3 text-[13px] text-white/90"
                            style={{
                              background: 'rgba(201,169,110,0.12)',
                              border: '1px solid rgba(201,169,110,0.2)',
                            }}
                          >
                            {msg.text}
                          </div>
                        ) : msg.entry ? (
                          <div className="max-w-[85%] space-y-2">
                            <div
                              className="rounded-2xl rounded-tl-sm px-4 py-3 text-[13px] text-white/60"
                              style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.06)',
                              }}
                            >
                              {msg.text}
                            </div>
                            <div
                              className="rounded-2xl p-4"
                              style={{
                                background: `${CATEGORY_COLORS[msg.entry.category]}10`,
                                border: `1px solid ${CATEGORY_COLORS[msg.entry.category]}30`,
                              }}
                            >
                              <span
                                className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2"
                                style={{
                                  background: `${CATEGORY_COLORS[msg.entry.category]}20`,
                                  color: CATEGORY_COLORS[msg.entry.category],
                                }}
                              >
                                {CATEGORY_LABELS[msg.entry.category]}
                              </span>
                              <p className="text-[14px] font-bold text-white/90">{msg.entry.title}</p>
                              {msg.entry.institution && (
                                <p className="text-[12px] text-white/40 mt-0.5">{msg.entry.institution}</p>
                              )}
                              {msg.entry.amount != null && (
                                <p className="text-[20px] font-extrabold mt-1" style={{ color: CATEGORY_COLORS[msg.entry.category] }}>
                                  {formatINR(msg.entry.amount)}
                                </p>
                              )}
                              {msg.entry.interestRate != null && (
                                <p className="text-[12px] text-white/40 mt-0.5">{msg.entry.interestRate}% p.a.</p>
                              )}
                              {(msg.entry.startDate || msg.entry.endDate) && (
                                <p className="text-[11px] text-white/30 mt-1">
                                  {msg.entry.startDate ? formatDate(msg.entry.startDate) : '—'}
                                  {msg.entry.endDate ? ` → ${formatDate(msg.entry.endDate)}` : ''}
                                </p>
                              )}
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => {
                                    addEntry({
                                      ...msg.entry!,
                                      id: Date.now().toString(),
                                      createdAt: Date.now(),
                                      updatedAt: Date.now(),
                                    });
                                    refreshProfile();
                                    setPendingEntry(null);
                                    setChatMessages((prev) => [
                                      ...prev,
                                      { role: 'ai', text: '✅ Entry saved! Add another or go back.' },
                                    ]);
                                  }}
                                  className="flex-1 py-2 rounded-xl text-[12px] font-bold text-[#070A12]"
                                  style={{ background: 'linear-gradient(135deg, #C9A96E, #A88B5A)' }}
                                >
                                  ✓ Save Entry
                                </button>
                                <button
                                  onClick={() => {
                                    setChatMessages((prev) => [
                                      ...prev,
                                      { role: 'ai', text: 'Please describe the entry again with more details.' },
                                    ]);
                                    setPendingEntry(null);
                                  }}
                                  className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-white/50"
                                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                  ✗ Try Again
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 text-[13px] text-white/60"
                            style={{
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            {msg.text}
                          </div>
                        )}
                      </div>
                    ))}

                    {chatLoading && (
                      <div className="flex justify-start">
                        <div
                          className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          {[0, 1, 2].map((d) => (
                            <motion.div
                              key={d}
                              className="w-2 h-2 rounded-full bg-[#8B5CF6]"
                              animate={{ y: [0, -6, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: d * 0.15,
                                ease: 'easeInOut',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Input bar */}
                  <div className="px-4 pb-6 pt-2 border-t border-white/5">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleChatSubmit();
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Describe your financial entry..."
                        className="flex-1 bg-[rgba(255,255,255,0.05)] rounded-2xl px-4 py-3 text-[13px] text-white/90 placeholder:text-white/25 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim() || chatLoading}
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
                        style={{ background: '#8B5CF6' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 2L11 13" />
                          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
