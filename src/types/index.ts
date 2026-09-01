export type CategoryType = 
  | 'housing' 
  | 'utilities' 
  | 'internet' 
  | 'finance' 
  | 'investment' 
  | 'family' 
  | 'entertainment' 
  | 'other';

export type AccountType = 'bank' | 'wallet' | 'card' | 'cash';

export interface PaymentMethod {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  initialBalance: number;
  iconName?: string;
  color?: string;
}

export interface PaymentItem {
  id: string;
  templateId?: string; // Reference to master recurring template if applicable
  name: string;
  amount: number;
  dueDay: number; // 1 to 31
  category: CategoryType;
  paymentMethodId?: string; // ID of PaymentMethod used for deduction
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
  paymentMethodId?: string;
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
