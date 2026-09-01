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
  const { currentMonthPayments, summary, currentMonthKey, isLiquidGlass } = usePayments();
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
          <h3 className="text-slate-900 dark:text-white font-black text-lg tracking-tight">
            Commitments
          </h3>

          <button
            onClick={onAddPayment}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all shadow-md active:scale-95 ${
              isLiquidGlass
                ? 'bg-white text-slate-950 border border-white shadow-white/20'
                : 'text-white bg-emerald-600 dark:bg-orange-500 shadow-emerald-500/20'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Bill</span>
          </button>
        </div>

        {/* Filter Pills with Deep Pure White Styling */}
        <div className="flex space-x-2">
          {/* All Bills Pill */}
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all duration-200 active:scale-95 ${
              filter === 'all'
                ? 'bg-white text-slate-950 shadow-lg shadow-white/20 border border-white scale-105'
                : 'bg-white/15 dark:bg-white/10 text-slate-800 dark:text-white font-extrabold border border-slate-300/60 dark:border-white/25 hover:bg-white/25 backdrop-blur-md'
            }`}
          >
            All Bills ({currentMonthPayments.length})
          </button>

          {/* Pending Pill */}
          <button
            onClick={() => setFilter('unpaid')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all duration-200 active:scale-95 ${
              filter === 'unpaid'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 border border-amber-300 scale-105'
                : 'bg-white/15 dark:bg-white/10 text-slate-800 dark:text-white font-extrabold border border-slate-300/60 dark:border-white/25 hover:bg-white/25 backdrop-blur-md'
            }`}
          >
            Pending ({currentMonthPayments.filter(p => !p.isPaid).length})
          </button>

          {/* Overdue Pill */}
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all duration-200 active:scale-95 ${
              filter === 'overdue'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 border border-rose-400 scale-105'
                : 'bg-white/15 dark:bg-white/10 text-slate-800 dark:text-white font-extrabold border border-slate-300/60 dark:border-white/25 hover:bg-white/25 backdrop-blur-md'
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
        <div className="app-card p-8 text-center my-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-orange-950/40 text-emerald-600 dark:text-orange-500 mx-auto flex items-center justify-center mb-3">
            <CreditCard className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h4 className="font-extrabold text-slate-800 dark:text-white text-base mb-1">
            No matching commitments
          </h4>
          <p className="text-slate-600 dark:text-slate-300 text-xs mb-4 max-w-xs mx-auto font-medium">
            {filter !== 'all' ? `No ${filter} commitments found.` : `No bills tracked for ${summary.monthName}.`}
          </p>
          <button
            onClick={onAddPayment}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-500 dark:bg-orange-500 text-white text-xs font-black shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
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
