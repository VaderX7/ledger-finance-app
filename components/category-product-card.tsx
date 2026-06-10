'use client';

import { motion } from 'framer-motion';
import { Product } from '@/lib/products';

const BANK_LOGO_MAP: Record<string, string> = {
  'State Bank of India': 'sbi',
  'Bank of Baroda': 'bob_public',
  'Bank of Baroda Limited': 'bob_public',
  'Bank of Baroda Ltd': 'bob_public',
  'Bank of India': 'boi_public',
  'Bank of India Limited': 'boi_public',
  'Bank of India Ltd': 'boi_public',
  'Bank of Maharashtra': 'bom_public',
  'Bank of Maharashtra Limited': 'bom_public',
  'Bank of Maharashtra Ltd': 'bom_public',
  'Canara Bank': 'canara_public',
  'Canara Bank Limited': 'canara_public',
  'Canara Bank Ltd': 'canara_public',
  'Central Bank of India': 'central_public',
  'Central Bank of India Limited': 'central_public',
  'Central Bank of India Ltd': 'central_public',
  'Indian Bank': 'indianbank_public',
  'Indian Bank Limited': 'indianbank_public',
  'Indian Bank Ltd': 'indianbank_public',
  'Indian Overseas Bank': 'iob_public',
  'Indian Overseas Bank Limited': 'iob_public',
  'Indian Overseas Bank Ltd': 'iob_public',
  'Punjab & Sind Bank': 'punjabsindbank_public',
  'Punjab & Sind Bank Limited': 'punjabsindbank_public',
  'Punjab & Sind Bank Ltd': 'punjabsindbank_public',
  'Punjab National Bank': 'pnb_public',
  'Punjab National Bank Limited': 'pnb_public',
  'Punjab National Bank Ltd': 'pnb_public',
  'UCO Bank': 'uco_public',
  'UCO Bank Limited': 'uco_public',
  'UCO Bank Ltd': 'uco_public',
  'Union Bank of India': 'ubi_public',
  'Union Bank of India Limited': 'ubi_public',
  'Union Bank of India Ltd': 'ubi_public',
  'Axis Bank': 'axis',
  'Axis Bank Limited': 'axis',
  'Bandhan Bank': 'bandhan',
  'CSB Bank': 'csb',
  'CSB Bank (formerly Catholic Syrian Bank)': 'csb',
  'City Union Bank': 'cub',
  'DCB Bank': 'dcb',
  'Dhanlaxmi Bank': 'dhanlaxmi',
  'Federal Bank': 'federal',
  'HDFC Bank': 'hdfc',
  'Housing Development Finance Corporation': 'hdfc',
  'ICICI Bank': 'icici',
  'ICICI Bank Limited': 'icici',
  'IDBI Bank': 'idbi',
  'IDFC FIRST Bank': 'idfc',
  'IDFC First Bank': 'idfc',
  'IDFC Bank': 'idfc',
  'IndusInd Bank': 'indusind',
  'Jammu & Kashmir Bank': 'j&k',
  'Karnataka Bank': 'karnataka',
  'Karur Vysya Bank': 'kvb',
  'Kotak Mahindra Bank': 'kmb',
  'Nainital Bank': 'nainital',
  'RBL Bank': 'rbl',
  'Tamilnad Mercantile Bank': 'tmb',
  'YES BANK': 'yesbank',
  'YES Bank': 'yesbank',
  'South Indian Bank': 'sib',
  'DBS Bank India (Digibank)': 'dbs',
  'Standard Chartered Bank': 'sc',
  'HSBC Bank India': 'hsbc',
  'AU Small Finance Bank': 'au_sfb',
  'AU Small Finance Bank Limited': 'au_sfb',
  'AU Small Finance Bank Ltd': 'au_sfb',
  'Capital Small Finance Bank': 'capital_sfb',
  'Capital Small Finance Bank Limited': 'capital_sfb',
  'Capital Small Finance Bank Ltd': 'capital_sfb',
  'Equitas Small Finance Bank': 'equitas_sfb',
  'Equitas Small Finance Bank Limited': 'equitas_sfb',
  'Equitas Small Finance Bank Ltd': 'equitas_sfb',
  'ESAF Small Finance Bank': 'esaf_sfb',
  'ESAF Small Finance Bank Limited': 'esaf_sfb',
  'ESAF Small Finance Bank Ltd': 'esaf_sfb',
  'Jana Small Finance Bank': 'jana_sfb',
  'Jana Small Finance Bank Limited': 'jana_sfb',
  'Jana Small Finance Bank Ltd': 'jana_sfb',
  'North East Small Finance Bank': 'northeast_sfb',
  'North East Small Finance Bank Limited': 'northeast_sfb',
  'North East Small Finance Bank Ltd': 'northeast_sfb',
  'Northeast Small Finance Bank': 'northeast_sfb',
  'Northeast Small Finance Bank Limited': 'northeast_sfb',
  'Northeast Small Finance Bank Ltd': 'northeast_sfb',
  'Shivalik Small Finance Bank': 'shivalik_sfb',
  'Shivalik Small Finance Bank Limited': 'shivalik_sfb',
  'Shivalik Small Finance Bank Ltd': 'shivalik_sfb',
  'Suryoday Small Finance Bank': 'suryoday_sfb',
  'Suryoday Small Finance Bank Limited': 'suryoday_sfb',
  'Suryoday Small Finance Bank Ltd': 'suryoday_sfb',
  'Ujjivan Small Finance Bank': 'ujjivan_sfb',
  'Ujjivan Small Finance Bank Limited': 'ujjivan_sfb',
  'Ujjivan Small Finance Bank Ltd': 'ujjivan_sfb',
  'Unity Small Finance Bank': 'unity_sfb',
  'Unity Small Finance Bank Limited': 'unity_sfb',
  'Unity Small Finance Bank Ltd': 'unity_sfb',
  'Utkarsh Small Finance Bank': 'utkarsh_sfb',
  'Utkarsh Small Finance Bank Limited': 'utkarsh_sfb',
  'Utkarsh Small Finance Bank Ltd': 'utkarsh_sfb',
  'Airtel Payments Bank': 'airtel_pb',
  'Airtel Payments Bank Limited': 'airtel_pb',
  'Airtel Payments Bank Ltd': 'airtel_pb',
  'Fino Payments Bank': 'fino_pb',
  'Fino Payments Bank Limited': 'fino_pb',
  'Fino Payments Bank Ltd': 'fino_pb',
  'Jio Payments Bank': 'jio_pb',
  'Jio Payments Bank Limited': 'jio_pb',
  'Jio Payments Bank Ltd': 'jio_pb',
  'NSDL Payments Bank': 'nsdl_pb',
  'NSDL Payments Bank Limited': 'nsdl_pb',
  'NSDL Payments Bank Ltd': 'nsdl_pb',
  'Paytm Payments Bank': 'paytm_pb',
  'Paytm Payments Bank Limited': 'paytm_pb',
  'Paytm Payments Bank Ltd': 'paytm_pb',
};

const LOGO_BG_MAP: Record<string, string> = {
  'Bank of India': '#017dc5',
  'Bank of India Limited': '#017dc5',
  'Canara Bank': '#0069df',
  'Canara Bank Limited': '#0069df',
  'IDFC FIRST Bank': '#9e1d28',
  'IDFC First Bank': '#9e1d28',
  'YES BANK': '#004489',
  'YES Bank': '#004489',
  'AU Small Finance Bank': '#ee7025',
  'IDBI Bank': '#299a85',
  'Karur Vysya Bank': '#d1d01d',
  'South Indian Bank': '#c4171c',
  'Capital Small Finance Bank': '#d10e14',
  'Unity Small Finance Bank': '#fdc937',
};

function generateCardShade(baseColor: string, index: number): { color: string; colorAccent: string } {
  // Parse the base hex color and shift hue/lightness slightly per index
  const shadeVariants = [
    { lighten: 0  },   // index 0: original base color
    { lighten: 35 },   // index 1: noticeably lighter
    { lighten: -30 },  // index 2: noticeably darker
    { lighten: 50 },   // index 3: much lighter/pastel
    { lighten: -45 },  // index 4: much darker/deep
    { lighten: 20 },   // index 5: medium light
    { lighten: -20 },  // index 6: medium dark
    { lighten: 60 },   // index 7: very light
    { lighten: -55 },  // index 8: very deep
    { lighten: 40 },   // index 9: bright
  ];

  const variant = shadeVariants[index % shadeVariants.length];

  // Use CSS color-mix or a simple hex manipulation
  // Easiest: mix the base color with white (lighten) or black (darken)
  const mixRatio = Math.abs(variant.lighten);
  const mixColor = variant.lighten > 0 ? '#ffffff' : '#000000';

  // Return as CSS color-mix string for the color, slightly shifted accent
  return {
    color: `color-mix(in srgb, ${baseColor} ${100 - mixRatio}%, ${mixColor})`,
    colorAccent: `color-mix(in srgb, ${baseColor} ${90 - mixRatio}%, ${variant.lighten > 0 ? '#ffffff' : '#001133'})`,
  };
}

interface CategoryProductCardProps {
  product: Product;
  index: number;
  onJargonClick?: (term: string) => void;
  onDetailsClick: (product: Product) => void;
}

function getBankInitials(lender: string): string {
  if (!lender) return 'BK';
  const lenderLower = lender.toLowerCase();
  if (lenderLower.includes('state bank of india') || lenderLower.includes('sbi')) return 'SB';
  if (lenderLower.includes('housing development') || lenderLower.includes('hdfc')) return 'HD';
  if (lenderLower.includes('icici')) return 'IC';
  if (lenderLower.includes('axis')) return 'AX';
  if (lenderLower.includes('equitas')) return 'EQ';
  if (lenderLower.includes('bajaj')) return 'BJ';
  if (lenderLower.includes('sidbi') || lenderLower.includes('mudra')) return 'SD';
  
  const words = lender.split(/\s+/).filter(w => w.length > 0);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return lender.substring(0, 2).toUpperCase();
}

function formatLenderName(lender: string): string {
  if (!lender) return '';
  const lower = lender.toLowerCase();
  if (lower.includes('state bank of india')) return 'SBI';
  if (lower.includes('housing development') || lower.includes('hdfc')) return 'HDFC Bank';
  if (lower.includes('icici')) return 'ICICI Bank';
  if (lower.includes('axis')) return 'Axis Bank';
  if (lower.includes('equitas')) return 'Equitas Bank';
  if (lower.includes('bajaj')) return 'Bajaj Finserv';
  if (lower.includes('sidbi')) return 'SIDBI';
  if (lower.includes('mudra')) return 'Mudra Scheme';
  return lender;
}

function getFormattedBankType(bankType: string): string {
  if (!bankType) return '';
  const bt = bankType.toLowerCase();
  if (bt === 'sfb') return 'SFB';
  if (bt === 'nbfc') return 'NBFC';
  if (bt === 'payments') return 'Payments';
  return bt.charAt(0).toUpperCase() + bt.slice(1);
}

function formatMinBalance(balance: string | number | undefined): string {
  if (balance === undefined || balance === null) return '₹0';
  const balanceStr = String(balance).toLowerCase().trim();
  if (balanceStr === 'nil' || balanceStr === '0' || balanceStr === '₹0' || balanceStr === 'none') return '₹0';
  if (balanceStr.includes('k')) return balanceStr;
  
  const str = balanceStr.replace(/[,]/g, '');
  const match = str.match(/₹?\s*(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num >= 1000) {
      return `₹${Math.round(num / 1000)}k`;
    }
    return `₹${num}`;
  }
  return String(balance);
}

function getProductMetricHighlight(product: Product) {
  const cat = product.category;
  
  if (cat === 'savings') {
    const interestRate = String(product.metrics.interestRate || 'N/A');
    const rate = interestRate.match(/[\d.]+%/)?.[0] ?? interestRate;
    let minBal = String(product.metrics.minBalance || '₹0');
    if (product.id === 'hdfc-savings' || minBal === '₹10,000' || minBal === '10000') {
      minBal = '₹10k';
    } else {
      minBal = formatMinBalance(minBal);
    }
    return {
      value: rate,
      subtitle: `p.a. interest · ${minBal} min balance`
    };
  }
  
  if (cat === 'fds') {
    let yieldVal = String(product.metrics.baseYield || 'N/A');
    if (yieldVal.includes('-')) {
      yieldVal = yieldVal.split('-')[0].trim();
    }
    if (!yieldVal.endsWith('%') && yieldVal !== 'N/A') {
      yieldVal = `${yieldVal}%`;
    }
    const tenure = String(product.metrics.tenureRange || 'N/A');
    return {
      value: yieldVal,
      subtitle: `p.a. yield · ${tenure} tenure`
    };
  }
  
  if (cat === 'loans') {
    let rate = String(product.metrics.minRate || 'N/A');
    if (rate.includes('-')) {
      rate = rate.split('-')[0].trim();
    }
    const tenure = String(product.metrics.maxTenure || 'N/A');
    return {
      value: rate.endsWith('%') ? rate : `${rate}%`,
      subtitle: `p.a. starting rate · ${tenure} max tenure`
    };
  }
  
  if (cat === 'creditcards') {
    const joining = String(product.metrics.joiningFee || '₹0');
    const annual = String(product.metrics.annualFee || '₹0');
    return {
      value: joining,
      subtitle: `joining fee · ${annual} annual`
    };
  }
  
  if (cat === 'current') {
    let mab = String(product.metrics.monthlyAvgBalance || 'N/A');
    if (mab.includes('-')) {
      mab = mab.split('-')[0].trim();
    }
    const deposit = String(product.metrics.freeCashDeposit || 'N/A');
    return {
      value: mab,
      subtitle: `avg balance · ${deposit} free deposit`
    };
  }
  
  // Fallback
  const firstKey = Object.keys(product.metrics)[0];
  const firstVal = String(product.metrics[firstKey] || 'N/A');
  return {
    value: firstVal,
    subtitle: firstKey ? firstKey.replace(/([A-Z])/g, ' $1').toLowerCase() : 'primary metric'
  };
}

export default function CategoryProductCard({
  product,
  index,
  onDetailsClick,
}: CategoryProductCardProps) {
  const isTopPick = product.topPick || ['hdfc-savings', 'equitas-savings', 'hdfc-fd', 'icici-cc', 'mudra-shishu'].includes(product.id);
  
  const bankInitials = getBankInitials(product.lender);
  const baseColor = product.color || '#C9A96E';
  const { color: cardColor, colorAccent: cardColorAccent } = generateCardShade(baseColor, index);
  const bankTypeLabel = getFormattedBankType(product.bankType);

  const isProtected = product.category === 'savings' || product.category === 'fds' || 
                      product.highlights.some(h => h.toLowerCase().includes('dicgc')) || 
                      product.description.toLowerCase().includes('dicgc');
                      
  const subtitleText = `${bankTypeLabel} · ${isProtected ? 'DICGC Protected' : 'RBI Registered'}`;

  const metricHighlight = getProductMetricHighlight(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: index * 0.05 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onDetailsClick(product)}
      className="relative overflow-hidden cursor-pointer group p-4 flex flex-col justify-between"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${cardColor} 22%, transparent) 0%, color-mix(in srgb, ${cardColorAccent} 8%, transparent) 100%), #0d1117`,
        borderTop: `1px solid color-mix(in srgb, ${cardColor} 50%, transparent)`,
        borderRight: `1px solid color-mix(in srgb, ${cardColor} 50%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, ${cardColor} 50%, transparent)`,
        borderLeft: `6px solid ${cardColor}`,
        borderRadius: '16px',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `color-mix(in srgb, ${cardColor} 14%, transparent)` }}
      />

      {/* Header Row */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Left: Avatar + Bank Details */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Bank Avatar */}
          <div
            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center p-[6px] overflow-hidden"
            style={{
              background: LOGO_BG_MAP[product.lender] ?? '#FFFFFF',
              border: `1px solid color-mix(in srgb, ${cardColor} 40%, transparent)`,
              boxShadow: `0 0 10px color-mix(in srgb, ${cardColor} 35%, transparent), 0 2px 8px rgba(0,0,0,0.15)`,
            }}
          >
            <img 
              src={`/logos/${BANK_LOGO_MAP[product.lender] || product.lender.toLowerCase().replace(/bank/gi, '').replace(/[^a-z0-9]/g, '').trim()}.png`} 
              alt={product.lender} 
              className="w-full h-full object-contain" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          
          {/* Bank Name + Subtitle */}
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-bold text-white leading-tight truncate">
              {formatLenderName(product.lender)}
            </span>
            <span className="text-[11px] text-white/40 leading-tight mt-0.5 font-body">
              {subtitleText}
            </span>
          </div>
        </div>

        {/* Right: Top Pick Badge */}
        {isTopPick && (
          <div 
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
            style={{
              backgroundColor: 'rgba(0, 229, 255, 0.08)',
              color: '#00E5FF',
              border: '1px solid rgba(0, 229, 255, 0.25)',
            }}
          >
            <span className="text-[10px] leading-none">★</span>
            <span>Top Pick</span>
          </div>
        )}
      </div>

      {/* Divider 1 */}
      <div className="border-t border-white/[0.05] my-3" />

      {/* Product Name */}
      <div className="relative z-10">
        <h3
          className="text-[20px] font-bold text-white tracking-tight leading-snug"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {product.name}
        </h3>
      </div>

      {/* Key Metric Highlight */}
      <div className="relative z-10 flex items-baseline gap-2 mt-2.5">
        <span 
          className="text-[28px] font-bold leading-none tracking-tight"
          style={{ color: cardColor }}
        >
          {metricHighlight.value}
        </span>
        <span className="text-[12px] text-white/35 font-body">
          {metricHighlight.subtitle}
        </span>
      </div>

      {/* Divider 2 */}
      <div className="border-t border-white/[0.05] my-3" />

      {/* Tags Row */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Highlights */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.highlights.slice(0, 3).map((h) => (
            <span
              key={h}
              className="px-2 py-0.5 rounded text-[10px] font-body text-white/40 bg-white/[0.02] border border-white/[0.08]"
            >
              {h}
            </span>
          ))}
        </div>

        {/* View Details Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDetailsClick(product);
          }}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all duration-300 hover:bg-[#00E5FF]/10 flex-shrink-0"
          style={{
            borderColor: 'rgba(0, 229, 255, 0.35)',
            color: '#00E5FF',
            background: 'transparent',
          }}
        >
          <span>View details</span>
          <span>→</span>
        </button>
      </div>
    </motion.div>
  );
}
