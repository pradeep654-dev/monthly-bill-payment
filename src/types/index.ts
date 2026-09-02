export type CategoryType = 
  | 'savings'
  | 'expense'
  | 'housing' 
  | 'utilities' 
  | 'internet' 
  | 'finance' 
  | 'investment' 
  | 'family' 
  | 'food'
  | 'healthcare'
  | 'education'
  | 'travel'
  | 'shopping'
  | 'entertainment' 
  | 'insurance'
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
  upiId?: string; // Optional VPA/UPI ID e.g. "landlord@upi"
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
  upiId?: string;
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
  totalSavings: number;
  totalExpense: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveTab = 'home' | 'history' | 'settings';
export type UrgencyFilter = 'all' | 'unpaid' | 'overdue';
