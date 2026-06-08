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

const CACHE_DURATION_MS = 5 * 60 * 1000;
const cacheMap = new Map<string, { data: Product[]; fetchedAt: number }>();

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
    bankType: row['bankType'] as BankType,
    category: row['category'] as ProductCategory,
    description: row['description'],
    highlights: arr(row['highlights']),
    documents: arr(row['documents']),
    color: row['color'],
    colorAccent: row['colorAccent'],
    portalUrl: row['portalUrl'],
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