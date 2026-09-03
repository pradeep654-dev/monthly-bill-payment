import React, { useState } from 'react';
import { Plus, CreditCard, PiggyBank, Receipt, Repeat, Calendar } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { PaymentItemCard } from './PaymentItemCard';
import type { PaymentItem, UrgencyFilter } from '../types';
import { getUrgencyStatus, formatCurrency, sortByUpcomingAndDate } from '../utils/formatters';
import { getCategoryMeta } from '../utils/categories';

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

  // Helper to determine if item is savings
  const isSavingsItem = (p: PaymentItem) => {
    return p.commitmentType === 'savings' || getCategoryMeta(p.category).group === 'savings';
  };

  // Split into Savings vs Commitments
  const savingsItems = currentMonthPayments.filter(isSavingsItem);
  const commitmentItems = currentMonthPayments.filter(p => !isSavingsItem(p));

  // Filter items based on active filter
  const applyFilter = (items: PaymentItem[]) => {
    return items.filter(payment => {
      if (filter === 'savings') return isSavingsItem(payment);
      if (filter === 'commitments') return !isSavingsItem(payment);
      if (filter === 'unpaid') return !payment.isPaid;
      if (filter === 'overdue') {
        const urgency = getUrgencyStatus(payment.dueDay, currentMonthKey, payment.isPaid);
        return urgency.status === 'overdue';
      }
      return true;
    });
  };

  const filteredSavings = sortByUpcomingAndDate(applyFilter(savingsItems));
  const filteredCommitments = sortByUpcomingAndDate(applyFilter(commitmentItems));
  const totalFilteredCount = filteredSavings.length + filteredCommitments.length;

  const totalSavingsSum = savingsItems.reduce((acc, p) => acc + p.amount, 0);
  const totalCommitmentsSum = commitmentItems.reduce((acc, p) => acc + p.amount, 0);

  const recurringCommitmentsCount = commitmentItems.filter(p => p.isRecurring).length;
  const currentMonthOnlyCount = commitmentItems.filter(p => !p.isRecurring).length;

  return (
    <div className="mt-6 space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-slate-900 dark:text-white font-black text-xl tracking-tight">
              Monthly Schedule
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Savings auto-continue every month • Commitments can be every month or current month only
            </p>
          </div>

          <button
            onClick={onAddPayment}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-black transition-all shadow-md active:scale-95 shrink-0 ${
              isLiquidGlass
                ? 'bg-white text-slate-950 border border-white shadow-white/20'
                : 'text-white bg-emerald-600 dark:bg-orange-500 shadow-emerald-500/20'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Entry</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {/* All */}
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all duration-200 shrink-0 ${
              filter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md border border-transparent scale-105'
                : 'bg-white/20 dark:bg-white/10 text-slate-800 dark:text-white font-extrabold border border-slate-300/60 dark:border-white/25 hover:bg-white/30 backdrop-blur-md'
            }`}
          >
            All ({currentMonthPayments.length})
          </button>

          {/* Savings Pill */}
          <button
            onClick={() => setFilter('savings')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all duration-200 shrink-0 flex items-center space-x-1 ${
              filter === 'savings'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400 scale-105'
                : 'bg-white/20 dark:bg-white/10 text-emerald-800 dark:text-emerald-300 font-extrabold border border-emerald-300/60 dark:border-emerald-700/60 hover:bg-white/30 backdrop-blur-md'
            }`}
          >
            <span>🏦 Savings ({savingsItems.length})</span>
          </button>

          {/* Commitments Pill */}
          <button
            onClick={() => setFilter('commitments')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all duration-200 shrink-0 flex items-center space-x-1 ${
              filter === 'commitments'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 border border-orange-400 scale-105'
                : 'bg-white/20 dark:bg-white/10 text-orange-800 dark:text-orange-300 font-extrabold border border-orange-300/60 dark:border-orange-700/60 hover:bg-white/30 backdrop-blur-md'
            }`}
          >
            <span>💳 Commitments ({commitmentItems.length})</span>
          </button>

          {/* Pending Pill */}
          <button
            onClick={() => setFilter('unpaid')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all duration-200 shrink-0 ${
              filter === 'unpaid'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 border border-amber-300 scale-105'
                : 'bg-white/20 dark:bg-white/10 text-slate-800 dark:text-white font-extrabold border border-slate-300/60 dark:border-white/25 hover:bg-white/30 backdrop-blur-md'
            }`}
          >
            Pending ({currentMonthPayments.filter(p => !p.isPaid).length})
          </button>

          {/* Overdue Pill */}
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all duration-200 shrink-0 ${
              filter === 'overdue'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 border border-rose-400 scale-105'
                : 'bg-white/20 dark:bg-white/10 text-slate-800 dark:text-white font-extrabold border border-slate-300/60 dark:border-white/25 hover:bg-white/30 backdrop-blur-md'
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

      {totalFilteredCount === 0 ? (
        <div className="app-card p-8 text-center my-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-orange-950/40 text-emerald-600 dark:text-orange-500 mx-auto flex items-center justify-center mb-3">
            <CreditCard className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h4 className="font-extrabold text-slate-800 dark:text-white text-base mb-1">
            No matching entries found
          </h4>
          <p className="text-slate-600 dark:text-slate-300 text-xs mb-4 max-w-xs mx-auto font-medium">
            {filter !== 'all' ? `No ${filter} entries match your selection.` : `No payments tracked for ${summary.monthName}.`}
          </p>
          <button
            onClick={onAddPayment}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-500 dark:bg-orange-500 text-white text-xs font-black shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Entry</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* SECTION 1: SAVINGS */}
          {(filter === 'all' || filter === 'savings' || filter === 'unpaid' || filter === 'overdue') && filteredSavings.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-sm">
                    <PiggyBank className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-black text-slate-900 dark:text-white text-sm">
                        🏦 Savings & Investments
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                        AUTO EVERY MONTH
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Automatically carried forward every month ({savingsItems.length} items)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block text-[10px]">
                    Total Savings
                  </span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalSavingsSum)}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {filteredSavings.map(payment => (
                  <PaymentItemCard
                    key={payment.id}
                    payment={payment}
                    onEdit={onEditPayment}
                    onDelete={onDeletePayment}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: COMMITMENTS TO PAY */}
          {(filter === 'all' || filter === 'commitments' || filter === 'unpaid' || filter === 'overdue') && filteredCommitments.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-500/10 dark:bg-orange-950/40 border border-orange-500/20">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-orange-500 text-white shadow-sm">
                    <Receipt className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-black text-slate-900 dark:text-white text-sm">
                        💳 Commitments to Pay
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-bold">
                        <Repeat className="w-3 h-3" />
                        <span>{recurringCommitmentsCount} Every Month</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-bold">
                        <Calendar className="w-3 h-3" />
                        <span>{currentMonthOnlyCount} Current Month Only</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block text-[10px]">
                    Total Commitments
                  </span>
                  <span className="text-sm font-black text-orange-600 dark:text-orange-400">
                    {formatCurrency(totalCommitmentsSum)}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {filteredCommitments.map(payment => (
                  <PaymentItemCard
                    key={payment.id}
                    payment={payment}
                    onEdit={onEditPayment}
                    onDelete={onDeletePayment}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
