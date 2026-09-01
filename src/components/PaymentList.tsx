import React from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { PaymentItemCard } from './PaymentItemCard';
import type { PaymentItem } from '../types';

interface PaymentListProps {
  onAddPayment: () => void;
  onEditPayment: (payment: PaymentItem) => void;
  onDeletePayment: (id: string) => void;
}

export const PaymentList: React.FC<PaymentListProps> = ({
  onAddPayment,
  onEditPayment,
  onDeletePayment
}) => {
  const { currentMonthPayments, summary } = usePayments();

  return (
    <div className="mt-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg tracking-tight">
          Payments
        </h3>

        <button
          onClick={onAddPayment}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs text-emerald-600 dark:text-orange-400 bg-emerald-50 dark:bg-orange-950/40 border border-emerald-200/80 dark:border-orange-800/40 hover:bg-emerald-100 dark:hover:bg-orange-900/50"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Payment</span>
        </button>
      </div>

      {/* List Container */}
      {currentMonthPayments.length === 0 ? (
        <div className="bg-white dark:bg-[#161B26] border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center my-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-orange-950/40 text-emerald-500 dark:text-orange-400 mx-auto flex items-center justify-center mb-3">
            <CreditCard className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base mb-1">
            No payments for {summary.monthName}
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 max-w-xs mx-auto">
            You don't have any bills tracked for this month yet.
          </p>
          <button
            onClick={onAddPayment}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-500 dark:bg-orange-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 dark:shadow-orange-500/20 hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Bill</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {currentMonthPayments.map(payment => (
            <PaymentItemCard
              key={payment.id}
              payment={payment}
              onEdit={onEditPayment}
              onDelete={onDeletePayment}
            />
          ))}
        </div>
      )}
    </div>
  );
};
