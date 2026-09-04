export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹${formatted}`;
};

export const getOrdinalSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
};

export const formatDueDay = (day: number): string => {
  return `Due on ${getOrdinalSuffix(day)}`;
};

export const getMonthName = (monthKey: string): string => {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const getNextMonthKey = (monthKey: string): string => {
  const [yearStr, monthStr] = monthKey.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10) + 1;
  if (month > 12) {
    month = 1;
    year += 1;
  }
  return `${year}-${month.toString().padStart(2, '0')}`;
};

export const getPrevMonthKey = (monthKey: string): string => {
  const [yearStr, monthStr] = monthKey.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10) - 1;
  if (month < 1) {
    month = 12;
    year -= 1;
  }
  return `${year}-${month.toString().padStart(2, '0')}`;
};

export interface UrgencyInfo {
  label: string;
  status: 'paid' | 'overdue' | 'today' | 'upcoming';
  colorClass: string;
}

export const getUrgencyStatus = (dueDay: number, monthKey: string, isPaid: boolean): UrgencyInfo => {
  if (isPaid) {
    return {
      label: 'Paid',
      status: 'paid',
      colorClass: 'bg-emerald-500 text-white font-black shadow-xs border border-emerald-400'
    };
  }

  const today = new Date();
  const [yearStr, monthStr] = monthKey.split('-');
  const selectedYear = parseInt(yearStr, 10);
  const selectedMonth = parseInt(monthStr, 10) - 1;

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  // If selected month is in the past
  if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
    return {
      label: 'Overdue',
      status: 'overdue',
      colorClass: 'bg-rose-600 text-white border border-rose-400 font-black animate-pulse shadow-xs'
    };
  }

  // If selected month is current month
  if (selectedYear === currentYear && selectedMonth === currentMonth) {
    if (dueDay < currentDay) {
      const diff = currentDay - dueDay;
      return {
        label: `Overdue (${diff}d)`,
        status: 'overdue',
        colorClass: 'bg-rose-600 text-white border border-rose-400 font-black animate-pulse shadow-xs'
      };
    }
    if (dueDay === currentDay) {
      return {
        label: 'Due Today',
        status: 'today',
        colorClass: 'bg-amber-400 text-slate-950 border border-amber-300 font-black shadow-xs'
      };
    }
    if (dueDay === currentDay + 1) {
      return {
        label: 'Due Tomorrow',
        status: 'upcoming',
        colorClass: 'bg-blue-600 text-white border border-blue-400 font-black shadow-xs'
      };
    }
    const diff = dueDay - currentDay;
    return {
      label: `Due in ${diff} days`,
      status: 'upcoming',
      colorClass: 'bg-white text-slate-950 dark:bg-white dark:text-slate-950 font-black border border-white shadow-xs'
    };
  }

  // Future month
  return {
    label: `Due on ${getOrdinalSuffix(dueDay)}`,
    status: 'upcoming',
    colorClass: 'bg-white text-slate-950 dark:bg-white dark:text-slate-950 font-black border border-white shadow-xs'
  };
};

/**
 * Extracts a clean 10-digit Indian mobile number if input is ONLY digits/phone.
 * If input contains '@', it is already a full VPA and returns null to preserve original handle.
 */
export const getCleanPhoneNumber = (input?: string): string | null => {
  if (!input || !input.trim()) return null;
  const trimmed = input.trim();
  // If input contains '@', it's already a full VPA (e.g. 7978003934@ybl) - do not strip or alter handle!
  if (trimmed.includes('@')) return null;

  const digitsOnly = trimmed.replace(/\D/g, '');
  if (/^[6-9]\d{9}$/.test(digitsOnly)) {
    return digitsOnly;
  }
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91') && /^[6-9]\d{9}$/.test(digitsOnly.slice(2))) {
    return digitsOnly.slice(2);
  }
  return null;
};

export type SupportedUpiApp = 'Paytm' | 'PhonePe' | 'GPay' | 'UPI';

/**
 * Generates platform-compatible UPI payment URL for both iOS (iPhone) and Android.
 * Directs to the selected target app (Paytm, PhonePe, GPay, or Universal UPI chooser).
 */
export const getUpiAppUrl = (
  app: SupportedUpiApp,
  payeeName: string,
  amount: number,
  upiId?: string
): string => {
  const nameEncoded = encodeURIComponent(payeeName.trim());
  const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);

  if (!upiId || !upiId.trim()) {
    if (app === 'Paytm') return isAndroid ? `intent://pay#Intent;scheme=upi;package=net.one97.paytm;end` : `paytmmp://pay`;
    if (app === 'PhonePe') return isAndroid ? `intent://pay#Intent;scheme=upi;package=com.phonepe.app;end` : `phonepe://pay`;
    if (app === 'GPay') return isAndroid ? `intent://pay#Intent;scheme=upi;package=com.google.android.apps.n26;end` : `gpay://upi/pay`;
    return `upi://pay`;
  }

  const rawInput = upiId.trim();
  const phone = getCleanPhoneNumber(rawInput);

  let vpa = rawInput;
  if (phone) {
    // For 10-digit mobile numbers, NPCI requires a PSP handle (@paytm, @ybl, @oksbi) matching the target app
    // to route the transaction cleanly without throwing "Technical Glitch"
    if (app === 'PhonePe') vpa = `${phone}@ybl`;
    else if (app === 'GPay') vpa = `${phone}@oksbi`;
    else vpa = `${phone}@paytm`;
  }

  const upiQuery = `pa=${vpa}&pn=${nameEncoded}&am=${amount}&cu=INR`;

  if (app === 'Paytm') {
    if (isAndroid) {
      return `intent://pay?${upiQuery}#Intent;scheme=upi;package=net.one97.paytm;end`;
    }
    return `paytmmp://pay?${upiQuery}`;
  }

  if (app === 'PhonePe') {
    if (isAndroid) {
      return `intent://pay?${upiQuery}#Intent;scheme=upi;package=com.phonepe.app;end`;
    }
    return `phonepe://pay?${upiQuery}`;
  }

  if (app === 'GPay') {
    if (isAndroid) {
      return `intent://pay?${upiQuery}#Intent;scheme=upi;package=com.google.android.apps.n26;end`;
    }
    return `gpay://upi/pay?${upiQuery}`;
  }

  return `upi://pay?${upiQuery}`;
};

export interface UpiTargetAppInfo {
  appName: SupportedUpiApp;
  url: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  brandLabel: string;
}

export const getUpiTargetAppInfo = (payeeName: string, amount: number, upiId?: string): UpiTargetAppInfo => {
  if (!upiId || !upiId.trim()) {
    return {
      appName: 'Paytm',
      url: getUpiAppUrl('Paytm', payeeName, amount, upiId),
      badgeBg: 'bg-[#002970]',
      badgeText: 'text-white',
      badgeBorder: 'border-[#00BAF2]/60',
      brandLabel: 'Paytm'
    };
  }

  const vpa = upiId.trim();
  const lowerVpa = vpa.toLowerCase();

  if (lowerVpa.endsWith('@ybl') || lowerVpa.endsWith('@ibl') || lowerVpa.endsWith('@axl')) {
    return {
      appName: 'PhonePe',
      url: getUpiAppUrl('PhonePe', payeeName, amount, upiId),
      badgeBg: 'bg-[#5f259f]',
      badgeText: 'text-white',
      badgeBorder: 'border-purple-400/60',
      brandLabel: 'PhonePe'
    };
  }

  if (lowerVpa.includes('@ok')) {
    return {
      appName: 'GPay',
      url: getUpiAppUrl('GPay', payeeName, amount, upiId),
      badgeBg: 'bg-slate-900 dark:bg-slate-800',
      badgeText: 'text-white',
      badgeBorder: 'border-blue-400/60',
      brandLabel: 'GPay'
    };
  }

  return {
    appName: 'Paytm',
    url: getUpiAppUrl('Paytm', payeeName, amount, upiId),
    badgeBg: 'bg-[#002970]',
    badgeText: 'text-white',
    badgeBorder: 'border-[#00BAF2]/60',
    brandLabel: 'Paytm'
  };
};

export const generatePaytmUrl = (payeeName: string, amount: number, upiId?: string): string => {
  return getUpiAppUrl('Paytm', payeeName, amount, upiId);
};

export const generateUpiUrl = generatePaytmUrl;

export const generateGenericUpiUrl = (payeeName: string, amount: number, upiId?: string): string => {
  return getUpiAppUrl('UPI', payeeName, amount, upiId);
};

/**
 * Sorts payment items placing upcoming (unpaid & unskipped) items on top,
 * sorted date-wise by dueDay ascending. Paid and Skipped items follow below,
 * also sorted date-wise by dueDay ascending.
 */
export const sortByUpcomingAndDate = <T extends { dueDay: number; isPaid: boolean; isSkipped?: boolean }>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    const aUpcoming = !a.isPaid && !a.isSkipped;
    const bUpcoming = !b.isPaid && !b.isSkipped;

    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;

    return a.dueDay - b.dueDay;
  });
};

/**
 * Returns concise short bank name (e.g. "SBI", "HDFC", "Paytm", "ICICI")
 */
export const formatShortBankName = (fullName: string): string => {
  if (!fullName) return '';
  const lower = fullName.toLowerCase();
  if (lower.includes('sbi')) return 'SBI';
  if (lower.includes('hdfc')) return 'HDFC';
  if (lower.includes('paytm') || lower.includes('upi') || lower.includes('gpay') || lower.includes('phonepe')) return 'Paytm';
  if (lower.includes('icici')) return 'ICICI';
  if (lower.includes('axis')) return 'Axis';
  if (lower.includes('kotak')) return 'Kotak';
  return fullName.split(' ')[0];
};


