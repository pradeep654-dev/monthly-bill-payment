import React, { useState } from 'react';
import { Banknote, CheckCircle2, ArrowRightLeft, Sliders } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';
import { SalarySettingsModal } from './SalarySettingsModal';

export const SalaryCreditCard: React.FC = () => {
  const { summary } = usePayments();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className="app-card p-5 relative overflow-hidden bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20 dark:border-cyan-500/30 space-y-3.5">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-cyan-500/15">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-2.5 rounded-2xl bg-cyan-500 text-white shadow-md shadow-cyan-500/20 shrink-0">
              <Banknote className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                SBI Salary Engine
              </span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                Monthly Salary ({formatCurrency(summary.monthlyIncome)})
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center space-x-1.5 text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 border border-blue-500/20 hover:scale-105 active:scale-95 shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Hike & Split</span>
          </button>
        </div>

        {/* 50/50 SBI -> HDFC Auto-Split Banner */}
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-1.5 rounded-xl bg-blue-500/20 text-blue-500 shrink-0">
              <ArrowRightLeft className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 min-w-0">
              <span className="whitespace-nowrap">Auto 50/50 Salary Split Engine</span>
              <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                SBI: {formatCurrency(summary.sbiSplitAmount || 40000)} • HDFC: {formatCurrency(summary.hdfcSplitAmount || 40000)}
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-black shrink-0 whitespace-nowrap">
            {100 - (summary.salarySplitPercent || 50)}/{summary.salarySplitPercent || 50} SPLIT
          </span>
        </div>

        {/* Salary & Leftover Allocation Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-white/60 dark:bg-[#0D1117]/80 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block whitespace-nowrap">
              Payday Income (SBI)
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {formatCurrency(summary.monthlyIncome || 80000)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 block whitespace-nowrap">
              Leftover Disposable Cash
            </span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(summary.leftoverIncome || 51493)}
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <span className="whitespace-nowrap">Reserves: {formatCurrency(summary.totalAmount)} for bills & SIPs</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-500" />
            <span>Auto-Split Active</span>
          </span>
        </div>
      </div>

      <SalarySettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
