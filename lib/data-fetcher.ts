import { Product, BankType, ProductCategory } from './products';

const BASE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSGWM40JwxQ_b3EQf288e5S1I_5DKjZy3HH-EidhMeBWaBGUbnn2381vr-ukaEt9WTrU9RTpny1JEgi/pub';

const SHEET_URLS: Partial<Record<ProductCategory, string>> = {
  savings: `${BASE}?gid=1872951396&single=true&output=csv`,
  fds: `${BASE}?gid=568132012&single=true&output=csv`,
  loans: `${BASE}?gid=1410955768&single=true&output=csv`,
  creditcards: `${BASE}?gid=211788568&single=true&output=csv`,
  current: `${BASE}?gid=949941536&single=true&output=csv`,
  govtschemes: `${BASE}?gid=230854347&single=true&output=csv`,
  insurance: `${BASE}?gid=81767275&single=true&output=csv`,
};

const FALLBACK_URL = `${BASE}?output=csv`;

const FD_RATES_URL = `${BASE}?gid=525203686&single=true&output=csv`;

export interface TenureRate {
  fd_id: string;
  lender: string;
  tenure_label: string;
  tenure_days: number;
  rate_general: number;
  rate_senior: number;
  is_special_tenure: string;
  notes: string;
}

const CACHE_DURATION_MS = 5 * 60 * 1000;
const cacheMap = new Map<string, { data: Product[]; fetchedAt: number }>();
const fdRatesCache = new Map<string, { data: TenureRate[]; fetchedAt: number }>();

async function fetchFromSheet(url: string, cacheKey: string): Promise<Product[]> {
  const cached = cacheMap.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < CACHE_DURATION_MS) {
    return cached.data;
  }
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
    const csv = await res.text();
    const data = parseCSV(csv);
    cacheMap.set(cacheKey, { data, fetchedAt: Date.now() });
    return data;
  } catch (err) {
    console.error(`[SUTRA] Failed to fetch (${cacheKey}):`, err);
    return cacheMap.get(cacheKey)?.data ?? [];
  }
}

export async function getProducts(): Promise<Product[]> {
  const categories: ProductCategory[] = ['savings', 'fds', 'loans', 'current', 'creditcards', 'govtschemes', 'insurance'];
  const results = await Promise.all(categories.map((c) => getProductsByCategory(c)));
  return results.flat();
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const url = SHEET_URLS[category];
  if (url) return fetchFromSheet(url, category);
  const all = await fetchFromSheet(FALLBACK_URL, 'fallback');
  return all.filter((p) => p.category === category);
}

export async function filterProductsByBankType(
  category: ProductCategory,
  bankTypes: BankType[]
): Promise<Product[]> {
  const products = await getProductsByCategory(category);
  if (bankTypes.length === 0) return products;
  return products.filter((p) => bankTypes.includes(p.bankType));
}

function parseCSV(csv: string): Product[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  const products: Product[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h.trim()] = (values[idx] ?? '').trim(); });
    // Skip empty or placeholder rows that don't have core product info
    if (!row['id'] || !row['name'] || !row['lender']) {
      continue;
    }
    try { products.push(rowToProduct(row)); }
    catch (e) { console.warn(`[SUTRA] Skipped row ${i + 1}:`, e); }
  }
  return products;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current); current = '';
    } else current += char;
  }
  result.push(current);
  return result;
}

function parseTenureRates(csv: string): TenureRate[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  const rates: TenureRate[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h.trim()] = (values[idx] ?? '').trim(); });
    if (!row['fd_id'] || !row['tenure_label']) continue;
    rates.push({
      fd_id: row['fd_id'],
      lender: row['lender'] || '',
      tenure_label: row['tenure_label'],
      tenure_days: Number(row['tenure_days']) || 0,
      rate_general: Number(row['rate_general']) || 0,
      rate_senior: Number(row['rate_senior']) || 0,
      is_special_tenure: row['is_special_tenure'] || 'No',
      notes: row['notes'] || '',
    });
  }
  return rates;
}

export async function fetchFDRates(fdId: string): Promise<TenureRate[]> {
  const cacheKey = `fd_rates_${fdId}`;
  const cached = fdRatesCache.get('fd_rates_all');
  if (cached && Date.now() - cached.fetchedAt < CACHE_DURATION_MS) {
    return cached.data.filter((r) => r.fd_id === fdId);
  }
  try {
    const res = await fetch(FD_RATES_URL, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`FD Rates fetch failed: ${res.status}`);
    const csv = await res.text();
    const allRates = parseTenureRates(csv);
    fdRatesCache.set('fd_rates_all', { data: allRates, fetchedAt: Date.now() });
    return allRates.filter((r) => r.fd_id === fdId);
  } catch (err) {
    console.error(`[SUTRA] Failed to fetch FD rates:`, err);
    return fdRatesCache.get('fd_rates_all')?.data.filter((r) => r.fd_id === fdId) ?? [];
  }
}

function rowToProduct(row: Record<string, string>): Product {
  const arr = (val: string) => val ? val.split('|').map((s) => s.trim()).filter(Boolean) : [];
  const metrics: Record<string, string | number> = {};
  for (let n = 1; n <= 6; n++) {
    const key = row[`metrics_key${n}`];
    const val = row[`metrics_val${n}`];
    if (key && val) metrics[key] = isNaN(Number(val)) || val === '' ? val : Number(val);
  }
  const product: Product = {
    id: row['id'],
    name: row['name'],
    lender: row['lender'],
    bankType: (() => {
      const bt = (row['bankType'] || '').trim().toLowerCase();
      const lender = (row['lender'] || '').toLowerCase();
      if (bt.includes('sfb') || bt.includes('small finance') || lender.includes('small finance') || lender.includes('sfb')) return 'sfb';
      if (bt.includes('payment') || lender.includes('payment')) return 'payments';
      if (bt.includes('public')) return 'public';
      if (bt.includes('private')) return 'private';
      if (bt.includes('nbfc')) return 'nbfc';
      return 'private'; // default fallback
    })() as BankType,
    category: row['category'] as ProductCategory,
    description: row['description'],
    highlights: arr(row['highlights']),
    documents: arr(row['documents']),
    color: row['color'],
    colorAccent: row['colorAccent'],
    portalUrl: row['portalUrl'],
    topPick: row['topPick'] === 'true' || ['hdfc-savings', 'equitas-savings', 'hdfc-fd', 'icici-cc', 'mudra-shishu'].includes(row['id']),
    metrics,
  };
  if (row['minAge']) product.minAge = Number(row['minAge']);
  if (row['maxAge']) product.maxAge = Number(row['maxAge']);
  if (row['minAnnualIncome']) product.minAnnualIncome = Number(row['minAnnualIncome']);
  if (row['maxAnnualIncome']) product.maxAnnualIncome = Number(row['maxAnnualIncome']);
  if (row['employmentTypes']) {
    product.employmentTypes = arr(row['employmentTypes']) as ('salaried' | 'self-employed')[];
  }
  return product;
}