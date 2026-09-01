import React, { useState } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { PaymentItemCard } from './PaymentItemCard';
import type { PaymentItem, UrgencyFilter } from '../types';
import { getUrgencyStatus } from '../utils/formatters';

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
  const { currentMonthPayments, summary, currentMonthKey } = usePayments();
  const [filter, setFilter] = useState<UrgencyFilter>('all');

  // Filter payments by urgency
  const filteredPayments = currentMonthPayments.filter(payment => {
    if (filter === 'unpaid') {
      return !payment.isPaid;
    }
    if (filter === 'overdue') {
      const urgency = getUrgencyStatus(payment.dueDay, currentMonthKey, payment.isPaid);
      return urgency.status === 'overdue';
    }
    return true;
  });

  return (
    <div className="mt-6">
      {/* Section Header & Filter Tabs */}
      <div className="flex flex-col space-y-3.5 mb-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg tracking-tight">
            Commitments
          </h3>

          <button
            onClick={onAddPayment}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs text-emerald-600 dark:text-orange-400 bg-emerald-50 dark:bg-orange-950/40 border border-emerald-200/80 dark:border-orange-800/40 hover:bg-emerald-100 dark:hover:bg-orange-900/50"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Bill</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All Bills ({currentMonthPayments.length})
          </button>

          <button
            onClick={() => setFilter('unpaid')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filter === 'unpaid'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Pending ({currentMonthPayments.filter(p => !p.isPaid).length})
          </button>

          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filter === 'overdue'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Overdue ({
              currentMonthPayments.filter(
                p => getUrgencyStatus(p.dueDay, currentMonthKey, p.isPaid).status === 'overdue'
              ).length
            })
          </button>
        </div>
      </div>

      {/* List Container */}
      {filteredPayments.length === 0 ? (
        <div className="bg-white dark:bg-[#161B26] border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center my-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-orange-950/40 text-emerald-500 dark:text-orange-400 mx-auto flex items-center justify-center mb-3">
            <CreditCard className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base mb-1">
            No matching commitments
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 max-w-xs mx-auto">
            {filter !== 'all' ? `No ${filter} commitments found.` : `No bills tracked for ${summary.monthName}.`}
          </p>
          <button
            onClick={onAddPayment}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-500 dark:bg-orange-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 dark:shadow-orange-500/20 hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Commitment</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPayments.map(payment => (
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
