export type CategoryType = 
  | 'savings'
  | 'expense'
  | 'housing' 
  | 'utilities' 
  | 'internet' 
  | 'finance' 
  | 'investment' 
  | 'personal_credit'
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

export type CommitmentType = 'savings' | 'commitment';

export interface PaymentItem {
  id: string;
  templateId?: string; // Reference to master recurring template if applicable
  name: string;
  amount: number;
  dueDay: number; // 1 to 31
  category: CategoryType;
  commitmentType?: CommitmentType; // 'savings' (auto every month) or 'commitment' (pay)
  paymentMethodId?: string; // ID of PaymentMethod used for deduction
  upiId?: string; // Optional VPA/UPI ID e.g. "landlord@upi"
  isRecurring: boolean;
  isAutopayEnabled?: boolean; // Autopay at 11:55 PM on due date
  isMandatory?: boolean; // Mandatory survival bill vs discretionary flexible spend
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
  commitmentType?: CommitmentType;
  paymentMethodId?: string;
  upiId?: string;
  isRecurring: boolean;
  isAutopayEnabled?: boolean;
  isMandatory?: boolean;
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
  totalBankBalance: number;
  netFreeLiquidity: number;
  monthlyIncome: number;
  leftoverIncome: number;
  mandatoryTotal: number;
  discretionaryTotal: number;
  survivalRunwayMonths: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveTab = 'home' | 'commitments' | 'savings' | 'budget' | 'history' | 'settings';
export type UrgencyFilter = 'all' | 'savings' | 'commitments' | 'unpaid' | 'overdue';


export type CategoryBudgets = Record<CategoryType, number>;

export type CategoryBudgetStatus = 'normal' | 'warning' | 'exceeded';

export interface CategoryBudgetSummary {
  category: CategoryType;
  spentAmount: number;
  budgetAmount: number;
  percentage: number;
  status: CategoryBudgetStatus;
  overAmount: number;
}

