import type { PaymentItem, PaymentTemplate, PaymentMethod, CategoryBudgets } from '../types';


export const INITIAL_MONTH = '2026-09';

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-sbi',
    name: 'SBI Bank (Salary Account)',
    type: 'bank',
    balance: 40000,
    initialBalance: 40000,
    color: 'cyan'
  },
  {
    id: 'pm-1',
    name: 'HDFC Bank Account',
    type: 'bank',
    balance: 40000,
    initialBalance: 55000,
    color: 'blue'
  },
  {
    id: 'pm-2',
    name: 'Paytm UPI',
    type: 'wallet',
    balance: 11500,
    initialBalance: 15000,
    color: 'emerald'
  }
];

export const DEFAULT_TEMPLATES: PaymentTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Rent',
    amount: 15000,
    dueDay: 5,
    category: 'housing',
    commitmentType: 'commitment',
    paymentMethodId: 'pm-1',
    isRecurring: true,
    isMandatory: true,
    notes: 'Apartment rent paid via HDFC Bank'
  },
  {
    id: 'tmpl-2',
    name: 'Electricity',
    amount: 2500,
    dueDay: 10,
    category: 'utilities',
    commitmentType: 'commitment',
    paymentMethodId: 'pm-2',
    isRecurring: true,
    isMandatory: true,
    notes: 'State electricity board bill'
  },
  {
    id: 'tmpl-3',
    name: 'Internet',
    amount: 1000,
    dueDay: 15,
    category: 'internet',
    commitmentType: 'commitment',
    paymentMethodId: 'pm-2',
    isRecurring: true,
    isMandatory: true,
    notes: 'Fiber broadband monthly plan'
  },
  {
    id: 'tmpl-4',
    name: 'Credit Card',
    amount: 6500,
    dueDay: 20,
    category: 'finance',
    commitmentType: 'commitment',
    paymentMethodId: 'pm-1',
    isRecurring: true,
    isMandatory: true,
    notes: 'HDFC credit card bill payment'
  },
  {
    id: 'tmpl-5',
    name: 'SIP',
    amount: 5000,
    dueDay: 5,
    category: 'investment',
    commitmentType: 'savings',
    paymentMethodId: 'pm-sbi',
    isRecurring: true,
    isAutopayEnabled: true,
    isMandatory: true,
    notes: 'Nifty 50 Index Fund auto-debit'
  },
  {
    id: 'tmpl-6',
    name: 'Sukanya Yojana',
    amount: 2000,
    dueDay: 10,
    category: 'savings',
    commitmentType: 'savings',
    paymentMethodId: 'pm-sbi',
    isRecurring: true,
    isAutopayEnabled: true,
    isMandatory: true,
    notes: 'Post office savings scheme'
  }
];

export const INITIAL_PAYMENTS_SEPT_2026: PaymentItem[] = [
  {
    id: 'pay-sept-1',
    templateId: 'tmpl-1',
    name: 'Rent',
    amount: 15000,
    dueDay: 5,
    category: 'housing',
    commitmentType: 'commitment',
    paymentMethodId: 'pm-1',
    isRecurring: true,
    isPaid: true,
    paidAt: '2026-09-04T10:30:00.000Z',
    monthKey: '2026-09',
    notes: 'Apartment rent paid via HDFC Bank'
  },
  {
    id: 'pay-sept-2',
    templateId: 'tmpl-2',
    name: 'Electricity',
    amount: 2500,
    dueDay: 10,
    category: 'utilities',
    commitmentType: 'commitment',
    paymentMethodId: 'pm-2',
    isRecurring: true,
    isPaid: true,
    paidAt: '2026-09-09T14:15:00.000Z',
    monthKey: '2026-09',
    notes: 'State electricity board bill'
  },
  {
    id: 'pay-sept-3',
    templateId: 'tmpl-3',
    name: 'Internet',
    amount: 1000,
    dueDay: 15,
    category: 'internet',
    commitmentType: 'commitment',
    paymentMethodId: 'pm-2',
    isRecurring: true,
    isPaid: true,
    paidAt: '2026-09-12T09:00:00.000Z',
    monthKey: '2026-09',
    notes: 'Fiber broadband monthly plan'
  },
  {
    id: 'pay-sept-4',
    templateId: 'tmpl-4',
    name: 'Credit Card',
    amount: 6500,
    dueDay: 20,
    category: 'finance',
    commitmentType: 'commitment',
    paymentMethodId: 'pm-1',
    isRecurring: true,
    isPaid: false,
    paidAt: null,
    monthKey: '2026-09',
    notes: 'HDFC credit card bill payment'
  },
  {
    id: 'pay-sept-5',
    templateId: 'tmpl-5',
    name: 'SIP',
    amount: 5000,
    dueDay: 5,
    category: 'investment',
    commitmentType: 'savings',
    paymentMethodId: 'pm-sbi',
    isRecurring: true,
    isAutopayEnabled: true,
    isPaid: false,
    paidAt: null,
    monthKey: '2026-09',
    notes: 'Nifty 50 Index Fund auto-debit'
  },
  {
    id: 'pay-sept-6',
    templateId: 'tmpl-6',
    name: 'Sukanya Yojana',
    amount: 2000,
    dueDay: 10,
    category: 'savings',
    commitmentType: 'savings',
    paymentMethodId: 'pm-sbi',
    isRecurring: true,
    isAutopayEnabled: true,
    isPaid: false,
    paidAt: null,
    monthKey: '2026-09',
    notes: 'Post office savings scheme'
  }
];

export const DEFAULT_CATEGORY_BUDGETS: CategoryBudgets = {

  housing: 20000,
  utilities: 3000,
  internet: 1500,
  finance: 8000,
  investment: 10000,
  savings: 5000,
  food: 10000,
  healthcare: 5000,
  education: 8000,
  travel: 5000,
  shopping: 6000,
  entertainment: 3000,
  insurance: 4000,
  family: 5000,
  personal_credit: 5000,
  expense: 5000,
  other: 3000
};

