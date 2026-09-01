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
      colorClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold'
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
      colorClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-bold animate-pulse'
    };
  }

  // If selected month is current month
  if (selectedYear === currentYear && selectedMonth === currentMonth) {
    if (dueDay < currentDay) {
      const diff = currentDay - dueDay;
      return {
        label: `Overdue (${diff}d)`,
        status: 'overdue',
        colorClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-bold animate-pulse'
      };
    }
    if (dueDay === currentDay) {
      return {
        label: 'Due Today',
        status: 'today',
        colorClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 font-bold'
      };
    }
    if (dueDay === currentDay + 1) {
      return {
        label: 'Due Tomorrow',
        status: 'upcoming',
        colorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-bold'
      };
    }
    const diff = dueDay - currentDay;
    return {
      label: `Due in ${diff} days`,
      status: 'upcoming',
      colorClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium'
    };
  }

  // Future month
  return {
    label: `Due on ${getOrdinalSuffix(dueDay)}`,
    status: 'upcoming',
    colorClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium'
  };
};

export const generateUpiUrl = (payeeName: string, amount: number, upiId?: string): string => {
  const vpa = upiId ? upiId.trim() : 'payee@upi';
  const nameEncoded = encodeURIComponent(payeeName);
  return `upi://pay?pa=${vpa}&pn=${nameEncoded}&am=${amount}&cu=INR`;
};
