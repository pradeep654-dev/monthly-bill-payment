import React, { useState } from 'react';
import { Receipt, Plus, Repeat, Calendar, CreditCard } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { PaymentItemCard } from './PaymentItemCard';
import type { PaymentItem } from '../types';
import { formatCurrency, getUrgencyStatus, sortByUpcomingAndDate } from '../utils/formatters';
import { getCategoryMeta } from '../utils/categories';

interface CommitmentsViewProps {
  onAddCommitment: () => void;
  onEditPayment: (payment: PaymentItem) => void;
  onDeletePayment: (id: string) => void;
}

type CommitmentSubFilter = 'all' | 'recurring' | 'current' | 'unpaid' | 'overdue';

export const CommitmentsView: React.FC<CommitmentsViewProps> = ({
  onAddCommitment,
  onEditPayment,
  onDeletePayment
}) => {
  const { currentMonthPayments, summary, currentMonthKey, isLiquidGlass } = usePayments();
  const [subFilter, setSubFilter] = useState<CommitmentSubFilter>('all');

  // Filter commitment/expense items (exclude savings)
  const isCommitmentItem = (p: PaymentItem) => {
    return p.commitmentType !== 'savings' && getCategoryMeta(p.category).group !== 'savings';
  };

  const commitmentItems = currentMonthPayments.filter(isCommitmentItem);

  const totalCommitmentAmount = commitmentItems.reduce((sum, p) => sum + p.amount, 0);
  const paidCommitmentAmount = commitmentItems.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0);
  const pendingCommitmentAmount = totalCommitmentAmount - paidCommitmentAmount;

  const recurringItems = commitmentItems.filter(p => p.isRecurring);
  const currentMonthItems = commitmentItems.filter(p => !p.isRecurring);

  const recurringTotal = recurringItems.reduce((sum, p) => sum + p.amount, 0);
  const currentMonthTotal = currentMonthItems.reduce((sum, p) => sum + p.amount, 0);

  // Apply sub-filter & sort upcoming cards on top date-wise
  const filteredCommitments = sortByUpcomingAndDate(
    commitmentItems.filter(payment => {
      if (subFilter === 'recurring') return payment.isRecurring;
      if (subFilter === 'current') return !payment.isRecurring;
      if (subFilter === 'unpaid') return !payment.isPaid;
      if (subFilter === 'overdue') {
        const urgency = getUrgencyStatus(payment.dueDay, currentMonthKey, payment.isPaid);
        return urgency.status === 'overdue';
      }
      return true;
    })
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Banner Card */}
      <div className={`app-card p-5 overflow-hidden relative transition-all ${
        isLiquidGlass
          ? 'bg-orange-500/10 dark:bg-orange-950/40 border-orange-400/40 backdrop-blur-md text-slate-900 dark:text-white'
          : 'bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 text-white border-slate-800 shadow-lg'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2.5 rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/30">
              <Receipt className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider block ${
                isLiquidGlass
                  ? 'text-orange-700 dark:text-orange-400'
                  : 'text-orange-400'
              }`}>
                Bills & Obligations
              </span>
              <h2 className={`text-base font-black tracking-tight ${
                isLiquidGlass
                  ? 'text-slate-900 dark:text-white'
                  : 'text-white'
              }`}>
                {summary.monthName} Commitments
              </h2>
            </div>
          </div>

          <button
            onClick={onAddCommitment}
            className="flex items-center space-x-1 px-3.5 py-1.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-xs font-black transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Bill</span>
          </button>
        </div>

        {/* Primary Metric: Total Commitments */}
        <div className={`mt-3 p-4 rounded-2xl border backdrop-blur-md flex items-center justify-between ${
          isLiquidGlass
            ? 'bg-white/60 dark:bg-white/5 border-orange-200 dark:border-white/15'
            : 'bg-white/10 border-white/15'
        }`}>
          <div>
            <span className={`text-[11px] font-black uppercase tracking-wider block mb-0.5 ${
              isLiquidGlass
                ? 'text-orange-800 dark:text-orange-300'
                : 'text-orange-300'
            }`}>
              Total Monthly Commitments
            </span>
            <span className={`text-2xl font-black tracking-tight ${
              isLiquidGlass
                ? 'text-slate-900 dark:text-white'
                : 'text-white'
            }`}>
              {formatCurrency(totalCommitmentAmount)}
            </span>
          </div>

          <div className="text-right space-y-1">
            <span className={`block text-[11px] font-bold ${
              isLiquidGlass
                ? 'text-slate-700 dark:text-slate-300'
                : 'text-slate-300'
            }`}>
              {commitmentItems.length} active bills
            </span>
            <span className={`block text-[10px] font-black ${
              isLiquidGlass
                ? 'text-amber-800 dark:text-amber-300'
                : 'text-amber-300'
            }`}>
              Pending: {formatCurrency(pendingCommitmentAmount)}
            </span>
          </div>
        </div>

        {/* Breakdown Grid: Every Month vs Current Month Only */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className={`p-2.5 rounded-xl border ${
            isLiquidGlass
              ? 'bg-teal-100/80 dark:bg-teal-500/20 border-teal-300/80 dark:border-teal-500/30 text-teal-900 dark:text-teal-200'
              : 'bg-teal-500/20 border-teal-500/30 text-teal-200'
          }`}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-extrabold text-[10px] uppercase flex items-center space-x-1">
                <Repeat className="w-3 h-3" />
                <span>Every Month</span>
              </span>
              <span className="font-black text-[10px]">{recurringItems.length}</span>
            </div>
            <span className="font-black text-sm block">{formatCurrency(recurringTotal)}</span>
          </div>

          <div className={`p-2.5 rounded-xl border ${
            isLiquidGlass
              ? 'bg-amber-100/80 dark:bg-amber-500/20 border-amber-300/80 dark:border-amber-500/30 text-amber-900 dark:text-amber-200'
              : 'bg-amber-500/20 border-amber-500/30 text-amber-200'
          }`}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-extrabold text-[10px] uppercase flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Current Month</span>
              </span>
              <span className="font-black text-[10px]">{currentMonthItems.length}</span>
            </div>
            <span className="font-black text-sm block">{formatCurrency(currentMonthTotal)}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & List Container */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {/* All */}
          <button
            onClick={() => setSubFilter('all')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
              subFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md scale-105'
                : 'bg-slate-200/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold'
            }`}
          >
            All ({commitmentItems.length})
          </button>

          {/* Every Month */}
          <button
            onClick={() => setSubFilter('recurring')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
              subFilter === 'recurring'
                ? 'bg-teal-500 text-white shadow-md scale-105'
                : 'bg-slate-200/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold'
            }`}
          >
            Every Month ({recurringItems.length})
          </button>

          {/* Current Month Only */}
          <button
            onClick={() => setSubFilter('current')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
              subFilter === 'current'
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'bg-slate-200/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold'
            }`}
          >
            Current Month ({currentMonthItems.length})
          </button>

          {/* Pending */}
          <button
            onClick={() => setSubFilter('unpaid')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
              subFilter === 'unpaid'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                : 'bg-slate-200/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold'
            }`}
          >
            Pending ({commitmentItems.filter(p => !p.isPaid).length})
          </button>
        </div>

        {/* List of Commitments */}
        {filteredCommitments.length === 0 ? (
          <div className="app-card p-8 text-center my-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 mx-auto flex items-center justify-center mb-3">
              <CreditCard className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h4 className="font-extrabold text-slate-800 dark:text-white text-base mb-1">
              No matching commitments
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-xs mb-4 max-w-xs mx-auto font-medium">
              No bills found matching your selected filter.
            </p>
            <button
              onClick={onAddCommitment}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-orange-500 text-white text-xs font-black shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Bill</span>
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};
