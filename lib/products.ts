export type BankType = 'public' | 'private' | 'sfb' | 'nbfc' | 'payments';

export type ProductCategory = 'savings' | 'loans' | 'current' | 'fds' | 'creditcards' | 'govtschemes' | 'insurance';

export type Product = {
  id: string;
  name: string;
  lender: string;
  bankType: BankType;
  category: ProductCategory;
  description: string;
  highlights: string[];
  documents: string[];
  color: string;
  colorAccent: string;
  portalUrl: string;
  // Eligibility
  minAge?: number;
  maxAge?: number;
  minAnnualIncome?: number;
  maxAnnualIncome?: number;
  employmentTypes?: ('salaried' | 'self-employed')[];
  // Metrics - polymorphic based on category
  metrics: Record<string, string | number>;
};

const jargonTerms = [
  'NBFC',
  'DICGC Protected',
  'Tenure',
  'Foreclosure Fee',
  'RBI Registered',
  'MAB',
  'Fuel Surcharge',
  'Maturity Yield',
  'Sr. Citizen Bonus',
  'Sweep-Out',
  'ACH',
  'SI Mandates',
  'DBT',
  'Relationship Value',
  'UHNI',
  'KYC',
  'FD',
  'BSBDA',
  'Rupay Card',
  'NRE',
  'NRO',
  'RFC',
  'Repatriation',
  'GST',
  'Parental Controls',
  'Cashback',
  'Personal Accident Insurance',
  'Debit Card',
];

export const products: Product[] = [
  // SAVINGS ACCOUNTS
  {
    id: 'sbi-savings',
    name: 'SBI Savings Account',
    lender: 'State Bank of India',
    bankType: 'public',
    category: 'savings',
    description:
      'Flexible savings account with zero MAB requirement. RBI Registered and fully DICGC Protected up to ₹5 lakhs. Earn interest on daily balance with no minimum balance penalty.',
    highlights: ['Zero MAB', 'DICGC Protected', 'Free card issuance', 'Online banking'],
    documents: ['ID proof', 'Address proof', 'PAN card'],
    color: '#C9A96E',
    colorAccent: '#00F5A0',
    portalUrl: 'https://www.sbi.co.in/web/personal-banking/savings-account',
    minAge: 18,
    maxAge: 100,
    minAnnualIncome: 0,
    employmentTypes: ['salaried', 'self-employed'],
    metrics: {
      interestRate: '2.50%',
      minBalance: '₹0',
      cardType: 'Debit Card Free',
      benefits: 'Life Insurance Coverage',
    },
  },
  {
    id: 'hdfc-savings',
    name: 'HDFC Savings Account',
    lender: 'Housing Development Finance Corporation',
    bankType: 'private',
    category: 'savings',
    description:
      'Premium savings account designed for modern banking. Zero MAB for regular account. Tiered interest rates on savings up to 3.5% on credit balances.',
    highlights: ['Competitive rates', 'Premium debit card', 'Cashback benefits', 'Mobile banking'],
    documents: ['ID proof', 'Address proof', 'PAN card'],
    color: '#38BDF8',
    colorAccent: '#00F5A0',
    portalUrl: 'https://www.hdfcbank.com/personal/savings-account',
    minAge: 18,
    maxAge: 100,
    minAnnualIncome: 0,
    employmentTypes: ['salaried', 'self-employed'],
    metrics: {
      interestRate: '3.00% - 3.50%',
      minBalance: '₹0',
      cardType: 'Premium Debit Card',
      benefits: 'Reward Points on Purchases',
    },
  },
  {
    id: 'equitas-savings',
    name: 'Equitas Savings Account',
    lender: 'Equitas Small Finance Bank',
    bankType: 'sfb',
    category: 'savings',
    description:
      'Small Finance Bank savings account with competitive rates and minimal documentation. DICGC Protected with flexible withdrawal options.',
    highlights: ['Higher interest rates', 'Low documentation', 'DICGC Protected', 'Fast processing'],
    documents: ['Aadhar card', 'Address proof'],
    color: '#2DD4BF',
    colorAccent: '#00F5A0',
    portalUrl: 'https://www.equitasbank.com/savings-account',
    minAge: 18,
    maxAge: 100,
    minAnnualIncome: 0,
    employmentTypes: ['salaried', 'self-employed'],
    metrics: {
      interestRate: '4.00% - 4.50%',
      minBalance: '₹1,000',
      cardType: 'Standard Debit Card',
      benefits: 'Cashback Rewards',
    },
  },

  // LOANS
  {
    id: 'sbi-personal-loan',
    name: 'SBI Personal Loan',
    lender: 'State Bank of India',
    bankType: 'public',
    category: 'loans',
    description:
      'Flexible unsecured personal loan from India\'s largest bank. RBI Registered with transparent pricing and flexible repayment tenure.',
    highlights: ['Quick approval', 'Transparent terms', 'Part prepayment allowed', 'Competitive rates'],
    documents: ['Salary slips (3 months)', 'Bank statements (6 months)', 'ITR (2 years)', 'ID proof'],
    color: '#C9A96E',
    colorAccent: '#00E5FF',
    portalUrl: 'https://www.sbi.co.in/web/personal-banking/loans/personal-loan',
    minAge: 23,
    maxAge: 65,
    minAnnualIncome: 300000,
    employmentTypes: ['salaried'],
    metrics: {
      rateType: 'Floating Rate',
      minRate: '9.50%',
      maxRate: '16.00%',
      maxTenure: '60 months',
      processingFee: '0.35%',
      collateralRequired: 'No',
    },
  },
  {
    id: 'hdfc-personal-loan',
    name: 'HDFC Personal Loan',
    lender: 'Housing Development Finance Corporation',
    bankType: 'private',
    category: 'loans',
    description:
      'Fast unsecured personal loan with minimal documentation. Quick disbursement within 24 hours. NBFC-backed with RBI registration.',
    highlights: ['24-hour disbursement', 'Minimal docs', 'Flexible tenure', 'Top-up available'],
    documents: ['Salary slips (3 months)', 'Bank statements (3 months)', 'ITR (1 year)', 'PAN card'],
    color: '#38BDF8',
    colorAccent: '#00E5FF',
    portalUrl: 'https://www.hdfcbank.com/personal-loans',
    minAge: 23,
    maxAge: 60,
    minAnnualIncome: 250000,
    employmentTypes: ['salaried', 'self-employed'],
    metrics: {
      rateType: 'Fixed + Floating',
      minRate: '10.25%',
      maxRate: '17.50%',
      maxTenure: '60 months',
      processingFee: '2.00%',
      collateralRequired: 'No',
    },
  },
  {
    id: 'mudra-shishu',
    name: 'Mudra Loan - Shishu',
    lender: 'SIDBI Mudra Scheme',
    bankType: 'nbfc',
    category: 'loans',
    description:
      'Government-backed micro business loan with zero processing fee. RBI Registered scheme perfect for entrepreneurs with minimal collateral.',
    highlights: ['Zero processing fee', 'Government backed', 'Fast approval', 'Low collateral'],
    documents: ['Business registration', 'Aadhar card', 'Bank statements (3 months)', 'Project report'],
    color: '#2DD4BF',
    colorAccent: '#00E5FF',
    portalUrl: 'https://www.mudracard.com',
    minAge: 18,
    maxAge: 65,
    minAnnualIncome: 50000,
    employmentTypes: ['self-employed'],
    metrics: {
      rateType: 'Fixed Rate',
      minRate: '6.00%',
      maxRate: '8.50%',
      maxTenure: '60 months',
      processingFee: '0%',
      collateralRequired: 'Minimal',
    },
  },

  // CURRENT ACCOUNTS
  {
    id: 'sbi-current',
    name: 'SBI Current Account',
    lender: 'State Bank of India',
    bankType: 'public',
    category: 'current',
    description:
      'Comprehensive current account for businesses. Free cash deposits and competitive liquidity management tools. RBI Regulated with full online control.',
    highlights: ['Free deposits', 'Online banking', 'Liquidity management', 'Bulk transactions'],
    documents: ['Business registration', 'MOA/AOA', 'Address proof', 'PAN certificate'],
    color: '#C9A96E',
    colorAccent: '#00E5FF',
    portalUrl: 'https://www.sbi.co.in/web/business-banking/current-account',
    minAge: 21,
    maxAge: 100,
    minAnnualIncome: 1000000,
    employmentTypes: ['self-employed'],
    metrics: {
      monthlyAvgBalance: '₹25,000 - ₹50,000',
      freeCashDeposit: 'Unlimited',
      transactionCap: 'No limit',
      chequeBook: '100 leaves free',
    },
  },
  {
    id: 'icici-current',
    name: 'ICICI Current Account',
    lender: 'ICICI Bank Limited',
    bankType: 'private',
    category: 'current',
    description:
      'Advanced current account with sophisticated banking features. Flexible balance requirements and comprehensive transaction management.',
    highlights: ['Advanced analytics', 'Flexible balance', 'Efficient settlements', 'API integration'],
    documents: ['Business registration', 'MOA/AOA', 'PAN certificate', 'GST certificate'],
    color: '#38BDF8',
    colorAccent: '#00E5FF',
    portalUrl: 'https://www.icicibank.com/business/current-account',
    minAge: 21,
    maxAge: 100,
    minAnnualIncome: 1500000,
    employmentTypes: ['self-employed'],
    metrics: {
      monthlyAvgBalance: '₹50,000 - ₹100,000',
      freeCashDeposit: '₹10L per month',
      transactionCap: 'Unlimited above MAB',
      chequeBook: '200 leaves free',
    },
  },
  {
    id: 'axis-current',
    name: 'Axis Current Account',
    lender: 'Axis Bank Limited',
    bankType: 'private',
    category: 'current',
    description:
      'Modern current account built for digital businesses. Integrated payment solutions and real-time transaction processing.',
    highlights: ['Digital integration', 'Real-time processing', 'API enabled', 'Scalable solutions'],
    documents: ['Business registration', 'MOA/AOA', 'GST certificate', 'Bank statements'],
    color: '#FB7185',
    colorAccent: '#00E5FF',
    portalUrl: 'https://www.axisbank.com/business/current-account',
    minAge: 21,
    maxAge: 100,
    minAnnualIncome: 1200000,
    employmentTypes: ['self-employed'],
    metrics: {
      monthlyAvgBalance: '₹40,000 - ₹75,000',
      freeCashDeposit: '₹15L per month',
      transactionCap: 'Unlimited',
      chequeBook: '150 leaves free',
    },
  },

  // FIXED DEPOSITS
  {
    id: 'sbi-fd',
    name: 'SBI Fixed Deposit',
    lender: 'State Bank of India',
    bankType: 'public',
    category: 'fds',
    description:
      'Safe and secure FD from India\'s largest bank. DICGC Protected up to ₹5 lakhs. Flexible tenure options with attractive returns.',
    highlights: ['DICGC Protected', 'Flexible tenure', 'Monthly payouts', 'Senior citizen benefit'],
    documents: ['ID proof', 'Address proof', 'PAN card', 'Bank account details'],
    color: '#C9A96E',
    colorAccent: '#00F5A0',
    portalUrl: 'https://www.sbi.co.in/web/personal-banking/deposits/fixed-deposit',
    minAge: 18,
    maxAge: 100,
    minAnnualIncome: 0,
    employmentTypes: ['salaried', 'self-employed'],
    metrics: {
      baseYield: '7.25%',
      seniorCitizenBonus: '+0.50%',
      tenureRange: '7 days to 10 years',
      dicgcProtection: 'Up to ₹5 Lakhs',
    },
  },
  {
    id: 'hdfc-fd',
    name: 'HDFC Fixed Deposit',
    lender: 'Housing Development Finance Corporation',
    bankType: 'private',
    category: 'fds',
    description:
      'Premium FD offering competitive rates and flexible options. DICGC Protected with guaranteed maturity yields.',
    highlights: ['Competitive rates', 'Liquid option', 'Monthly interest', 'Senior citizen rates'],
    documents: ['ID proof', 'Address proof', 'PAN card', 'Bank account details'],
    color: '#38BDF8',
    colorAccent: '#00F5A0',
    portalUrl: 'https://www.hdfcbank.com/personal/fixed-deposit',
    minAge: 18,
    maxAge: 100,
    minAnnualIncome: 0,
    employmentTypes: ['salaried', 'self-employed'],
    metrics: {
      baseYield: '7.50% - 7.75%',
      seniorCitizenBonus: '+0.75%',
      tenureRange: '7 days to 10 years',
      dicgcProtection: 'Up to ₹5 Lakhs',
    },
  },
  {
    id: 'equitas-fd',
    name: 'Equitas FD',
    lender: 'Equitas Small Finance Bank',
    bankType: 'sfb',
    category: 'fds',
    description:
      'High-yield FD from trusted Small Finance Bank. Competitive rates reaching 8.50% for select tenures. DICGC Protected.',
    highlights: ['Highest rates', 'Quick processing', 'DICGC Protected', 'Flexible tenure'],
    documents: ['ID proof', 'Address proof', 'Aadhar card', 'Bank account'],
    color: '#2DD4BF',
    colorAccent: '#00F5A0',
    portalUrl: 'https://www.equitasbank.com/fixed-deposit',
    minAge: 18,
    maxAge: 100,
    minAnnualIncome: 0,
    employmentTypes: ['salaried', 'self-employed'],
    metrics: {
      baseYield: '8.00% - 8.50%',
      seniorCitizenBonus: '+0.50%',
      tenureRange: '7 days to 10 years',
      dicgcProtection: 'Up to ₹5 Lakhs',
    },
  },
  {
    id: 'bajaj-fd',
    name: 'Bajaj Finserv FD',
    lender: 'Bajaj Finance Limited',
    bankType: 'nbfc',
    category: 'fds',
    description:
      'High-yield NBFC FD from trusted Bajaj. DICGC Protected up to ₹5 lakhs. Attractive rates with zero lock-in options.',
    highlights: ['High yields', 'DICGC Protected', 'Quick processing', 'Monthly payouts'],
    documents: ['PAN card', 'Aadhar card', 'Bank account details', 'Cancelled cheque'],
    color: '#FB7185',
    colorAccent: '#00F5A0',
    portalUrl: 'https://www.bajajfinserv.in/fixed-deposit',
    minAge: 18,
    maxAge: 100,
    minAnnualIncome: 0,
    employmentTypes: ['salaried', 'self-employed'],
    metrics: {
      baseYield: '8.25% - 8.75%',
      seniorCitizenBonus: '+0.50%',
      tenureRange: '12 months to 60 months',
      dicgcProtection: 'Up to ₹5 Lakhs',
    },
  },

  // CREDIT CARDS
  {
    id: 'sbi-cc',
    name: 'SBI Prime Credit Card',
    lender: 'State Bank of India',
    bankType: 'public',
    category: 'creditcards',
    description:
      'Premium credit card from SBI with milestone rewards. Fuel surcharge waived on all transactions. Comprehensive insurance coverage.',
    highlights: ['Fuel surcharge waived', 'Milestone rewards', 'Insurance coverage', 'Lounge access'],
    documents: ['ID proof', 'Address proof', 'PAN card', 'Bank statements'],
    color: '#C9A96E',
    colorAccent: '#00E5FF',
    portalUrl: 'https://www.sbi.co.in/web/personal-banking/credit-cards/sbi-prime',
    minAge: 25,
    maxAge: 65,
    minAnnualIncome: 500000,
    employmentTypes: ['salaried'],
    metrics: {
      joiningFee: '₹499',
      annualFee: '₹499 (Waived on 1 L spend)',
      milestoneRewards: '₹2,000 on 1L, ₹5,000 on 3L',
      eligibilityIncome: '₹5 Lakh+',
      fuelSurcharge: 'Nil',
    },
  },
  {
    id: 'hdfc-cc',
    name: 'HDFC Regalia Gold',
    lender: 'Housing Development Finance Corporation',
    bankType: 'private',
    category: 'creditcards',
    description:
      'Premium lifestyle credit card with dining benefits. Zero fuel surcharge on all pump transactions globally.',
    highlights: ['Dining rewards', 'Fuel benefit', 'Travel insurance', 'Priority support'],
    documents: ['ID proof', 'Address proof', 'PAN card', 'Salary slip'],
    color: '#38BDF8',
    colorAccent: '#00E5FF',
    portalUrl: 'https://www.hdfcbank.com/credit-cards/regalia-gold',
    minAge: 25,
    maxAge: 65,
    minAnnualIncome: 750000,
    employmentTypes: ['salaried'],
    metrics: {
      joiningFee: '₹2,500',
      annualFee: '₹2,500 (Waived on 2L spend)',
      milestoneRewards: '₹3,000 on 1L, ₹10,000 on 3L',
      eligibilityIncome: '₹7.5 Lakh+',
      fuelSurcharge: 'Waived',
    },
  },
  {
    id: 'icici-cc',
    name: 'ICICI Bank iClick',
    lender: 'ICICI Bank Limited',
    bankType: 'private',
    category: 'creditcards',
    description:
      'Flexible credit card with cashback rewards. Fuel surcharge waived on all fuel purchases nationwide.',
    highlights: ['Cashback rewards', 'Fuel surcharge waived', 'Digital wallet benefits', 'Quick approval'],
    documents: ['ID proof', 'Address proof', 'PAN card', 'Salary slip'],
    color: '#FB7185',
    colorAccent: '#00E5FF',
    portalUrl: 'https://www.icicibank.com/personal/cards/credit-cards/iclick',
    minAge: 25,
    maxAge: 65,
    minAnnualIncome: 600000,
    employmentTypes: ['salaried'],
    metrics: {
      joiningFee: '₹0',
      annualFee: '₹0 (Lifetime Free)',
      milestoneRewards: '₹1,500 on 50K, ₹3,000 on 1L',
      eligibilityIncome: '₹6 Lakh+',
      fuelSurcharge: 'Waived 1% up to ₹500/month',
    },
  },
];

export const jargonDefinitions: Record<string, { en: string; hi: string }> = {
  NBFC: {
    en: "Non-Banking Financial Company (NBFC) is an organization that lends money and invests in securities but doesn't hold a banking license.",
    hi: 'NBFC (नॉन-बैंकिंग फाइनेंशियल कंपनी) एक संगठन है जो पैसे उधार देता है लेकिन पूरी बैंकिंग सुविधाएं नहीं देता।',
  },
  'DICGC Protected': {
    en: 'DICGC protection means your deposits are insured up to ₹5 lakh by the government. If the bank fails, your money is safe.',
    hi: 'DICGC सुरक्षा का मतलब है कि आपकी जमा राशि सरकार द्वारा ₹5 लाख तक बीमित है।',
  },
  Tenure: {
    en: 'Tenure is the length of time for which you borrow money or invest. For loans, it\'s the repayment period.',
    hi: 'Tenure का मतलब है वह समय अवधि जिसके लिए आप पैसे उधार लेते या निवेश करते हैं।',
  },
  'Foreclosure Fee': {
    en: 'Foreclosure Fee is the charge a lender imposes if you pay off your loan early before the tenure ends.',
    hi: 'Foreclosure Fee वह चार्ज है जो लेंडर लगाता है अगर आप अपना कर्ज समय से पहले चुका दें।',
  },
  'RBI Registered': {
    en: 'RBI Registered means the institution is licensed by Reserve Bank of India, ensuring it follows strict rules and your money is safe.',
    hi: 'RBI Registered का अर्थ है कि संस्था RBI द्वारा लाइसेंसप्राप्त है और कानूनी नियमों का पालन करती है।',
  },
  MAB: {
    en: 'Minimum Average Balance (MAB) is the minimum balance you must maintain in your savings account to avoid monthly charges.',
    hi: 'MAB (न्यूनतम औसत बैलेंस) वह न्यूनतम राशि है जो आपको चार्ज से बचने के लिए बनाए रखनी चाहिए।',
  },
  'Fuel Surcharge': {
    en: 'Fuel Surcharge is an extra fee charged on credit card fuel transactions. Many premium cards waive this surcharge.',
    hi: 'Fuel Surcharge क्रेडिट कार्ड पर ईंधन के लिए लगने वाली अतिरिक्त फीस है।',
  },
  'Maturity Yield': {
    en: 'Maturity Yield is the total return you receive when your Fixed Deposit or investment reaches its maturity date.',
    hi: 'Maturity Yield वह कुल रिटर्न है जो आप FD परिपक्वता के समय प्राप्त करते हैं।',
  },
  'Sr. Citizen Bonus': {
    en: 'Senior Citizen Bonus is an extra interest rate added to deposits for citizens aged 60 and above.',
    hi: 'Sr. Citizen Bonus 60 वर्ष से अधिक आयु के नागरिकों के लिए दी जाने वाली अतिरिक्त ब्याज दर है।',
  },
  'Sweep-Out': {
    en: 'An automatic feature where excess balance above a set threshold is automatically transferred to a high-interest Fixed Deposit, maximizing savings returns.',
    hi: 'Sweep-Out एक स्वचालित सुविधा है जहां अतिरिक्त शेष उच्च-ब्याज FD में स्वचालित रूप से स्थानांतरित होता है।',
  },
  ACH: {
    en: 'Automated Clearing House (ACH) is an electronic network for financial transactions. ACH mandates allow automatic recurring payments.',
    hi: 'ACH (ऑटोमेटेड क्लीयरिंग हाउस) वित्तीय लेनदेन के लिए एक इलेक्ट्रॉनिक नेटवर्क है।',
  },
  'SI Mandates': {
    en: 'SI (Systematic Investment Plan) Mandates are standing instructions to automatically invest fixed amounts at regular intervals.',
    hi: 'SI (व्यवस्थित निवेश योजना) स्थायी निर्देश हैं जो नियमित रूप से निवेश करते हैं।',
  },
  DBT: {
    en: 'Direct Benefit Transfer (DBT) is a government program that directly deposits welfare payments into eligible beneficiaries\' bank accounts.',
    hi: 'DBT (प्रत्यक्ष लाभ हस्तांतरण) एक सरकारी कार्यक्रम है जो कल्याण भुगतान सीधे खाते में जमा करता है।',
  },
  'Relationship Value': {
    en: 'Relationship Value is the total worth of all financial products a customer maintains with a bank, used for premium account eligibility.',
    hi: 'Relationship Value एक ग्राहक द्वारा बैंक के साथ बनाए गए सभी वित्तीय उत्पादों का कुल मूल्य है।',
  },
  UHNI: {
    en: 'Ultra High Net-worth Individual (UHNI) refers to individuals with net worth exceeding ₹50 crore.',
    hi: 'UHNI (अल्ट्रा हाई नेट-वर्थ इंडिविजुअल) ₹50 करोड़ से अधिक शुद्ध संपत्ति वाले व्यक्ति को संदर्भित करता है।',
  },
  KYC: {
    en: 'Know Your Customer (KYC) is a regulatory requirement where banks verify customer identity and collect personal information.',
    hi: 'KYC (अपने ग्राहक को जानें) एक नियामक आवश्यकता है जहां बैंक ग्राहक की पहचान सत्यापित करते हैं।',
  },
  FD: {
    en: 'Fixed Deposit (FD) is an investment instrument where you deposit a sum for a fixed period at a predetermined interest rate.',
    hi: 'FD (फिक्स्ड डिपॉजिट) एक निवेश साधन है जहां आप एक निश्चित अवधि के लिए राशि जमा करते हैं।',
  },
  BSBDA: {
    en: 'Basic Savings Bank Deposit Account (BSBDA) is a zero-balance account designed for financial inclusion.',
    hi: 'BSBDA एक शून्य-बैलेंस खाता है जिसे वित्तीय समावेशन के लिए डिज़ाइन किया गया है।',
  },
  'Rupay Card': {
    en: 'RuPay Card is an Indian domestic payment card developed by NPCI, offering secure transactions.',
    hi: 'RuPay कार्ड NPCI द्वारा विकसित एक भारतीय घरेलू भुगतान कार्ड है।',
  },
  NRE: {
    en: 'Non-Resident External (NRE) account is for NRIs to deposit foreign currency earnings with tax-free interest benefits.',
    hi: 'NRE खाता NRIs के लिए विदेशी मुद्रा आय जमा करने के लिए है।',
  },
  NRO: {
    en: 'Non-Resident Ordinary (NRO) account is for NRIs to manage Indian rupee income.',
    hi: 'NRO खाता NRIs के लिए भारतीय रुपये की आय प्रबंधित करने के लिए है।',
  },
  RFC: {
    en: 'Resident Foreign Currency (RFC) account allows returning residents to hold foreign currency balances.',
    hi: 'RFC खाता लौटने वाले निवासियों को विदेशी मुद्रा शेष रखने की अनुमति देता है।',
  },
  Repatriation: {
    en: 'Repatriation is the process of transferring foreign currency or funds from overseas accounts back to India.',
    hi: 'Repatriation विदेशी मुद्रा को भारत वापस स्थानांतरित करने की प्रक्रिया है।',
  },
  GST: {
    en: 'Goods & Services Tax (GST) is India\'s unified indirect tax applied to the supply of goods and services.',
    hi: 'GST (वस्तु एवं सेवा कर) भारत का एकीकृत अप्रत्यक्ष कर है।',
  },
  'Parental Controls': {
    en: 'Parental Controls are spending limit settings that parents can configure on their children\'s bank accounts.',
    hi: 'Parental Controls माता-पिता द्वारा बच्चों के खाते पर खर्च की सीमा निर्धारित करने के लिए सेट किए जाते हैं।',
  },
  Cashback: {
    en: 'Cashback is a reward where a percentage of transaction value is credited back to your account.',
    hi: 'Cashback एक पुरस्कार है जहां लेनदेन मूल्य का एक प्रतिशत आपके खाते में वापस जमा होता है।',
  },
  'Personal Accident Insurance': {
    en: 'Personal Accident Insurance provides coverage for unexpected accidents and injuries with financial compensation.',
    hi: 'Personal Accident Insurance दुर्घटनाओं के लिए वित्तीय कवरेज प्रदान करता है।',
  },
  'Debit Card': {
    en: 'Debit Card is a payment card linked to your bank account that deducts funds directly from your balance.',
    hi: 'Debit Card आपके बैंक खाते से सीधे पैसे निकालने के लिए उपयोग किया जाता है।',
  },
};

export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return products.filter((p) => p.category === category);
};

export const filterProductsByBankType = (
  category: ProductCategory,
  bankTypes: BankType[]
): Product[] => {
  const categoryProducts = getProductsByCategory(category);
  if (bankTypes.length === 0) return categoryProducts;
  return categoryProducts.filter((p) => bankTypes.includes(p.bankType));
};

export const filterProductsByUserProfile = (
  userProfile: { monthlyIncome: number; age: number; employmentType: 'salaried' | 'self-employed' },
  category: ProductCategory,
  bankTypes: BankType[] = []
): Product[] => {
  let filtered = filterProductsByBankType(category, bankTypes);

  return filtered.filter((product) => {
    if (product.minAge && userProfile.age < product.minAge) return false;
    if (product.maxAge && userProfile.age > product.maxAge) return false;

    const annualIncome = userProfile.monthlyIncome * 12;
    if (product.minAnnualIncome && annualIncome < product.minAnnualIncome) return false;
    if (product.maxAnnualIncome && annualIncome > product.maxAnnualIncome) return false;

    if (product.employmentTypes && !product.employmentTypes.includes(userProfile.employmentType)) {
      return false;
    }

    return true;
  });
};

export const getJargonTermsInText = (text: string) => {
  if (!text || typeof text !== 'string') return [];
  const found: Array<{ term: string; start: number; end: number }> = [];
  jargonTerms.forEach((term) => {
    let index = 0;
    while ((index = text.indexOf(term, index)) !== -1) {
      found.push({ term, start: index, end: index + term.length });
      index += term.length;
    }
  });
  return found.sort((a, b) => a.start - b.start);
};
