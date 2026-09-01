import type { PaymentItem, PaymentTemplate } from '../types';

export const INITIAL_MONTH = '2026-09';

export const DEFAULT_TEMPLATES: PaymentTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Rent',
    amount: 15000,
    dueDay: 5,
    category: 'housing',
    isRecurring: true,
    notes: 'Apartment rent paid via UPI'
  },
  {
    id: 'tmpl-2',
    name: 'Electricity',
    amount: 2500,
    dueDay: 10,
    category: 'utilities',
    isRecurring: true,
    notes: 'State electricity board bill'
  },
  {
    id: 'tmpl-3',
    name: 'Internet',
    amount: 1000,
    dueDay: 15,
    category: 'internet',
    isRecurring: true,
    notes: 'Fiber broadband monthly plan'
  },
  {
    id: 'tmpl-4',
    name: 'Credit Card',
    amount: 6500,
    dueDay: 20,
    category: 'finance',
    isRecurring: true,
    notes: 'HDFC credit card bill payment'
  },
  {
    id: 'tmpl-5',
    name: 'SIP',
    amount: 5000,
    dueDay: 5,
    category: 'investment',
    isRecurring: true,
    notes: 'Nifty 50 Index Fund auto-debit'
  },
  {
    id: 'tmpl-6',
    name: 'Sukanya Yojana',
    amount: 2000,
    dueDay: 10,
    category: 'family',
    isRecurring: true,
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
    isRecurring: true,
    isPaid: true,
    paidAt: '2026-09-04T10:30:00.000Z',
    monthKey: '2026-09',
    notes: 'Apartment rent paid via UPI'
  },
  {
    id: 'pay-sept-2',
    templateId: 'tmpl-2',
    name: 'Electricity',
    amount: 2500,
    dueDay: 10,
    category: 'utilities',
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
    isRecurring: true,
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
    category: 'family',
    isRecurring: true,
    isPaid: false,
    paidAt: null,
    monthKey: '2026-09',
    notes: 'Post office savings scheme'
  }
];
