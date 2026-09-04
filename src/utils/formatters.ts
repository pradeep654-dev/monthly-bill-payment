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
 * Extracts a clean 10-digit Indian mobile number if valid, otherwise returns null.
 */
export const getCleanPhoneNumber = (input?: string): string | null => {
  if (!input || !input.trim()) return null;
  const digitsOnly = input.trim().replace(/\D/g, '');
  if (/^[6-9]\d{9}$/.test(digitsOnly)) {
    return digitsOnly;
  }
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91') && /^[6-9]\d{9}$/.test(digitsOnly.slice(2))) {
    return digitsOnly.slice(2);
  }
  return null;
};

/**
 * Generates Paytm app deep link URL (paytmmp://)
 * - If 10-digit mobile number: formats as `phone@paytm` per NPCI specification
 * - If full UPI VPA: passes `pa=user@vpa` parameter for direct VPA resolution
 * - If empty: opens Paytm Pay screen
 */
export const generatePaytmUrl = (payeeName: string, amount: number, upiId?: string): string => {
  const nameEncoded = encodeURIComponent(payeeName);
  if (!upiId || !upiId.trim()) {
    return `paytmmp://pay`;
  }

  const phone = getCleanPhoneNumber(upiId);
  const vpa = phone ? `${phone}@paytm` : upiId.trim();

  return `paytmmp://pay?pa=${encodeURIComponent(vpa)}&pn=${nameEncoded}&am=${amount}&cu=INR`;
};

export const generateUpiUrl = generatePaytmUrl;

export const generateGenericUpiUrl = (payeeName: string, amount: number, upiId?: string): string => {
  const nameEncoded = encodeURIComponent(payeeName);
  if (!upiId || !upiId.trim()) {
    return `upi://pay`;
  }

  const phone = getCleanPhoneNumber(upiId);
  const vpa = phone ? `${phone}@paytm` : upiId.trim();

  return `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${nameEncoded}&am=${amount}&cu=INR`;
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


