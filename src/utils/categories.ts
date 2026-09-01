import { 
  Home, 
  Zap, 
  Wifi, 
  CreditCard, 
  TrendingUp, 
  PiggyBank, 
  Tv, 
  Receipt,
  type LucideIcon
} from 'lucide-react';
import type { CategoryType } from '../types';

export interface CategoryInfo {
  label: string;
  icon: LucideIcon;
  colorClasses: string;
}

export const strokeWidth: number = 2.2;

export const CATEGORY_MAP: Record<CategoryType, CategoryInfo> = {
  housing: {
    label: 'Housing & Rent',
    icon: Home,
    colorClasses: 'bg-emerald-50 text-emerald-600 dark:bg-[#1E293B] dark:text-amber-500 dark:border dark:border-slate-700/60'
  },
  utilities: {
    label: 'Electricity & Utilities',
    icon: Zap,
    colorClasses: 'bg-amber-50 text-amber-600 dark:bg-[#1E293B] dark:text-orange-400 dark:border dark:border-slate-700/60'
  },
  internet: {
    label: 'Internet & Mobile',
    icon: Wifi,
    colorClasses: 'bg-blue-50 text-blue-600 dark:bg-[#1E293B] dark:text-blue-400 dark:border dark:border-slate-700/60'
  },
  finance: {
    label: 'Credit Cards & Loans',
    icon: CreditCard,
    colorClasses: 'bg-purple-50 text-purple-600 dark:bg-[#1E293B] dark:text-purple-400 dark:border dark:border-slate-700/60'
  },
  investment: {
    label: 'SIP & Investments',
    icon: TrendingUp,
    colorClasses: 'bg-teal-50 text-teal-600 dark:bg-[#1E293B] dark:text-emerald-400 dark:border dark:border-slate-700/60'
  },
  family: {
    label: 'Family & Savings',
    icon: PiggyBank,
    colorClasses: 'bg-rose-50 text-rose-600 dark:bg-[#1E293B] dark:text-rose-400 dark:border dark:border-slate-700/60'
  },
  entertainment: {
    label: 'Subscriptions & Leisure',
    icon: Tv,
    colorClasses: 'bg-indigo-50 text-indigo-600 dark:bg-[#1E293B] dark:text-indigo-400 dark:border dark:border-slate-700/60'
  },
  other: {
    label: 'Other Expenses',
    icon: Receipt,
    colorClasses: 'bg-slate-100 text-slate-600 dark:bg-[#1E293B] dark:text-slate-400 dark:border dark:border-slate-700/60'
  }
};

export const getCategoryMeta = (category: CategoryType): CategoryInfo => {
  return CATEGORY_MAP[category] || CATEGORY_MAP.other;
};
