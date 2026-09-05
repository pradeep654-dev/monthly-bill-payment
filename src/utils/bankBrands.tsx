import React from 'react';

export interface BankBrandInfo {
  key: string;
  shortName: string;
  fullName: string;
  brandColor: string; // Primary hex color
  secondaryColor?: string;
  badgeBg: string; // Tailwind class or style
  badgeText: string;
  badgeBorder: string;
  cardBg: string;
  cardBorder: string;
  Logo: React.FC<{ className?: string }>;
}

// 1. SBI Logo (State Bank of India keyhole circle)
export const SbiLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#0083CA" />
    <circle cx="50" cy="38" r="16" fill="#FFFFFF" />
    <rect x="43" y="38" width="14" height="46" fill="#FFFFFF" />
  </svg>
);

// 2. HDFC Bank Logo (Navy box with red square frame)
export const HdfcLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#004B8D" rx="16" />
    <rect x="22" y="22" width="56" height="56" fill="#ED232A" />
    <rect x="36" y="36" width="28" height="28" fill="#FFFFFF" />
    <rect x="10" y="42" width="80" height="16" fill="#004B8D" />
    <rect x="42" y="10" width="16" height="80" fill="#004B8D" />
  </svg>
);

// 3. ICICI Bank Logo (Orange background with white flame 'I')
export const IciciLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#F37023" rx="16" />
    <path d="M50 15 C30 15 20 30 20 50 C20 70 30 85 50 85 C42 75 40 60 50 50 C60 40 65 30 50 15 Z" fill="#052F6B" />
    <path d="M44 26 L62 26 L62 74 L44 74 Z" fill="#FFFFFF" />
  </svg>
);

// 4. Axis Bank Logo (Burgundy with inverted triangle 'A')
export const AxisLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#97124B" rx="16" />
    <path d="M50 18 L82 82 H64 L50 54 L36 82 H18 Z" fill="#FFFFFF" />
  </svg>
);

// 5. Kotak Mahindra Bank Logo (Red with 'K' swoosh)
export const KotakLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#ED1C24" rx="16" />
    <path d="M26 18 H42 V42 L64 18 H84 L58 48 L86 82 H66 L42 53 V82 H26 Z" fill="#FFFFFF" />
  </svg>
);

// 6. Paytm Logo (Dark blue with cyan 'tm')
export const PaytmLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#002970" rx="16" />
    <path d="M16 26 H46 C54 26 58 30 58 37 C58 45 52 49 44 49 H28 V74 H16 Z M28 38 H42 C45 38 47 37 47 35 C47 33 45 32 42 32 H28 Z" fill="#FFFFFF" />
    <path d="M60 26 H72 V74 H60 Z M76 26 H88 V74 H76 Z" fill="#00BAF2" />
  </svg>
);

// 7. PhonePe Logo (Purple with 'पे')
export const PhonePeLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#5F259F" rx="16" />
    <circle cx="50" cy="50" r="32" fill="#FFFFFF" />
    <path d="M40 30 H54 C60 30 64 34 64 40 C64 46 60 50 54 50 H47 V70 H40 Z M47 38 V44 H54 C56 44 57 43 57 41 C57 39 56 38 54 38 Z" fill="#5F259F" />
  </svg>
);

// 8. Google Pay Logo (GPay)
export const GPayLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#FFFFFF" rx="16" stroke="#E2E8F0" strokeWidth="4" />
    <path d="M48 40 V58 H72 C71 64 65 72 48 72 C35 72 24 61 24 48 C24 35 35 24 48 24 C55 24 60 27 63 30 L72 21 C66 15 58 12 48 12 C28 12 12 28 12 48 C12 68 28 84 48 84 C69 84 83 69 83 48 C83 45 82 43 82 40 Z" fill="#4285F4" />
  </svg>
);

// 9. PNB Logo (Punjab National Bank)
export const PnbLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#A20000" rx="16" />
    <circle cx="50" cy="50" r="32" stroke="#FFD700" strokeWidth="8" fill="none" />
    <circle cx="50" cy="50" r="16" fill="#FFD700" />
  </svg>
);

// 10. Bank of Baroda Logo (BOB Baroda Sun)
export const BobLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#F26522" rx="16" />
    <path d="M25 50 C25 32 38 20 55 20 C72 20 80 35 72 50 C80 65 72 80 55 80 C38 80 25 68 25 50 Z" fill="#FFFFFF" />
    <circle cx="50" cy="50" r="12" fill="#F26522" />
  </svg>
);

// 11. Canara Bank Logo
export const CanaraLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#00A3E0" rx="16" />
    <path d="M20 75 L50 25 L80 75 Z" fill="#FFD100" />
    <path d="M35 75 L50 48 L65 75 Z" fill="#00A3E0" />
  </svg>
);

// 12. Union Bank Logo
export const UnionBankLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#0054A6" rx="16" />
    <path d="M30 20 V55 C30 68 40 78 50 78 C60 78 70 68 70 55 V20 H54 V55 C54 58 52 60 50 60 C48 60 46 58 46 55 V20 Z" fill="#FFFFFF" />
    <path d="M60 20 H78 V36 H60 Z" fill="#E31B23" />
  </svg>
);

// 13. IndusInd Bank Logo
export const IndusIndLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#84221A" rx="16" />
    <path d="M25 70 C25 40 40 25 75 25 V40 C50 40 40 50 40 70 Z" fill="#FFFFFF" />
    <circle cx="68" cy="62" r="12" fill="#FFFFFF" />
  </svg>
);

// 14. IDFC FIRST Bank Logo
export const IdfcLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#990000" rx="16" />
    <text x="50" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="32" fontWeight="900" fontFamily="sans-serif">IDFC</text>
  </svg>
);

// 15. Default Bank Landmark Logo
export const DefaultBankLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#1E293B" rx="16" />
    <path d="M50 20 L20 38 H80 Z M25 44 H35 V72 H25 Z M45 44 H55 V72 H45 Z M65 44 H75 V72 H65 Z M18 76 H82 V82 H18 Z" fill="#FFFFFF" />
  </svg>
);

export const BANK_BRANDS: Record<string, BankBrandInfo> = {
  sbi: {
    key: 'sbi',
    shortName: 'SBI',
    fullName: 'State Bank of India',
    brandColor: '#003366',
    secondaryColor: '#0083CA',
    badgeBg: 'bg-[#003366] text-white',
    badgeText: 'text-cyan-200',
    badgeBorder: 'border-[#0083CA]/70',
    cardBg: 'bg-[#003366]/10 dark:bg-[#002D62]/40',
    cardBorder: 'border-[#0083CA]/40',
    Logo: SbiLogo
  },
  hdfc: {
    key: 'hdfc',
    shortName: 'HDFC',
    fullName: 'HDFC Bank',
    brandColor: '#004B8D',
    secondaryColor: '#ED232A',
    badgeBg: 'bg-[#004B8D] text-white',
    badgeText: 'text-white',
    badgeBorder: 'border-[#ED232A]/80',
    cardBg: 'bg-[#004B8D]/10 dark:bg-[#003B73]/40',
    cardBorder: 'border-[#004B8D]/40',
    Logo: HdfcLogo
  },
  icici: {
    key: 'icici',
    shortName: 'ICICI',
    fullName: 'ICICI Bank',
    brandColor: '#F37023',
    secondaryColor: '#052F6B',
    badgeBg: 'bg-[#F37023] text-white',
    badgeText: 'text-white',
    badgeBorder: 'border-[#052F6B]/60',
    cardBg: 'bg-[#F37023]/10 dark:bg-[#F37023]/25',
    cardBorder: 'border-[#F37023]/40',
    Logo: IciciLogo
  },
  axis: {
    key: 'axis',
    shortName: 'Axis',
    fullName: 'Axis Bank',
    brandColor: '#97124B',
    badgeBg: 'bg-[#97124B] text-white',
    badgeText: 'text-white',
    badgeBorder: 'border-[#d22d64]/60',
    cardBg: 'bg-[#97124B]/10 dark:bg-[#97124B]/30',
    cardBorder: 'border-[#97124B]/40',
    Logo: AxisLogo
  },
  kotak: {
    key: 'kotak',
    shortName: 'Kotak',
    fullName: 'Kotak Mahindra Bank',
    brandColor: '#ED1C24',
    badgeBg: 'bg-[#ED1C24] text-white',
    badgeText: 'text-white',
    badgeBorder: 'border-[#003366]/60',
    cardBg: 'bg-[#ED1C24]/10 dark:bg-[#ED1C24]/25',
    cardBorder: 'border-[#ED1C24]/40',
    Logo: KotakLogo
  },
  paytm: {
    key: 'paytm',
    shortName: 'Paytm',
    fullName: 'Paytm Payments Bank / Wallet',
    brandColor: '#002970',
    secondaryColor: '#00BAF2',
    badgeBg: 'bg-[#002970] text-[#00BAF2]',
    badgeText: 'text-[#00BAF2]',
    badgeBorder: 'border-[#00BAF2]/70',
    cardBg: 'bg-[#002970]/10 dark:bg-[#002970]/40',
    cardBorder: 'border-[#00BAF2]/40',
    Logo: PaytmLogo
  },
  phonepe: {
    key: 'phonepe',
    shortName: 'PhonePe',
    fullName: 'PhonePe UPI',
    brandColor: '#5F259F',
    badgeBg: 'bg-[#5F259F] text-white',
    badgeText: 'text-white',
    badgeBorder: 'border-purple-300/70',
    cardBg: 'bg-[#5F259F]/10 dark:bg-[#5F259F]/30',
    cardBorder: 'border-[#5F259F]/40',
    Logo: PhonePeLogo
  },
  gpay: {
    key: 'gpay',
    shortName: 'GPay',
    fullName: 'Google Pay',
    brandColor: '#4285F4',
    badgeBg: 'bg-[#1A73E8] text-white',
    badgeText: 'text-white',
    badgeBorder: 'border-blue-300/70',
    cardBg: 'bg-blue-500/10 dark:bg-blue-950/40',
    cardBorder: 'border-blue-400/40',
    Logo: GPayLogo
  },
  pnb: {
    key: 'pnb',
    shortName: 'PNB',
    fullName: 'Punjab National Bank',
    brandColor: '#A20000',
    badgeBg: 'bg-[#A20000] text-yellow-300',
    badgeText: 'text-yellow-300',
    badgeBorder: 'border-yellow-400/70',
    cardBg: 'bg-[#A20000]/10 dark:bg-[#A20000]/30',
    cardBorder: 'border-[#A20000]/40',
    Logo: PnbLogo
  },
  bob: {
    key: 'bob',
    shortName: 'BOB',
    fullName: 'Bank of Baroda',
    brandColor: '#F26522',
    badgeBg: 'bg-[#F26522] text-white',
    badgeText: 'text-white',
    badgeBorder: 'border-orange-300/70',
    cardBg: 'bg-[#F26522]/10 dark:bg-[#F26522]/30',
    cardBorder: 'border-[#F26522]/40',
    Logo: BobLogo
  },
  canara: {
    key: 'canara',
    shortName: 'Canara',
    fullName: 'Canara Bank',
    brandColor: '#00A3E0',
    badgeBg: 'bg-[#00A3E0] text-yellow-200',
    badgeText: 'text-yellow-200',
    badgeBorder: 'border-yellow-300/70',
    cardBg: 'bg-[#00A3E0]/10 dark:bg-[#00A3E0]/30',
    cardBorder: 'border-[#00A3E0]/40',
    Logo: CanaraLogo
  },
  union: {
    key: 'union',
    shortName: 'Union Bank',
    fullName: 'Union Bank of India',
    brandColor: '#0054A6',
    badgeBg: 'bg-[#0054A6] text-white',
    badgeText: 'text-white',
    badgeBorder: 'border-red-500/70',
    cardBg: 'bg-[#0054A6]/10 dark:bg-[#0054A6]/30',
    cardBorder: 'border-[#0054A6]/40',
    Logo: UnionBankLogo
  },
  indusind: {
    key: 'indusind',
    shortName: 'IndusInd',
    fullName: 'IndusInd Bank',
    brandColor: '#84221A',
    badgeBg: 'bg-[#84221A] text-white',
    badgeText: 'text-white',
    badgeBorder: 'border-red-400/70',
    cardBg: 'bg-[#84221A]/10 dark:bg-[#84221A]/30',
    cardBorder: 'border-[#84221A]/40',
    Logo: IndusIndLogo
  },
  idfc: {
    key: 'idfc',
    shortName: 'IDFC',
    fullName: 'IDFC FIRST Bank',
    brandColor: '#990000',
    badgeBg: 'bg-[#990000] text-white',
    badgeText: 'text-white',
    badgeBorder: 'border-amber-400/70',
    cardBg: 'bg-[#990000]/10 dark:bg-[#990000]/30',
    cardBorder: 'border-[#990000]/40',
    Logo: IdfcLogo
  }
};

export const defaultBankBrand: BankBrandInfo = {
  key: 'bank',
  shortName: 'Bank',
  fullName: 'Bank Account',
  brandColor: '#1E293B',
  badgeBg: 'bg-slate-900 text-white dark:bg-slate-800',
  badgeText: 'text-slate-100',
  badgeBorder: 'border-slate-700/60',
  cardBg: 'bg-slate-800/10 dark:bg-slate-900/40',
  cardBorder: 'border-slate-700/40',
  Logo: DefaultBankLogo
};

/**
 * Returns original bank brand information, official SVG logo, and signature brand colors based on bank name or payment method string.
 */
export const getBankBrandInfo = (bankNameOrText?: string): BankBrandInfo => {
  if (!bankNameOrText || !bankNameOrText.trim()) {
    return defaultBankBrand;
  }

  const lower = bankNameOrText.toLowerCase();

  if (lower.includes('sbi') || lower.includes('state bank')) return BANK_BRANDS.sbi;
  if (lower.includes('hdfc')) return BANK_BRANDS.hdfc;
  if (lower.includes('icici')) return BANK_BRANDS.icici;
  if (lower.includes('axis')) return BANK_BRANDS.axis;
  if (lower.includes('kotak')) return BANK_BRANDS.kotak;
  if (lower.includes('paytm')) return BANK_BRANDS.paytm;
  if (lower.includes('phonepe')) return BANK_BRANDS.phonepe;
  if (lower.includes('gpay') || lower.includes('google pay')) return BANK_BRANDS.gpay;
  if (lower.includes('pnb') || lower.includes('punjab national')) return BANK_BRANDS.pnb;
  if (lower.includes('baroda') || lower.includes('bob')) return BANK_BRANDS.bob;
  if (lower.includes('canara')) return BANK_BRANDS.canara;
  if (lower.includes('union')) return BANK_BRANDS.union;
  if (lower.includes('indusind')) return BANK_BRANDS.indusind;
  if (lower.includes('idfc')) return BANK_BRANDS.idfc;

  // Fallback: extract short name
  const firstWord = bankNameOrText.split(' ')[0];
  return {
    ...defaultBankBrand,
    shortName: firstWord || 'Bank',
    fullName: bankNameOrText
  };
};

interface BankBadgeProps {
  bankName: string;
  className?: string;
  showFullName?: boolean;
}

export const BankBadge: React.FC<BankBadgeProps> = ({ bankName, className = '', showFullName = false }) => {
  const brand = getBankBrandInfo(bankName);
  const LogoComp = brand.Logo;

  return (
    <span
      className={`text-xs font-black px-2.5 py-1 rounded-xl shrink-0 ${brand.badgeBg} border ${brand.badgeBorder} shadow-sm flex items-center space-x-1.5 ${className}`}
    >
      <div className="w-4 h-4 rounded-md overflow-hidden shrink-0 flex items-center justify-center bg-white/10 p-0.5">
        <LogoComp className="w-3.5 h-3.5" />
      </div>
      <span className={brand.badgeText}>{showFullName ? brand.fullName : brand.shortName}</span>
    </span>
  );
};
