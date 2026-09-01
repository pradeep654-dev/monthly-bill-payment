export type CategoryType = 
  | 'housing' 
  | 'utilities' 
  | 'internet' 
  | 'finance' 
  | 'investment' 
  | 'family' 
  | 'entertainment' 
  | 'other';

export interface PaymentItem {
  id: string;
  templateId?: string; // Reference to master recurring template if applicable
  name: string;
  amount: number;
  dueDay: number; // 1 to 31
  category: CategoryType;
  isRecurring: boolean;
  notes?: string;
  isPaid: boolean;
  paidAt?: string | null;
  monthKey: string; // e.g. "2026-09"
}

export interface PaymentTemplate {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  category: CategoryType;
  isRecurring: boolean;
  notes?: string;
}

export interface MonthSummary {
  monthKey: string; // "YYYY-MM"
  monthName: string; // "September 2026"
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  percentagePaid: number;
  totalCount: number;
  paidCount: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveTab = 'home' | 'history' | 'settings';
