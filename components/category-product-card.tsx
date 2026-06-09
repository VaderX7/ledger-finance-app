'use client';

import { motion } from 'framer-motion';
import { Product } from '@/lib/products';

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
    let rate = String(product.metrics.interestRate || 'N/A');
    if (rate.includes('-')) {
      rate = rate.split('-')[0].trim();
    }
    if (!rate.endsWith('%') && rate !== 'N/A') {
      rate = `${rate}%`;
    }
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
  const avatarBgColor = product.color || '#C9A96E';
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
        background: '#0d1117',
        borderTop: '1px solid rgba(0, 229, 255, 0.12)',
        borderRight: '1px solid rgba(0, 229, 255, 0.12)',
        borderBottom: '1px solid rgba(0, 229, 255, 0.12)',
        borderLeft: `3px solid ${product.color || '#C9A96E'}`,
        borderRadius: '16px',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `${product.color}14` }}
      />

      {/* Header Row */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Left: Avatar + Bank Details */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Bank Avatar */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] flex-shrink-0"
            style={{
              backgroundColor: `${avatarBgColor}15`,
              border: `1px solid ${avatarBgColor}35`,
              color: avatarBgColor,
            }}
          >
            {bankInitials}
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
        <span className="text-[28px] font-bold text-[#00F5A0] leading-none tracking-tight">
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
