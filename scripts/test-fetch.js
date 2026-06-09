const BASE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSGWM40JwxQ_b3EQf288e5S1I_5DKjZy3HH-EidhMeBWaBGUbnn2381vr-ukaEt9WTrU9RTpny1JEgi/pub';
const url = `${BASE}?gid=1872951396&single=true&output=csv`;

function parseCSVLine(line) {
  const result = [];
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

async function run() {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  const savingsProducts = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, idx) => { row[h.trim()] = (values[idx] ?? '').trim(); });
    
    const lender = row['lender'];
    const bankType = row['bankType'];
    const category = row['category'];
    const name = row['name'];
    
    // Normalize bankType
    let bt = (bankType || '').trim().toLowerCase();
    const lenderLower = (lender || '').toLowerCase();
    if (bt.includes('sfb') || bt.includes('small finance') || lenderLower.includes('small finance') || lenderLower.includes('sfb')) {
      bt = 'sfb';
    } else if (bt.includes('payment') || lenderLower.includes('payment')) {
      bt = 'payments';
    } else if (bt.includes('public')) {
      bt = 'public';
    } else if (bt.includes('private')) {
      bt = 'private';
    } else {
      bt = 'private';
    }
    
    if (category === 'savings') {
      savingsProducts.push({ lender, name, rawType: bankType, resolvedType: bt });
    }
  }
  console.log(`TOTAL SAVINGS PRODUCTS: ${savingsProducts.length}`);
  console.log(JSON.stringify(savingsProducts, null, 2));
}

run();
