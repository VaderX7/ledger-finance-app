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
  topPick?: boolean;
  // Eligibility
  minAge?: number;
  maxAge?: number;
  minAnnualIncome?: number;
  maxAnnualIncome?: number;
  employmentTypes?: ('salaried' | 'self-employed')[];
  // Metrics - polymorphic based on category
  metrics: Record<string, string | number>;
};


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
    topPick: true,
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
    topPick: true,
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

export const jargonTerms = [
  'NBFC', 'DICGC Protected', 'Tenure', 'Foreclosure Fee', 'RBI Registered', 'MAB', 
  'Fuel Surcharge', 'Maturity Yield', 'Sr. Citizen Bonus', 'Sweep-Out', 'ACH', 
  'SI Mandates', 'DBT', 'Relationship Value', 'UHNI', 'KYC', 'BSBDA', 
  'Rupay Card', 'NRE', 'NRO', 'RFC', 'Repatriation', 'GST', 'Parental Controls', 
  'Cashback', 'Personal Accident Insurance', 'Debit Card', 'DICGC', 'p.a.', 'RBI', 
  'PAN', 'Aadhaar', 'OCI', 'PIO', 'DTAA', 'RuPay', 'NEFT', 'RTGS', 'IMPS', 
  'UPI', 'NACH', 'EMI', 'SIP', 'TDS', 'SFB', 'AMB', 'Sweep-In', 
  'Nomination', 'Overdraft', 'Lien', 'Collateral', 'Fixed Deposit', 'Recurring Deposit'
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
    en: 'Minimum Average Balance (MAB) is the average balance you must keep in your bank account over a month to avoid penalty charges.',
    hi: 'MAB वह औसत राशि है जो आपको बैंक चार्ज से बचने के लिए अपने खाते में बनाए रखनी होती है।',
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
    en: 'An automatic feature that transfers funds exceeding a set limit from your savings account into a high-interest Fixed Deposit.',
    hi: 'Sweep-Out एक ऐसी सुविधा है जो आपके खाते की अतिरिक्त रकम को स्वचालित रूप से उच्च ब्याज वाली FD में बदल देती है।',
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
    en: 'Know Your Customer (KYC) is a standard process where banks check documents to verify your identity and address.',
    hi: 'KYC वह प्रक्रिया है जिसके द्वारा बैंक ग्राहकों की पहचान और पते का सत्यापन करते हैं।',
  },
  FD: {
    en: 'Fixed Deposit (FD) is a savings instrument where you invest money for a fixed period at a set interest rate, earning higher returns.',
    hi: 'FD एक सुरक्षित निवेश योजना है जिसमें आप एक निश्चित अवधि के लिए तय ब्याज दर पर पैसे जमा करते हैं।',
  },
  'Fixed Deposit': {
    en: 'Fixed Deposit (FD) is a savings instrument where you invest money for a fixed period at a set interest rate, earning higher returns than a regular savings account.',
    hi: 'Fixed Deposit (FD) एक सुरक्षित निवेश योजना है जिसमें आप एक निश्चित अवधि के लिए तय ब्याज दर पर पैसे जमा करते हैं, जो बचत खाते से अधिक रिटर्न देता है।',
  },
  'Recurring Deposit': {
    en: 'Recurring Deposit (RD) is a savings scheme where you deposit a fixed amount every month for a chosen tenure and earn interest on the maturity amount.',
    hi: 'Recurring Deposit (RD) एक बचत योजना है जिसमें आप हर महीने एक निश्चित राशि जमा करते हैं और परिपक्वता राशि पर ब्याज कमाते हैं।',
  },
  BSBDA: {
    en: 'Basic Savings Bank Deposit Account (BSBDA) is a zero-balance savings account that offers basic banking facilities for free.',
    hi: 'BSBDA एक बिना किसी न्यूनतम बैलेंस की अनिवार्यता वाला बचत खाता है जो मुफ्त में बुनियादी बैंकिंग सुविधाएं देता है।',
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
  DICGC: {
    en: 'Deposit Insurance and Credit Guarantee Corporation (DICGC) insures your bank deposits up to ₹5 lakh per bank. If the bank fails, you get your money back.',
    hi: 'DICGC (डिपॉज़िट इंश्योरेंस एंड क्रेडिट गैरेंटी कॉर्पोरेशन) आपकी बैंक जमा राशि को प्रति बैंक ₹5 लाख तक बीमित करता है।',
  },
  'p.a.': {
    en: 'p.a. stands for "per annum", meaning per year. Interest rates on loans and deposits are quoted on a yearly basis.',
    hi: 'p.a. का मतलब है "प्रति वर्ष"। ऋण और जमा पर ब्याज दरें सालाना आधार पर बताई जाती हैं।',
  },
  RBI: {
    en: 'Reserve Bank of India (RBI) is India\'s central bank that regulates all banks and financial institutions to keep your money safe.',
    hi: 'RBI (भारतीय रिज़र्व बैंक) भारत का केंद्रीय बैंक है जो सभी बैंकों को नियंत्रित करता है।',
  },
  PAN: {
    en: 'Permanent Account Number (PAN) is a unique 10-digit identifier issued by the Income Tax Department, required for financial transactions.',
    hi: 'PAN (स्थायी खाता संख्या) आयकर विभाग द्वारा जारी एक अद्वितीय 10 अंकों का पहचान पत्र है।',
  },
  Aadhaar: {
    en: 'Aadhaar is a 12-digit unique identity number issued by UIDAI, used as proof of identity and address across India.',
    hi: 'Aadhaar UIDAI द्वारा जारी 12 अंकों की अद्वितीय पहचान संख्या है जो पहचान और पते के प्रमाण के रूप में उपयोग होती है।',
  },
  OCI: {
    en: 'Overseas Citizen of India (OCI) is a foreign citizenship status for people of Indian origin, allowing visa-free travel to India.',
    hi: 'OCI (ओवरसीज़ सिटिज़न ऑफ इंडिया) भारतीय मूल के लोगों के लिए विदेशी नागरिकता की स्थिति है।',
  },
  PIO: {
    en: 'Person of Indian Origin (PIO) is a status for foreign citizens who hold an Indian passport or have Indian ancestry.',
    hi: 'PIO (पर्सन ऑफ इंडियन ओरिजिन) उन विदेशी नागरिकों की स्थिति है जिनका भारतीय पासपोर्ट या भारतीय मूल है।',
  },
  DTAA: {
    en: 'Double Taxation Avoidance Agreement (DTAA) is a treaty between two countries to prevent the same income from being taxed twice.',
    hi: 'DTAA (डबल टैक्सेशन अवॉइडेंस एग्रीमेंट) दो देशों के बीच एक संधि है जो एक ही आय पर दो बार कर लगने से बचाती है।',
  },
  RuPay: {
    en: 'RuPay is an Indian domestic debit and credit card payment network developed by NPCI, offering lower transaction fees.',
    hi: 'RuPay NPCI द्वारा विकसित एक भारतीय भुगतान नेटवर्क है जो कम लेनदेन शुल्क प्रदान करता है।',
  },
  NEFT: {
    en: 'National Electronic Funds Transfer (NEFT) is a system for transferring money between banks across India, available 24/7.',
    hi: 'NEFT (नेशनल इलेक्ट्रॉनिक फंड्स ट्रांसफर) बैंकों के बीच पैसे भेजने की एक प्रणाली है जो 24/7 उपलब्ध है।',
  },
  RTGS: {
    en: 'Real Time Gross Settlement (RTGS) is for high-value money transfers (₹2 lakh and above) that settle in real time.',
    hi: 'RTGS (रियल टाइम ग्रॉस सेटलमेंट) उच्च मूल्य (₹2 लाख और ऊपर) के मनी ट्रांसफर के लिए है जो रियल टाइम में सेटल होता है।',
  },
  IMPS: {
    en: 'Immediate Payment Service (IMPS) is an instant interbank electronic fund transfer service available 24/7 on mobile.',
    hi: 'IMPS (इमीडिएट पेमेंट सर्विस) मोबाइल पर 24/7 उपलब्ध एक तत्काल इंटरबैंक फंड ट्रांसफर सेवा है।',
  },
  UPI: {
    en: 'Unified Payments Interface (UPI) allows instant money transfers between bank accounts using a mobile app with just a UPI ID or phone number.',
    hi: 'UPI (यूनिफाइड पेमेंट्स इंटरफेस) मोबाइल ऐप से बैंक खातों के बीच तत्काल पैसे भेजने की सुविधा है।',
  },
  NACH: {
    en: 'National Automated Clearing House (NACH) handles bulk transactions like salary credits, EMIs, and dividend payments automatically.',
    hi: 'NACH (नेशनल ऑटोमेटेड क्लीयरिंग हाउस) वेतन, EMI और लाभांश जैसे थोक लेनदेन को स्वचालित रूप से संभालता है।',
  },
  EMI: {
    en: 'Equated Monthly Installment (EMI) is a fixed monthly payment you make to repay a loan over a set tenure.',
    hi: 'EMI (समान मासिक किस्त) ऋण चुकाने के लिए आप जो हर महीने एक निश्चित राशि देते हैं।',
  },
  SIP: {
    en: 'Systematic Investment Plan (SIP) lets you invest a fixed amount regularly in mutual funds, building wealth over time.',
    hi: 'SIP (सिस्टमैटिक इन्वेस्टमेंट प्लान) आपको नियमित रूप से म्यूचुअल फंड में निवेश करने की सुविधा देता है।',
  },
  RD: {
    en: 'Recurring Deposit (RD) is a savings scheme where you deposit a fixed amount every month and earn interest like an FD.',
    hi: 'RD (रिकरिंग डिपॉज़िट) एक बचत योजना है जिसमें आप हर महीने एक निश्चित राशि जमा करते हैं और FD जैसा ब्याज कमाते हैं।',
  },
  TDS: {
    en: 'Tax Deducted at Source (TDS) is tax automatically cut by the bank or employer from your interest or salary before you receive it.',
    hi: 'TDS (स्रोत पर कर कटौती) बैंक या नियोक्ता द्वारा आपकी ब्याज आय या वेतन से स्वचालित रूप से काटा जाने वाला कर है।',
  },
  SFB: {
    en: 'Small Finance Bank (SFB) is a niche bank that provides basic banking services like savings accounts, loans, and payments to underserved areas.',
    hi: 'SFB (स्मॉल फाइनेंस बैंक) एक विशेष बैंक है जो कम सेवा वाले क्षेत्रों को बुनियादी बैंकिंग सेवाएं प्रदान करता है।',
  },
  AMB: {
    en: 'Average Monthly Balance (AMB) is the minimum average amount you must maintain in your bank account each month to avoid penalties.',
    hi: 'AMB (औसत मासिक बैलेंस) वह न्यूनतम औसत राशि है जो आपको हर महीने जुर्माने से बचने के लिए अपने खाते में रखनी होती है।',
  },
  'Sweep-In': {
    en: 'Sweep-In automatically moves excess funds from a linked FD into your savings account when your balance falls below a set limit.',
    hi: 'Sweep-In आपके बचत खाते का बैलेंस कम होने पर स्वचालित रूप से जुड़ी FD से अतिरिक्त रकम को बचत खाते में ले आता है।',
  },
  Nomination: {
    en: 'Nomination is the process of appointing a person who will receive your bank funds in case of your untimely death.',
    hi: 'Nomination एक ऐसी प्रक्रिया है जिसमें आप एक व्यक्ति को नामांकित करते हैं जो आपकी मृत्यु के बाद आपके बैंक फंड प्राप्त करेगा।',
  },
  Overdraft: {
    en: 'Overdraft is a credit facility that lets you withdraw more money than your account balance, up to a pre-approved limit.',
    hi: 'Overdraft एक ऋण सुविधा है जो आपको अपने खाते की शेष राशि से अधिक पैसे निकालने की अनुमति देती है।',
  },
  Lien: {
    en: 'Lien is the bank\'s right to hold or claim your assets or funds as security until you repay your outstanding debt.',
    hi: 'Lien बैंक का वह अधिकार है जिसके तहत वह आपकी बकाया राशि चुकाने तक आपकी संपत्ति या फंड को रख सकता है।',
  },
  Collateral: {
    en: 'Collateral is an asset like property or gold that you pledge to a bank as security when taking a loan.',
    hi: 'Collateral संपत्ति या सोने जैसी संपत्ति है जो आप ऋण लेते समय बैंक को सुरक्षा के रूप में गिरवी रखते हैं।',
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
  const textLower = text.toLowerCase();
  
  // Sort jargonTerms by length descending so that we match longer phrases (like "DICGC Protected") first.
  const sortedJargonTerms = [...jargonTerms].sort((a, b) => b.length - a.length);

  sortedJargonTerms.forEach((term) => {
    const termLower = term.toLowerCase();
    let index = 0;
    while ((index = textLower.indexOf(termLower, index)) !== -1) {
      const start = index;
      const end = index + term.length;
      const before = index === 0 ? ' ' : text[index - 1];
      const after = index + term.length >= text.length ? ' ' : text[index + term.length];
      const boundaryBefore = /\W/.test(before);
      const boundaryAfter = /\W/.test(after);
      // Check if this match overlaps with any already added match
      const overlaps = found.some(existing => 
        (start >= existing.start && start < existing.end) ||
        (end > existing.start && end <= existing.end) ||
        (start <= existing.start && end >= existing.end)
      );
      if (boundaryBefore && boundaryAfter && !overlaps) {
        found.push({ term, start, end });
      }
      index += term.length;
    }
  });
  // Sort matches by start position ascending for JargonText to parse linearly
  return found.sort((a, b) => a.start - b.start);
};
