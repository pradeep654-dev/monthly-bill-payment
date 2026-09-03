import { 
  Home, 
  Zap, 
  Wifi, 
  CreditCard, 
  TrendingUp, 
  PiggyBank, 
  Tv, 
  Receipt,
  Utensils,
  Activity,
  GraduationCap,
  Car,
  ShoppingBag,
  ShieldCheck,
  Heart,
  Users,
  type LucideIcon
} from 'lucide-react';
import type { CategoryType } from '../types';

export interface CategoryInfo {
  label: string;
  icon: LucideIcon;
  colorClasses: string;
  group: 'savings' | 'expense';
}

export const strokeWidth: number = 2.2;

export const CATEGORY_MAP: Record<CategoryType, CategoryInfo> = {
  savings: {
    label: 'Savings & Deposits',
    icon: PiggyBank,
    group: 'savings',
    colorClasses: 'bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-700/60'
  },
  expense: {
    label: 'Spends & Expenses',
    icon: Receipt,
    group: 'expense',
    colorClasses: 'bg-orange-100/90 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 dark:border dark:border-orange-700/60'
  },
  personal_credit: {
    label: 'Friends & Shop Udhar',
    icon: Users,
    group: 'expense',
    colorClasses: 'bg-indigo-100/90 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border dark:border-indigo-700/60'
  },
  housing: {
    label: 'Housing & Rent',
    icon: Home,
    group: 'expense',
    colorClasses: 'bg-emerald-50 text-emerald-600 dark:bg-[#1E293B] dark:text-amber-500 dark:border dark:border-slate-700/60'
  },
  utilities: {
    label: 'Electricity & Utilities',
    icon: Zap,
    group: 'expense',
    colorClasses: 'bg-amber-50 text-amber-600 dark:bg-[#1E293B] dark:text-orange-400 dark:border dark:border-slate-700/60'
  },
  internet: {
    label: 'Internet & Mobile',
    icon: Wifi,
    group: 'expense',
    colorClasses: 'bg-blue-50 text-blue-600 dark:bg-[#1E293B] dark:text-blue-400 dark:border dark:border-slate-700/60'
  },
  finance: {
    label: 'Credit Cards & Loans',
    icon: CreditCard,
    group: 'expense',
    colorClasses: 'bg-purple-50 text-purple-600 dark:bg-[#1E293B] dark:text-purple-400 dark:border dark:border-slate-700/60'
  },
  investment: {
    label: 'SIP & Investments',
    icon: TrendingUp,
    group: 'savings',
    colorClasses: 'bg-teal-50 text-teal-600 dark:bg-[#1E293B] dark:text-emerald-400 dark:border dark:border-slate-700/60'
  },
  family: {
    label: 'Family & Care',
    icon: Heart,
    group: 'expense',
    colorClasses: 'bg-rose-50 text-rose-600 dark:bg-[#1E293B] dark:text-rose-400 dark:border dark:border-slate-700/60'
  },
  food: {
    label: 'Food & Groceries',
    icon: Utensils,
    group: 'expense',
    colorClasses: 'bg-lime-50 text-lime-600 dark:bg-[#1E293B] dark:text-lime-400 dark:border dark:border-slate-700/60'
  },
  healthcare: {
    label: 'Medical & Health',
    icon: Activity,
    group: 'expense',
    colorClasses: 'bg-red-50 text-red-600 dark:bg-[#1E293B] dark:text-red-400 dark:border dark:border-slate-700/60'
  },
  education: {
    label: 'Education & Fees',
    icon: GraduationCap,
    group: 'expense',
    colorClasses: 'bg-sky-50 text-sky-600 dark:bg-[#1E293B] dark:text-sky-400 dark:border dark:border-slate-700/60'
  },
  travel: {
    label: 'Travel & Fuel',
    icon: Car,
    group: 'expense',
    colorClasses: 'bg-cyan-50 text-cyan-600 dark:bg-[#1E293B] dark:text-cyan-400 dark:border dark:border-slate-700/60'
  },
  shopping: {
    label: 'Shopping & Lifestyle',
    icon: ShoppingBag,
    group: 'expense',
    colorClasses: 'bg-pink-50 text-pink-600 dark:bg-[#1E293B] dark:text-pink-400 dark:border dark:border-slate-700/60'
  },
  entertainment: {
    label: 'Subscriptions & Leisure',
    icon: Tv,
    group: 'expense',
    colorClasses: 'bg-indigo-50 text-indigo-600 dark:bg-[#1E293B] dark:text-indigo-400 dark:border dark:border-slate-700/60'
  },
  insurance: {
    label: 'Insurance & Policies',
    icon: ShieldCheck,
    group: 'expense',
    colorClasses: 'bg-violet-50 text-violet-600 dark:bg-[#1E293B] dark:text-violet-400 dark:border dark:border-slate-700/60'
  },
  other: {
    label: 'Other Expenses',
    icon: Receipt,
    group: 'expense',
    colorClasses: 'bg-slate-100 text-slate-600 dark:bg-[#1E293B] dark:text-slate-400 dark:border dark:border-slate-700/60'
  }
};

export const getCategoryMeta = (category: CategoryType): CategoryInfo => {
  return CATEGORY_MAP[category] || CATEGORY_MAP.other;
};
