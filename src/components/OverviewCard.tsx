import React from 'react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';

export const OverviewCard: React.FC = () => {
  const { summary } = usePayments();

  return (
    <div className="bg-white dark:bg-[#161B26] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm dark:shadow-none transition-colors duration-200">
      {/* Title */}
      <h2 className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-4 tracking-tight">
        Overview
      </h2>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {/* Total */}
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Total
          </span>
          <span className="text-slate-900 dark:text-white font-extrabold text-xl tracking-tight block">
            {formatCurrency(summary.totalAmount)}
          </span>
        </div>

        {/* Paid */}
        <div className="border-l border-slate-100 dark:border-slate-800/80 pl-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Paid
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xl tracking-tight block">
            {formatCurrency(summary.paidAmount)}
          </span>
        </div>

        {/* Pending */}
        <div className="border-l border-slate-100 dark:border-slate-800/80 pl-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Pending
          </span>
          <span className="text-red-500 dark:text-orange-500 font-extrabold text-xl tracking-tight block">
            {formatCurrency(summary.pendingAmount)}
          </span>
        </div>
      </div>

      {/* Progress Info & Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-emerald-600 dark:text-orange-500 tracking-tight">
            {summary.percentagePaid}% Paid
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {summary.paidCount} of {summary.totalCount} bills
          </span>
        </div>

        {/* Track Container */}
        <div className="w-full bg-slate-100 dark:bg-[#262E3D] h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="bg-emerald-500 dark:bg-orange-500 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${Math.max(0, Math.min(100, summary.percentagePaid))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
