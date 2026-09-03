import React from 'react';
import { PiggyBank, Receipt, Wallet, ShieldCheck } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';

export const OverviewCard: React.FC = () => {
  const { summary, isLiquidGlass } = usePayments();

  return (
    <div className="app-card p-5 overflow-hidden space-y-4">
      {/* Executive Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-300 block mb-0.5">
            Financial Dashboard
          </span>
          <h2 className="text-sm font-black text-slate-900 dark:text-white">
            {summary.monthName} Overview
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

      {/* Top Highlight: Total Bank Balance & Net Liquidity */}
      <div className={`p-4 rounded-3xl grid grid-cols-2 gap-3 ${
        isLiquidGlass
          ? 'bg-white/40 dark:bg-white/10 border border-white/70 dark:border-white/20 backdrop-blur-md'
          : 'bg-slate-900 text-white dark:bg-[#0D1322] border border-slate-800'
      }`}>
        {/* Total Liquid Bank Balance */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 dark:text-slate-400">
            <Wallet className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Bank Balance</span>
          </div>
          <span className="text-base sm:text-lg font-black tracking-tight block">
            {formatCurrency(summary.totalBankBalance)}
          </span>
        </div>

        {/* Net Free Liquidity */}
        <div className="space-y-1 border-l border-slate-700/60 dark:border-slate-800 pl-3">
          <div className="flex items-center space-x-1.5 text-emerald-400 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Net Free Cash</span>
          </div>
          <span className={`text-base sm:text-lg font-black tracking-tight block ${
            summary.netFreeLiquidity >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {formatCurrency(summary.netFreeLiquidity)}
          </span>
        </div>
      </div>

      {/* Primary 4-Metric Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Total Savings */}
        <div className={`p-3 rounded-2xl flex items-center justify-between ${
          isLiquidGlass
            ? 'bg-emerald-500/15 dark:bg-emerald-950/40 border border-emerald-400/40 backdrop-blur-md'
            : 'bg-emerald-50/80 dark:bg-teal-950/50 border border-emerald-200/80 dark:border-teal-800/60'
        }`}>
          <div>
            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block mb-0.5">
              🏦 Total Savings
            </span>
            <span className="text-sm sm:text-base font-black text-emerald-700 dark:text-emerald-300 tracking-tight block">
              {formatCurrency(summary.totalSavings)}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
            <PiggyBank className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Total Expense / Commitments */}
        <div className={`p-3 rounded-2xl flex items-center justify-between ${
          isLiquidGlass
            ? 'bg-orange-500/15 dark:bg-orange-950/40 border border-orange-400/40 backdrop-blur-md'
            : 'bg-orange-50/80 dark:bg-orange-950/50 border border-orange-200/80 dark:border-orange-800/60'
        }`}>
          <div>
            <span className="text-[10px] font-black text-orange-700 dark:text-orange-300 uppercase tracking-wider block mb-0.5">
              💳 Commitments
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

      {/* Secondary Metrics: Paid vs Pending */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 flex items-center justify-between text-xs">
          <span className="font-extrabold text-emerald-700 dark:text-emerald-300">Paid Amount</span>
          <span className="font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(summary.paidAmount)}</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-amber-50/60 dark:bg-orange-950/30 border border-amber-200/50 dark:border-orange-800/40 flex items-center justify-between text-xs">
          <span className="font-extrabold text-amber-700 dark:text-amber-300">Pending Amount</span>
          <span className="font-black text-amber-600 dark:text-orange-400">{formatCurrency(summary.pendingAmount)}</span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-1.5 pt-1">
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
