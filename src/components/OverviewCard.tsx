import React from 'react';
import { PiggyBank, Receipt } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';

export const OverviewCard: React.FC = () => {
  const { summary, isLiquidGlass } = usePayments();

  return (
    <div className="app-card p-5 overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-300 block mb-0.5">
            Overview
          </span>
          <h2 className="text-xs font-black text-slate-800 dark:text-white">
            {summary.monthName} Commitments
          </h2>
        </div>

        {/* % Paid Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-black tracking-tight ${
          isLiquidGlass
            ? 'real-liquid-pill text-slate-900 dark:text-white dark:border-white/30'
            : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60'
        }`}>
          {summary.percentagePaid}% Paid
        </div>
      </div>

      {/* Primary Metrics 3-Column Display */}
      <div className="grid grid-cols-3 gap-2.5 mb-3">
        {/* Total */}
        <div className={`p-3 rounded-2xl ${
          isLiquidGlass
            ? 'bg-white/40 dark:bg-white/10 border border-white/70 dark:border-white/20 backdrop-blur-md'
            : 'bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-750'
        }`}>
          <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
            Total
          </span>
          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight block">
            {formatCurrency(summary.totalAmount)}
          </span>
        </div>

        {/* Paid */}
        <div className={`p-3 rounded-2xl ${
          isLiquidGlass
            ? 'bg-white/60 dark:bg-emerald-950/40 border border-white/80 dark:border-emerald-500/40 backdrop-blur-md'
            : 'bg-emerald-50/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60'
        }`}>
          <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block mb-1">
            Paid
          </span>
          <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 tracking-tight block">
            {formatCurrency(summary.paidAmount)}
          </span>
        </div>

        {/* Pending */}
        <div className={`p-3 rounded-2xl ${
          isLiquidGlass
            ? 'bg-white/40 dark:bg-orange-950/40 border border-white/70 dark:border-orange-500/40 backdrop-blur-md'
            : 'bg-amber-50/70 dark:bg-orange-950/60 border border-amber-200 dark:border-orange-800/60'
        }`}>
          <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 uppercase tracking-wider block mb-1">
            Pending
          </span>
          <span className="text-sm sm:text-base font-black text-amber-600 dark:text-orange-400 tracking-tight block">
            {formatCurrency(summary.pendingAmount)}
          </span>
        </div>
      </div>

      {/* Total Savings & Total Expense 2-Column Display */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {/* Total Savings */}
        <div className={`p-3 rounded-2xl flex items-center justify-between ${
          isLiquidGlass
            ? 'bg-emerald-500/15 dark:bg-emerald-950/40 border border-emerald-400/40 backdrop-blur-md'
            : 'bg-emerald-50/80 dark:bg-teal-950/50 border border-emerald-200/80 dark:border-teal-800/60'
        }`}>
          <div>
            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block mb-0.5">
              Total Savings
            </span>
            <span className="text-sm sm:text-base font-black text-emerald-700 dark:text-emerald-300 tracking-tight block">
              {formatCurrency(summary.totalSavings)}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
            <PiggyBank className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Total Expense */}
        <div className={`p-3 rounded-2xl flex items-center justify-between ${
          isLiquidGlass
            ? 'bg-orange-500/15 dark:bg-orange-950/40 border border-orange-400/40 backdrop-blur-md'
            : 'bg-orange-50/80 dark:bg-orange-950/50 border border-orange-200/80 dark:border-orange-800/60'
        }`}>
          <div>
            <span className="text-[10px] font-black text-orange-700 dark:text-orange-300 uppercase tracking-wider block mb-0.5">
              Total Expense
            </span>
            <span className="text-sm sm:text-base font-black text-orange-700 dark:text-orange-300 tracking-tight block">
              {formatCurrency(summary.totalExpense)}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300">
            <Receipt className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px]">
          <span className="font-extrabold text-slate-700 dark:text-slate-200">
            {summary.paidCount} of {summary.totalCount} bills completed
          </span>
          <span className="font-black text-emerald-600 dark:text-orange-400">
            {summary.percentagePaid}%
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isLiquidGlass
                ? 'real-liquid-active-light dark:real-liquid-active-dark'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-orange-500 dark:to-amber-500'
            }`}
            style={{ width: `${summary.percentagePaid}%` }}
          />
        </div>
      </div>
    </div>
  );
};
