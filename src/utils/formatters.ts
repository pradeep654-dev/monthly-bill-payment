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
 * Generates Paytm default UPI URL scheme (paytmmp:// or paytm://) with generic upi:// fallback
 */
export const generateUpiUrl = (payeeName: string, amount: number, upiId?: string): string => {
  const vpa = upiId ? upiId.trim() : 'payee@upi';
  const nameEncoded = encodeURIComponent(payeeName);
  // Default to Paytm deep link scheme
  return `paytmmp://pay?pa=${vpa}&pn=${nameEncoded}&am=${amount}&cu=INR`;
};

export const generateGenericUpiUrl = (payeeName: string, amount: number, upiId?: string): string => {
  const vpa = upiId ? upiId.trim() : 'payee@upi';
  const nameEncoded = encodeURIComponent(payeeName);
  return `upi://pay?pa=${vpa}&pn=${nameEncoded}&am=${amount}&cu=INR`;
};
