import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export type EntryCategory = 'savings_account' | 'current_account' | 'fd' | 'loan' | 'investment' | 'property' | 'asset' | 'liability' | 'income' | 'expense' | 'insurance' | 'other';

export interface FinancialEntry {
  id: string;
  category: EntryCategory;
  title: string;
  institution?: string;
  amount?: number;
  interestRate?: number;
  startDate?: string;
  endDate?: string;
  notes?: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt: number;
  updatedAt: number;
}

export interface UserFinancialProfile {
  name?: string;
  age?: number;
  city?: string;
  employmentType?: string;
  annualIncome?: number;
  entries: FinancialEntry[];
  privacyMode: 'local' | 'cloud';
  lastUpdated: number;
}

export const CATEGORY_COLORS: Record<EntryCategory, string> = {
  savings_account: '#C9A96E',
  current_account: '#C9A96E',
  fd: '#00F5A0',
  loan: '#FB7185',
  investment: '#00E5FF',
  property: '#FF9933',
  asset: '#2DD4BF',
  liability: '#F97316',
  income: '#00F5A0',
  expense: '#FB7185',
  insurance: '#00D4AA',
  other: '#C9A96E',
};

export const CATEGORY_LABELS: Record<EntryCategory, string> = {
  savings_account: 'Savings Account',
  current_account: 'Current Account',
  fd: 'Fixed Deposit',
  loan: 'Loan',
  investment: 'Investment',
  property: 'Property',
  asset: 'Asset',
  liability: 'Liability',
  income: 'Income',
  expense: 'Expense',
  insurance: 'Insurance',
  other: 'Other',
};

const STORAGE_KEY = 'ledger_financial_profile';

function getDefaultProfile(): UserFinancialProfile {
  return {
    entries: [],
    privacyMode: 'local',
    lastUpdated: Date.now(),
  };
}

export function getProfile(): UserFinancialProfile {
  if (typeof window === 'undefined') return getDefaultProfile();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProfile();
    return JSON.parse(raw) as UserFinancialProfile;
  } catch {
    return getDefaultProfile();
  }
}

export function saveProfile(profile: UserFinancialProfile): void {
  if (typeof window === 'undefined') return;
  profile.lastUpdated = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function addEntry(entry: FinancialEntry): void {
  const profile = getProfile();
  profile.entries.push(entry);
  saveProfile(profile);
}

export function updateEntry(id: string, updates: Partial<FinancialEntry>): void {
  const profile = getProfile();
  const idx = profile.entries.findIndex((e) => e.id === id);
  if (idx !== -1) {
    profile.entries[idx] = { ...profile.entries[idx], ...updates, updatedAt: Date.now() };
    saveProfile(profile);
  }
}

export function deleteEntry(id: string): void {
  const profile = getProfile();
  profile.entries = profile.entries.filter((e) => e.id !== id);
  saveProfile(profile);
}

export function getEntries(category?: EntryCategory): FinancialEntry[] {
  const profile = getProfile();
  if (!category) return profile.entries;
  return profile.entries.filter((e) => e.category === category);
}

export async function syncToFirebase(uid: string): Promise<void> {
  const profile = getProfile();
  await setDoc(doc(db, 'users', uid, 'financial_profile', 'main'), profile, { merge: true });
}

export async function loadFromFirebase(uid: string): Promise<void> {
  const snap = await getDoc(doc(db, 'users', uid, 'financial_profile', 'main'));
  if (snap.exists()) {
    const data = snap.data() as UserFinancialProfile;
    saveProfile(data);
  }
}

export function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(2)}Cr`;
  }
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(1)}L`;
  }
  return `${sign}₹${abs.toLocaleString('en-IN')}`;
}

const ASSET_CATEGORIES: EntryCategory[] = ['savings_account', 'current_account', 'fd', 'investment', 'property', 'asset', 'income'];
const LIABILITY_CATEGORIES: EntryCategory[] = ['loan', 'liability', 'expense'];

export function getTotalAssets(entries: FinancialEntry[]): number {
  return entries
    .filter((e) => ASSET_CATEGORIES.includes(e.category))
    .reduce((sum, e) => sum + (e.amount ?? 0), 0);
}

export function getTotalLiabilities(entries: FinancialEntry[]): number {
  return entries
    .filter((e) => LIABILITY_CATEGORIES.includes(e.category))
    .reduce((sum, e) => sum + (e.amount ?? 0), 0);
}

export function getNetWorth(entries: FinancialEntry[]): number {
  return getTotalAssets(entries) - getTotalLiabilities(entries);
}
